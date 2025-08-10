import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageSquare, MapPin, Tag, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { products } from '../data/products';
import { useSubscriptionPlanStore } from '../store/subscriptionPlanStore';
import { usePageTitle } from '../hooks/usePageTitle';

const Cart: React.FC = () => {
  usePageTitle('Shopping Cart');
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const { plans } = useSubscriptionPlanStore();
  const [orderNote, setOrderNote] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Mock coupon codes for demonstration
  const validCoupons = {
    'SAVE10': { discount: 0.10, description: '10% off your order' },
    'WELCOME15': { discount: 0.15, description: '15% off for new customers' },
    'BULK20': { discount: 0.20, description: '20% off orders over $50' }
  };

  // Mock frequently bought items
  const frequentlyBoughtItems = products.filter(p => !items.some(item => item.product.id === p.id)).slice(0, 3);

  const handleEstimateShipping = () => {
    if (!shippingZip || shippingZip.length < 5) {
      return;
    }

    // Mock shipping calculation based on zip code
    const baseShipping = 5.99;
    const zipNum = parseInt(shippingZip.substring(0, 2));
    let calculatedShipping = baseShipping;

    if (zipNum >= 90000) calculatedShipping = 8.99; // West Coast
    else if (zipNum >= 70000) calculatedShipping = 6.99; // Central
    else if (zipNum >= 10000) calculatedShipping = 5.99; // East Coast

    // Free shipping over PKR 50
    if (getSubtotal() >= 50) calculatedShipping = 0;

    setShippingCost(calculatedShipping);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (couponCode.toUpperCase() === 'BULK20' && getSubtotal() < 50) {
      setCouponError('This coupon requires a minimum order of PKR 50');
      return;
    }

    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      discount: coupon.discount
    });
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    return getSubtotal() * appliedCoupon.discount;
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shipping = shippingCost || 0;
    return subtotal - discount + shipping;
  };

  const handleAddFrequentItem = (product: any) => {
    // This would typically use the same add to cart modal
    // For now, we'll add it directly with default options
    const cartItem = {
      product,
      quantity: 1,
      purchaseType: 'one-time' as const,
      hasBottleExchange: false
    };
    // You would call addItem from the cart store here
    console.log('Adding frequent item:', cartItem);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-secondary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-text mb-4">Your cart is empty</h1>
            <p className="text-text/70 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-secondary/20">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-text">Shopping Cart</h1>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.purchaseType}`} className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-text text-center sm:text-left">
                          {item.product.name}
                        </h3>
                        <p className="text-text/70 text-sm sm:text-base text-center sm:text-left">{item.product.size}</p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                          {item.purchaseType === 'subscription' && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Subscription
                            </span>
                          )}
                          {item.hasBottleExchange && (
                            <span className="bg-blue-100 text-secondary px-2 py-1 rounded text-xs">
                              Bottle Exchange
                            </span>
                          )}
                        </div>

                        {/* Subscription Details */}
                        {item.purchaseType === 'subscription' && item.subscriptionPlan && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-800">
                              <div className="font-medium mb-1 text-xs sm:text-sm">📅 Subscription Details:</div>
                              {(() => {
                                const plan = plans.find(p => p.id === item.subscriptionPlan);
                                if (plan) {
                                  return (
                                    <div className="space-y-1">
                                      <div className="text-xs sm:text-sm">• Plan: {plan.name}</div>
                                      <div className="text-xs sm:text-sm">• Savings: {plan.savings || 'Applied'}</div>
                                      <div className="text-xs sm:text-sm">• Delivery: Automatic recurring deliveries</div>
                                      <div className="text-xs mt-2 text-green-700">
                                        ✓ You'll receive {plan.name.toLowerCase()} with free delivery
                                      </div>
                                    </div>
                                  );
                                }
                                return <div className="text-xs sm:text-sm">• Plan: {item.subscriptionPlan}</div>;
                              })()}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-secondary/30 rounded-full flex items-center justify-center hover:bg-secondary/10"
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-secondary/30 rounded-full flex items-center justify-center hover:bg-secondary/10"
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-semibold text-text">
                                PKR {(item.product.price * item.quantity).toFixed(2)}
                              </p>
                              {item.purchaseType === 'subscription' && (
                                <p className="text-xs sm:text-sm text-accent">15% off applied</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-500 hover:text-red-700 p-1 sm:p-2"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1. Order Note */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Add Order Note</h2>
              </div>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Special instructions for your delivery (e.g., gate code, preferred delivery location, etc.)"
                className="w-full p-3 border border-secondary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-text/60">
                  Add any special instructions for your delivery
                </p>
                <span className="text-xs text-text/50">
                  {orderNote.length}/500
                </span>
              </div>
            </div>

            {/* 2. Estimate Shipping */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Estimate Shipping</h2>
              </div>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="Enter ZIP code"
                    className="w-full p-3 border border-secondary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    maxLength={10}
                  />
                </div>
                <button
                  onClick={handleEstimateShipping}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Calculate
                </button>
              </div>
              {shippingCost !== null && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-text/80">Estimated shipping to {shippingZip}:</span>
                    <span className="font-semibold text-text">
                      {shippingCost === 0 ? 'FREE' : `PKR${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {shippingCost === 0 && getSubtotal() >= 50 && (
                    <p className="text-sm text-accent mt-1">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3. Add Coupon */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Add Coupon</h2>
              </div>

              {appliedCoupon ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-green-800">
                        Coupon "{appliedCoupon.code}" applied
                      </span>
                      <p className="text-sm text-green-600">
                        You saved PKR {getDiscountAmount().toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full p-3 border border-secondary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary uppercase"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      className="bg-primary hover:bg-primary/90 disabled:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-600 text-sm mt-2">{couponError}</p>
                  )}
                  <div className="mt-3 text-sm text-text/60">
                    <p className="font-medium mb-1">Available coupons:</p>
                    <ul className="space-y-1">
                      <li>• SAVE10 - 10% off your order</li>
                      <li>• WELCOME15 - 15% off for new customers</li>
                      <li>• BULK20 - 20% off orders over PKR 50</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Frequently Bought Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Frequently Bought Together</h2>
              </div>
              <p className="text-text/70 mb-4">
                Customers who bought these items also purchased:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frequentlyBoughtItems.map((product) => (
                  <div key={product.id} className="border border-secondary/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-secondary/10">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-text mb-1 text-sm">
                      {product.name}
                    </h3>
                    <p className="text-text/70 text-xs mb-2">{product.size}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">
                        PKR {product.price}
                      </span>
                      <button
                        onClick={() => handleAddFrequentItem(product)}
                        className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-text mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-text/70">Subtotal</span>
                  <span className="font-medium">PKR {getSubtotal().toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-accent">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-PKR {getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-text/70">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === null ? 'Calculated at checkout' :
                      shippingCost === 0 ? 'Free' : `PKR ${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-secondary/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      PKR {shippingCost !== null ? getFinalTotal().toFixed(2) : getSubtotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Benefits Summary */}
              {items.some(item => item.purchaseType === 'subscription') && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <h3 className="font-medium text-green-800 text-sm sm:text-base">Subscription Benefits</h3>
                  </div>
                  <div className="text-xs sm:text-sm text-green-700 space-y-1 sm:space-y-2">
                    <div className="font-medium">
                      You have {items.filter(item => item.purchaseType === 'subscription').length} subscription item(s):
                    </div>
                    <div className="space-y-1">
                      {items.filter(item => item.purchaseType === 'subscription').map((item, index) => {
                        const plan = plans.find(p => p.id === item.subscriptionPlan);
                        return (
                          <div key={index} className="text-xs pl-2 border-l-2 border-green-300">
                            <div className="break-words">
                              • {item.product.name} - {plan?.name || item.subscriptionPlan}
                              {plan && plan.savings && (
                                <span className="text-green-600"> ({plan.savings})</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 sm:mt-3 pt-2 border-t border-green-200 text-xs space-y-1">
                      <div>✓ Automatic recurring deliveries</div>
                      <div>✓ Guaranteed savings on every order</div>
                      <div>✓ Free delivery & flexibility to cancel anytime</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold text-center block transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/products"
                  className="w-full border border-secondary/30 hover:border-secondary/50 text-text py-3 rounded-lg font-medium text-center block transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;