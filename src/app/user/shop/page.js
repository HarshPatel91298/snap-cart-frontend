'use client' // Add this line to make the component a client component

import React, { useState } from 'react'

import HeroSection from '../components/HeroSection'
import CategoriesSidebar from '../components/CategoriesSidebar'
import FeaturesSection from '../components/FeaturesSection'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import data from '@/utils/data'

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState(data.products)

  const handleSearch = (searchTerm) => {
    const filtered = data.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />


      {/* Shop Content */}
      <div className="container mx-auto flex flex-col lg:flex-row py-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-200 p-4 mb-4 lg:mb-0">

          <CategoriesSidebar />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />

        </main>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  )
}
