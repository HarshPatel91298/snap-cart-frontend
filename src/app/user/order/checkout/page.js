'use client';
import React, { useState } from 'react';

const CheckoutForm = () => {
  const [totalAmount, setTotalAmount] = useState('');

  const handleCheckout = () => {
    alert(`Checkout amount: $${totalAmount}`);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Enter Amount</h2>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Amount in CAD"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
