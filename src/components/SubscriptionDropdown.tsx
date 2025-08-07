import React, { useState } from 'react';
import { subscriptionPlans } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { Product, CartItem } from '../types';

const SubscriptionDropdown: React.FC = () => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const { addItem, toggleCart } = useCartStore();

    const handlePlanSelect = (planId: string) => {
        setSelectedPlanId(planId);

        if (planId) {
            const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
            if (selectedPlan) {
                // Create a generic subscription product
                const subscriptionProduct: Product = {
                    id: `subscription-${planId}`,
                    name: `${selectedPlan.name} Subscription`,
                    description: `Regular delivery: ${selectedPlan.name}`,
                    price: calculatePlanPrice(selectedPlan),
                    image: '/assets/images/imgi_21_19-Liter-Bottle-Tap-and-Stand-1_720x.jpg',
                    size: selectedPlan.name,
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

    // Calculate price based on plan (base bottle price * quantity * discount)
    const calculatePlanPrice = (plan: { name: string; discount: number }) => {
        const baseBottlePrice = 250; // Base price per bottle
        let quantity = 1;

        // Extract quantity from plan name
        if (plan.name.includes('3 bottles')) quantity = 3;
        else if (plan.name.includes('5 bottles')) quantity = 5;
        else if (plan.name.includes('12 bottles')) quantity = 12;
        else if (plan.name.includes('20 bottles')) quantity = 20;

        const basePrice = baseBottlePrice * quantity;
        return basePrice * (1 - plan.discount);
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
                {subscriptionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id} style={{ color: '#333' }}>
                        {plan.name} ({Math.round(plan.discount * 100)}% off)
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SubscriptionDropdown;
