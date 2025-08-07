import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionExpiry: number | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkSession: () => boolean;
}

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      sessionExpiry: null,
      
      login: (username: string, password: string) => {
        // Simple authentication - in production, this should be handled by a backend
        if (username === 'admin' && password === 'admin') {
          const expiry = Date.now() + SESSION_DURATION;
          set({ 
            isAuthenticated: true, 
            isAdmin: true,
            sessionExpiry: expiry 
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          isAdmin: false,
          sessionExpiry: null 
        });
      },
      
      checkSession: () => {
        const state = get();
        if (state.sessionExpiry && Date.now() > state.sessionExpiry) {
          // Session expired
          set({ 
            isAuthenticated: false, 
            isAdmin: false,
            sessionExpiry: null 
          });
          return false;
        }
        return state.isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
