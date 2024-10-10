/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'

// GraphQL Queries and Mutations
const GET_BRANDS = `
  query Brands {
    brands {
      id
      name
      description
      is_active
      logoURL
      createdAt
      updatedAt
    }
  }
`

const CREATE_BRAND = `
  mutation CreateBrand($newBrand: NewBrandInput!) {
    createBrand(newBrand: $newBrand) {
      status
      data {
        id
        name
        description
        is_active
        logoURL
        createdAt
        updatedAt
      }
      message
    }
  }
`

const UPDATE_BRAND = `
  mutation UpdateBrand($updateBrandId: ID!, $brandData: UpdateBrandInput!) {
    updateBrand(id: $updateBrandId, brandData: $brandData) {
      status
      data {
        id
        name
        description
        is_active
        logoURL
        createdAt
        updatedAt
      }
      message
    }
  }
`

const DELETE_BRAND = `
  mutation DeleteBrandById($deleteBrandByIdId: ID!) {
    deleteBrandById(id: $deleteBrandByIdId) {
      status
      data {
        id
      }
      message
    }
  }
`

const TOGGLE_BRAND_STATUS = `
  mutation ToggleBrandStatusById($toggleBrandStatusByIdId: ID!) {
    toggleBrandStatusById(id: $toggleBrandStatusByIdId) {
      status
      data {
        id
        name
        description
        is_active
        logoURL
        createdAt
        updatedAt
      }
      message
    }
  }
`

const AdminBrands = () => {
  const [brands, setBrands] = useState([])
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    logoURL: '',
  })
  const [editingBrand, setEditingBrand] = useState(null)

  // Fetch brands from the GraphQL endpoint
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_BRANDS,
          }),
        })

        const { data } = await res.json()
        setBrands(data.brands)
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }
    fetchBrands()
  }, [])

  // Handle input changes for new or editing brands
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingBrand) {
      setEditingBrand((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewBrand((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Create a new brand
  const handleCreateBrand = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_BRAND,
          variables: {
            newBrand,
          },
        }),
      })

      const { data } = await res.json()
      setBrands([...brands, data.createBrand.data])
      setNewBrand({ name: '', description: '', logoURL: '' })
    } catch (error) {
      console.error('Error creating brand:', error)
    }
  }

  // Update an existing brand
  const handleUpdateBrand = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_BRAND,
          variables: {
            updateBrandId: editingBrand.id,
            brandData: {
              name: editingBrand.name,
              description: editingBrand.description,
              logoURL: editingBrand.logoURL,
            },
          },
        }),
      })

      const { data } = await res.json()
      setBrands(
        brands.map((brand) =>
          brand.id === data.updateBrand.data.id ? data.updateBrand.data : brand
        )
      )
      setEditingBrand(null)
    } catch (error) {
      console.error('Error updating brand:', error)
    }
  }

  // Delete a brand
  const handleDeleteBrand = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_BRAND,
          variables: {
            deleteBrandByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      if (data?.deleteBrandById?.status) {
        setBrands(brands.filter((brand) => brand.id !== id))
      } else {
        console.error('Failed to delete brand')
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
    }
  }

  // Archive/Toggle brand status
  const handleToggleBrandStatus = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOGGLE_BRAND_STATUS,
          variables: {
            toggleBrandStatusByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      setBrands(
        brands.map((brand) =>
          brand.id === data.toggleBrandStatusById.data.id
            ? data.toggleBrandStatusById.data
            : brand
        )
      )
    } catch (error) {
      console.error('Error toggling brand status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Portal - Manage Brands</h1>

      {/* Form for Adding/Editing Brand */}
      <div className="bg-gray-100 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingBrand ? 'Edit Brand' : 'Add New Brand'}
        </h2>
        <input
          type="text"
          name="name"
          value={editingBrand ? editingBrand.name : newBrand.name}
          onChange={handleInputChange}
          placeholder="Brand Name"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="description"
          value={editingBrand ? editingBrand.description : newBrand.description}
          onChange={handleInputChange}
          placeholder="Brand Description"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="logoURL"
          value={editingBrand ? editingBrand.logoURL : newBrand.logoURL}
          onChange={handleInputChange}
          placeholder="Brand Logo URL"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={editingBrand ? handleUpdateBrand : handleCreateBrand}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingBrand ? 'Update Brand' : 'Create Brand'}
        </button>
        {editingBrand && (
          <button
            onClick={() => setEditingBrand(null)}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Brand Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Brand List</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Logo</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{brand.name}</td>
                <td className="p-4">{brand.description}</td>
                <td className="p-4">
                  <img
                    src={brand.logoURL}
                    alt={brand.name}
                    className="h-10 w-10"
                  />
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    onClick={() => setEditingBrand(brand)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`${
                      brand.is_active
                        ? 'bg-gray-500 hover:bg-gray-700'
                        : 'bg-green-500 hover:bg-green-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={() => handleToggleBrandStatus(brand.id)}
                  >
                    {brand.is_active ? 'Archive' : 'Unarchive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBrands
