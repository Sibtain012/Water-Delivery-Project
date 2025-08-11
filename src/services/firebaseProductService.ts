import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirebaseProduct, COLLECTIONS, PERMISSIONS } from '../types/firebase';
import { securityService } from './securityService';
import { Product } from '../types';

class FirebaseProductService {
  /**
   * Get all active products (public access)
   */
  async getAllProducts(limitCount: number = 50, lastDoc?: DocumentSnapshot): Promise<{
    products: Product[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    try {
      let q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const products = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data() as FirebaseProduct;
          return this.convertToProduct(data);
        })
      );

      await securityService.logActivity('READ', 'products', 'multiple', true);

      return {
        products,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount
      };
    } catch (error) {
      await securityService.logActivity('READ', 'products', 'multiple', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get featured products (public access)
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isActive', '==', true),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const products = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data() as FirebaseProduct;
          return this.convertToProduct(data);
        })
      );

      await securityService.logActivity('READ', 'products', 'featured', true);
      return products;
    } catch (error) {
      await securityService.logActivity('READ', 'products', 'featured', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get product by ID (public access)
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as FirebaseProduct;

      if (!data.isActive) {
        return null; // Don't return inactive products to public
      }

      await securityService.logActivity('READ', 'product', id, true);
      return this.convertToProduct(data);
    } catch (error) {
      await securityService.logActivity('READ', 'product', id, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get all products including inactive ones (admin only)
   */
  async getAllProductsAdmin(): Promise<FirebaseProduct[]> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_PRODUCT);

    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[];

      await securityService.logActivity('READ', 'products', 'admin_all', true);
      return products;
    } catch (error) {
      await securityService.logActivity('READ', 'products', 'admin_all', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Create new product (admin only)
   */
  async createProduct(productData: Omit<FirebaseProduct, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    await securityService.requireAdminPermission(PERMISSIONS.CREATE_PRODUCT);

    if (securityService.isRateLimited('create_product', 5, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      // Sanitize input data
      const allowedFields: (keyof typeof productData)[] = [
        'name', 'description', 'price', 'imageUrl', 'size', 'type',
        'featured', 'hasExchange', 'depositPrice', 'isActive'
      ];

      const sanitizedData = securityService.sanitizeInput(productData, allowedFields);

      // Validate required fields
      if (!sanitizedData.name || !sanitizedData.price || !sanitizedData.imageUrl) {
        throw new Error('Missing required fields: name, price, imageUrl');
      }

      // Validate price
      if (typeof sanitizedData.price !== 'number' || sanitizedData.price <= 0) {
        throw new Error('Price must be a positive number');
      }

      const newProduct: Omit<FirebaseProduct, 'id'> = {
        ...sanitizedData,
        name: sanitizedData.name!,
        price: sanitizedData.price!,
        imageUrl: sanitizedData.imageUrl!,
        description: sanitizedData.description || '',
        size: sanitizedData.size || '',
        type: sanitizedData.type || 'bottle',
        isActive: sanitizedData.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: securityService.getCurrentUserRole() || 'unknown'
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), newProduct);

      await securityService.logActivity('CREATE', 'product', docRef.id, true, undefined, {
        productName: newProduct.name,
        price: newProduct.price
      });

      return docRef.id;
    } catch (error) {
      await securityService.logActivity('CREATE', 'product', 'new', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Update product (admin only)
   */
  async updateProduct(id: string, updates: Partial<FirebaseProduct>): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_PRODUCT);

    if (securityService.isRateLimited('update_product', 10, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      // Sanitize input data
      const allowedFields: (keyof FirebaseProduct)[] = [
        'name', 'description', 'price', 'imageUrl', 'size', 'type',
        'featured', 'hasExchange', 'depositPrice', 'isActive'
      ];

      const sanitizedUpdates = securityService.sanitizeInput(updates, allowedFields);

      // Validate price if provided
      if (sanitizedUpdates.price !== undefined) {
        if (typeof sanitizedUpdates.price !== 'number' || sanitizedUpdates.price <= 0) {
          throw new Error('Price must be a positive number');
        }
      }

      const updateData = {
        ...sanitizedUpdates,
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('UPDATE', 'product', id, true, undefined, {
        updatedFields: Object.keys(sanitizedUpdates)
      });
    } catch (error) {
      await securityService.logActivity('UPDATE', 'product', id, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Delete product (soft delete - admin only)
   */
  async deleteProduct(id: string): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.DELETE_PRODUCT);

    if (securityService.isRateLimited('delete_product', 5, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);

      // Soft delete - just mark as inactive
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });

      await securityService.logActivity('DELETE', 'product', id, true);
    } catch (error) {
      await securityService.logActivity('DELETE', 'product', id, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Search products by name or description
   */
  async searchProducts(searchTerm: string, limitCount: number = 20): Promise<Product[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or similar
      const searchTermLower = searchTerm.toLowerCase();

      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isActive', '==', true),
        orderBy('name'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const products = await Promise.all(
        snapshot.docs
          .filter(doc => {
            const data = doc.data() as FirebaseProduct;
            return data.name.toLowerCase().includes(searchTermLower) ||
              data.description.toLowerCase().includes(searchTermLower);
          })
          .map(async (docSnapshot) => {
            const data = docSnapshot.data() as FirebaseProduct;
            return this.convertToProduct(data);
          })
      );

      await securityService.logActivity('SEARCH', 'products', searchTerm, true);
      return products;
    } catch (error) {
      await securityService.logActivity('SEARCH', 'products', searchTerm, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get products by type
   */
  async getProductsByType(type: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isActive', '==', true),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const products = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data() as FirebaseProduct;
          return this.convertToProduct(data);
        })
      );

      await securityService.logActivity('READ', 'products', `type_${type}`, true);
      return products;
    } catch (error) {
      await securityService.logActivity('READ', 'products', `type_${type}`, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Convert FirebaseProduct to Product (for backwards compatibility)
   */
  private convertToProduct(firebaseProduct: FirebaseProduct): Product {
    return {
      id: firebaseProduct.id,
      name: firebaseProduct.name,
      description: firebaseProduct.description,
      price: firebaseProduct.price,
      image: firebaseProduct.imageUrl,
      size: firebaseProduct.size,
      type: firebaseProduct.type,
      featured: firebaseProduct.featured,
      hasExchange: firebaseProduct.hasExchange,
      depositPrice: firebaseProduct.depositPrice
    };
  }

  /**
   * Batch update products (admin only) - useful for migrations
   */
  async batchUpdateProducts(updates: Array<{ id: string; data: Partial<FirebaseProduct> }>): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_PRODUCT);

    if (updates.length > 50) {
      throw new Error('Batch size cannot exceed 50 items');
    }

    try {
      const promises = updates.map(update => this.updateProduct(update.id, update.data));
      await Promise.all(promises);

      await securityService.logActivity('BATCH_UPDATE', 'products', 'multiple', true, undefined, {
        batchSize: updates.length
      });
    } catch (error) {
      await securityService.logActivity('BATCH_UPDATE', 'products', 'multiple', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }
}

export const firebaseProductService = new FirebaseProductService();
