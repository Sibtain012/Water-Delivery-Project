import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import auth, { db } from '../lib/firebase';
import { FirebaseCustomer, COLLECTIONS, PERMISSIONS } from '../types/firebase';
import { securityService } from './securityService';

class FirebaseCustomerService {
  /**
   * Create or update customer profile
   */
  async createOrUpdateCustomer(customerData: Omit<FirebaseCustomer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    try {
      // Sanitize input data
      const allowedFields: (keyof typeof customerData)[] = [
        'firebaseUid', 'email', 'name', 'phone', 'address', 'city', 'postalCode', 'signupMethod', 'isActive'
      ];

      const sanitizedData = securityService.sanitizeInput(customerData, allowedFields);

      // Validate required fields
      if (!sanitizedData.email || !sanitizedData.name) {
        throw new Error('Missing required fields: email, name');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedData.email)) {
        throw new Error('Invalid email format');
      }

      // Check if customer already exists
      const existingCustomer = await this.getCustomerByFirebaseUid(sanitizedData.firebaseUid!);
      const now = new Date();

      if (existingCustomer) {
        // Update existing customer
        const updateData = {
          ...sanitizedData,
          updatedAt: serverTimestamp(),
          lastLoginAt: now
        };

        await updateDoc(doc(db, COLLECTIONS.CUSTOMERS, existingCustomer.id), updateData);

        await securityService.logActivity('UPDATE', 'customer', existingCustomer.id, true);
        return existingCustomer.id;
      } else {
        // Create new customer
        const newCustomer: Omit<FirebaseCustomer, 'id'> = {
          ...sanitizedData,
          firebaseUid: sanitizedData.firebaseUid!,
          email: sanitizedData.email!,
          name: sanitizedData.name!,
          phone: sanitizedData.phone || '',
          address: sanitizedData.address || '',
          city: sanitizedData.city || '',
          postalCode: sanitizedData.postalCode || '',
          signupMethod: sanitizedData.signupMethod || 'manual',
          isActive: true,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now
        };

        // Use firebaseUid as document ID for easier lookups
        await setDoc(doc(db, COLLECTIONS.CUSTOMERS, sanitizedData.firebaseUid!), newCustomer);

        await securityService.logActivity('CREATE', 'customer', sanitizedData.firebaseUid!, true, undefined, {
          signupMethod: newCustomer.signupMethod
        });

        return sanitizedData.firebaseUid!;
      }
    } catch (error) {
      await securityService.logActivity('CREATE_OR_UPDATE', 'customer',
        customerData.firebaseUid || 'unknown', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get customer by Firebase UID
   */
  async getCustomerByFirebaseUid(firebaseUid: string): Promise<FirebaseCustomer | null> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    // Users can only access their own data, admins can access any customer data
    const canAccess = auth.currentUser.uid === firebaseUid ||
      securityService.hasPermission(PERMISSIONS.READ_CUSTOMER);

    if (!canAccess) {
      await securityService.logActivity('UNAUTHORIZED_ACCESS', 'customer', firebaseUid, false,
        'User attempted to access another customer\'s data');
      throw new Error('Access denied');
    }

    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, firebaseUid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const customerData = {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseCustomer;

      await securityService.logActivity('READ', 'customer', firebaseUid, true);
      return customerData;
    } catch (error) {
      await securityService.logActivity('READ', 'customer', firebaseUid, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get customer by email (admin only)
   */
  async getCustomerByEmail(email: string): Promise<FirebaseCustomer | null> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_CUSTOMER);

    try {
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('email', '==', email),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const customerData = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      } as FirebaseCustomer;

      await securityService.logActivity('READ', 'customer', `email_${email}`, true);
      return customerData;
    } catch (error) {
      await securityService.logActivity('READ', 'customer', `email_${email}`, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Update customer profile
   */
  async updateCustomerProfile(
    firebaseUid: string,
    updates: Partial<Pick<FirebaseCustomer, 'name' | 'phone' | 'address' | 'city' | 'postalCode'>>
  ): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    // Users can only update their own profile, admins can update any customer
    const canUpdate = auth.currentUser.uid === firebaseUid ||
      securityService.hasPermission(PERMISSIONS.UPDATE_CUSTOMER);

    if (!canUpdate) {
      await securityService.logActivity('UNAUTHORIZED_ACCESS', 'customer', firebaseUid, false,
        'User attempted to update another customer\'s profile');
      throw new Error('Access denied');
    }

    if (securityService.isRateLimited('update_customer_profile', 10, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      // Sanitize input data
      const allowedFields: (keyof typeof updates)[] = ['name', 'phone', 'address', 'city', 'postalCode'];
      const sanitizedUpdates = securityService.sanitizeInput(updates, allowedFields);

      // Validate name if provided
      if (sanitizedUpdates.name !== undefined && (!sanitizedUpdates.name || sanitizedUpdates.name.trim().length < 2)) {
        throw new Error('Name must be at least 2 characters long');
      }

      const updateData = {
        ...sanitizedUpdates,
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, COLLECTIONS.CUSTOMERS, firebaseUid);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('UPDATE', 'customer', firebaseUid, true, undefined, {
        updatedFields: Object.keys(sanitizedUpdates)
      });
    } catch (error) {
      await securityService.logActivity('UPDATE', 'customer', firebaseUid, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get all customers (admin only)
   */
  async getAllCustomers(): Promise<FirebaseCustomer[]> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_CUSTOMER);

    try {
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseCustomer[];

      await securityService.logActivity('READ', 'customers', 'all', true);
      return customers;
    } catch (error) {
      await securityService.logActivity('READ', 'customers', 'all', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Deactivate customer account (admin only)
   */
  async deactivateCustomer(firebaseUid: string, reason?: string): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_CUSTOMER);

    if (securityService.isRateLimited('deactivate_customer', 5, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, firebaseUid);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });

      await securityService.logActivity('DEACTIVATE', 'customer', firebaseUid, true, undefined, {
        reason: reason || 'No reason provided'
      });
    } catch (error) {
      await securityService.logActivity('DEACTIVATE', 'customer', firebaseUid, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Reactivate customer account (admin only)
   */
  async reactivateCustomer(firebaseUid: string): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_CUSTOMER);

    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, firebaseUid);
      await updateDoc(docRef, {
        isActive: true,
        updatedAt: serverTimestamp()
      });

      await securityService.logActivity('REACTIVATE', 'customer', firebaseUid, true);
    } catch (error) {
      await securityService.logActivity('REACTIVATE', 'customer', firebaseUid, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Search customers by name or email (admin only)
   */
  async searchCustomers(searchTerm: string, limitCount: number = 20): Promise<FirebaseCustomer[]> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_CUSTOMER);

    try {
      const searchTermLower = searchTerm.toLowerCase();

      // Get all customers and filter (not ideal for large datasets)
      // In production, consider using a search service like Algolia
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        orderBy('name'),
        limit(limitCount * 2) // Get more to account for filtering
      );

      const snapshot = await getDocs(q);
      const customers = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as FirebaseCustomer)
        .filter(customer =>
          customer.name.toLowerCase().includes(searchTermLower) ||
          customer.email.toLowerCase().includes(searchTermLower)
        )
        .slice(0, limitCount);

      await securityService.logActivity('SEARCH', 'customers', searchTerm, true);
      return customers;
    } catch (error) {
      await securityService.logActivity('SEARCH', 'customers', searchTerm, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get customer statistics (admin only)
   */
  async getCustomerStats(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    recentSignups: number; // Last 30 days
    googleSignups: number;
    manualSignups: number;
  }> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_CUSTOMER);

    try {
      const customers = await this.getAllCustomers();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.isActive).length,
        inactiveCustomers: customers.filter(c => !c.isActive).length,
        recentSignups: customers.filter(c => c.createdAt > thirtyDaysAgo).length,
        googleSignups: customers.filter(c => c.signupMethod === 'google').length,
        manualSignups: customers.filter(c => c.signupMethod === 'manual').length
      };

      await securityService.logActivity('READ', 'customer_stats', 'all', true);
      return stats;
    } catch (error) {
      await securityService.logActivity('READ', 'customer_stats', 'all', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(firebaseUid: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, firebaseUid);
      await updateDoc(docRef, {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      // Don't throw error here to avoid disrupting login flow
      console.error('Error updating last login:', error);
    }
  }
}

export const firebaseCustomerService = new FirebaseCustomerService();
