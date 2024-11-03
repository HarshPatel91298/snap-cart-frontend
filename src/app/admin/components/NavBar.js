import React from 'react';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  const routes = [
    { label: 'Brand', path: '/admin/brand' },
    { label: 'Category', path: '/admin/category' },
    { label: 'Subcategory', path: '/admin/subcategory' },
    { label: 'Warehouse', path: '/admin/warehouse' },
    { label: 'Product', path: '/admin/product' },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 inset-x-0 flex justify-between items-center bg-white border-b py-3 px-6 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center">
          {/* Logo */}
          <a href="#" aria-label="Admin Panel" className="text-xl font-semibold text-blue-600 dark:text-white">
            <svg className="w-28 h-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 116 32">
              <path d="M33.5696 30.8182V11.3182H37.4474V13.7003H37.6229..." fill="currentColor" />
              {/* Add remaining SVG paths */}
            </svg>
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {routes.map((route) => (
            <button
              key={route.path}
              onClick={() => router.push(route.path)}
              className="text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-500"
            >
              {route.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* User Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 shadow-lg rounded-lg hidden">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-white">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-white">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-white">Logout</a>
            </div>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  );
}
