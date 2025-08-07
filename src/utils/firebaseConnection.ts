import { db } from '../lib/firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

class FirebaseConnectionManager {
  private isOnline = true;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Initial connection state
    this.isOnline = navigator.onLine;
  }

  private async handleOnline() {
    console.log('🌐 Network is back online');
    this.isOnline = true;
    this.retryCount = 0;
    await this.enableFirestore();
  }

  private async handleOffline() {
    console.log('📡 Network went offline');
    this.isOnline = false;
    await this.disableFirestore();
  }

  private async enableFirestore() {
    if (!db) return;
    
    try {
      await enableNetwork(db);
      console.log('✅ Firestore network enabled');
    } catch (error) {
      console.warn('Failed to enable Firestore network:', error);
    }
  }

  private async disableFirestore() {
    if (!db) return;
    
    try {
      await disableNetwork(db);
      console.log('⏸️ Firestore network disabled');
    } catch (error) {
      console.warn('Failed to disable Firestore network:', error);
    }
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName = 'Firebase operation'
  ): Promise<T> {
    if (this.connectionPromise) {
      await this.connectionPromise;
    }

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();
        this.retryCount = 0; // Reset on success
        return result;
      } catch (error: any) {
        console.warn(`${operationName} failed (attempt ${attempt + 1}/${this.maxRetries + 1}):`, error);

        if (attempt === this.maxRetries) {
          throw error;
        }

        // Check if it's a network-related error
        const isNetworkError = 
          error?.code === 'unavailable' ||
          error?.message?.includes('network') ||
          error?.message?.includes('offline') ||
          error?.message?.includes('timeout') ||
          !this.isOnline;

        if (isNetworkError) {
          console.log(`⏳ Waiting ${this.retryDelay}ms before retry...`);
          await this.delay(this.retryDelay);
          this.retryDelay = Math.min(this.retryDelay * 2, 10000); // Exponential backoff, max 10s
        } else {
          // For non-network errors, don't retry
          throw error;
        }
      }
    }

    throw new Error(`${operationName} failed after ${this.maxRetries + 1} attempts`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async checkConnection(): Promise<boolean> {
    if (!db) return false;
    
    try {
      // Try to enable network to test connection
      await enableNetwork(db);
      return true;
    } catch (error) {
      console.warn('Firebase connection check failed:', error);
      return false;
    }
  }

  public getConnectionStatus(): { isOnline: boolean; retryCount: number } {
    return {
      isOnline: this.isOnline,
      retryCount: this.retryCount
    };
  }
}

export const firebaseConnectionManager = new FirebaseConnectionManager();

// Helper function to wrap Firebase operations with retry logic
export function withRetry<T>(
  operation: () => Promise<T>,
  operationName?: string
): Promise<T> {
  return firebaseConnectionManager.executeWithRetry(operation, operationName);
}
