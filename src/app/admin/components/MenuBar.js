import React, { useState } from 'react'
import Link from 'next/link'

export default function MenuBar() {
  const [isSidebarVisible, setSidebarVisible] = useState(false)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  return (
    <>
      {/* ========== MAIN CONTENT ========== */}
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-md"
      >
        {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>

      {/* Overlay */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        id="hs-application-sidebar"
        className={`hs-overlay transition-all duration-300 transform w-[260px] h-full fixed inset-y-0 start-0 z-50 bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full p-4 bg-gray-100 dark:bg-neutral-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">SnapCart</h2>
            {/* Button to Hide Sidebar */}
            <button
              onClick={toggleSidebar}
              className="p-2 bg-red-500 text-white rounded-lg shadow-md"
            >
              Hide
            </button>
          </div>
          {/* Content */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav
              className="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open=""
            >
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link
                    href="/admin/category"
                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-blue-100 dark:text-white dark:bg-neutral-700"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/brand"
                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-blue-100 dark:text-white dark:bg-neutral-700"
                  >
                    Brands
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/product"
                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-blue-100 dark:text-white dark:bg-neutral-700"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/address"
                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-blue-100 dark:text-white dark:bg-neutral-700"
                  >
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/stock"
                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-blue-100 dark:text-white dark:bg-neutral-700"
                  >
                    Stock
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* End Content */}
        </div>
      </div>
      {/* End Sidebar */}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarVisible ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Please log in to access the admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ========== END MAIN CONTENT ========== */}
    </>
  )
}
