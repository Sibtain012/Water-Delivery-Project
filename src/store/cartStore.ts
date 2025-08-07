import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem } from '../types';
import { cookieUtils } from '../utils/cookies';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          item => item.product.id === newItem.product.id &&
            item.purchaseType === newItem.purchaseType &&
            item.subscriptionPlan === newItem.subscriptionPlan
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedItems = [...items, newItem];
        }

        // Save to cookies if user has accepted necessary cookies
        const preferences = cookieUtils.getCookiePreferences();
        if (preferences?.necessary) {
          cookieUtils.saveCartToCookies(updatedItems);
        }

        set({ items: updatedItems });
      },

      removeItem: (productId: string) => {
        const newItems = get().items.filter(item => item.product.id !== productId);

        // Update cookies
        const preferences = cookieUtils.getCookiePreferences();
        if (preferences?.necessary) {
          cookieUtils.saveCartToCookies(newItems);
        }

        set({ items: newItems });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newItems = get().items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );

        // Update cookies
        const preferences = cookieUtils.getCookiePreferences();
        if (preferences?.necessary) {
          cookieUtils.saveCartToCookies(newItems);
        }

        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [] });
        // Clear cart from cookies
        const preferences = cookieUtils.getCookiePreferences();
        if (preferences?.necessary) {
          cookieUtils.saveCartToCookies([]);
        }
      },

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          let price = item.product.price;

          // Apply deposit if no bottle exchange
          if (item.product.hasExchange && !item.hasBottleExchange && item.product.depositPrice) {
            price += item.product.depositPrice;
          }

          // Apply subscription discount
          if (item.purchaseType === 'subscription') {
            price *= 0.85; // 15% subscription discount
          }

          return total + (price * item.quantity);
        }, 0);
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'aqua-cart-storage',
      // Load cart from cookies on initialization
      onRehydrateStorage: () => (state) => {
        const cookieCart = cookieUtils.getCartFromCookies();
        if (cookieCart && Array.isArray(cookieCart)) {
          return { ...state, items: cookieCart };
        }
        return state;
      },
    }
  )
);