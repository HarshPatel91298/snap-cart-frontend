/* eslint-disable @next/next/no-img-element */
import React from 'react'
import ProductCarousel from './ProductCarousel' // Ensure this is the correct path
import data from '@/utils/data' // Assuming you are using 'data' for products

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4">
      {/* Product Carousel */}
      <h2 className="text-2xl font-bold my-6 text-black">Featured Products</h2>
      <ProductCarousel products={data.products} />

      {/* Product Grid */}
      <h2 className="text-2xl font-bold my-6 text-black">Shop All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <div key={product.slug} className="bg-white p-4 rounded-lg shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <h3 className="text-lg font-semibold mt-2 text-black">
              {product.name}
            </h3>
            <p className="text-black mt-1">${product.price}</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
