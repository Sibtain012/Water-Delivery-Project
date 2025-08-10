import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  bottles: number;
  frequency: string; // e.g., 'Monthly'
  popular?: boolean;
  savings?: string; // e.g., 'Save 15%'
  features?: string[];
  // Backward compatibility
  discountPercent?: number; // e.g., 15
  discount?: number; // 0.15 (used in some legacy components)
}

interface SubscriptionPlanStore {
  plans: SubscriptionPlan[];
  addPlan: (plan: SubscriptionPlan) => void;
  updatePlan: (id: string, plan: Partial<SubscriptionPlan>) => void;
  deletePlan: (id: string) => void;
  getPlan: (id: string) => SubscriptionPlan | undefined;
  resetPlans: () => void;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 2999,
    bottles: 8,
    frequency: 'Monthly',
    savings: 'Save 10%',
    discountPercent: 10,
    discount: 0.10,
    features: ['8 bottles monthly', 'Free delivery', 'Cancel anytime']
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 4999,
    bottles: 12,
    frequency: 'Monthly',
    popular: true,
    savings: 'Save 15%',
    discountPercent: 15,
    discount: 0.15,
    features: ['12 bottles monthly', 'Free delivery', 'Priority support', 'Cancel anytime']
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 7999,
    bottles: 20,
    frequency: 'Monthly',
    savings: 'Save 18%',
    discountPercent: 18,
    discount: 0.18,
    features: ['20 bottles monthly', 'Free priority delivery', 'Half bottle security deposit', 'Dedicated support', 'Cancel anytime']
  }
];

export const useSubscriptionPlanStore = create<SubscriptionPlanStore>()(
  persist(
    (set, get) => ({
      plans: defaultPlans,
      addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, plan) => set((state) => ({
        plans: state.plans.map(p => (p.id === id ? { ...p, ...plan } : p))
      })),
      deletePlan: (id) => set((state) => ({ plans: state.plans.filter(p => p.id !== id) })),
      getPlan: (id) => get().plans.find(p => p.id === id),
      resetPlans: () => set(() => ({ plans: defaultPlans }))
    }),
    {
      name: 'subscription-plans-storage',
      partialize: (state) => ({ plans: state.plans })
    }
  )
);
