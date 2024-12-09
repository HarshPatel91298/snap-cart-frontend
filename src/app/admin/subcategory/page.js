"use client";

import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

// GraphQL Queries and Mutations
const GET_SUBCATEGORIES = gql`
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

const GET_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
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
  mutation UpdateSubCategory(
    $id: ID!
    $subCategoryData: UpdateSubCategoryInput!
  ) {
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
  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchGraphQLData(GET_SUBCATEGORIES);
      setSubCategories(data.subCategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchGraphQLData(GET_CATEGORIES);
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openModal = (subCategory = null) => {
    if (subCategory) {
      setEditingSubCategory(subCategory);
    } else {
      setNewSubCategory({ name: "", description: "", category_id: "" });
      setEditingSubCategory(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSubCategory) {
      setEditingSubCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewSubCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdateSubCategory = async (e) => {
    e.preventDefault();
    const mutation = editingSubCategory
      ? UPDATE_SUBCATEGORY
      : CREATE_SUBCATEGORY;
    const variables = editingSubCategory
      ? {
          id: editingSubCategory.id,
          subCategoryData: { ...editingSubCategory },
        }
      : { newSubCategory: { ...newSubCategory } };

    try {
      await fetchGraphQLData(mutation, variables);
      fetchSubCategories();
      closeModal();
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

  const parseDate = (date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      SubCategories
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Manage your subcategories here.
                    </p>
                  </div>
                  <div>
                    <button
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => openModal()}
                    >
                      Add SubCategory
                    </button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : subCategories.length > 0 ? (
                      subCategories.map((subCategory) => (
                        <tr key={subCategory.id}>
                          <td className="px-6 py-4">{subCategory.name}</td>
                          <td className="px-6 py-4">
                            {subCategory.description}
                          </td>
                          <td className="px-6 py-4">
                            {categories.find(
                              (cat) => cat.id === subCategory.category_id
                            )?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            {subCategory.is_active ? "Active" : "Inactive"}
                          </td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <button
                              onClick={() => openModal(subCategory)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSubCategory(subCategory.id)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleToggleSubCategoryStatus(subCategory.id)
                              }
                              className={`${
                                subCategory.is_active
                                  ? "text-yellow-600 hover:text-yellow-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {subCategory.is_active
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No subcategories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingSubCategory ? "Edit SubCategory" : "Add New SubCategory"}
            </h2>
            <form onSubmit={handleCreateOrUpdateSubCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={
                    editingSubCategory
                      ? editingSubCategory.name
                      : newSubCategory.name
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  placeholder="SubCategory Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={
                    editingSubCategory
                      ? editingSubCategory.description
                      : newSubCategory.description
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  placeholder="SubCategory Description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={
                    editingSubCategory
                      ? editingSubCategory.category_id
                      : newSubCategory.category_id
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingSubCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
