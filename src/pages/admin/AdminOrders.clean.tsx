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
            <div className="min-h-screen bg-gray-50 pt-24 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-500">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-lg mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                                    />
                                </div>
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Orders ({filteredOrders.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredOrders.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No orders found matching your criteria.
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div key={order.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-500">
                                                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">
                                                {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">{order.customerDetails?.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">{order.customerDetails?.address || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{order.deliveryDate}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Package className="h-4 w-4" />
                                            <span>{order.deliveryTime || 'Any time'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-4 w-4" />
                                            <span>PKR {order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                                        <div className="space-y-2">
                                            {order.items?.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-700">
                                                        {item.productName} x {item.quantity}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        PKR {(item.productPrice * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            )) || []}
                                        </div>
                                    </div>

                                    {/* Status Update */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex items-center space-x-4">
                                            <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-gray-700">
                                                Update Status:
                                            </label>
                                            <select
                                                id={`status-${order.id}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
