// pages/page.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchGraphQLData } from '@/lib/graphqlClient';
import { gql } from 'graphql-request';

// GraphQL Queries
const QUERY_GET_PRODUCT = gql`
  query Query($product_id: ID!) {
    products(id: $product_id) {
      id
      name
      description
      price
      color
      brand_id
      category_id
      sub_category_id
      display_image
    }
  }
`;

const QUERY_GET_ATTACHMENT_BY_ID = gql`
  query AttachmentById($attachmentByIdId: ID!) {
    attachmentById(id: $attachmentByIdId) {
      data {
        url
      }
    }
  }
`;

export default function Cart() {
  const { user, redirectURL, setRedirectURL } = UserAuth();
  const [cart, setCart] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from localStorage or API
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartData);
    fetchProducts(cartData);

    // Redirect to /order/checkout if user is not logged
    if (!user && !redirectURL) {
      setRedirectURL('/user/order/checkout');
    }
  }, []);

  // Fetch product details and their images
  const fetchProducts = async (products) => {
    try {
      const fetchedProducts = await Promise.all(
        products.map(async (product) => {
          const productData = await fetchGraphQLData(QUERY_GET_PRODUCT, { product_id: product.product_id });
          if (productData?.products?.length > 0) {
            const productDetails = productData.products[0];
            const imageResponse = await fetchGraphQLData(QUERY_GET_ATTACHMENT_BY_ID, {
              attachmentByIdId: productDetails.display_image,
            });
            productDetails.display_image_url = imageResponse?.attachmentById?.data?.url || '/placeholder-image.png';
            productDetails.quantity = product.quantity;
            return productDetails;
          }
          return null;
        })
      );
      setCartProducts(fetchedProducts.filter((item) => item !== null));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Calculate Order Summary
  const calculateOrderSummary = () => {
    const subtotal = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Example tax: 10%
    const saleDiscount = 20; // Example sale discount
    const total = subtotal + tax - saleDiscount;

    return { subtotal, tax, saleDiscount, total };
  };

  const { subtotal, tax, saleDiscount, total } = calculateOrderSummary();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-10 flex justify-center">
      <div className="w-[100vw] max-w-6xl px-4 lg:px-0 flex flex-col lg:flex-row gap-8">
        {/* Shopping Bag Section */}
        <div className="lg:w-3/5">
          <h1 className="text-2xl font-bold mb-8 dark:text-neutral-200">Shopping Bag</h1>
          {loading ? (
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
                    <select
                      className="ml-2 px-3 py-1 border rounded-lg"
                      value={product.quantity}
                      onChange={(e) =>
                        setCartProducts((prev) =>
                          prev.map((item) =>
                            item.id === product.id
                              ? { ...item, quantity: parseInt(e.target.value) }
                              : item
                          )
                        )
                      }
                    >
                      {[...Array(10)].map((_, idx) => (
                        <option key={idx} value={idx + 1}>
                          {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="text-sm text-indigo-600 hover:underline mt-2"
                    onClick={() => setCartProducts((prev) => prev.filter((item) => item.id !== product.id))}
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
                <span className="text-sm">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax</span>
                <span className="text-sm">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sale Discount</span>
                <span className="text-sm">-${saleDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">
                  Promo code
                </span>
                <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  Enter code
                </button>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-base">Total</span>
                <span className="text-base">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link href={user ? '/user/order/checkout' : '/user/login'}>
              <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
