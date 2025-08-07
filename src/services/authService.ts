// AuthService stub - Authentication has been removed in favor of guest checkout
// This file exists only to prevent import errors from components that may still reference it

export interface AuthResult {
  user: any;
  isNewUser?: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthResult;
  error?: string;
}

class AuthService {
  constructor() {
    // No-op constructor for stub service
  }

  // All auth methods return failure since authentication is disabled
  async signUpWithEmail(_email: string, _password: string, _displayName?: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Authentication is disabled. Please use guest checkout.'
    };
  }

  async signInWithEmail(_email: string, _password: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Authentication is disabled. Please use guest checkout.'
    };
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Authentication is disabled. Please use guest checkout.'
    };
  }

  async signOut(): Promise<AuthResponse> {
    return { success: true };
  }

  getCurrentUser(): any | null {
    return null;
  }

  onAuthStateChanged(callback: (user: any | null) => void) {
    // Immediately call callback with null user since auth is disabled
    callback(null);
    return () => { }; // Return empty unsubscribe function
  }
}

export const authService = new AuthService();
