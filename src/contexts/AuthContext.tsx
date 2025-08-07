import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { userSyncService } from '../services/userSyncService';
import { securityService } from '../services/securityService';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Set a fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timeout - rendering app anyway');
        setLoading(false);
      }
    }, 3000); // Reduced timeout for better UX

    // Set another timeout to force load even if auth is having issues
    const forceLoadTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Force loading app due to auth delays');
        setLoading(false);
      }
    }, 8000);

    const initializeAuth = async () => {
      try {
        const unsubscribe = authService.onAuthStateChanged((user) => {
          if (!isMounted) return;
          
          clearTimeout(fallbackTimeout);
          clearTimeout(forceLoadTimeout);
          setCurrentUser(user);

          // Sync Firebase user with customer store - don't wait for completion
          if (user) {
            console.log('✅ User authenticated:', user.email);
            // Run sync in background without blocking UI
            userSyncService.syncFirebaseUserToCustomerStore(user);
          } else {
            console.log('👋 User signed out');
            userSyncService.clearSyncedCustomer();
            securityService.clearSession();
          }

          setLoading(false);
          setError(null);
        });

        return () => {
          if (isMounted) {
            clearTimeout(fallbackTimeout);
            clearTimeout(forceLoadTimeout);
            unsubscribe();
          }
        };
      } catch (initError) {
        if (isMounted) {
          console.error('Auth initialization error:', initError);
          clearTimeout(fallbackTimeout);
          clearTimeout(forceLoadTimeout);
          setError('Authentication initialization failed');
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      isMounted = false;
      cleanup.then(cleanupFn => cleanupFn?.()).catch(() => {});
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.signInWithEmail(email, password);
      if (!response.success) {
        throw new Error(response.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const response = await authService.signUpWithEmail(email, password, displayName);
      if (!response.success) {
        throw new Error(response.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await authService.signInWithGoogle();
      if (!response.success) {
        throw new Error(response.error || 'Google sign in failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await authService.signOut();
      if (!response.success) {
        throw new Error(response.error || 'Sign out failed');
      }
      // Clear synced customer is handled by onAuthStateChanged
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export everything at the bottom to avoid Fast Refresh issues
export { AuthProvider, useAuth };