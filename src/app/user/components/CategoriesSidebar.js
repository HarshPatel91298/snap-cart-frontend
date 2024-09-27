import React from 'react'
import Link from 'next/link'

export default function CategoriesSidebar() {
  const categories = [
    "Women's Clothing",
    "Men's Clothing",
    'Kids Clothing',
    'Watch',
    'Sports Accessories',
    'Sunglasses',
    'Bags',
    'Sneakers',
    'Jewellery',
    'Hair Accessories',
    'Other',
  ]

  return (
    <div className="bg-white p-4 w-64">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li key={index}>
            <Link
              href={`/category/${category.toLowerCase().replace(/ /g, '-')}`}
            >
              <span className="text-black-700 hover:text-black">
                {category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
