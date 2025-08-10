import React, { useState } from 'react';
import { useSubscriptionPlanStore } from '../store/subscriptionPlanStore';
import { useCartStore } from '../store/cartStore';
import { Product, CartItem } from '../types';

const SubscriptionDropdown: React.FC = () => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const { addItem, toggleCart } = useCartStore();
    const { plans } = useSubscriptionPlanStore();

    const handlePlanSelect = (planId: string) => {
        setSelectedPlanId(planId);

        if (planId) {
            const selectedPlan = plans.find(plan => plan.id === planId);
            if (selectedPlan) {
                // Create a generic subscription product
                const subscriptionProduct: Product = {
                    id: `subscription-${planId}`,
                    name: `${selectedPlan.name} Subscription`,
                    description: `Regular delivery: ${selectedPlan.name}`,
                    price: selectedPlan.price,
                    image: '/assets/images/imgi_21_19-Liter-Bottle-Tap-and-Stand-1_720x.jpg',
                    size: selectedPlan.bottles ? `${selectedPlan.bottles} bottles` : selectedPlan.name,
                    type: 'bottle',
                    hasExchange: false,
                    depositPrice: 0
                };

                // Create cart item
                const cartItem: CartItem = {
                    product: subscriptionProduct,
                    quantity: 1,
                    purchaseType: 'subscription',
                    subscriptionPlan: planId,
                    hasBottleExchange: false
                };

                // Add to cart
                addItem(cartItem);

                // Show cart
                toggleCart();

                // Reset selection
                setSelectedPlanId('');
            }
        }
    };

    return (
        <div className="w-full max-w-xs">
            <select
                value={selectedPlanId}
                onChange={(e) => handlePlanSelect(e.target.value)}
                className="w-full p-3 border-2 border-primary rounded-lg bg-primary text-white font-medium focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors cursor-pointer"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>\")",
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px',
                    paddingRight: '40px'
                }}
            >
                <option value="" style={{ color: '#333' }}>Select a plan</option>
                {plans.map((plan) => (
                    <option key={plan.id} value={plan.id} style={{ color: '#333' }}>
                        {plan.name} {plan.savings ? `(${plan.savings})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SubscriptionDropdown;
