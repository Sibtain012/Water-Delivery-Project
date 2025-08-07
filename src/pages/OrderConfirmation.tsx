import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Clock, ArrowRight } from 'lucide-react';

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  deliveryDate: string;
  deliveryTime: string;
  // Add other order properties as needed
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();

  // Get order data from navigation state, with fallback
  const orderData = location.state?.orderData as OrderData;
  const orderId = location.state?.orderId || orderData?.id;

  // Fallback order number if no data is passed
  const orderNumber = orderId || `AP${Date.now().toString().slice(-6)}`;

  // Format order number for display (remove timestamp part if it exists)
  const displayOrderNumber = orderNumber.startsWith('ORD-')
    ? orderNumber
    : `#${orderNumber}`;

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 pt-24 sm:pt-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 px-2">
            Order Confirmed!
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 px-2">
            Thank you for choosing Abetahura. Your order has been successfully placed and is being processed.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-800">Order Number</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 break-all">{displayOrderNumber}</p>
            {orderData && (
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-700 space-y-1">
                <p className="break-words">Customer: {orderData.customerName}</p>
                <p>Total: PKR {orderData.orderTotal?.toFixed(2)}</p>
                <p className="break-words">Delivery: {orderData.deliveryDate} at {orderData.deliveryTime}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center p-4 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Estimated Delivery</h3>
              <p className="text-slate-600 text-xs sm:text-sm break-words">
                {orderData?.deliveryDate ?
                  `${orderData.deliveryDate} (${orderData.deliveryTime})` :
                  'Within 24-48 hours'
                }
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Order Status</h3>
              <p className="text-slate-600 text-xs sm:text-sm">Being prepared</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600 text-sm sm:text-base px-2">
              We've sent a confirmation email with all the details of your order.
              You'll receive another email with tracking information once your order ships.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-4 sm:px-6 py-3 rounded-lg font-semibold text-center transition-colors text-sm sm:text-base"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">What happens next?</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm sm:text-base">Order Processing</h3>
                <p className="text-slate-600 text-xs sm:text-sm">We're preparing your order and will have it ready for delivery soon.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm sm:text-base">Quality Check</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Each bottle is inspected to ensure it meets our quality standards.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">3</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm sm:text-base">Out for Delivery</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Your order will be delivered to your specified address during the selected time window.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;