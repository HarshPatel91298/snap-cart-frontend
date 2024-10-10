'use client'

import { useState, useEffect } from 'react'

// GraphQL Queries and Mutations
const GET_CATEGORIES = `
  query Categories {
    categories {
      id
      name
      description
      is_active
      createdAt
      updatedAt
    }
  }
`

const GET_SUBCATEGORIES = `
  query SubCategories {
    subCategories {
      id
      name
      description
      is_active
      category_id
      createdAt
      updatedAt
    }
  }
`

const CREATE_CATEGORY = `
  mutation CreateCategory($newCategory: NewCategoryInput!) {
    createCategory(newCategory: $newCategory) {
      status
      data {
        id
        name
        description
        is_active
        createdAt
        updatedAt
      }
      message
    }
  }
`

const CREATE_SUBCATEGORY = `
  mutation CreateSubCategory($newSubCategory: NewSubCategoryInput!) {
    createSubCategory(newSubCategory: $newSubCategory) {
      status
      data {
        id
        name
        description
        is_active
        category_id
        createdAt
        updatedAt
      }
      message
    }
  }
`

const UPDATE_CATEGORY = `
  mutation UpdateCategory($updateCategoryId: ID!, $categoryData: UpdateCategoryInput!) {
    updateCategory(id: $updateCategoryId, categoryData: $categoryData) {
      data {
        id
        name
        description
        is_active
        createdAt
        updatedAt
      }
      status
      message
    }
  }
`

const UPDATE_SUBCATEGORY = `
  mutation UpdateSubCategory($updateSubCategoryId: ID!, $subCategoryData: UpdateSubCategoryInput!) {
    updateSubCategory(id: $updateSubCategoryId, subCategoryData: $subCategoryData) {
      status
      data {
        id
        name
        description
        is_active
        category_id
        createdAt
        updatedAt
      }
      message
    }
  }
`

const DELETE_CATEGORY = `
  mutation DeleteCategoryById($deleteCategoryByIdId: ID!) {
    deleteCategoryById(id: $deleteCategoryByIdId) {
      status
      data {
        id
      }
      message
    }
  }
`

const DELETE_SUBCATEGORY = `
  mutation DeleteSubCategoryById($deleteSubCategoryByIdId: ID!) {
    deleteSubCategoryById(id: $deleteSubCategoryByIdId) {
      status
      data {
        id
      }
      message
    }
  }
`

const TOGGLE_CATEGORY_STATUS = `
  mutation ToggleCategoryStatusById($toggleCategoryStatusByIdId: ID!) {
    toggleCategoryStatusById(id: $toggleCategoryStatusByIdId) {
      data {
        id
        name
        description
        is_active
        createdAt
        updatedAt
      }
    }
  }
`

