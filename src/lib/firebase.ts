import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
};

// Global Firebase connection state
interface FirebaseState {
  isInitialized: boolean;
  isOnline: boolean;
  hasNetworkError: boolean;
  retryCount: number;
}

const firebaseState: FirebaseState = {
  isInitialized: false,
  isOnline: true,
  hasNetworkError: false,
  retryCount: 0
};

// Initialize Firebase with comprehensive error handling
let app: any;
let db: any;

const initializeFirebase = async () => {
  try {
    validateConfig();
    app = initializeApp(firebaseConfig);

    // Initialize Firestore with optimal settings for guest orders
    try {
      db = initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        localCache: {
          kind: 'persistent'
        }
      });

      console.log('🌐 Firestore initialized for guest orders');

    } catch (firestoreError) {
      console.warn('⚠️ Firestore initialization failed, creating fallback:', firestoreError);
      // Fallback to basic Firestore if advanced features fail
      db = getFirestore(app);
    }

    firebaseState.isInitialized = true;
    firebaseState.hasNetworkError = false;
    console.log('✅ Firebase initialized successfully for guest checkout');

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    firebaseState.hasNetworkError = true;
    // Don't throw error - let app continue with offline mode
  }
};

// Initialize Firebase
initializeFirebase();

// Network status monitoring with better error handling
if (typeof window !== 'undefined') {
  firebaseState.isOnline = navigator.onLine;

  const handleOnline = async () => {
    if (!firebaseState.isOnline) {
      console.log('🌐 Network back online, attempting to reconnect...');
      firebaseState.isOnline = true;
      firebaseState.retryCount = 0;

      if (db) {
        try {
          await enableNetwork(db);
          firebaseState.hasNetworkError = false;
          console.log('✅ Firestore reconnected successfully');
        } catch (error) {
          console.warn('⚠️ Failed to re-enable Firestore, continuing in offline mode:', error);
          firebaseState.hasNetworkError = true;
        }
      }
    }
  };

  const handleOffline = async () => {
    if (firebaseState.isOnline) {
      console.log('📡 Network offline, enabling offline mode...');
      firebaseState.isOnline = false;

      if (db) {
        try {
          await disableNetwork(db);
          console.log('✅ Firestore offline mode enabled');
        } catch (error) {
          console.warn('⚠️ Failed to disable Firestore network:', error);
        }
      }
    }
  };

  // Listen for network changes
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Handle visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && firebaseState.hasNetworkError) {
      console.log('🔄 Tab visible, checking Firebase connection...');
      setTimeout(handleOnline, 1000); // Small delay to allow network to stabilize
    }
  });
}

// Export Firebase state checker
export const getFirebaseState = () => ({ ...firebaseState });

// Export connection health check
export const checkFirebaseHealth = async (): Promise<boolean> => {
  if (!db || !firebaseState.isInitialized) return false;

  try {
    await enableNetwork(db);
    firebaseState.hasNetworkError = false;
    return true;
  } catch (error) {
    firebaseState.hasNetworkError = true;
    return false;
  }
};

export { db };
export default app;
