import React from 'react';
import { useCheckoutStore } from '../../../utils/checkoutUtils';
import { useCart } from '../../../context/CartContext';

export const OrderSummary = () => {
  const { cartItems, orderSummary } = useCheckoutStore();
  const { cartProducts, subTotal, tax, total, cartLoading } = useCart();

  // Handle loading state
  if (cartLoading) {
    return <div className="text-center py-6">Loading your cart...</div>;
  }

  // Cart Item Component
  const CartItemComponent = ({ item }) => (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
      <img
        src={item.display_image_url}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-500 text-sm">
          {item.description.length > 50
            ? `${item.description.substring(0, 50)}...`
            : item.description}
        </p>
        <p className="text-gray-500 text-sm">
          Color: {'Red'} • Size: {'M'} • Qty: {item.quantity}
        </p>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">${item.price}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <button className="text-blue-600 text-sm hover:text-blue-700">Edit cart</button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-900">
          <span className="text-gray-600">Subtotal</span>
          <span>${subTotal}</span>
        </div>
        <div className="flex justify-between text-gray-900">
          <span className="text-gray-600">Tax</span>
          <span>${tax}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="text-gray-900">Total</span>
          <span className="text-lg font-medium text-gray-900">USD ${total}</span>
        </div>
      </div>

      <div className="space-y-4">
        {cartProducts.length > 0 ? (
          cartProducts.map((item) => (
            <CartItemComponent key={item.id} item={item} />
          ))
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};
