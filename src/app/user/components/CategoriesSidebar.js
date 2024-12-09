"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CategoriesSidebar = ({ categories, subCategories, brands, onFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState({
    type: null,
    id: null,
  });
  const [showCategories, setShowCategories] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({}); // Track expanded categories

  const handleCategoryFilter = (categoryId) => {
    setSelectedFilter({ type: "category", id: categoryId });
    onFilter({ type: "category", id: categoryId });
  };

  const handleSubCategoryFilter = (subCategoryId) => {
    setSelectedFilter({ type: "sub_category", id: subCategoryId });
    onFilter({ type: "sub_category", id: subCategoryId });
  };

  const handleBrandFilter = (brandId) => {
    setSelectedFilter({ type: "brand", id: brandId });
    onFilter({ type: "brand", id: brandId });
  };

  const isSelected = (type, id) =>
    selectedFilter.type === type && selectedFilter.id === id;

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="bg-white w-full lg:w-64 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Products</h2>

      {/* Categories Section */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-700 mb-2 focus:outline-none"
          onClick={() => setShowCategories(!showCategories)}
        >
          <span>Categories</span>
          {showCategories ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showCategories && (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <div>
                  <button
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left transition ${
                      isSelected("category", category.id)
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                    {/* Toggle Subcategories */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryExpansion(category.id);
                      }}
                      className="ml-2 text-sm"
                    >
                      {expandedCategories[category.id] ? (
                        <FaChevronUp size={12} />
                      ) : (
                        <FaChevronDown size={12} />
                      )}
                    </span>
                  </button>

                  {/* Subcategories List */}
                  {expandedCategories[category.id] && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {subCategories
                        .filter(
                          (subCategory) =>
                            subCategory.category_id === category.id
                        )
                        .map((subCategory) => (
                          <li key={subCategory.id}>
                            <button
                              onClick={() =>
                                handleSubCategoryFilter(subCategory.id)
                              }
                              className={`w-full flex items-center py-1 px-3 rounded-md text-left transition text-sm ${
                                isSelected("sub_category", subCategory.id)
                                  ? "bg-blue-500 text-white font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {subCategory.name}
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Brands Section */}
      <div>
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-700 mb-2 focus:outline-none"
          onClick={() => setShowBrands(!showBrands)}
        >
          <span>Brands</span>
          {showBrands ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showBrands && (
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand.id}>
                <button
                  onClick={() => handleBrandFilter(brand.id)}
                  className={`w-full flex items-center py-2 px-3 rounded-md text-left transition ${
                    isSelected("brand", brand.id)
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {brand.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesSidebar;
