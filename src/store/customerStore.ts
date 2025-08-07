import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
  id: string;
  customerId: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      description?: string;
    };
    quantity: number;
    purchaseType: 'one-time' | 'subscription';
    subscriptionPlan?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate: string;
  deliveryTime: string;
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
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  password?: string;
  signupMethod?: 'google' | 'manual';
  firebaseUid?: string;
  orders: Order[];
  subscriptions: any[];
  createdAt: Date;
}

interface CustomerStore {
  customers: Customer[];
  orders: Order[];
  currentCustomer: Customer | null;

  // Customer methods
  addCustomer: (customer: Omit<Customer, 'id' | 'orders' | 'subscriptions' | 'createdAt'>) => void;
  createCustomer: (customer: Omit<Customer, 'id' | 'orders' | 'subscriptions' | 'createdAt'>) => Customer;
  getCustomer: (id: string) => Customer | undefined;
  getCustomerByEmail: (email: string) => Customer | undefined;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getAllCustomers: () => Customer[];
  setCurrentCustomer: (customer: Customer) => void;
  logoutCustomer: () => void;

  // Order methods
  createOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  getOrdersByCustomer: (customerId: string) => Order[];

  // Statistics
  getOrderStats: () => {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      orders: [],
      currentCustomer: null,

      // Customer methods
      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orders: [],
          subscriptions: [],
          createdAt: new Date()
        };

        set((state) => ({
          customers: [...state.customers, newCustomer]
        }));
      },

      createCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orders: [],
          subscriptions: [],
          createdAt: new Date()
        };

        set((state) => ({
          customers: [...state.customers, newCustomer]
        }));

        return newCustomer;
      },

      getCustomerByEmail: (email) => {
        return get().customers.find(customer => customer.email === email);
      },

      setCurrentCustomer: (customer) => {
        set({ currentCustomer: customer });
      },

      logoutCustomer: () => {
        set({ currentCustomer: null });
      },

      getCustomer: (id) => {
        return get().customers.find(customer => customer.id === id);
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === id ? { ...customer, ...updates } : customer
          )
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter(customer => customer.id !== id),
          orders: state.orders.filter(order => order.customerId !== id)
        }));
      },

      getAllCustomers: () => {
        const store = get();
        // Get unique customers from orders
        const uniqueCustomers = new Map<string, Customer>();

        store.orders.forEach(order => {
          if (!uniqueCustomers.has(order.customerId)) {
            uniqueCustomers.set(order.customerId, {
              id: order.customerId,
              firstName: order.customerDetails.firstName,
              lastName: order.customerDetails.lastName,
              email: order.customerDetails.email,
              phone: order.customerDetails.phone,
              address: order.customerDetails.address,
              city: order.customerDetails.city,
              postalCode: order.customerDetails.postalCode,
              orders: store.orders.filter(o => o.customerId === order.customerId),
              subscriptions: [],
              createdAt: order.orderDate
            });
          }
        });

        // Merge with existing customers
        store.customers.forEach(customer => {
          uniqueCustomers.set(customer.id, customer);
        });

        return Array.from(uniqueCustomers.values());
      },

      // Order methods
      createOrder: (order) => {
        console.log('🏪 CustomerStore: Creating order:', order);

        set((state) => {
          const newOrders = [...state.orders, order];
          console.log('🏪 CustomerStore: Total orders after creation:', newOrders.length);
          return { orders: newOrders };
        });
      },

      getOrder: (id) => {
        return get().orders.find(order => order.id === id);
      },

      getAllOrders: () => {
        const orders = get().orders;
        console.log('🏪 CustomerStore: getAllOrders called, returning:', orders.length, 'orders');
        return orders;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        }));
      },

      updateOrderDetails: (orderId, updates) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          )
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter(order => order.id !== orderId)
        }));
      },

      getOrdersByCustomer: (customerId) => {
        return get().orders.filter(order => order.customerId === customerId);
      },

      getOrderStats: () => {
        const orders = get().orders;
        return {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
        };
      },
    }),
    {
      name: 'customer-storage', 
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert date strings back to Date objects
            state.customers = state.customers.map(customer => ({
              ...customer,
              createdAt: new Date(customer.createdAt)
            }));

            state.orders = state.orders.map(order => ({
              ...order,
              orderDate: new Date(order.orderDate)
            }));

            console.log('🔄 Rehydrating customer store...');
            console.log(`📦 Loaded ${state.orders.length} orders from localStorage`);
          } catch (error) {
            console.error('Error rehydrating store:', error);
            state.customers = [];
            state.orders = [];
          }
        }
      },
    }
  )
);