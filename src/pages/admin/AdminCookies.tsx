import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Cookie, Trash2, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';

interface CookieData {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: string;
}

const AdminCookies: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [cookies, setCookies] = useState<CookieData[]>([]);
    const [visibleValues, setVisibleValues] = useState<{ [key: string]: boolean }>({});

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    const loadCookies = () => {
        const allCookies = Cookies.get();
        const cookieArray: CookieData[] = Object.entries(allCookies).map(([name, value]) => ({
            name,
            value,
            domain: window.location.hostname,
            path: '/',
        }));
        setCookies(cookieArray);
    };

    const deleteCookie = (cookieName: string) => {
        if (window.confirm(`Are you sure you want to delete the cookie "${cookieName}"?`)) {
            Cookies.remove(cookieName);
            loadCookies();
        }
    };

    const toggleValueVisibility = (cookieName: string) => {
        setVisibleValues(prev => ({
            ...prev,
            [cookieName]: !prev[cookieName]
        }));
    };

    const formatValue = (value: string, isVisible: boolean) => {
        if (!isVisible) {
            return '*'.repeat(Math.min(value.length, 20));
        }
        return value.length > 100 ? value.substring(0, 100) + '...' : value;
    };

    useEffect(() => {
        loadCookies();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-40 py-4 sm:py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-lg mb-4 sm:mb-8">
                    <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                                <Cookie className="h-5 sm:h-6 w-5 sm:w-6 mr-2" />
                                Cookie Management
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={loadCookies}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <LogOut className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookie Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Cookie className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Cookies</dt>
                                        <dd className="text-lg font-medium text-gray-900">{cookies.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Eye className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Visible Values</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {Object.values(visibleValues).filter(Boolean).length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Cookie className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Domain</dt>
                                        <dd className="text-lg font-medium text-gray-900">{window.location.hostname}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookies Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">All Cookies</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Manage all cookies stored in the browser
                        </p>
                    </div>

                    {cookies.length === 0 ? (
                        <div className="text-center py-12">
                            <Cookie className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No cookies found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No cookies are currently stored in the browser
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cookie Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Domain
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cookies.map((cookie, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Cookie className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">{cookie.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs break-all">
                                                    {formatValue(cookie.value, visibleValues[cookie.name] || false)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {cookie.domain}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => toggleValueVisibility(cookie.name)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title={visibleValues[cookie.name] ? 'Hide value' : 'Show value'}
                                                    >
                                                        {visibleValues[cookie.name] ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCookie(cookie.name)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete cookie"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCookies;