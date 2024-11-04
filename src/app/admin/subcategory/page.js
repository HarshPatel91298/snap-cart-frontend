"use client";

import { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient"; // Ensure this utility is correctly set up

// GraphQL Queries and Mutations
const GET_SUBCATEGORIES = gql`
  query {
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

const CREATE_SUBCATEGORY = gql`
  mutation CreateSubCategory($newSubCategory: NewSubCategoryInput!) {
    createSubCategory(newSubCategory: $newSubCategory) {
      status
      data {
        id
        name
        description
        is_active
        createdAt
        updatedAt
        category_id
      }
      message
    }
  }
`;

const UPDATE_SUBCATEGORY = gql`
  mutation UpdateSubCategory($id: ID!, $subCategoryData: UpdateSubCategoryInput!) {
    updateSubCategory(id: $id, subCategoryData: $subCategoryData) {
      status
      data {
        id
        name
        description
        is_active
        createdAt
        updatedAt
        category_id
      }
      message
    }
  }
`;

const DELETE_SUBCATEGORY = gql`
  mutation DeleteSubCategoryById($id: ID!) {
    deleteSubCategoryById(id: $id) {
      status
      message
    }
  }
`;

const TOGGLE_SUBCATEGORY_STATUS = gql`
  mutation ToggleSubCategoryStatusById($id: ID!) {
    toggleSubCategoryStatusById(id: $id) {
      status
      data {
        id
        is_active
      }
      message
    }
  }
`;

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({ name: "", description: "", category_id: "" });
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchGraphQLData(GET_SUBCATEGORIES);
      setSubCategories(data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSubCategory) {
      setEditingSubCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewSubCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdateSubCategory = async () => {
    try {
      const mutation = editingSubCategory ? UPDATE_SUBCATEGORY : CREATE_SUBCATEGORY;
      const variables = editingSubCategory
        ? { id: editingSubCategory.id, subCategoryData: { ...editingSubCategory } }
        : { newSubCategory: { ...newSubCategory } };
      await fetchGraphQLData(mutation, variables);
      fetchSubCategories();
      setNewSubCategory({ name: "", description: "", category_id: "" });
      setEditingSubCategory(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await fetchGraphQLData(DELETE_SUBCATEGORY, { id });
      fetchSubCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleToggleSubCategoryStatus = async (id) => {
    try {
      await fetchGraphQLData(TOGGLE_SUBCATEGORY_STATUS, { id });
      fetchSubCategories();
    } catch (error) {
      console.error("Error toggling subcategory status:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Admin - Manage SubCategories
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingSubCategory ? "Edit SubCategory" : "Add New SubCategory"}
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            value={editingSubCategory ? editingSubCategory.name : newSubCategory.name}
            onChange={handleInputChange}
            placeholder="SubCategory Name"
            className="border p-2 rounded w-full mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
          <textarea
            name="description"
            value={editingSubCategory ? editingSubCategory.description : newSubCategory.description}
            onChange={handleInputChange}
            placeholder="SubCategory Description"
            className="border p-2 rounded w-full mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            name="category_id"
            value={editingSubCategory ? editingSubCategory.category_id : newSubCategory.category_id}
            onChange={handleInputChange}
            placeholder="Category ID"
            className="border p-2 rounded w-full mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleCreateOrUpdateSubCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingSubCategory ? "Update SubCategory" : "Create SubCategory"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">SubCategory List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subCategory) => (
                <tr
                  key={subCategory.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="p-4">{subCategory.name}</td>
                  <td className="p-4">{subCategory.description}</td>
                  <td className="p-4">{subCategory.category_id}</td>
                  <td className="p-4">
                    {subCategory.is_active ? "Active" : "Inactive"}
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
                          ? "bg-gray-500 hover:bg-gray-700"
                          : "bg-green-500 hover:bg-green-700"
                      } text-white px-4 py-2 rounded`}
                      onClick={() => handleToggleSubCategoryStatus(subCategory.id)}
                    >
                      {subCategory.is_active ? "Deactivate" : "Activate"}
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
