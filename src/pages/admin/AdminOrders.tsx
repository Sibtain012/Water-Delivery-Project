import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, User, Phone, MapPin, DollarSign, LogOut, Trash2, Search } from 'lucide-react';
import { firebaseOrderService } from '../../services/firebaseOrderService';
import { FirebaseOrder } from '../../types/firebase';

const AdminOrders: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders from Firebase
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const firebaseOrders = await firebaseOrderService.getAllOrders();
        console.log('🔍 DEBUG - Firebase orders data:', firebaseOrders);
        setOrders(firebaseOrders);
      } catch (error) {
        console.error('Error loading orders from Firebase:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await firebaseOrderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders after update
      const updatedOrders = await firebaseOrderService.getAllOrders();
      setOrders(updatedOrders);
      console.log('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await firebaseOrderService.deleteOrder(orderId);
        // Refresh orders after deletion
        const updatedOrders = await firebaseOrderService.getAllOrders();
        setOrders(updatedOrders);
        console.log('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-40 py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm sm:text-base">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-40 py-4 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-4 sm:mb-8">
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h1>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto justify-center sm:justify-start"
              >
                <LogOut className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 sm:px-6 py-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500">
                No orders found matching your criteria.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">Customer Details:</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">
                          {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{order.customerDetails?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <svg className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-sm sm:text-base text-gray-700">{order.customerDetails?.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">Billing & Delivery Address:</h4>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm sm:text-base text-gray-700">
                          <div>{order.customerDetails?.address || 'N/A'}</div>
                          <div className="text-gray-500">
                            {order.customerDetails?.city && order.customerDetails?.postalCode
                              ? `${order.customerDetails.city}, ${order.customerDetails.postalCode}`
                              : 'City, Postal Code not provided'
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm sm:text-base text-gray-700">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-4 gap-2 sm:gap-0">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                      <span>{order.deliveryDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 sm:h-4 w-3 sm:w-4" />
                      <span>{order.deliveryTime || 'Any time'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 sm:h-4 w-3 sm:w-4" />
                      <span className="font-medium">PKR {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-3 sm:pt-4">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 text-xs sm:text-sm">
                          <div className="flex justify-between items-start sm:items-center gap-2">
                            <span className="text-gray-700 flex-1">
                              {item.productName} x {item.quantity}
                              {item.purchaseType === 'subscription' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Subscription
                                </span>
                              )}
                            </span>
                            <span className="text-gray-900 font-medium whitespace-nowrap">
                              PKR {(item.productPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.purchaseType === 'subscription' && item.subscriptionDetails && (
                            <div className="bg-green-50 p-2 rounded text-xs">
                              <strong className="block mb-1">Subscription Details:</strong>
                              <div className="space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                  <span className="font-medium">Plan:</span>
                                  <span className="break-words">{item.subscriptionDetails.planName}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                  <span className="font-medium">Frequency:</span>
                                  <span>{item.subscriptionDetails.frequency}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                  <span className="font-medium">Bottles:</span>
                                  <span>{item.subscriptionDetails.bottles} per delivery</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                  <span className="font-medium">Savings:</span>
                                  <span className="text-green-600">{item.subscriptionDetails.savings}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.purchaseType === 'subscription' && item.subscriptionPlan && !item.subscriptionDetails && (
                            <div className="bg-green-50 p-2 rounded text-xs">
                              <strong>Subscription Plan:</strong>
                              <span className="ml-1 break-words">{item.subscriptionPlan}</span>
                            </div>
                          )}
                        </div>
                      )) || []}
                    </div>
                  </div>

                  {/* Subscription Summary */}
                  {order.items?.some(item => item.purchaseType === 'subscription') && (
                    <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Subscription Summary:
                      </h4>
                      <div className="bg-green-50 p-3 rounded-md">
                        <div className="text-xs sm:text-sm text-green-800">
                          <div className="font-medium mb-2">⚡ This order contains recurring subscription items:</div>
                          {order.items?.filter(item => item.purchaseType === 'subscription').map((item, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              • <strong>{item.productName}</strong>
                              {item.subscriptionDetails && (
                                <span>
                                  {' '}({item.subscriptionDetails.planName} - {item.subscriptionDetails.frequency})
                                </span>
                              )}
                              {item.subscriptionPlan && !item.subscriptionDetails && (
                                <span> ({item.subscriptionPlan})</span>
                              )}
                            </div>
                          ))}
                          <div className="mt-2 text-xs text-green-700 font-medium">
                            📅 Customer will receive automatic deliveries according to their selected plan(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {order.customerDetails?.notes && (
                    <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Special Instructions:</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{order.customerDetails.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label htmlFor={`status-${order.id}`} className="text-xs sm:text-sm font-medium text-gray-700">
                        Update Status:
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
