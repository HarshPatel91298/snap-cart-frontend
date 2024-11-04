"use client";

import { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient"; // Ensure this utility is correctly set up

// GraphQL Queries and Mutations
const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
      description
      is_active
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CATEGORY = gql`
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
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $categoryData: UpdateCategoryInput!) {
    updateCategory(id: $id, categoryData: $categoryData) {
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
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategoryById($id: ID!) {
    deleteCategoryById(id: $id) {
      status
      message
    }
  }
`;

const TOGGLE_CATEGORY_STATUS = gql`
  mutation ToggleCategoryStatusById($id: ID!) {
    toggleCategoryStatusById(id: $id) {
      status
      data {
        id
        is_active
      }
      message
    }
  }
`;

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchGraphQLData(GET_CATEGORIES);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdateCategory = async () => {
    try {
      const mutation = editingCategory ? UPDATE_CATEGORY : CREATE_CATEGORY;
      const variables = editingCategory
        ? { id: editingCategory.id, categoryData: { ...editingCategory } }
        : { newCategory: { ...newCategory } };
      await fetchGraphQLData(mutation, variables);
      fetchCategories();
      setNewCategory({ name: "", description: "" });
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetchGraphQLData(DELETE_CATEGORY, { id });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleToggleCategoryStatus = async (id) => {
    try {
      await fetchGraphQLData(TOGGLE_CATEGORY_STATUS, { id });
      fetchCategories();
    } catch (error) {
      console.error("Error toggling category status:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Admin - Manage Categories
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            value={editingCategory ? editingCategory.name : newCategory.name}
            onChange={handleInputChange}
            placeholder="Category Name"
            className="border p-2 rounded w-full mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
          <textarea
            name="description"
            value={editingCategory ? editingCategory.description : newCategory.description}
            onChange={handleInputChange}
            placeholder="Category Description"
            className="border p-2 rounded w-full mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleCreateOrUpdateCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Category List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">{category.description}</td>
                  <td className="p-4">
                    {category.is_active ? "Active" : "Inactive"}
                  </td>
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
                          ? "bg-gray-500 hover:bg-gray-700"
                          : "bg-green-500 hover:bg-green-700"
                      } text-white px-4 py-2 rounded`}
                      onClick={() => handleToggleCategoryStatus(category.id)}
                    >
                      {category.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
