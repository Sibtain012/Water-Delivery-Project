import { firebaseProductService } from '../services/firebaseProductService';
import { products } from '../data/products';
import { Product } from '../types';
import { FirebaseProduct } from '../types/firebase';

/**
 * Migration utility to move existing static data to Firebase
 * Run this once with admin privileges to populate your Firebase database
 */
class DataMigration {
  /**
   * Migrate products from static data to Firebase
   */
  async migrateProducts(): Promise<void> {
    console.log('🚀 Starting product migration...');
    
    try {
      const migrationResults = [];
      
      for (const product of products) {
        try {
          // Convert Product to FirebaseProduct format
          const firebaseProductData: Omit<FirebaseProduct, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.image, // Convert image to imageUrl
            size: product.size,
            type: product.type,
            featured: product.featured || false,
            hasExchange: product.hasExchange || false,
            depositPrice: product.depositPrice || 0,
            isActive: true
          };

          const productId = await firebaseProductService.createProduct(firebaseProductData);
          
          migrationResults.push({
            originalId: product.id,
            newId: productId,
            name: product.name,
            status: 'success'
          });
          
          console.log(`✅ Migrated product: ${product.name} (${product.id} -> ${productId})`);
        } catch (error) {
          console.error(`❌ Failed to migrate product ${product.name}:`, error);
          migrationResults.push({
            originalId: product.id,
            name: product.name,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Print migration summary
      const successful = migrationResults.filter(r => r.status === 'success').length;
      const failed = migrationResults.filter(r => r.status === 'failed').length;
      
      console.log('\n📊 Migration Summary:');
      console.log(`✅ Successful: ${successful}`);
      console.log(`❌ Failed: ${failed}`);
      console.log(`📋 Total: ${migrationResults.length}`);
      
      if (failed > 0) {
        console.log('\n🔍 Failed migrations:');
        migrationResults
          .filter(r => r.status === 'failed')
          .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
      }
      
      return migrationResults;
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  /**
   * Create a super admin user (run this first before other migrations)
   */
  async createSuperAdmin(
    firebaseUid: string,
    email: string,
    name: string
  ): Promise<void> {
    console.log('👑 Creating super admin user...');
    
    try {
      // This would need to be done through Firebase Admin SDK or Firebase console
      // as it requires elevated privileges
      console.log(`
⚠️  MANUAL STEP REQUIRED:
To create a super admin, you need to manually add a document to the 'admins' collection in Firestore:

Collection: admins
Document ID: ${firebaseUid}
Data:
{
  "firebaseUid": "${firebaseUid}",
  "email": "${email}",
  "name": "${name}",
  "role": "super-admin",
  "permissions": [
    "create:product", "read:product", "update:product", "delete:product",
    "create:order", "read:order", "update:order", "delete:order", "assign:driver",
    "read:customer", "update:customer", "delete:customer",
    "create:admin", "read:admin", "update:admin", "delete:admin",
    "read:audit_logs", "update:settings", "backup:data", "export:data"
  ],
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
      `);
    } catch (error) {
      console.error('Failed to create super admin:', error);
      throw error;
    }
  }

  /**
   * Verify migration by checking if products exist in Firebase
   */
  async verifyProductMigration(): Promise<void> {
    console.log('🔍 Verifying product migration...');
    
    try {
      const { products: firebaseProducts } = await firebaseProductService.getAllProducts();
      
      console.log(`📦 Found ${firebaseProducts.length} products in Firebase`);
      
      firebaseProducts.forEach(product => {
        console.log(`  - ${product.name} (${product.id})`);
      });
      
      // Check for featured products
      const featuredProducts = await firebaseProductService.getFeaturedProducts();
      console.log(`⭐ Found ${featuredProducts.length} featured products`);
      
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  }

  /**
   * Clean up test data (use with caution!)
   */
  async cleanupTestData(): Promise<void> {
    console.warn('⚠️  This will deactivate all products in Firebase. Use with caution!');
    
    // This is a safer "delete" that just marks products as inactive
    try {
      const { products: firebaseProducts } = await firebaseProductService.getAllProductsAdmin();
      
      for (const product of firebaseProducts) {
        await firebaseProductService.updateProduct(product.id, { isActive: false });
        console.log(`🗑️  Deactivated: ${product.name}`);
      }
      
      console.log(`✅ Deactivated ${firebaseProducts.length} products`);
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }
}

export const dataMigration = new DataMigration();

// Export individual functions for easier testing
export const {
  migrateProducts,
  createSuperAdmin,
  verifyProductMigration,
  cleanupTestData
} = dataMigration;
