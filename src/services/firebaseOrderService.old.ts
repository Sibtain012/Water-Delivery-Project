import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirebaseOrder, COLLECTIONS, PERMISSIONS } from '../types/firebase';
import { securityService } from './securityService';

class FirebaseOrderService {
  /**
   * Create new order (guest or authenticated)
   */
  async createOrder(orderData: Omit<FirebaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderDate'>): Promise<string> {
    // Check if this is a guest order
    const isGuestOrder = !auth.currentUser;

    // Apply rate limiting only for authenticated users
    if (!isGuestOrder && securityService.isRateLimited('create_order', 5, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }    try {
      // Sanitize input data
      const allowedFields: (keyof typeof orderData)[] = [
        'customerId', 'customerFirebaseUid', 'items', 'customerDetails', 'total',
        'status', 'paymentStatus', 'paymentMethod', 'deliveryDate', 'deliveryTime'
      ];
      
      let sanitizedData;
      try {
        sanitizedData = securityService.sanitizeInput(orderData, allowedFields);
      } catch (securityError) {
        console.warn('⚠️ Security service error, using basic sanitization:', securityError);
        // Fallback to basic sanitization for guest orders
        sanitizedData = {} as Partial<typeof orderData>;
        for (const field of allowedFields) {
          if (orderData[field] !== undefined) {
            (sanitizedData as any)[field] = orderData[field];
          }
        }
      }

      // Validate required fields
      if (!sanitizedData.customerId || !sanitizedData.items || !sanitizedData.customerDetails ||
        !sanitizedData.total || !sanitizedData.deliveryDate) {
        console.error('Missing required order fields:', {
          customerId: !!sanitizedData.customerId,
          items: !!sanitizedData.items,
          customerDetails: !!sanitizedData.customerDetails,
          total: !!sanitizedData.total,
          deliveryDate: !!sanitizedData.deliveryDate
        });
        throw new Error('Missing required order fields');
      }

      // For guest orders, skip user validation
      if (!isGuestOrder) {
        // Validate that user is creating order for themselves (unless admin)
        const canCreateForOthers = securityService.hasPermission(PERMISSIONS.CREATE_ORDER);
        if (!canCreateForOthers && auth.currentUser?.uid !== sanitizedData.customerFirebaseUid) {
          await securityService.logActivity('UNAUTHORIZED_ACCESS', 'order', 'create', false,
            'User attempted to create order for another customer');
          throw new Error('Cannot create order for another customer');
        }
      }

      // Validate order total
      if (typeof sanitizedData.total !== 'number' || sanitizedData.total <= 0) {
        throw new Error('Invalid order total');
      }

      // Validate items array
      if (!Array.isArray(sanitizedData.items) || sanitizedData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Generate tracking number
      const trackingNumber = this.generateTrackingNumber();

      const newOrder: Omit<FirebaseOrder, 'id'> = {
        ...sanitizedData,
        customerId: sanitizedData.customerId!,
        customerFirebaseUid: sanitizedData.customerFirebaseUid!,
        items: sanitizedData.items!,
        customerDetails: sanitizedData.customerDetails!,
        total: sanitizedData.total!,
        status: 'pending',
        paymentStatus: 'pending',
        deliveryDate: sanitizedData.deliveryDate!,
        deliveryTime: sanitizedData.deliveryTime || '',
        orderDate: new Date(),
        trackingNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), newOrder);

      // Log activity for authenticated users only
      if (!isGuestOrder) {
        try {
          await securityService.logActivity('CREATE', 'order', docRef.id, true, undefined, {
            customerId: newOrder.customerId,
            total: newOrder.total,
            itemCount: newOrder.items.length,
            trackingNumber: newOrder.trackingNumber
          });
        } catch (logError) {
          console.warn('⚠️ Security logging failed:', logError);
        }
      }

      return docRef.id;
    } catch (error) {
      // Log errors for authenticated users only
      if (!isGuestOrder) {
        try {
          await securityService.logActivity('CREATE', 'order', 'new', false,
            error instanceof Error ? error.message : 'Unknown error'
          );
        } catch (logError) {
          console.warn('⚠️ Security error logging failed:', logError);
        }
      }
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<FirebaseOrder | null> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const orderData = {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseOrder;

      // Check if user can access this order
      const canAccess = auth.currentUser.uid === orderData.customerFirebaseUid ||
        securityService.hasPermission(PERMISSIONS.READ_ORDER);

      if (!canAccess) {
        await securityService.logActivity('UNAUTHORIZED_ACCESS', 'order', orderId, false,
          'User attempted to access another customer\'s order');
        throw new Error('Access denied');
      }

      await securityService.logActivity('READ', 'order', orderId, true);
      return orderData;
    } catch (error) {
      await securityService.logActivity('READ', 'order', orderId, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get orders by customer Firebase UID
   */
  async getOrdersByCustomer(
    customerFirebaseUid: string,
    limitCount: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    orders: FirebaseOrder[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    // Users can only access their own orders, admins can access any customer's orders
    const canAccess = auth.currentUser.uid === customerFirebaseUid ||
      securityService.hasPermission(PERMISSIONS.READ_ORDER);

    if (!canAccess) {
      await securityService.logActivity('UNAUTHORIZED_ACCESS', 'orders', customerFirebaseUid, false,
        'User attempted to access another customer\'s orders');
      throw new Error('Access denied');
    }

    try {
      let q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('customerFirebaseUid', '==', customerFirebaseUid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[];

      await securityService.logActivity('READ', 'orders', `customer_${customerFirebaseUid}`, true);

      return {
        orders,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount
      };
    } catch (error) {
      await securityService.logActivity('READ', 'orders', `customer_${customerFirebaseUid}`, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(
    limitCount: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    orders: FirebaseOrder[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_ORDER);

    try {
      let q = query(
        collection(db, COLLECTIONS.ORDERS),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[];

      await securityService.logActivity('READ', 'orders', 'all', true);

      return {
        orders,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount
      };
    } catch (error) {
      await securityService.logActivity('READ', 'orders', 'all', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(
    orderId: string,
    status: FirebaseOrder['status'],
    adminNotes?: string
  ): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_ORDER);

    if (securityService.isRateLimited('update_order_status', 20, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };

      // Set status-specific timestamps
      switch (status) {
        case 'confirmed':
          updateData.confirmedAt = serverTimestamp();
          break;
        case 'delivered':
          updateData.deliveredAt = serverTimestamp();
          break;
        case 'cancelled':
          updateData.cancelledAt = serverTimestamp();
          break;
      }

      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }

      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('UPDATE', 'order', orderId, true, undefined, {
        newStatus: status,
        hasAdminNotes: !!adminNotes
      });
    } catch (error) {
      await securityService.logActivity('UPDATE', 'order', orderId, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Update payment status (admin only)
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: FirebaseOrder['paymentStatus'],
    paymentMethod?: string
  ): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.UPDATE_ORDER);

    try {
      const updateData: any = {
        paymentStatus,
        updatedAt: serverTimestamp()
      };

      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }

      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('UPDATE', 'order_payment', orderId, true, undefined, {
        newPaymentStatus: paymentStatus,
        paymentMethod
      });
    } catch (error) {
      await securityService.logActivity('UPDATE', 'order_payment', orderId, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Assign driver to order (admin only)
   */
  async assignDriver(orderId: string, driverId: string): Promise<void> {
    await securityService.requireAdminPermission(PERMISSIONS.ASSIGN_DRIVER);

    try {
      const updateData = {
        assignedDriverId: driverId,
        status: 'processing' as const,
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('ASSIGN_DRIVER', 'order', orderId, true, undefined, {
        driverId
      });
    } catch (error) {
      await securityService.logActivity('ASSIGN_DRIVER', 'order', orderId, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, cancelReason: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    try {
      // Get the order first to check permissions
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Check if user can cancel this order
      const canCancel = auth.currentUser.uid === order.customerFirebaseUid ||
        securityService.hasPermission(PERMISSIONS.UPDATE_ORDER);

      if (!canCancel) {
        await securityService.logActivity('UNAUTHORIZED_ACCESS', 'order', orderId, false,
          'User attempted to cancel another customer\'s order');
        throw new Error('Access denied');
      }

      // Check if order can be cancelled
      if (['delivered', 'cancelled'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      const updateData = {
        status: 'cancelled' as const,
        cancelReason: securityService.sanitizeInput({ cancelReason }, ['cancelReason']).cancelReason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(docRef, updateData);

      await securityService.logActivity('CANCEL', 'order', orderId, true, undefined, {
        cancelReason: updateData.cancelReason
      });
    } catch (error) {
      await securityService.logActivity('CANCEL', 'order', orderId, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get order statistics (admin only)
   */
  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_ORDER);

    try {
      const { orders } = await this.getAllOrders(1000); // Get more orders for stats

      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0
          ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
          : 0
      };

      await securityService.logActivity('READ', 'order_stats', 'all', true);
      return stats;
    } catch (error) {
      await securityService.logActivity('READ', 'order_stats', 'all', false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Search orders by tracking number or customer email (admin only)
   */
  async searchOrders(searchTerm: string, limitCount: number = 20): Promise<FirebaseOrder[]> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_ORDER);

    try {
      const searchTermLower = searchTerm.toLowerCase();

      // Search by tracking number first (exact match)
      const trackingQuery = query(
        collection(db, COLLECTIONS.ORDERS),
        where('trackingNumber', '==', searchTerm),
        limit(5)
      );

      const trackingSnapshot = await getDocs(trackingQuery);
      const trackingResults = trackingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[];

      if (trackingResults.length > 0) {
        await securityService.logActivity('SEARCH', 'orders', searchTerm, true);
        return trackingResults;
      }

      // If no tracking number match, search by customer email
      const { orders } = await this.getAllOrders(limitCount * 2);
      const emailResults = orders.filter(order =>
        order.customerDetails.email.toLowerCase().includes(searchTermLower)
      ).slice(0, limitCount);

      await securityService.logActivity('SEARCH', 'orders', searchTerm, true);
      return emailResults;
    } catch (error) {
      await securityService.logActivity('SEARCH', 'orders', searchTerm, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Get orders by status (admin only)
   */
  async getOrdersByStatus(status: FirebaseOrder['status'], limitCount: number = 50): Promise<FirebaseOrder[]> {
    await securityService.requireAdminPermission(PERMISSIONS.READ_ORDER);

    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[];

      await securityService.logActivity('READ', 'orders', `status_${status}`, true);
      return orders;
    } catch (error) {
      await securityService.logActivity('READ', 'orders', `status_${status}`, false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Generate tracking number
   */
  private generateTrackingNumber(): string {
    const prefix = 'WD'; // Water Delivery
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}

export const firebaseOrderService = new FirebaseOrderService();
