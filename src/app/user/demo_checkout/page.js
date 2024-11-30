'use client';
import React from 'react';
import { useCheckoutStore } from '../../../utils/checkoutUtils';
import { Header } from '../components/CheckoutHeader';
import { CheckoutForm } from '../components/CheckoutForm';
import { PaymentForm } from '../components/PaymentForm';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { OrderSummary } from '../components/OrderSummary';

function App() {
  const step = useCheckoutStore((state) => state.step);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {step === 'checkout' && <CheckoutForm />}
            {step === 'review' && <PaymentForm />}
            {step === 'confirmation' && <OrderConfirmation />}
          </div>
          
          <div className="lg:pl-12">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
