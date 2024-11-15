// pages/page.js
'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Cart() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-10 flex justify-center">
      <div className="w-[100vw] max-w-6xl px-4 lg:px-0 flex flex-col lg:flex-row gap-8">
        {/* Shopping Bag Section */}
        <div className="lg:w-3/5">
          <h1 className="text-2xl font-bold mb-8 dark:text-neutral-200">
            Shopping bag
          </h1>

          {/* Product Item 1 */}
          <div className="flex flex-col sm:flex-row items-start border-b border-gray-300 pb-6 mb-6 dark:border-neutral-700">
            <Image
              src="https://images.unsplash.com/photo-1699595749116-33a4a869503c?q=80&w=480&h=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Nike Air Force 1"
              width={120}
              height={120}
              className="rounded-lg w-full sm:w-auto mb-4 sm:mb-0"
            />
            <div className="sm:ml-4 flex-1">
              <h4 className="text-lg font-semibold dark:text-neutral-200">
                Nike Air Force 1
              </h4>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                $149
              </p>
              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-neutral-400">
                <div className="mr-6 mb-2">
                  <span>Color</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    White
                  </span>
                </div>
                <div className="mr-6 mb-2">
                  <span>Size</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    US 10
                  </span>
                </div>
                <div className="mb-2">
                  <span>Quantity</span>
                  <select className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 mt-2">
                Remove
              </button>
            </div>
          </div>

          {/* Product Item 2 */}
          <div className="flex flex-col sm:flex-row items-start border-b border-gray-300 pb-6 mb-6 dark:border-neutral-700">
            <Image
              src="https://images.unsplash.com/photo-1708443683334-1e41c52f33ac?q=80&w=480&h=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Camo Blend Jacket"
              width={120}
              height={120}
              className="rounded-lg w-full sm:w-auto mb-4 sm:mb-0"
            />
            <div className="sm:ml-4 flex-1">
              <h4 className="text-lg font-semibold dark:text-neutral-200">
                Camo Blend Jacket
              </h4>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-neutral-400 line-through mr-2">
                  $60
                </span>
                <span className="text-red-500 dark:text-red-400">$40</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Low in stock
              </p>
              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-neutral-400">
                <div className="mr-6 mb-2">
                  <span>Color</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    Camo
                  </span>
                </div>
                <div className="mr-6 mb-2">
                  <span>Size</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    M
                  </span>
                </div>
                <div className="mb-2">
                  <span>Quantity</span>
                  <select className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 mt-2">
                Remove
              </button>
            </div>
          </div>

          {/* Product Item 3 */}
          <div className="flex flex-col sm:flex-row items-start dark:border-neutral-700 pb-6 mb-6">
            <Image
              src="https://images.unsplash.com/photo-1603218183500-7e1d62c3c679?q=80&w=480&h=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mahabis Classic"
              width={120}
              height={120}
              className="rounded-lg w-full sm:w-auto mb-4 sm:mb-0"
            />
            <div className="sm:ml-4 flex-1">
              <h4 className="text-lg font-semibold dark:text-neutral-200">
                Mahabis Classic
              </h4>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                $40
              </p>
              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-neutral-400">
                <div className="mr-6 mb-2">
                  <span>Color</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    White
                  </span>
                </div>
                <div className="mr-6 mb-2">
                  <span>Size</span>
                  <span className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:text-neutral-200 dark:border-neutral-700">
                    M
                  </span>
                </div>
                <div className="mb-2">
                  <span>Quantity</span>
                  <select className="ml-2 px-3 py-1 border rounded-lg text-gray-700 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 mt-2">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-[90vw] sm:w-3/5 lg:w-2/5 mx-auto">
          <div className="border rounded-lg p-6 dark:border-neutral-700">
            <h5 className="text-lg font-semibold mb-6 dark:text-neutral-200">
              Order summary
            </h5>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">Subtotal</span>
                <span className="text-sm dark:text-neutral-200">$229</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">Shipping</span>
                <span className="text-sm dark:text-neutral-200">—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">
                  Estimated Tax
                </span>
                <button
                  onClick={() => alert('Calculating tax')}
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Calculate
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-neutral-200">
                  Promo code
                </span>
                <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  Enter code
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-neutral-400">
                  Sale
                </span>
                <span className="text-sm text-gray-500 dark:text-neutral-400">
                  -$20
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-base dark:text-neutral-200">Total</span>
                <span className="text-base dark:text-neutral-200">
                  USD $229
                </span>
              </div>
            </div>

            <Link href="/checkout" passHref>
              <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
                Checkout
              </button>
            </Link>

            <button className="mt-4 w-full border border-gray-300 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 flex items-center justify-center">
              <Image
                src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                alt="PayPal Logo"
                width={24}
                height={24}
                className="mr-2"
              />
              PayPal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
