"use client";

import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetchGraphQLData(GET_CATEGORIES);
      setCategories(response.categories || response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setNewCategory({ name: "", description: "" });
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
      setIsModalOpen(false);
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

  const parseDate = (date) => {
    try {
      // Check if date is a number (UNIX timestamp)
      if (!isNaN(date)) {
        return new Date(parseInt(date, 10)).toLocaleDateString();
      }
      // Else, assume it's an ISO string
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <>
      {/* Table Section */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Card */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                {/* Header */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      Categories
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Manage your categories here.
                    </p>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => openModal()}
                      >
                        <svg
                          className="shrink-0 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Add Category
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Header */}
                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Name
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Description
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Created At
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Updated At
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Status
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <tr key={category.id}>
                          {/* Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {category.name}
                            </div>
                          </td>
                          {/* Description */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-neutral-400">
                              {category.description}
                            </div>
                          </td>
                          {/* Created At */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-neutral-400">
                              {parseDate(category.createdAt)}
                            </div>
                          </td>
                          {/* Updated At */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-neutral-400">
                              {parseDate(category.updatedAt)}
                            </div>
                          </td>
                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {category.is_active ? (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-500/10 dark:text-green-500">
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                  <path d="M6.293 9.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414L10 14.414l-4.707-4.707a1 1 0 010-1.414z" />
                                </svg>
                                Active
                              </span>
                            ) : (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0z" />
                                  <path d="M6.293 6.293a1 1 0 011.414 1.414L6.414 9l1.293 1.293a1 1 0 11-1.414 1.414L5 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L3.586 9 .293 6.293a1 1 0 011.414-1.414L5 7.586l1.293-1.293a1 1 0 011.414 0z" />
                                </svg>
                                Inactive
                              </span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openModal(category)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900 ml-4 dark:text-red-500 dark:hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* End Table */}
                {/* Footer */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      <span className="font-semibold text-gray-800 dark:text-neutral-200">
                        {categories.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  {/* Pagination buttons can be added here if needed */}
                </div>
                {/* End Footer */}
              </div>
            </div>
          </div>
        </div>
        {/* End Card */}
      </div>
      {/* End Table Section */}

      {/* Modal */}
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
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={
                    editingCategory ? editingCategory.name : newCategory.name
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600"
                  placeholder="Category Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={
                    editingCategory
                      ? editingCategory.description
                      : newCategory.description
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600"
                  placeholder="Description"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdateCategory}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* End Modal */}
    </>
  );
}
