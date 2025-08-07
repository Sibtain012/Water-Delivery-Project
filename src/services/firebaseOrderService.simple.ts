import {
    collection,
    addDoc
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
}

export const firebaseOrderService = new FirebaseOrderService();
