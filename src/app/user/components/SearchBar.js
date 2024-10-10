import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="relative mb-6 max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search products..."
        className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300"
      />
      <svg
        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M15 11a6 6 0 11-12 0 6 6 0 0112 0z"
        ></path>
      </svg>
    </div>
  )
}
