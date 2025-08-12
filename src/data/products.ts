import { Product } from '../types';
import product_1 from '../../assets/images/imgi_21_19-Liter-Bottle-Tap-and-Stand-1_720x.jpg';
import product_2 from '../../assets/images/imgi_21_500-Ml-12-bottles_720x.jpg';
import product_3 from '../../assets/images/WhatsApp Image 2025-08-08 at 4.16.47 PM.jpeg';
import product_4 from '../../assets/images/imgi_21_cooler_720x.jpg';
import product_5 from '../../assets/images/imgi_6_1.5-Litre-6-bottles_720x.jpg';
import product_6 from '../../assets/images/imgi_7_6-liter_720x.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: '19 Liter Bottle (Without Stand)',
    description: 'Pure 19-liter water bottle for home and office use. No security deposit required. Perfect for water dispensers and coolers.',
    price: 250.00,
    image: product_3,
    size: '19 Liters',
    type: 'bottle',
    featured: true,
    hasExchange: true,
    depositPrice: 1000
  },
  {
    id: '2',
    name: '1.5 Litre Bottle (6 BOTTLES)',
    description: 'Purchases of Pet 1.5 Liter (Six Bottles) - Our 1.5 liter water is perfect for one of those days when you just need extra hydration. Take it with you anywhere!',
    price: 360.00,
    image: product_5,
    size: '1.5 Liters',
    type: 'bottle',
    featured: true,
    hasExchange: true,
    depositPrice: 1000
  },
  {
    id: '3',
    name: '500 ML Bottles (12 Bottles)',
    description: '500 ML Bottles (12 Bottles) - Meet the handy 0.5 liter. It is the perfect sized bottle for any occasion. Easy to carry and perfect for on-the-go hydration.',
    price: 360.00,
    image: product_2,
    size: '500 ML',
    type: 'bottle',
    featured: true,
    hasExchange: true,
    depositPrice: 1000
  },
  {
    id: '4',
    name: 'Non- Electronic Table Top Dispenser',
    description: 'Non-Electronic Table top Dispenser Golden Quality Made Of High Quality FDA Grade PP Polymer. Non – Dust Adhesive. Prevents Bacteria from Growing. No Water Leakage. Low Cost.',
    price: 1500.00,
    image: product_4,
    size: '19 Liters',
    type: 'dispenser',
    featured: false,
    hasExchange: true,
    depositPrice: 1000
  },
  {
    id: '5',
    name: '6 LITER WATER BOTTLE (MINIMUM 3)',
    description: "This 6 LITER WATER BOTTLE (MINIMUM 3) is perfect for your hydration needs! The large 6L capacity keeps you hydrated for longer and ensures you won't run out of water anytime soon.",
    price: 450.00,
    image: product_6,
    size: '6 Liters',
    type: 'bottle',
    featured: false,
    hasExchange: true,
    depositPrice: 1000
  },
  {
    id: '6',
    name: '19 Liter Bottle Tap and Stand',
    description: '5-Gallon Countertop Stand is the perfect space saving solution. The durable stand is also collapsible, so storing it when it is not in use is a breeze. Security deposit required for this product only.',
    price: 600.00,
    image: product_1,
    size: '19 Liters',
    type: 'accessory',
    featured: false,
    hasExchange: true,
    depositPrice: 500.00
  }
];

export const subscriptionPlans = [
  { id: 'weekly-3', name: '3 bottles per week', discount: 0.15 },
  { id: 'weekly-5', name: '5 bottles per week', discount: 0.20 },
  { id: 'monthly-12', name: '12 bottles per month', discount: 0.10 },
  { id: 'monthly-20', name: '20 bottles per month', discount: 0.18 }
];

// Helper functions for product operations
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByType = (type: string): Product[] => {
  return products.filter(product => product.type === type);
};

export const calculateProductTotal = (product: Product, quantity: number): number => {
  const basePrice = product.price * quantity;
  const depositPrice = product.hasExchange && product.depositPrice ? product.depositPrice : 0;
  return basePrice + depositPrice;
};

export const formatPrice = (price: number): string => {
  return `PKR ${price.toFixed(2)}`;
};

export const getAvailableProductTypes = (): string[] => {
  const types = products.map(product => product.type);
  return Array.from(new Set(types));
};
