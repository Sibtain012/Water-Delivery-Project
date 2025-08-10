import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Product, CartItem } from '../types';
import { useSubscriptionPlanStore } from '../store/subscriptionPlanStore';
import { useCartStore } from '../store/cartStore';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [hasBottleExchange, setHasBottleExchange] = useState(false);
  const { addItem, toggleCart } = useCartStore();
  const { plans } = useSubscriptionPlanStore();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      product,
      quantity,
      purchaseType,
      subscriptionPlan: purchaseType === 'subscription' ? subscriptionPlan : undefined,
      hasBottleExchange: product.hasExchange ? hasBottleExchange : undefined
    };

    addItem(cartItem);
    onClose();
    setQuantity(1);
    setPurchaseType('one-time');
    setSubscriptionPlan('');
    setHasBottleExchange(false);
  };

  const getPrice = () => {
    let price = product.price * quantity;

    if (product.hasExchange && !hasBottleExchange && product.depositPrice) {
      price += product.depositPrice * quantity;
    }

    if (purchaseType === 'subscription') {
      price *= 0.85; // 15% discount for subscription
    }

    return price;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-slate-600">{product.size}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Product Image */}
          <div className="aspect-video mb-6 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Purchase Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Purchase Type
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="one-time"
                  checked={purchaseType === 'one-time'}
                  onChange={(e) => setPurchaseType(e.target.value as 'one-time')}
                  className="mr-3"
                />
                <span>One-time purchase</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="subscription"
                  checked={purchaseType === 'subscription'}
                  onChange={(e) => setPurchaseType(e.target.value as 'subscription')}
                  className="mr-3"
                />
                <span>Subscription (15% off)</span>
              </label>
            </div>
          </div>

          {/* Subscription Plans */}
          {purchaseType === 'subscription' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Subscription Plan
              </label>
              <select
                value={subscriptionPlan}
                onChange={(e) => {
                  setSubscriptionPlan(e.target.value);
                  // Auto-add to cart when subscription plan is selected
                  if (e.target.value) {
                    const selectedPlan = plans.find(plan => plan.id === e.target.value);
                    if (selectedPlan) {
                      const cartItem: CartItem = {
                        product,
                        quantity,
                        purchaseType: 'subscription',
                        subscriptionPlan: e.target.value,
                        hasBottleExchange: product.hasExchange ? hasBottleExchange : undefined
                      };
                      addItem(cartItem);
                      toggleCart(); // Show cart after adding
                      onClose();
                      setQuantity(1);
                      setPurchaseType('one-time');
                      setSubscriptionPlan('');
                      setHasBottleExchange(false);
                    }
                  }
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a plan to add to cart</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} {plan.savings ? `(${plan.savings})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Selecting a plan will automatically add it to your cart
              </p>
            </div>
          )}

          {/* Bottle Exchange */}
          {product.hasExchange && (
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasBottleExchange}
                  onChange={(e) => setHasBottleExchange(e.target.checked)}
                  className="mr-3"
                />
                <span className="text-sm">
                  I have bottles to exchange (no deposit required)
                </span>
              </label>
              {!hasBottleExchange && product.depositPrice && (
                <p className="text-xs text-slate-500 mt-1">
                  Security deposit: PKR {product.depositPrice} per bottle
                </p>
              )}
            </div>
          )}

          {/* Price Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                PKR {getPrice().toFixed(2)}
              </span>
            </div>
            {purchaseType === 'subscription' && (
              <p className="text-xs text-green-600 mt-1">
                15% subscription discount applied
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          {purchaseType === 'one-time' && (
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Check className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          )}

          {purchaseType === 'subscription' && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700 font-medium">Choose a subscription plan above to add to cart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;