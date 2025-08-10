import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Star, Truck, Clock, Shield } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Product, CartItem } from '../types';
import { useSubscriptionPlanStore, SubscriptionPlan as AdminSubscriptionPlan } from '../store/subscriptionPlanStore';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  bottles: number;
  frequency: string;
  popular?: boolean;
  savings?: string;
  features?: string[];
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { addItem, toggleCart } = useCartStore();
  const { plans } = useSubscriptionPlanStore();

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Normalize plans from store to modal's expected shape
  const subscriptionPlans: SubscriptionPlan[] = (plans as AdminSubscriptionPlan[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    bottles: p.bottles,
    frequency: p.frequency,
    popular: p.popular,
    savings: p.savings,
    features: p.features
  }));

  const handleSubscribe = () => {
    if (selectedPlan) {
      // Create a subscription product to add to cart
      const subscriptionProduct: Product = {
        id: `subscription-${selectedPlan.id}`,
        name: `${selectedPlan.name} Subscription`,
        description: `${selectedPlan.bottles} bottles delivered ${selectedPlan.frequency.toLowerCase()}`,
        price: selectedPlan.price,
        image: '/assets/images/imgi_21_19-Liter-Bottle-Tap-and-Stand-1_720x.jpg', // Default bottle image
        size: `${selectedPlan.bottles} bottles`,
        type: 'bottle',
        hasExchange: false,
        depositPrice: 0
      };

      // Create cart item with subscription details
      const cartItem: CartItem = {
        product: subscriptionProduct,
        quantity: 1,
        purchaseType: 'subscription',
        subscriptionPlan: selectedPlan.id,
        hasBottleExchange: false
      };

      // Add to cart
      addItem(cartItem);

      // Open cart sidebar to show the added item
      toggleCart();

      // Call the original onSubscribe for any additional handling
      onSubscribe(selectedPlan);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-accent p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl text-text font-bold mb-2">Subscribe & Save</h2>
            <p className="text-text/90 text-lg">
              Choose the perfect plan for your hydration needs
            </p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {/* Benefits Banner */}
          <div className="bg-gradient-to-r from-background to-secondary/10 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text">Free Delivery</h4>
                  <p className="text-sm text-text/70">On all orders</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-text">Flexible</h4>
                  <p className="text-sm text-text/70">Cancel anytime</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text">Save up to 18%</h4>
                  <p className="text-sm text-text/70">Best value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${selectedPlan?.id === plan.id
                  ? 'ring-3 ring-secondary shadow-lg scale-105 bg-secondary/5'
                  : 'border-2 border-gray-200 hover:border-secondary hover:shadow-md'
                  } ${plan.popular ? 'border-accent mt-4' : ''} bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg border-2 border-white whitespace-nowrap">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}

                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-text">PKR {plan.price.toLocaleString()}</span>
                    <span className="text-text/70 ml-1">/{plan.frequency.toLowerCase()}</span>
                  </div>
                  {plan.savings && (
                    <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-text/80">
                      <CheckCircle className="w-4 h-4 text-secondary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <div className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${selectedPlan?.id === plan.id
                    ? 'bg-secondary text-white'
                    : 'bg-primary text-white hover:bg-primary/90'
                    }`}>
                    {selectedPlan?.id === plan.id ? 'Selected ✓' : 'Select Plan'}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-background px-8 py-6 border-t border-gray-200">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-primary/30 rounded-xl font-semibold text-primary hover:bg-white hover:border-primary/50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubscribe}
              disabled={!selectedPlan}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${selectedPlan
                ? 'bg-primary hover:bg-gradient-to-r hover:from-secondary hover:to-accent text-white shadow-lg hover:shadow-xl'
                : 'bg-primary/50 text-white cursor-not-allowed'
                }`}
            >
              {selectedPlan ? `Add ${selectedPlan.name} to Cart` : 'Select a Plan'}
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-text/70 text-sm">
              <Clock className="w-4 h-4 inline mr-1 text-text/60" />
              Start your subscription today • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;