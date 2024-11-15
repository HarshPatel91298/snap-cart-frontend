// pages/checkout.js
"use client";
import React from "react";

const CheckoutPage = () => {
  return (
    <>
      {/* Main Wrapper */}
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Main Content */}
        <main id="content" className="flex-1 p-4">
          {/* Checkout */}
          <div className="w-full max-w-7xl mx-auto">
            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-7">
                {/* Checkout Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-4 dark:text-white">
                    Checkout as Guest
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    or{" "}
                    <a
                      href="/login"
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Log in
                    </a>{" "}
                    for faster checkout
                  </p>
                </div>
                {/* End Checkout Header */}

                {/* Contact Details */}
                <div className="border rounded-lg p-6 mb-6 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">
                      Contact details
                    </h2>

                    {/* Email Input */}
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="Email"
                      />
                    </div>
                    {/* End Email Input */}

                    {/* Newsletter Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newsletter"
                        className="h-4 w-4 text-indigo-600 border-gray-200 rounded dark:bg-gray-900 dark:border-gray-700"
                      />
                      <label
                        htmlFor="newsletter"
                        className="ml-2 text-sm dark:text-gray-400"
                      >
                        Email me with news and offers
                      </label>
                    </div>
                    {/* End Newsletter Checkbox */}
                  </div>
                </div>
                {/* End Contact Details */}

                {/* Shipping Address */}
                <div className="border rounded-lg p-6 mb-6 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">
                      Shipping address
                    </h2>

                    {/* Full Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="full-name"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Full name
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="Full name"
                      />
                    </div>
                    {/* End Full Name */}

                    {/* Country Select */}
                    <div className="mb-4">
                      <label
                        htmlFor="country"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Country
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm appearance-none dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                          defaultValue="US"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          {/* Add more countries as needed */}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          {/* Dropdown Icon */}
                          <svg
                            className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* End Country Select */}

                    {/* Address 1 */}
                    <div className="mb-4">
                      <label
                        htmlFor="address1"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Address 1
                      </label>
                      <input
                        id="address1"
                        type="text"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="Address 1"
                      />
                    </div>
                    {/* End Address 1 */}

                    {/* Address 2 */}
                    <div className="mb-4">
                      <label
                        htmlFor="address2"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Address 2 (optional)
                      </label>
                      <input
                        id="address2"
                        type="text"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="Address 2"
                      />
                    </div>
                    {/* End Address 2 */}

                    {/* City */}
                    <div className="mb-4">
                      <label
                        htmlFor="city"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="City"
                      />
                    </div>
                    {/* End City */}

                    {/* State and Zip Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* State */}
                      <div className="mb-4">
                        <label
                          htmlFor="state"
                          className="block text-sm mb-2 dark:text-gray-200"
                        >
                          State
                        </label>
                        <input
                          id="state"
                          type="text"
                          className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                          placeholder="State"
                        />
                      </div>
                      {/* End State */}

                      {/* Zip Code */}
                      <div className="mb-4">
                        <label
                          htmlFor="zip"
                          className="block text-sm mb-2 dark:text-gray-200"
                        >
                          Zip code
                        </label>
                        <input
                          id="zip"
                          type="text"
                          className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                          placeholder="Zip code"
                        />
                      </div>
                      {/* End Zip Code */}
                    </div>
                    {/* End State and Zip Code */}

                    {/* Phone */}
                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-sm mb-2 dark:text-gray-200"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="text"
                        className="block w-full border border-gray-200 rounded-md shadow-sm p-3 text-sm dark:bg-transparent dark:border-gray-700 dark:text-gray-300"
                        placeholder="Phone"
                      />
                    </div>
                    {/* End Phone */}

                    {/* Default Address Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="default-address"
                        className="h-4 w-4 text-indigo-600 border-gray-200 rounded dark:bg-gray-900 dark:border-gray-700"
                      />
                      <label
                        htmlFor="default-address"
                        className="ml-2 text-sm dark:text-gray-400"
                      >
                        Make this my default address
                      </label>
                    </div>
                    {/* End Default Address Checkbox */}
                  </div>
                </div>
                {/* End Shipping Address */}

                {/* Shipping Method */}
                <div className="border rounded-lg p-6 mb-6 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6 dark:text-white">
                    Shipping method
                  </h2>

                  {/* Shipping Options */}
                  <div className="space-y-4">
                    {/* Option 1 */}
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="shipping-method-1"
                        className="flex items-center w-full"
                      >
                        <input
                          type="radio"
                          id="shipping-method-1"
                          name="shipping-method"
                          className="h-4 w-4 text-indigo-600 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                          defaultChecked
                        />
                        <span className="ml-3 text-sm dark:text-gray-200">
                          2-4 working days
                        </span>
                      </label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Free
                      </span>
                    </div>
                    {/* End Option 1 */}

                    {/* Option 2 */}
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="shipping-method-2"
                        className="flex items-center w-full"
                      >
                        <input
                          type="radio"
                          id="shipping-method-2"
                          name="shipping-method"
                          className="h-4 w-4 text-indigo-600 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                        />
                        <span className="ml-3 text-sm dark:text-gray-200">
                          Express Delivery
                        </span>
                      </label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        $9
                      </span>
                    </div>
                    {/* End Option 2 */}

                    {/* Option 3 */}
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="shipping-method-3"
                        className="flex items-center w-full"
                      >
                        <input
                          type="radio"
                          id="shipping-method-3"
                          name="shipping-method"
                          className="h-4 w-4 text-indigo-600 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                        />
                        <span className="ml-3 text-sm dark:text-gray-200">
                          Nominated Day
                        </span>
                      </label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        $10
                      </span>
                    </div>
                    {/* End Option 3 */}
                  </div>
                  {/* End Shipping Options */}
                </div>
                {/* End Shipping Method */}
              </div>
              {/* End Left Column */}

              {/* Right Column */}
              <div className="lg:col-span-5">
                {/* Order Summary */}
                <div className="border rounded-lg p-6 dark:border-gray-700">
                  <div className="mb-6 flex justify-between items-center">
                    <h5 className="text-xl font-semibold dark:text-white">
                      Order summary
                    </h5>
                    <a
                      href="/cart"
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Edit cart
                    </a>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-sm dark:text-gray-200">
                        Subtotal
                      </span>
                      <span className="text-sm dark:text-gray-200">$229</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span className="text-sm dark:text-gray-200">
                        Shipping
                      </span>
                      <span className="text-sm dark:text-gray-200">Free</span>
                    </div>

                    {/* Estimated Tax */}
                    <div className="flex justify-between">
                      <span className="text-sm dark:text-gray-200">
                        Estimated Tax
                      </span>
                      <span className="text-sm dark:text-gray-200">$0</span>
                    </div>

                    {/* Promo Code */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-200">
                        Promo code
                      </span>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Enter code
                      </button>
                    </div>

                    {/* Sale */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Sale
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        -$20
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-semibold">
                      <span className="text-base dark:text-gray-200">
                        Total
                      </span>
                      <span className="text-base dark:text-gray-200">
                        USD $229
                      </span>
                    </div>
                  </div>
                  {/* End Summary Details */}

                  {/* Cart Items */}
                  <div className="mt-6 border-t pt-6 dark:border-gray-700">
                    {/* Item 1 */}
                    <div className="flex items-center mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1699595749116-33a4a869503c?q=80&w=180&auto=format&fit=crop"
                        alt="Nike Air Force 1"
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-semibold dark:text-gray-200">
                          Nike Air Force 1
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Color: White | Size: M
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: 1
                        </p>
                        <p className="text-sm font-semibold dark:text-gray-200">
                          $150
                        </p>
                      </div>
                    </div>
                    {/* End Item 1 */}

                    {/* Item 2 */}
                    <div className="flex items-center mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1708443683334-1e41c52f33ac?q=80&w=180&auto=format&fit=crop"
                        alt="Camo Blend Jacket"
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-semibold dark:text-gray-200">
                          Camo Blend Jacket
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Color: Camo | Size: M
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: 1
                        </p>
                        <p className="text-sm font-semibold dark:text-gray-200">
                          <span className="line-through text-gray-500 dark:text-gray-400">
                            $60
                          </span>{" "}
                          $40
                        </p>
                      </div>
                    </div>
                    {/* End Item 2 */}

                    {/* Item 3 */}
                    <div className="flex items-center">
                      <img
                        src="https://images.unsplash.com/photo-1603218183500-7e1d62c3c679?q=80&w=180&auto=format&fit=crop"
                        alt="Mahabis Classic"
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-semibold dark:text-gray-200">
                          Mahabis Classic
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Color: White | Size: M
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: 1
                        </p>
                        <p className="text-sm font-semibold dark:text-gray-200">
                          $39
                        </p>
                      </div>
                    </div>
                    {/* End Item 3 */}
                  </div>
                  {/* End Cart Items */}
                </div>
                {/* End Order Summary */}
              </div>
              {/* End Right Column */}
            </div>
            {/* End Grid */}
          </div>
          {/* End Checkout */}
        </main>
        {/* End Main Content */}

        {/* Footer */}
        <footer className="flex flex-col items-center px-4 py-4 border-t dark:border-neutral-700 space-y-4 md:flex-row md:space-y-0 md:justify-between">
          {/* Back Button */}
          <a
            href="/cart"
            className="flex items-center text-sm text-gray-700 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 order-1 md:order-none"
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </a>

          {/* Progress Indicators */}
          <div className="flex items-center space-x-2 order-2 md:order-none w-full justify-center md:w-auto">
            <div className="w-20 h-1 bg-indigo-600"></div>
            <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Continue Button */}
          <a
            href="/review-and-pay"
            className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded order-3 md:order-none"
          >
            Continue
            <svg
              className="h-5 w-5 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </footer>

        {/* End Footer */}
      </div>
      {/* End Main Wrapper */}
    </>
  );
};

export default CheckoutPage;
