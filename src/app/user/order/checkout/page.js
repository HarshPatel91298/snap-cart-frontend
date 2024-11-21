// pages/checkout.js
'use client'
import React from 'react'

const CheckoutPage = () => {
  return (
    <>
      {/* Main Wrapper */}
      <div className="flex flex-col w-full min-h-screen bg-white dark:bg-[#0a0a0a]">
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
                    Checkout
                  </h1>
                  </div>
                  
                {/* End Checkout Header */}

             

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
                          </span>{' '}
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
  )
}

export default CheckoutPage
