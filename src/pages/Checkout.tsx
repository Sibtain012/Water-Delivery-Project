import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { CheckoutForm } from '../types';
import { emailService, OrderEmailData } from '../services/emailService';
import { firebaseOrderService } from '../services/firebaseOrderService';
import { useSubscriptionPlanStore } from '../store/subscriptionPlanStore';
import { usePageTitle } from '../hooks/usePageTitle';

const Checkout: React.FC = () => {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { plans } = useSubscriptionPlanStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryDate: '',
    deliveryTime: '',
    notes: ''
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showEasyPaisaModal, setShowEasyPaisaModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');

  // Redirect to cart if no items (but not if order was just completed)
  useEffect(() => {
    if (items.length === 0 && !orderCompleted && !isProcessing) {
      navigate('/cart');
    }
  }, [items, navigate, orderCompleted, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Required field validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.deliveryDate) errors.deliveryDate = 'Delivery date is required';
    if (!formData.deliveryTime) errors.deliveryTime = 'Delivery time is required';

    // Delivery date validation
    if (formData.deliveryDate) {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.deliveryDate = 'Delivery date cannot be in the past';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before processing
    if (!validateForm()) {
      alert('Please correct the errors in the form before submitting.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Firebase order data structure for guest checkout
      const firebaseOrderData = {
        customerFirebaseUid: 'guest', // All orders are guest orders now
        customerId: 'guest',
        items: items.map(item => {
          // Get subscription plan details if this is a subscription item
          const getSubscriptionDetails = () => {
            if (item.purchaseType === 'subscription' && item.subscriptionPlan) {
              const plan = plans.find(p => p.id === item.subscriptionPlan);
              if (plan) {
                return {
                  planId: plan.id,
                  planName: plan.name,
                  frequency: plan.frequency || 'Monthly',
                  bottles: plan.bottles || 1,
                  savings: plan.savings || 'Savings applied',
                  discount: plan.discount || 0.15
                };
              }
            }
            return undefined;
          };

          return {
            productId: item.product.id,
            productName: item.product.name,
            productPrice: item.product.price,
            quantity: item.quantity,
            purchaseType: item.purchaseType as 'one-time' | 'subscription',
            subscriptionPlan: item.subscriptionPlan,
            subscriptionDetails: getSubscriptionDetails(),
            hasBottleExchange: false
          };
        }),
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        total: getTotalPrice(),
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime
      };

      console.log('Creating guest order:', firebaseOrderData);

      // Save order to Firebase Firestore
      console.log('📦 Attempting to save order to Firebase...');
      try {
        const firebaseOrderId = await firebaseOrderService.createOrder(firebaseOrderData);
        console.log('✅ Order saved to Firebase successfully with ID:', firebaseOrderId);

        // Prepare email data
        const hasSubscriptions = items.some(item => item.purchaseType === 'subscription');
        const subscriptionItems = items.filter(item => item.purchaseType === 'subscription');

        const emailData: OrderEmailData = {
          orderId: firebaseOrderId,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
          orderItems: items.map(item => {
            const subscriptionDetails = item.purchaseType === 'subscription' && item.subscriptionPlan
              ? plans.find(p => p.id === item.subscriptionPlan)
              : null;

            return {
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
              purchaseType: item.purchaseType,
              subscriptionPlan: item.subscriptionPlan,
              subscriptionDetails: subscriptionDetails
                ? `${subscriptionDetails.name} (${subscriptionDetails.savings || 'Savings applied'})`
                : undefined
            };
          }),
          orderTotal: getTotalPrice(),
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          notes: formData.notes || 'No special instructions',
          hasSubscriptions,
          subscriptionSummary: hasSubscriptions
            ? subscriptionItems.map(item => {
              const plan = plans.find(p => p.id === item.subscriptionPlan);
              return `${item.product.name} - ${plan?.name || 'Unknown plan'}`;
            }).join(', ')
            : undefined
        };

        // Send emails in background (don't block order creation)
        console.log('📧 Attempting to send email notifications...');
        Promise.all([
          emailService.sendOrderNotificationToAdmin(emailData),
          emailService.sendOrderConfirmationToCustomer(emailData)
        ]).then(([adminResult, customerResult]) => {
          console.log('📧 Email results - Admin:', adminResult, 'Customer:', customerResult);
          if (adminResult && customerResult) {
            console.log('✅ Both email notifications sent successfully');
          } else if (adminResult || customerResult) {
            console.log('⚠️ Some email notifications sent:', { admin: adminResult, customer: customerResult });
          } else {
            console.log('❌ No email notifications were sent - check EmailJS configuration');
          }
        }).catch((error) => {
          console.error('❌ Email sending error:', error);
        });

        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mark order as completed before clearing cart to prevent redirect
        setOrderCompleted(true);

        // Clear cart and navigate to confirmation
        clearCart();

        // Create order data for confirmation page
        const orderDataForConfirmation = {
          id: firebaseOrderId,
          customerId: 'guest',
          customerDetails: firebaseOrderData.customerDetails,
          items: items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            purchaseType: item.purchaseType,
            subscriptionPlan: item.subscriptionPlan
          })),
          total: getTotalPrice(),
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          status: "pending" as const,
          orderDate: new Date()
        };

        navigate('/order-confirmation', {
          state: {
            orderId: firebaseOrderId,
            orderData: orderDataForConfirmation
          }
        });
      } catch (firebaseError) {
        console.error('❌ Firebase order creation failed:', firebaseError);
        throw new Error(`Failed to save order to database: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      setOrderCompleted(false); // Reset flag so user can try again
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0 &&
    formData.firstName && formData.lastName && formData.email &&
    formData.phone && formData.address && formData.city &&
    formData.postalCode && formData.deliveryDate && formData.deliveryTime;

  if (items.length === 0 && !orderCompleted && !isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h1>
          <p className="text-slate-600">Add some items to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</div>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.lastName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+92 300 1234567"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</div>
                  Billing Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your billing address"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="City"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="Postal Code"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</div>
                  Delivery Address
                </h2>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">Same as billing address</span>
                  </label>
                </div>
                <div className="text-sm text-slate-500 bg-white p-3 rounded border">
                  <p className="font-medium">Delivery will be made to your billing address:</p>
                  <p className="mt-1">
                    {formData.address && formData.city && formData.postalCode
                      ? `${formData.address}, ${formData.city}, ${formData.postalCode}`
                      : 'Please fill in billing address above'
                    }
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">4</div>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {/* <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg bg-white">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={selectedPaymentMethod === 'cod'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">Cash on Delivery</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Recommended</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Pay when your order is delivered</p>
                    </div>
                  </div> */}

                  <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedPaymentMethod('easypaisa');
                      setShowEasyPaisaModal(true);
                    }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={selectedPaymentMethod === 'easypaisa'}
                      onChange={(e) => {
                        setSelectedPaymentMethod(e.target.value);
                        setShowEasyPaisaModal(true);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">Pay with EasyPaisa</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Mobile Payment</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Transfer money via EasyPaisa mobile wallet</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-75">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-500">Online Payment</span>
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Coming Soon</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Credit/Debit Card, Bank Transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">5</div>
                  Delivery Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Delivery Time *
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select time</option>
                      <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                      <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                      <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                      <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">6</div>
                  Special Instructions
                </h2>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special delivery instructions, gate codes, or preferences..."
                />
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Complete Order - PKR {getTotalPrice().toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-8 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.purchaseType}`} className="border-b border-slate-100 pb-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      {item.purchaseType === 'subscription' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Subscription
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
                      {item.purchaseType === 'subscription' && (
                        <p className="text-xs text-green-600">15% off applied</p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Subscription Info in Checkout */}
                  {item.purchaseType === 'subscription' && item.subscriptionPlan && (
                    <div className="mt-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                      <div className="text-xs sm:text-sm text-green-800">
                        <div className="font-medium mb-1 sm:mb-2 flex items-center text-xs sm:text-sm">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                          Subscription Details
                        </div>
                        {(() => {
                          const plan = plans.find(p => p.id === item.subscriptionPlan);
                          if (plan) {
                            return (
                              <div className="space-y-1 text-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span>📦 Plan:</span>
                                  <strong className="break-words">{plan.name}</strong>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span>💰 Savings:</span>
                                  <strong>{Math.round((plan.discount || 0) * 100)}% off</strong>
                                  <span className="text-green-600">regular price</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span>🚚 Delivery:</span>
                                  <strong>Automatic & Free</strong>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span>🔄 Frequency:</span>
                                  <strong>Recurring deliveries</strong>
                                </div>
                                <div className="mt-2 p-1.5 sm:p-2 bg-green-100 rounded border border-green-200">
                                  <div className="text-green-700 font-medium text-xs leading-tight">
                                    ✓ You'll save PKR {((item.product.price * item.quantity * (plan.discount || 0))).toFixed(2)} on this order
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-xs break-words">
                              📦 Plan: <strong>{item.subscriptionPlan}</strong>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">PKR {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              {items.some(item => item.purchaseType === 'subscription') && (
                <div className="flex justify-between text-green-600">
                  <span>Subscription Savings</span>
                  <span className="font-medium">
                    -PKR {items.filter(item => item.purchaseType === 'subscription').reduce((total, item) => {
                      const plan = plans.find(p => p.id === item.subscriptionPlan);
                      return total + (plan ? (item.product.price * item.quantity * (plan.discount || 0)) : 0);
                    }, 0).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total</span>
                <span>PKR {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Subscription Summary Alert */}
            {items.some(item => item.purchaseType === 'subscription') && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">🎉 Subscription Benefits</h4>
                    <div className="text-xs sm:text-sm text-green-700 space-y-1">
                      <div>✓ Automatic deliveries - never run out of water</div>
                      <div>✓ Guaranteed savings on every delivery</div>
                      <div>✓ Free delivery on all subscription orders</div>
                      <div>✓ Cancel or modify anytime</div>
                    </div>
                    <div className="mt-2 sm:mt-3 text-xs text-green-600 font-medium">
                      📧 You'll receive email confirmations for all deliveries
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Free delivery on all orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* EasyPaisa Payment Modal */}
        {showEasyPaisaModal && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/60"
            onClick={() => setShowEasyPaisaModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="easypaisa-title"
              className="w-full md:w-auto bg-white rounded-t-2xl md:rounded-xl shadow-2xl md:max-w-lg lg:max-w-xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 relative">
                {/* Close button */}
                <button
                  onClick={() => setShowEasyPaisaModal(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Drag handle for mobile */}
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300 md:hidden" />

                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 id="easypaisa-title" className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">EasyPaisa Payment Details</h3>
                  <p className="text-sm sm:text-base text-gray-600">Complete your payment using the details below</p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Account Name:</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900 text-right truncate">Muhammad Tahir Aftab Butt</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-semibold text-gray-900 font-mono break-all">03346977744</span>
                          <button
                            onClick={() => navigator.clipboard.writeText('0334-697774')}
                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Amount:</span>
                        <span className="text-lg sm:text-xl font-bold text-green-600">PKR {getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Payment Instructions:</h4>
                    <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Open your EasyPaisa app</li>
                      <li>Select "Send Money" or "Money Transfer"</li>
                      <li>Enter the account number above</li>
                      <li>Enter the exact amount: PKR {getTotalPrice().toFixed(2)}</li>
                      <li>Complete the transaction</li>
                      <li>Take a screenshot of the confirmation</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">Important:</h4>
                        <p className="text-xs sm:text-sm text-green-700 mb-2">Please share your payment screenshot to our WhatsApp number:</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-green-800">+92 334 6977744</span>
                          <button
                            onClick={() => window.open('https://wa.me/92334697774', '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full transition-colors"
                          >
                            Open WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky action bar */}
                <div className="sticky bottom-0 left-0 right-0 bg-white pt-2 sm:pt-3 pb-[env(safe-area-inset-bottom)]">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowEasyPaisaModal(false)}
                      className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowEasyPaisaModal(false);
                        // Keep EasyPaisa selected
                      }}
                      className="w-full sm:flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      I've Made Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;