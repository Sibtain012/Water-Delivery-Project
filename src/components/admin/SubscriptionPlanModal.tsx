import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SubscriptionPlan } from '../../store/subscriptionPlanStore';

interface Props {
  plan?: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
}

const emptyPlan: SubscriptionPlan = {
  id: '',
  name: '',
  price: 0,
  bottles: 0,
  frequency: 'Monthly',
  popular: false,
  savings: '',
  features: []
};

const SubscriptionPlanModal: React.FC<Props> = ({ plan, onClose, onSave }) => {
  const [form, setForm] = useState<SubscriptionPlan>(emptyPlan);
  const isEdit = Boolean(plan);

  useEffect(() => {
    if (plan) {
      setForm(plan);
    } else {
      setForm({ ...emptyPlan, id: generateId('plan') });
    }
  }, [plan]);

  const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'bottles') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized: SubscriptionPlan = {
      ...form,
      features: typeof form.features === 'string' ? (form.features as unknown as string).split(',').map(f => f.trim()).filter(Boolean) : (form.features || [])
    };
    onSave(normalized);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold">{isEdit ? 'Edit' : 'Add'} Subscription Plan</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input name="id" value={form.id} onChange={handleChange} disabled={isEdit} className="w-full border rounded-lg p-2 disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bottles</label>
              <input name="bottles" type="number" value={form.bottles} onChange={handleChange} min={0} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Bi-Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} min={0} className="w-full border rounded-lg p-2" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="popular" name="popular" type="checkbox" checked={!!form.popular} onChange={handleChange} />
              <label htmlFor="popular" className="text-sm font-medium text-gray-700">Mark as Popular</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Savings Badge (e.g., Save 15%)</label>
            <input name="savings" value={form.savings || ''} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <textarea name="features" value={Array.isArray(form.features) ? form.features.join(', ') : (form.features as unknown as string) || ''} onChange={handleChange} rows={3} className="w-full border rounded-lg p-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5">{isEdit ? 'Save Changes' : 'Add Plan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionPlanModal;
