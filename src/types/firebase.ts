export interface FirebaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  size: string;
  type: 'bottle' | 'dispenser' | 'accessory';
  featured?: boolean;
  hasExchange?: boolean;
  depositPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
}

export interface FirebaseCustomer {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  signupMethod: 'google' | 'manual';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface FirebaseOrder {
  id: string;
  customerId: string;
  customerFirebaseUid: string;
  items: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    purchaseType: 'one-time' | 'subscription';
    subscriptionPlan?: string;
    subscriptionDetails?: {
      planId: string;
      planName: string;
      frequency: string;
      bottles: number;
      savings: string;
      discount: number;
    };
    hasBottleExchange?: boolean;
  }>;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'bank-transfer';
  deliveryDate: string;
  deliveryTime: string;
  orderDate: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  trackingNumber?: string;
  assignedDriverId?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseSubscription {
  id: string;
  customerId: string;
  customerFirebaseUid: string;
  productId: string;
  planId: string;
  planName: string;
  quantity: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  nextDeliveryDate: Date;
  status: 'active' | 'paused' | 'cancelled';
  deliveryAddress: string;
  totalPrice: number;
  discountPercent: number;
  createdAt: Date;
  updatedAt: Date;
  pausedAt?: Date;
  cancelledAt?: Date;
  lastDeliveryAt?: Date;
}

export interface FirebaseAdmin {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'super-admin' | 'admin' | 'manager';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  createdBy?: string;
}

export interface FirebaseDriver {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleInfo: {
    type: string;
    model: string;
    plateNumber: string;
  };
  isActive: boolean;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };
  assignedOrders: string[];
  totalDeliveries: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// Database collection names (for consistency)
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  SUBSCRIPTIONS: 'subscriptions',
  ADMINS: 'admins',
  DRIVERS: 'drivers',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'settings'
} as const;

// Security roles and permissions
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
  DRIVER: 'driver'
} as const;

export const PERMISSIONS = {
  // Product permissions
  CREATE_PRODUCT: 'create:product',
  READ_PRODUCT: 'read:product',
  UPDATE_PRODUCT: 'update:product',
  DELETE_PRODUCT: 'delete:product',

  // Order permissions
  CREATE_ORDER: 'create:order',
  READ_ORDER: 'read:order',
  UPDATE_ORDER: 'update:order',
  DELETE_ORDER: 'delete:order',
  ASSIGN_DRIVER: 'assign:driver',

  // Customer permissions
  READ_CUSTOMER: 'read:customer',
  UPDATE_CUSTOMER: 'update:customer',
  DELETE_CUSTOMER: 'delete:customer',

  // Admin permissions
  CREATE_ADMIN: 'create:admin',
  READ_ADMIN: 'read:admin',
  UPDATE_ADMIN: 'update:admin',
  DELETE_ADMIN: 'delete:admin',

  // System permissions
  READ_AUDIT_LOGS: 'read:audit_logs',
  UPDATE_SETTINGS: 'update:settings',
  BACKUP_DATA: 'backup:data',
  EXPORT_DATA: 'export:data'
} as const;
