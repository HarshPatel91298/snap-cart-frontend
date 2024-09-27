import React from 'react'
import data from '@/utils/data' // Replace with your data source
import ProductItem from './ProductItem' // This would be your product component

export default function ProductGrid() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold my-6">Special Offer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductItem product={product} key={product.slug} />
        ))}
      </div>
    </div>
  )
}
