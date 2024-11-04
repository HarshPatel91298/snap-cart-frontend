"use client";

import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

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
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    const mutation = editingSubCategory ? UPDATE_SUBCATEGORY : CREATE_SUBCATEGORY;
    const variables = editingSubCategory
      ? { id: editingSubCategory.id, subCategoryData: { ...editingSubCategory } }
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
      if (!isNaN(date)) {
        return new Date(parseInt(date, 10)).toLocaleDateString();
      }
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
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
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
                      Add SubCategory
                    </button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Category ID</th>
                      <th className="px-6 py-3 text-left">Created At</th>
                      <th className="px-6 py-3 text-left">Updated At</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : subCategories.length > 0 ? (
                      subCategories.map((subCategory) => (
                        <tr key={subCategory.id}>
                          <td className="px-6 py-4">{subCategory.name}</td>
                          <td className="px-6 py-4">{subCategory.description}</td>
                          <td className="px-6 py-4">{subCategory.category_id}</td>
                          <td className="px-6 py-4">{parseDate(subCategory.createdAt)}</td>
                          <td className="px-6 py-4">{parseDate(subCategory.updatedAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {subCategory.is_active ? (
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
                          <td className="px-6 py-4 text-right space-x-4">
                            <button
                              onClick={() => openModal(subCategory)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(subCategory.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleToggleSubCategoryStatus(subCategory.id)}
                              className={`${
                                subCategory.is_active
                                  ? "text-yellow-600 hover:text-yellow-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {subCategory.is_active ? "Archive" : "Unarchive"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          No subcategories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                      {subCategories.length}
                    </span>{" "}
                    results
                  </p>
                </div>
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
                  value={editingSubCategory ? editingSubCategory.name : newSubCategory.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="SubCategory Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingSubCategory ? editingSubCategory.description : newSubCategory.description}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category ID</label>
                <input
                  type="text"
                  name="category_id"
                  value={editingSubCategory ? editingSubCategory.category_id : newSubCategory.category_id}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Category ID"
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
