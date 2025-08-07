export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  type: 'bottle' | 'dispenser' | 'accessory';
  featured?: boolean;
  hasExchange?: boolean;
  depositPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  purchaseType: 'one-time' | 'subscription';
  subscriptionPlan?: string;
  hasBottleExchange?: boolean;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
}