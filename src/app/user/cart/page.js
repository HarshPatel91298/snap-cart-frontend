// pages/page.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'nextjs-toploader/app';



export default function Cart() {
  const { user, setRedirectURL } = UserAuth();
  const { addToCart, reduceQty, deleteItemFromCart, cartProducts, setCartProducts, subTotal, tax, total, cartLoading } = useCart();

  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      setRedirectURL('/user/order/checkout');
      router.push('/user/login');
    } else {
      setRedirectURL(null);
      router.push('/user/order/checkout');
    }
  }


  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-10 flex justify-center">
      <div className="w-[100vw] max-w-6xl px-4 lg:px-0 flex flex-col lg:flex-row gap-8">
        {/* Shopping Bag Section */}
        <div className="lg:w-3/5">
          <h1 className="text-2xl font-bold mb-8 dark:text-neutral-200">Shopping Bag</h1>
          {cartLoading ? (
            <p className="text-center dark:text-neutral-400">Loading...</p>
          ) : cartProducts.length > 0 ? (
            cartProducts.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row items-start border-b pb-6 mb-6">
                <Image
                  src={product.display_image_url}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="rounded-lg w-full sm:w-auto mb-4 sm:mb-0"
                />
                <div className="sm:ml-4 flex-1">
                  <h4 className="text-lg font-semibold dark:text-neutral-200">{product.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">${product.price}</p>
                  <div className="flex items-center">
                    <span>Quantity:</span>
                    <div className="flex items-center">
                      {/* Minus button */}
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg"
                        onClick={() => {
                          if (product.quantity > 1) {
                            reduceQty(product.id , 1);
                            setCartProducts((prev) =>
                              prev.map((item) =>
                                item.id === product.id
                                  ? { ...item, quantity: item.quantity - 1 }
                                  : item
                              )
                            );
                          }
                        }}
                      >
                        -
                      </button>

                      {/* Quantity display */}
                      <span className="mx-2">{product.quantity}</span>

                      {/* Plus button */}
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg"
                        onClick={() => {
                          addToCart([{product_id : product.id, quantity : 1}]);
                          setCartProducts((prev) =>
                            prev.map((item) =>
                              item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                            )
                          );
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="text-sm text-indigo-600 hover:underline mt-2"
                    onClick={() => {
                      deleteItemFromCart(product.id);
                      setCartProducts((prev) =>
                        prev.filter((item) => item.id !== product.id)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))
          ) : (
            <p className="text-center dark:text-neutral-400">Your cart is empty.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="border rounded-lg p-6 dark:border-neutral-700">
            <h5 className="text-lg font-semibold mb-6 dark:text-neutral-200">Order Summary</h5>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">${subTotal ? subTotal.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax</span>
                <span className="text-sm">${tax ? tax.toFixed(2) : '0.00'}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-sm">Sale Discount</span>
                <span className="text-sm">-${saleDiscount.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">
                  Promo code
                </span>
                <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  {user ? 'Apply' : 'Login to Apply'}
                </button>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-base">Total</span>
                <span className="text-base">${total ? total.toFixed(2) : '0.00'}</span>
              </div>
            </div>
              <button 
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              onClick={handleCheckout}
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}








