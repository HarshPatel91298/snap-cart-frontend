import React from 'react'
import HeroSection from '../components/HeroSection'
import CategoriesSidebar from '../components/CategoriesSidebar'
import FeaturesSection from '../components/FeaturesSection'
import ProductGrid from '../components/ProductGrid'

export default function ShopPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto flex py-12">
        {/* Sidebar */}
        <aside className="w-1/4">
          <CategoriesSidebar />
        </aside>

        {/* Main Content */}
        <main className="w-3/4">
          {/* Product Grid */}
          <ProductGrid />
        </main>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  )
}
