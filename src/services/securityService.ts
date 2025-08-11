import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  FirebaseAdmin,
  SecurityAuditLog,
  COLLECTIONS,
  ROLES,
  PERMISSIONS
} from '../types/firebase';

class SecurityService {
  private currentUserRole: string | null = null;
  private currentUserPermissions: string[] = [];

  /**
   * Initialize user permissions after authentication
   */
  async initializeUserSecurity(firebaseUid: string): Promise<void> {
    // Set default customer permissions immediately for better UX
    this.currentUserRole = ROLES.CUSTOMER;
    this.currentUserPermissions = [
      PERMISSIONS.CREATE_ORDER,
      PERMISSIONS.READ_ORDER
    ];

    try {
      // Check if user is an admin with shorter timeout for better UX
      const adminDocPromise = getDoc(doc(db, COLLECTIONS.ADMINS, firebaseUid));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      const adminDoc = await Promise.race([adminDocPromise, timeoutPromise]) as any;

      if (adminDoc && adminDoc.exists()) {
        const adminData = adminDoc.data() as FirebaseAdmin;
        this.currentUserRole = adminData.role;
        this.currentUserPermissions = adminData.permissions;

        console.log(`🔐 Admin user detected: ${adminData.role}`);

        // Update last login in background (don't wait)
        updateDoc(doc(db, COLLECTIONS.ADMINS, firebaseUid), {
          lastLoginAt: serverTimestamp()
        }).catch(() => {
          // Silently fail - this is not critical
        });

        // Log activity in background - silently fail if offline
        this.logActivity('LOGIN', 'admin', firebaseUid, true).catch(() => {
          // Silently fail - logging is not critical for UX
        });
      } else {
        console.log(`👤 Customer user: ${firebaseUid}`);

        // Log customer activity in background - silently fail if offline
        this.logActivity('LOGIN', 'customer', firebaseUid, true).catch(() => {
          // Silently fail - logging is not critical for UX
        });
      }
    } catch (error: any) {
      // Check if it's a Firebase offline error
      const isFirebaseOfflineError =
        error?.code === 'unavailable' ||
        error?.message?.includes('offline') ||
        error?.message?.includes('Failed to get document because the client is offline') ||
        error?.message?.includes('Connection timeout');

      if (isFirebaseOfflineError) {
        console.log('📱 Operating in offline-first mode - using default customer permissions');
      } else {
        console.warn('⚠️ Failed to verify admin status - defaulting to customer permissions');
      }

      // Don't log errors for offline scenarios - it's expected behavior
      // Don't throw error - continue with customer permissions
    }
  }

  /**
   * Check if current user has specific permission
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUserPermissions) {
      return false;
    }

    // Super admin has all permissions
    if (this.currentUserRole === ROLES.SUPER_ADMIN) {
      return true;
    }

    return this.currentUserPermissions.includes(permission);
  }

  /**
   * Check if current user can access specific resource
   */
  canAccessResource(resourceType: string, resourceId?: string, ownerId?: string): boolean {
    const readPermission = `read:${resourceType}`;

    if (!this.hasPermission(readPermission)) {
      return false;
    }

    // For customers, they can only access their own resources
    if (this.currentUserRole === ROLES.CUSTOMER && ownerId) {
      return auth.currentUser?.uid === ownerId;
    }

    return true;
  }

  /**
   * Validate admin permissions for sensitive operations
   */
  async requireAdminPermission(permission: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    if (!this.hasPermission(permission)) {
      await this.logActivity('UNAUTHORIZED_ACCESS', 'permission', permission, false, `Missing permission: ${permission}`);
      throw new Error('Insufficient permissions');
    }
  }

  /**
   * Sanitize and validate input data
   */
  sanitizeInput<T extends Record<string, any>>(data: T, allowedFields: (keyof T)[]): Partial<T> {
    const sanitized: Partial<T> = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        let value = data[field];

        // Basic XSS prevention for string fields
        if (typeof value === 'string') {
          value = value.trim();
          // Remove potentially dangerous characters
          value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
          value = value.replace(/javascript:/gi, '');
          value = value.replace(/on\w+\s*=\s*["\'][^"\']*["\']/gi, '');
        }

        sanitized[field] = value;
      }
    }

    return sanitized;
  }

  /**
   * Log security-related activities
   */
  async logActivity(
    action: string,
    resource: string,
    resourceId: string,
    success: boolean,
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      const auditLog: Omit<SecurityAuditLog, 'id'> = {
        action,
        resource,
        resourceId,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'unknown',
        userRole: this.currentUserRole || 'unknown',
        timestamp: new Date(),
        success,
        errorMessage,
        metadata
      };

      await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), auditLog);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error here to avoid disrupting main operations
    }
  }

  /**
   * Get audit logs (admin only)
   */
  async getAuditLogs(startDate?: Date, endDate?: Date, userId?: string): Promise<SecurityAuditLog[]> {
    await this.requireAdminPermission(PERMISSIONS.READ_AUDIT_LOGS);

    try {
      let q = query(
        collection(db, COLLECTIONS.AUDIT_LOGS),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      if (startDate) {
        q = query(q, where('timestamp', '>=', startDate));
      }

      if (endDate) {
        q = query(q, where('timestamp', '<=', endDate));
      }

      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityAuditLog[];

      await this.logActivity('READ', 'audit_logs', 'multiple', true);

      return logs;
    } catch (error) {
      await this.logActivity('READ', 'audit_logs', 'multiple', false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Create admin user (super admin only)
   */
  async createAdmin(
    firebaseUid: string,
    email: string,
    name: string,
    role: 'admin' | 'manager',
    permissions: string[]
  ): Promise<void> {
    await this.requireAdminPermission(PERMISSIONS.CREATE_ADMIN);

    try {
      const newAdmin: Omit<FirebaseAdmin, 'id'> = {
        firebaseUid,
        email,
        name,
        role,
        permissions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: auth.currentUser?.uid
      };

      await setDoc(doc(db, COLLECTIONS.ADMINS, firebaseUid), newAdmin);

      await this.logActivity('CREATE', 'admin', firebaseUid, true, undefined, { role, permissions });
    } catch (error) {
      await this.logActivity('CREATE', 'admin', firebaseUid, false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Rate limiting for sensitive operations
   */
  private rateLimitMap = new Map<string, { count: number; lastReset: number }>();

  isRateLimited(operation: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = `${auth.currentUser?.uid || 'anonymous'}_${operation}`;
    const current = this.rateLimitMap.get(key) || { count: 0, lastReset: now };

    // Reset if window has passed
    if (now - current.lastReset > windowMs) {
      current.count = 0;
      current.lastReset = now;
    }

    current.count++;
    this.rateLimitMap.set(key, current);

    if (current.count > maxAttempts) {
      this.logActivity('RATE_LIMIT_EXCEEDED', operation, key, false);
      return true;
    }

    return false;
  }

  /**
   * Clear user session data
   */
  clearSession(): void {
    this.currentUserRole = null;
    this.currentUserPermissions = [];
  }

  /**
   * Get current user role
   */
  getCurrentUserRole(): string | null {
    return this.currentUserRole;
  }

  /**
   * Get current user permissions
   */
  getCurrentUserPermissions(): string[] {
    return [...this.currentUserPermissions];
  }
}

export const securityService = new SecurityService();
