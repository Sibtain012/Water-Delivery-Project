import emailjs from '@emailjs/browser';

export interface OrderEmailData {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    orderItems: Array<{
        name: string;
        quantity: number;
        price: number;
        total: number;
        purchaseType: 'one-time' | 'subscription';
        subscriptionPlan?: string;
        subscriptionDetails?: string;
    }>;
    orderTotal: number;
    deliveryDate: string;
    deliveryTime: string;
    notes: string;
    hasSubscriptions: boolean;
    subscriptionSummary?: string;
}

class EmailService {
    private isInitialized = false;

    constructor() {
        this.initializeEmailJS();
    }

    private initializeEmailJS() {
        try {
            // Use the correct public key from .env
            const publicKey = "C20yscudq01bTtC8I";

            emailjs.init(publicKey);
            this.isInitialized = true;
            console.log('✅ EmailJS initialized successfully with key:', publicKey);
        } catch (error) {
            console.error('❌ Failed to initialize EmailJS:', error);
        }
    }

    async sendOrderNotificationToAdmin(orderData: OrderEmailData): Promise<boolean> {
        if (!this.isInitialized) {
            console.warn('⚠️ EmailJS not initialized, skipping admin email');
            return false;
        }

        try {
            const serviceId = "service_se59j7c";
            const templateId = "template_fy2d29a";

            console.log('📧 Sending admin notification email...');

            // Template parameters matching your ADMIN template exactly
            const templateParams = {
                // CRITICAL: EmailJS needs to_email parameter for routing
                to_email: 'aabetahura@gmail.com',
                to_name: 'Admin',

                // Your template variables
                order_id: orderData.orderId,
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                customer_address: orderData.customerAddress,
                order_date: new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                order_items: orderData.orderItems.map(item => {
                    let itemText = `${item.name} - Qty: ${item.quantity} - PKR ${item.total.toFixed(2)}`;
                    if (item.purchaseType === 'subscription') {
                        itemText += ` (SUBSCRIPTION: ${item.subscriptionDetails || item.subscriptionPlan || 'Plan details not specified'})`;
                    }
                    return itemText;
                }).join('\n'),
                order_total: `PKR ${orderData.orderTotal.toFixed(2)}`,
                delivery_date: orderData.deliveryDate,
                delivery_time: orderData.deliveryTime,
                special_notes: orderData.notes || 'No special instructions',
                subscription_info: orderData.hasSubscriptions ?
                    `\n⚡ SUBSCRIPTION ORDER ALERT ⚡\nThis order contains subscription items:\n${orderData.subscriptionSummary || 'Subscription details included in items above'}`
                    : ''
            };

            console.log('📧 Admin email params:', templateParams);

            const result = await emailjs.send(serviceId, templateId, templateParams);

            if (result.status === 200) {
                console.log('✅ Admin notification email sent successfully');
                return true;
            } else {
                console.error('❌ Failed to send admin email:', result);
                return false;
            }
        } catch (error) {
            console.error('❌ Error sending admin notification email:', error);
            return false;
        }
    }

    async sendOrderConfirmationToCustomer(orderData: OrderEmailData): Promise<boolean> {
        if (!this.isInitialized) {
            console.warn('⚠️ EmailJS not initialized, skipping customer email');
            return false;
        }

        try {
            const serviceId = "service_se59j7c";
            const templateId = "template_zuw9l89";

            console.log('📧 Sending customer confirmation email...');

            // Template parameters matching your CUSTOMER template exactly
            const templateParams = {
                // CRITICAL: EmailJS needs to_email parameter for routing
                to_email: orderData.customerEmail,
                to_name: orderData.customerName,

                // Your template variables
                customer_name: orderData.customerName,
                order_id: orderData.orderId,
                order_date: new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                order_items: orderData.orderItems.map(item => {
                    let itemText = `${item.name} - Qty: ${item.quantity} - PKR ${item.total.toFixed(2)}`;
                    if (item.purchaseType === 'subscription') {
                        itemText += ` (Subscription: ${item.subscriptionDetails || item.subscriptionPlan || 'Recurring delivery'})`;
                    }
                    return itemText;
                }).join('\n'),
                order_total: `PKR ${orderData.orderTotal.toFixed(2)}`,
                delivery_date: orderData.deliveryDate,
                delivery_time: orderData.deliveryTime,
                delivery_address: orderData.customerAddress,
                subscription_details: orderData.hasSubscriptions ?
                    `You have subscribed to recurring deliveries! Your subscription items will be delivered automatically according to your selected plan.`
                    : ''
            };

            console.log('📧 Customer email params:', templateParams);

            const result = await emailjs.send(serviceId, templateId, templateParams);

            if (result.status === 200) {
                console.log('✅ Customer confirmation email sent successfully');
                return true;
            } else {
                console.error('❌ Failed to send customer email:', result);
                return false;
            }
        } catch (error) {
            console.error('❌ Error sending customer confirmation email:', error);
            return false;
        }
    }

    // Test method
    async testEmailConfiguration(): Promise<{ admin: boolean; customer: boolean }> {
        console.log('🧪 Testing EmailJS configuration...');

        const testOrderData: OrderEmailData = {
            orderId: 'TEST-' + Date.now(),
            customerName: 'Test Customer',
            customerEmail: 'aabetahura@gmail.com',
            customerPhone: '+1234567890',
            customerAddress: '123 Test Street, Test City, 12345',
            orderItems: [
                {
                    name: 'Test Water Bottle',
                    quantity: 2,
                    price: 50,
                    total: 100,
                    purchaseType: 'one-time' as const
                }
            ],
            orderTotal: 100,
            deliveryDate: new Date().toISOString().split('T')[0],
            deliveryTime: '9am-12pm',
            notes: 'This is a test order',
            hasSubscriptions: false
        };

        const adminResult = await this.sendOrderNotificationToAdmin(testOrderData);
        const customerResult = await this.sendOrderConfirmationToCustomer(testOrderData);

        return {
            admin: adminResult,
            customer: customerResult
        };
    }
}

export const emailService = new EmailService(); 