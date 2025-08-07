import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirebaseOrder, COLLECTIONS } from '../types/firebase';

class FirebaseOrderService {
  /**
   * Create new guest order (no authentication required)
   */
  async createOrder(orderData: Omit<FirebaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderDate'>): Promise<string> {
    console.log('🔄 Creating guest order...');

    try {
      // Simple validation for guest orders
      if (!orderData.customerId || !orderData.items || !orderData.customerDetails ||
        !orderData.total || !orderData.deliveryDate) {
        console.error('Missing required order fields:', {
          customerId: !!orderData.customerId,
          items: !!orderData.items,
          customerDetails: !!orderData.customerDetails,
          total: !!orderData.total,
          deliveryDate: !!orderData.deliveryDate
        });
        throw new Error('Missing required order fields');
      }

      // Validate order total
      if (typeof orderData.total !== 'number' || orderData.total <= 0) {
        throw new Error('Invalid order total');
      }

      // Validate items array
      if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Generate tracking number
      const trackingNumber = this.generateTrackingNumber();

      const newOrder: Omit<FirebaseOrder, 'id'> = {
        ...orderData,
        customerId: orderData.customerId,
        customerFirebaseUid: orderData.customerFirebaseUid,
        items: orderData.items,
        customerDetails: orderData.customerDetails,
        total: orderData.total,
        status: 'pending',
        paymentStatus: 'pending',
        deliveryDate: orderData.deliveryDate,
        deliveryTime: orderData.deliveryTime || '',
        orderDate: new Date(),
        trackingNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('💾 Saving order to Firebase...');
      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), newOrder);
      console.log('✅ Order saved successfully with ID:', docRef.id);

      return docRef.id;
    } catch (error) {
      console.error('❌ Order creation failed:', error);
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

  /**
   * Get all orders for admin dashboard
   */
  async getAllOrders(): Promise<FirebaseOrder[]> {
    try {
      console.log('📋 Fetching all orders from Firebase...');
      const ordersQuery = query(
        collection(db, COLLECTIONS.ORDERS),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: FirebaseOrder[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to Date objects if needed
          orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : data.orderDate,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        } as FirebaseOrder);
      });

      console.log('✅ Retrieved orders:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      console.log(`🔄 Updating order ${orderId} status to ${status}...`);
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
      console.log('✅ Order status updated successfully');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting order ${orderId}...`);
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await deleteDoc(orderRef);
      console.log('✅ Order deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw error;
    }
  }

  /**
   * Get unique customers from orders
   */
  async getCustomersFromOrders(): Promise<any[]> {
    try {
      console.log('👥 Fetching customers from orders...');
      const orders = await this.getAllOrders();

      // Extract unique customers based on email or phone
      const customerMap = new Map();

      orders.forEach(order => {
        const customer = order.customerDetails;
        if (customer && (customer.email || customer.phone)) {
          const key = customer.email || customer.phone;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: key,
              name: `${customer.firstName} ${customer.lastName}`.trim() || 'Unknown',
              email: customer.email || 'N/A',
              phone: customer.phone || 'N/A',
              address: customer.address || 'N/A',
              city: customer.city || 'N/A',
              totalOrders: 1,
              lastOrderDate: order.createdAt,
              createdAt: order.createdAt
            });
          } else {
            // Update existing customer info
            const existing = customerMap.get(key);
            existing.totalOrders += 1;
            if (order.createdAt > existing.lastOrderDate) {
              existing.lastOrderDate = order.createdAt;
            }
          }
        }
      });

      const customers = Array.from(customerMap.values());
      console.log('✅ Retrieved unique customers:', customers.length);
      return customers;
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      throw error;
    }
  }
}

export const firebaseOrderService = new FirebaseOrderService();
