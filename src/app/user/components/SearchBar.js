import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handles the input change and calls the parent-provided onSearch function
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-8 max-w-lg mx-auto">
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for products, categories..."
        className="w-full p-4 pl-14 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 transition duration-300 text-gray-800"
        aria-label="Search products"
      />
      {/* Search Icon */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M15 11a6 6 0 11-12 0 6 6 0 0112 0z"
          ></path>
        </svg>
      </div>
      {/* Clear Button */}
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            onSearch("");
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition duration-300"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