const TOGGLE_SUBCATEGORY_STATUS = `
  mutation ToggleSubCategoryStatusById($toggleSubCategoryStatusByIdId: ID!) {
    toggleSubCategoryStatusById(id: $toggleSubCategoryStatusByIdId) {
      data {
        id
        name
        description
        is_active
        category_id
        createdAt
        updatedAt
      }
    }
  }
`

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    description: '',
    category_id: '',
  })
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubCategory, setEditingSubCategory] = useState(null)

  // Fetch categories and subcategories from the GraphQL endpoint
  useEffect(() => {
    const fetchCategoriesAndSubCategories = async () => {
      try {
        const categoryRes = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_CATEGORIES,
          }),
        })

        const subCategoryRes = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_SUBCATEGORIES,
          }),
        })

        const { data: categoryData } = await categoryRes.json()
        const { data: subCategoryData } = await subCategoryRes.json()

        setCategories(categoryData.categories)
        setSubCategories(subCategoryData.subCategories)
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error)
      }
    }

    fetchCategoriesAndSubCategories()
  }, [])

  // Handle input changes for new or editing categories and subcategories
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingCategory) {
      setEditingCategory((prev) => ({ ...prev, [name]: value }))
    } else if (editingSubCategory) {
      setEditingSubCategory((prev) => ({ ...prev, [name]: value }))
    } else if (newSubCategory) {
      setNewSubCategory((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Create a new category
  const handleCreateCategory = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_CATEGORY,
          variables: {
            newCategory,
          },
        }),
      })

      const { data } = await res.json()
      setCategories([...categories, data.createCategory.data])
      setNewCategory({ name: '', description: '' })
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  // Create a new subcategory
  const handleCreateSubCategory = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_SUBCATEGORY,
          variables: {
            newSubCategory,
          },
        }),
      })

      const { data } = await res.json()
      setSubCategories([...subCategories, data.createSubCategory.data])
      setNewSubCategory({ name: '', description: '', category_id: '' })
    } catch (error) {
      console.error('Error creating subcategory:', error)
    }
  }

  // Update an existing category
  const handleUpdateCategory = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_CATEGORY,
          variables: {
            updateCategoryId: editingCategory.id,
            categoryData: {
              name: editingCategory.name,
              description: editingCategory.description,
            },
          },
        }),
      })

      const { data } = await res.json()
      setCategories(
        categories.map((cat) =>
          cat.id === data.updateCategory.data.id
            ? data.updateCategory.data
            : cat
        )
      )
      setEditingCategory(null)
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  // Update an existing subcategory
  const handleUpdateSubCategory = async () => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_SUBCATEGORY,
          variables: {
            updateSubCategoryId: editingSubCategory.id,
            subCategoryData: {
              name: editingSubCategory.name,
              description: editingSubCategory.description,
              category_id: editingSubCategory.category_id,
            },
          },
        }),
      })

      const { data } = await res.json()
      setSubCategories(
        subCategories.map((subCat) =>
          subCat.id === data.updateSubCategory.data.id
            ? data.updateSubCategory.data
            : subCat
        )
      )
      setEditingSubCategory(null)
    } catch (error) {
      console.error('Error updating subcategory:', error)
    }
  }

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_CATEGORY,
          variables: {
            deleteCategoryByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      if (data?.deleteCategoryById?.status) {
        setCategories(categories.filter((cat) => cat.id !== id))
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // Delete a subcategory
  const handleDeleteSubCategory = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_SUBCATEGORY,
          variables: {
            deleteSubCategoryByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      if (data?.deleteSubCategoryById?.status) {
        setSubCategories(subCategories.filter((subCat) => subCat.id !== id))
      } else {
        console.error('Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
    }
  }

  // Archive/Toggle category status
  const handleToggleCategoryStatus = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOGGLE_CATEGORY_STATUS,
          variables: {
            toggleCategoryStatusByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      setCategories(
        categories.map((cat) =>
          cat.id === data.toggleCategoryStatusById.data.id
            ? data.toggleCategoryStatusById.data
            : cat
        )
      )
    } catch (error) {
      console.error('Error toggling category status:', error)
    }
  }

  // Archive/Toggle subcategory status
  const handleToggleSubCategoryStatus = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOGGLE_SUBCATEGORY_STATUS,
          variables: {
            toggleSubCategoryStatusByIdId: id,
          },
        }),
      })

      const { data } = await res.json()
      setSubCategories(
        subCategories.map((subCat) =>
          subCat.id === data.toggleSubCategoryStatusById.data.id
            ? data.toggleSubCategoryStatusById.data
            : subCat
        )
      )
    } catch (error) {
      console.error('Error toggling subcategory status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Portal - Manage Categories and Subcategories
      </h1>

      {/* Form for Adding/Editing Category */}
      <div className="bg-gray-100 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h2>
        <input
          type="text"
          name="name"
          value={editingCategory ? editingCategory.name : newCategory.name}
          onChange={handleInputChange}
          placeholder="Category Name"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="description"
          value={
            editingCategory
              ? editingCategory.description
              : newCategory.description
          }
          onChange={handleInputChange}
          placeholder="Category Description"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={
            editingCategory ? handleUpdateCategory : handleCreateCategory
          }
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingCategory ? 'Update Category' : 'Create Category'}
        </button>
        {editingCategory && (
          <button
            onClick={() => setEditingCategory(null)}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Form for Adding/Editing Subcategory */}
      <div className="bg-gray-100 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        </h2>
        <input
          type="text"
          name="name"
          value={
            editingSubCategory ? editingSubCategory.name : newSubCategory.name
          }
          onChange={handleInputChange}
          placeholder="Subcategory Name"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="description"
          value={
            editingSubCategory
              ? editingSubCategory.description
              : newSubCategory.description
          }
          onChange={handleInputChange}
          placeholder="Subcategory Description"
          className="border p-2 rounded w-full mb-4"
        />
        <select
          name="category_id"
          value={
            editingSubCategory
              ? editingSubCategory.category_id
              : newSubCategory.category_id
          }
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={
            editingSubCategory
              ? handleUpdateSubCategory
              : handleCreateSubCategory
          }
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingSubCategory ? 'Update Subcategory' : 'Create Subcategory'}
        </button>
        {editingSubCategory && (
          <button
            onClick={() => setEditingSubCategory(null)}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Category Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Category List</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{category.name}</td>
                <td className="p-4">{category.description}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    onClick={() => setEditingCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`${
                      category.is_active
                        ? 'bg-gray-500 hover:bg-gray-700'
                        : 'bg-green-500 hover:bg-green-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={() => handleToggleCategoryStatus(category.id)}
                  >
                    {category.is_active ? 'Archive' : 'Unarchive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subcategory Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Subcategory List</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory) => (
              <tr key={subCategory.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{subCategory.name}</td>
                <td className="p-4">{subCategory.description}</td>
                <td className="p-4">
                  {categories.find(
                    (category) => category.id === subCategory.category_id
                  )?.name || 'N/A'}
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    onClick={() => setEditingSubCategory(subCategory)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteSubCategory(subCategory.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`${
                      subCategory.is_active
                        ? 'bg-gray-500 hover:bg-gray-700'
                        : 'bg-green-500 hover:bg-green-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={() =>
                      handleToggleSubCategoryStatus(subCategory.id)
                    }
                  >
                    {subCategory.is_active ? 'Archive' : 'Unarchive'}
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

export default AdminCategories
