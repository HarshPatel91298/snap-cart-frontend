"use client";

import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { fetchGraphQLData } from "@/lib/graphqlClient"; // Utility function to fetch GraphQL data

export default function Cart() {
  const { user, setRedirectURL } = UserAuth();
  const {
    addToCart,
    reduceQty,
    deleteItemFromCart,
    cartProducts,
    setCartProducts,
    subTotal,
    tax,
    total,
    cartLoading,
  } = useCart();

  const router = useRouter();
  const [promoCode, setPromoCode] = useState(""); // State for promo code input
  const [promoError, setPromoError] = useState(null);
  const [discount, setDiscount] = useState(0); // State to store discount amount

  const handleCheckout = () => {
    if (!user) {
      setRedirectURL("/user/order/checkout");
      router.push("/user/login");
    } else {
      setRedirectURL(null);
      router.push("/user/order/checkout");
    }
  };

  // Function to apply the promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code.");
      return;
    }

    try {
      // Fetch the promo code details
      const response = await fetchGraphQLData(
        `
        query CouponByCode($code: String!) {
          couponByCode(code: $code) {
            id
            code
            description
            type
            discount
            max_discount
            min_order_amount
          }
        }
      `,
        { code: promoCode }
      );

      const coupon = response?.couponByCode;
      console.log(response, "couponnnnnnnnnnnnnnn");
      if (!coupon || coupon.code !== promoCode) {
        setPromoError("Invalid promo code.");
        return;
      }

      // Check if the cart meets the minimum order amount
      if (subTotal < coupon.min_order_amount) {
        setPromoError(
          `Minimum order amount of $${coupon.min_order_amount.toFixed(
            2
          )} is required to apply this code.`
        );
        return;
      }

      // Calculate the discount
      let discountValue = 0;
      if (coupon.type === "PERCENTAGE") {
        discountValue = (subTotal * coupon.discount) / 100;
        discountValue = Math.min(discountValue, coupon.max_discount);
      } else if (coupon.type === "FLAT") {
        discountValue = coupon.discount;
      }

      // Apply the discount
      setDiscount(discountValue);
      setPromoError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoError(
        "An error occurred while applying the promo code. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-10 flex justify-center">
      <div className="w-[100vw] max-w-6xl px-4 lg:px-0 flex flex-col lg:flex-row gap-8">
        {/* Shopping Bag Section */}
        <div className="lg:w-3/5">
          <h1 className="text-2xl font-bold mb-8 dark:text-neutral-200">
            Shopping Bag
          </h1>
          {cartLoading ? (
            <p className="text-center dark:text-neutral-400">Loading...</p>
          ) : cartProducts.length > 0 ? (
            cartProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-start border-b pb-6 mb-6"
              >
                <Image
                  src={product.display_image_url}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="rounded-lg w-full sm:w-auto mb-4 sm:mb-0"
                />
                <div className="sm:ml-4 flex-1">
                  <h4 className="text-lg font-semibold dark:text-neutral-200">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                    ${product.price}
                  </p>
                  <div className="flex items-center">
                    <span>Quantity:</span>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg"
                        onClick={() => {
                          if (product.quantity > 1) {
                            reduceQty(product.id, 1);
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
                      <span className="mx-2">{product.quantity}</span>
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg"
                        onClick={() => {
                          addToCart([{ product_id: product.id, quantity: 1 }]);
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
            <p className="text-center dark:text-neutral-400">
              Your cart is empty.
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="border rounded-lg p-6 dark:border-neutral-700">
            <h5 className="text-lg font-semibold mb-6 dark:text-neutral-200">
              Order Summary
            </h5>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">
                  ${subTotal ? subTotal.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax</span>
                <span className="text-sm">
                  ${tax ? tax.toFixed(2) : "0.00"}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Discount</span>
                  <span className="text-sm">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="promo-code"
                  className="text-sm font-semibold mb-2"
                >
                  Promo Code
                </label>
                <div className="flex items-center">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-sm text-red-500 mt-2">{promoError}</p>
                )}
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-base">Total</span>
                <span className="text-base">
                  ${(total - discount).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              onClick={handleCheckout}
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
