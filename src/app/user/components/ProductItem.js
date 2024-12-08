/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product }) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded w-full h-40 object-cover"
        />
      </Link>
      <div className="flex flex-col items-center justify-center mt-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg font-semibold text-black">{product.name}</h2>
        </Link>
        <p className="text-sm text-black">{product.brand}</p>
        <p className="text-lg font-bold mt-2 text-black">${product.price}</p>
        <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
