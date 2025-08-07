import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Package } from 'lucide-react';
import { firebaseOrderService } from '../../services/firebaseOrderService';

interface CustomerData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    totalOrders: number;
    lastOrderDate: Date;
    createdAt: Date;
}

const AdminCustomers: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);

    // Load customers from Firebase orders
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                const customersData = await firebaseOrderService.getCustomersFromOrders();
                console.log('🔍 DEBUG - Firebase customers data:', customersData);
                setCustomers(customersData);
            } catch (error) {
                console.error('Error loading customers from Firebase:', error);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-40 py-4 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm sm:text-base">Loading customers...</p>
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
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Management</h1>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto justify-center sm:justify-start"
                            >
                                <LogOut className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Customers List */}
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Customers ({customers.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {customers.length === 0 ? (
                            <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                                No customers found. Customers will appear here once they place orders.
                            </div>
                        ) : (
                            customers.map((customer) => (
                                <div key={customer.id} className="p-3 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 sm:gap-0">
                                        <div className="flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{customer.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Customer since {new Date(customer.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right w-full sm:w-auto">
                                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 justify-end sm:justify-start">
                                                <Package className="h-3 sm:h-4 w-3 sm:w-4" />
                                                <span>{customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm sm:text-base text-gray-700 truncate">{customer.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm sm:text-base text-gray-700">{customer.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                                            <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm sm:text-base text-gray-700 truncate">
                                                {customer.address}, {customer.city}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Customer Stats */}
                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-gray-600 truncate">Customer ID: {customer.id}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-gray-600">
                                                    Active customer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                {customers.length > 0 && (
                    <div className="mt-4 sm:mt-8 bg-white shadow-sm rounded-lg p-3 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Customer Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">{customers.length}</div>
                                <div className="text-xs sm:text-sm text-blue-600">Total Customers</div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                    {customers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
                                </div>
                                <div className="text-xs sm:text-sm text-green-600">Total Orders</div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                                    {customers.length > 0 ?
                                        (customers.reduce((sum, customer) => sum + customer.totalOrders, 0) / customers.length).toFixed(1)
                                        : '0'
                                    }
                                </div>
                                <div className="text-xs sm:text-sm text-purple-600">Avg Orders per Customer</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
