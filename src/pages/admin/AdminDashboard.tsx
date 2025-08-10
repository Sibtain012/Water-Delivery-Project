import React, { useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';
import { Product } from '../../types';
import { Pencil, Trash2, Plus, LogOut, Cookie, Settings, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../../components/admin/ProductModal';
import { useSubscriptionPlanStore } from '../../store/subscriptionPlanStore';
import SubscriptionPlanModal from '../../components/admin/SubscriptionPlanModal';
import { usePageTitle } from '../../hooks/usePageTitle';

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Dashboard');
  const { products, deleteProduct, resetProducts } = useProductStore();
  const { plans, addPlan, updatePlan, deletePlan, resetPlans } = useSubscriptionPlanStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handlePlanSave = (plan: any) => {
    if (editingPlanId) {
      updatePlan(editingPlanId, plan);
    } else {
      addPlan(plan);
    }
    setShowPlanModal(false);
    setEditingPlanId(null);
  };

  const openAddPlan = () => {
    setEditingPlanId(null);
    setShowPlanModal(true);
  };

  const openEditPlan = (id: string) => {
    setEditingPlanId(id);
    setShowPlanModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const handleResetProducts = () => {
    if (window.confirm('Are you sure you want to reset all products to default? This will remove all your custom changes.')) {
      resetProducts();
      alert('Products have been reset to default values.');
    }
  };

  const handleResetPlans = () => {
    if (window.confirm('Reset subscription plans to defaults? This will remove all custom plans.')) {
      resetPlans();
      alert('Subscription plans have been reset to default values.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-40 py-4 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h1>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Add Product
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/admin/customers')}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Customer Details
                </button>
                <button
                  onClick={() => navigate('/admin/cookies')}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Cookie className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Manage Cookies
                </button>
                <button
                  onClick={handleResetProducts}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reset Products
                </button>
                <button
                  onClick={openAddPlan}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Add Subscription Plan
                </button>
                <button
                  onClick={handleResetPlans}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <RefreshCcw className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Reset Plans
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LogOut className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Plans Management */}
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Subscription Plans
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{plan.name}</h3>
                        {plan.popular && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">Popular</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">PKR {plan.price.toLocaleString()} / {plan.frequency}</div>
                      <div className="text-xs text-gray-500">{plan.bottles} bottles • {plan.savings || '—'}</div>
                      {plan.features && plan.features.length > 0 && (
                        <ul className="mt-2 text-xs text-gray-600 list-disc list-inside space-y-0.5">
                          {plan.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-2 shrink-0">
                      <button onClick={() => openEditPlan(plan.id)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => {
                        if (confirm('Delete this plan?')) deletePlan(plan.id);
                      }} className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="text-sm text-gray-500">No plans yet. Click "Add Subscription Plan" to create one.</div>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">PKR {product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="p-3 sm:p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <div className="flex space-x-2 ml-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 font-medium">PKR {product.price}</p>
                      <p className="text-xs text-gray-500">{product.size}</p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {product.type}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Add/Edit Subscription Plan Modal */}
      {showPlanModal && (
        <SubscriptionPlanModal
          plan={editingPlanId ? plans.find(p => p.id === editingPlanId) || undefined : undefined}
          onClose={() => {
            setShowPlanModal(false);
            setEditingPlanId(null);
          }}
          onSave={handlePlanSave}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
