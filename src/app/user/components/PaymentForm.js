import React, { useState, useEffect } from 'react';
import { useCheckoutStore } from '../../../utils/checkoutUtils';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import StripePaymetCard from './StripePaymentCard';

export const PaymentForm = () => {
  const { setStep } = useCheckoutStore();
  const { cart_id } = useCart();

  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateCartId = async () => {
      if (cart_id) {
        setCartId(cart_id);
        setLoading(false); // Stop loading after the cart_id is set
      }
    };
    updateCartId();
  }, [cart_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirmation');
  };

  if (loading || !cartId) {
    // Render a loading spinner or placeholder until cart_id is ready
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Render the form after cart_id is ready
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Payment methods</h2>
        <StripePaymetCard cartID={cartId} />
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => setStep('checkout')}
        >
          Back
        </button>
       
      </div>
    </form>
  );
};
