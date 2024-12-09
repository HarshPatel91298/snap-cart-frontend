"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import CategoriesSidebar from "../components/CategoriesSidebar";
import FeaturesSection from "../components/FeaturesSection";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import { fetchGraphQLData } from "@/lib/graphqlClient";
import { UserAuth } from "@/context/AuthContext";

// GraphQL Queries
const GET_PRODUCTS = `
  query Products {
    products {
      id
      name
      description
      price
      display_image
      brand_id
      category_id
      sub_category_id
      is_active
    }
  }
`;

const GET_RANDOM_PRODUCTS = `
  query GetRandomProducts($limit: Int!) {
    getRandomProducts(limit: $limit) {
      id
    name
    description
    cost_price
    price
    color
    brand_id
    category_id
    sub_category_id
    display_image
    images
    sku
    is_active
    created_at
    updated_at
    }
  }
`;

const GET_CATEGORIES = `
  query Categories {
    categories {
      id
      name
    }
  }
`;

const GET_BRANDS = `
  query Brands {
    brands {
      id
      name
    }
  }
`;

const GET_SUBCATEGORIES = `
  query SubCategories {
    subCategories {
      id
      name
      description
      is_active
      createdAt
      updatedAt
      category_id
    }
  }
`;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, dbUser, getUserByUID } = UserAuth();

  // Fetch dbUser if not already set
  useEffect(() => {
    const fetchUser = async () => {
      if (user && user.uid && !dbUser) {
        const response = await getUserByUID(user.uid);
        if (!response.success) {
          console.error("Error fetching dbUser:", response.message);
        }
      }
    };
    fetchUser();
  }, [user, dbUser, getUserByUID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productResponse,
          categoryResponse,
          brandResponse,
          subCategoryResponse,
        ] = await Promise.all([
          fetchGraphQLData(GET_PRODUCTS),
          fetchGraphQLData(GET_CATEGORIES),
          fetchGraphQLData(GET_BRANDS),
          fetchGraphQLData(GET_SUBCATEGORIES),
        ]);

        setProducts(productResponse?.products || []);
        setFilteredProducts(productResponse?.products || []);
        setCategories(categoryResponse?.categories || []);
        setBrands(brandResponse?.brands || []);
        setSubCategories(subCategoryResponse?.subCategories || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch random products with limit
  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const variables = { limit: 4 };
        const response = await fetchGraphQLData(GET_RANDOM_PRODUCTS, variables);
        console.log(response, "random products");
        setRandomProducts(response?.getRandomProducts || []);
        setRandomLoading(false);
      } catch (err) {
        console.error("Error fetching random products:", err);
        setRandomProducts([]);
        setRandomLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = ({ type, id }) => {
    let filtered;
    if (type === "category") {
      filtered = products.filter((product) => product.category_id === id);
    } else if (type === "sub_category") {
      filtered = products.filter((product) => product.sub_category_id === id);
    } else if (type === "brand") {
      filtered = products.filter((product) => product.brand_id === id);
    } else {
      filtered = products;
    }
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <p className="text-center py-12">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-12 text-red-500">Error: {error.message}</p>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Shop Content */}
      <div className="min-w-[97vw] mx-auto flex flex-col lg:flex-row gap-6 py-12 px-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <CategoriesSidebar
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            onFilter={handleFilter}
          />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Main Product Grid */}
          <ProductGrid products={filteredProducts} userId={dbUser?.id} />

          {/* Random Products Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Recommended Products
            </h2>
            {randomLoading ? (
              <p>Loading random products...</p>
            ) : randomProducts.length > 0 ? (
              <ProductGrid products={randomProducts} userId={dbUser?.id} />
            ) : (
              <p>No random products available.</p>
            )}
          </section>
        </main>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}
