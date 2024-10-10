'use client'

import Link from 'next/link'

// Define your categories array or pass it as a prop
const categories = [
  { id: 1, name: "Women's Clothing", slug: 'womens-clothing' },
  { id: 2, name: "Men's Clothing", slug: 'mens-clothing' },
  { id: 3, name: 'Kids Clothing', slug: 'kids-clothing' },
  { id: 4, name: 'Watch', slug: 'watch' },
  { id: 5, name: 'Sports Accessories', slug: 'sports-accessories' },
  { id: 6, name: 'Sunglasses', slug: 'sunglasses' },
  { id: 7, name: 'Bags', slug: 'bags' },
  { id: 8, name: 'Sneakers', slug: 'sneakers' },
  { id: 9, name: 'Jewellery', slug: 'jewellery' },
  { id: 10, name: 'Hair Accessories', slug: 'hair-accessories' },
  { id: 11, name: 'Other', slug: 'other' },
]

const CategoriesSidebar = () => (
  <div className="bg-gray-200 w-64 p-4">
    <h3 className="font-semibold text-lg text-black">Shop by Categories</h3>
    <ul className="mt-4">
      {categories.map((category) => (
        <li key={category.id} className="mt-2">
          <Link
            href={`/category/${category.slug}`}
            className="text-black hover:text-blue-500"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default CategoriesSidebar

