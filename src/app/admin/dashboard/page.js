"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const routes = [
    { label: "Brand", path: "/admin/brand" },
    { label: "Category", path: "/admin/category" },
    { label: "Subcategory", path: "/admin/subcategory" },
    { label: "Warehouse", path: "/admin/warehouse" },
    { label: "Product", path: "/admin/product" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 px-8 pt-8">
        Admin Dashboard
      </h1>
      <div className="px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.path}
            onClick={() => router.push(route.path)}
            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {route.label}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage {route.label.toLowerCase()} here.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
