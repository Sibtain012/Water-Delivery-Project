import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { subscriptionPlans } from '../data/products';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart ({getTotalItems()})</h2>
            <button
              onClick={toggleCart}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.purchaseType}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">{item.product.size}</p>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.purchaseType === 'subscription' && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            Subscription
                          </span>
                        )}
                        {item.hasBottleExchange && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-1">
                            Exchange
                          </span>
                        )}
                      </div>

                      {/* Subscription Details in Sidebar */}
                      {item.purchaseType === 'subscription' && item.subscriptionPlan && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <div className="text-green-800">
                            {(() => {
                              const plan = subscriptionPlans.find(p => p.id === item.subscriptionPlan);
                              if (plan) {
                                return (
                                  <div className="space-y-1">
                                    <div className="font-medium text-xs leading-tight">{plan.name}</div>
                                    <div className="text-green-600 text-xs leading-tight">
                                      {Math.round(plan.discount * 100)}% savings • Auto delivery
                                    </div>
                                  </div>
                                );
                              }
                              return <div className="text-xs break-words">Plan: {item.subscriptionPlan}</div>;
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>PKR {getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-lg font-medium text-center block transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-lg font-medium text-center block transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;