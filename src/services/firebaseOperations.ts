import { db } from '../lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

interface FirebaseOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data?: any;
}

class FirebaseOperationsService {
  private operationQueue: FirebaseOperation[] = [];
  private isProcessing = false;

  constructor() {
    console.log('🔥 Firebase Operations Service initialized in offline-first mode');
  }

  // Safe document creation with offline queueing
  async createDocument(collectionName: string, data: any): Promise<string | null> {
    try {
      if (!db) {
        console.warn('⚠️ Firestore not available, queueing operation');
        this.queueOperation({ type: 'create', collection: collectionName, data });
        return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Try to enable network briefly for the operation
      await this.safeNetworkOperation(async () => {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log('✅ Document created:', docRef.id);
        return docRef.id;
      });

      return null;
    } catch (error) {
      console.error('❌ Failed to create document:', error);
      this.queueOperation({ type: 'create', collection: collectionName, data });
      return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  // Safe document reading with offline fallback
  async readDocument(collectionName: string, docId: string): Promise<any | null> {
    try {
      if (!db) {
        console.warn('⚠️ Firestore not available, cannot read document');
        return null;
      }

      return await this.safeNetworkOperation(async () => {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      });
    } catch (error) {
      console.error('❌ Failed to read document:', error);
      return null;
    }
  }

  // Safe collection reading with offline fallback
  async readCollection(collectionName: string): Promise<any[]> {
    try {
      if (!db) {
        console.warn('⚠️ Firestore not available, cannot read collection');
        return [];
      }

      const result = await this.safeNetworkOperation(async () => {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
      return result ?? [];
    } catch (error) {
      console.error('❌ Failed to read collection:', error);
      return [];
    }
  }

  // Safe network operation wrapper
  private async safeNetworkOperation<T>(operation: () => Promise<T>): Promise<T | null> {
    let networkWasEnabled = false;

    try {
      // Try to enable network for this operation
      await enableNetwork(db);
      networkWasEnabled = true;

      // Execute the operation with a timeout
      const result = await Promise.race([
        operation(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('Operation timeout')), 10000)
        )
      ]);

      return result;
    } catch (error) {
      console.warn('⚠️ Network operation failed:', error);
      return null;
    } finally {
      // Always disable network after operation to prevent connection errors
      if (networkWasEnabled) {
        try {
          await disableNetwork(db);
        } catch (disableError) {
          console.warn('Failed to disable network:', disableError);
        }
      }
    }
  }

  // Queue operations for later when network is available
  private queueOperation(operation: FirebaseOperation) {
    this.operationQueue.push(operation);
    console.log(`📋 Queued ${operation.type} operation for ${operation.collection}`);
  }

  // Process queued operations (called when network becomes available)
  async processQueuedOperations() {
    if (this.isProcessing || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`🔄 Processing ${this.operationQueue.length} queued operations...`);

    const operations = [...this.operationQueue];
    this.operationQueue = [];

    for (const operation of operations) {
      try {
        switch (operation.type) {
          case 'create':
            await this.createDocument(operation.collection, operation.data);
            break;
          // Add other operation types as needed
        }
      } catch (error) {
        console.error('❌ Failed to process queued operation:', error);
        // Re-queue failed operations
        this.operationQueue.push(operation);
      }
    }

    this.isProcessing = false;
    console.log('✅ Finished processing queued operations');
  }

  // Get current queue status
  getQueueStatus() {
    return {
      queueLength: this.operationQueue.length,
      isProcessing: this.isProcessing
    };
  }
}

export const firebaseOperations = new FirebaseOperationsService();
