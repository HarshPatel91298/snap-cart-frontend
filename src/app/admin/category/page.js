"use client";
import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

const LIST_CATEGORIES_QUERY = gql`
  query ListCategories {
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

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($newCategory: NewCategoryInput!) {
    createCategory(newCategory: $newCategory) {
      status
      message
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
`;

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $categoryData: UpdateCategoryInput!) {
    updateCategory(id: $id, categoryData: $categoryData) {
      status
      message
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
`;

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategoryById(id: $id) {
      status
      message
    }
  }
`;

const TOGGLE_CATEGORY_STATUS_MUTATION = gql`
  mutation ToggleCategoryStatus($id: ID!) {
    toggleCategoryStatusById(id: $id) {
      status
      data {
        is_active
      }
      message
    }
  }
`;

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1).toLocaleString();
  return date;
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLData(LIST_CATEGORIES_QUERY);
        if (response?.categories) {
          setCategories(response.categories);
        } else {
          setError("Error fetching categories");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const createOrUpdateCategory = async (event) => {
    event.preventDefault();
    const categoryInput = {
      name: categoryName,
      description: categoryDescription,
    };

    try {
      const response = editingCategoryId
        ? await fetchGraphQLData(UPDATE_CATEGORY_MUTATION, {
            id: editingCategoryId,
            categoryData: categoryInput,
          })
        : await fetchGraphQLData(CREATE_CATEGORY_MUTATION, {
            newCategory: categoryInput,
          });

      if (
        response?.createCategory?.status ||
        response?.updateCategory?.status
      ) {
        let updatedCategory;
        if (editingCategoryId) {
          updatedCategory = response.updateCategory.data;
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === editingCategoryId
                ? { ...category, ...updatedCategory }
                : category
            )
          );
        } else {
          updatedCategory = response.createCategory.data;
          setCategories((prevCategories) => [
            ...prevCategories,
            updatedCategory,
          ]);
        }
        toggleModal();
      } else {
        setError(
          response?.createCategory?.message ||
            response?.updateCategory?.message ||
            "Error saving category"
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await fetchGraphQLData(DELETE_CATEGORY_MUTATION, {
        id: deleteCategoryId,
      });

      if (response?.deleteCategoryById?.status) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== deleteCategoryId)
        );
        closeDeleteModal();
      } else {
        setError("Error deleting category");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCategoryStatus = async (categoryId) => {
    try {
      const response = await fetchGraphQLData(TOGGLE_CATEGORY_STATUS_MUTATION, {
        id: categoryId,
      });

      if (response?.toggleCategoryStatusById?.status) {
        const updatedCategory = response.toggleCategoryStatusById.data;
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, is_active: updatedCategory.is_active }
              : category
          )
        );
      } else {
        setError("Error toggling category status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleModal = (category = null) => {
    setIsModalOpen(!isModalOpen);
    if (category) {
      setEditingCategoryId(category.id);
      setCategoryName(category.name);
      setCategoryDescription(category.description);
    } else {
      setEditingCategoryId(null);
      setCategoryName("");
      setCategoryDescription("");
    }
  };

  const openDeleteModal = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteCategoryId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
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
                <div className="inline-flex gap-x-2">
                  <button
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    onClick={toggleModal}
                  >
                    Create Category
                  </button>

                  {/* Modal for Create/Edit */}
                  {isModalOpen && (
                    <div
                      id="hs-scroll-inside-body-modal"
                      className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center"
                    >
                      <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-lg p-5 m-4">
                        <div className="flex justify-between items-center pb-3 border-b dark:border-neutral-700">
                          <h3 className="font-bold text-gray-800 dark:text-white">
                            {editingCategoryId
                              ? "Edit Category"
                              : "Create Category"}
                          </h3>
                          <button
                            type="button"
                            className="text-gray-500 dark:text-neutral-400"
                            onClick={toggleModal}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          {/* Create/Edit Category Form */}
                          <form
                            className="space-y-4"
                            onSubmit={createOrUpdateCategory}
                          >
                            <div className="max-w-sm">
                              <label
                                htmlFor="category-name"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                id="category-name"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Category Name"
                                value={categoryName}
                                onChange={(e) =>
                                  setCategoryName(e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="max-w-sm">
                              <label
                                htmlFor="category-description"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="category-description"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Category Description"
                                value={categoryDescription}
                                onChange={(e) =>
                                  setCategoryDescription(e.target.value)
                                }
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={toggleModal}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              >
                                {editingCategoryId ? "Update" : "Create"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {category.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(category.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {category.is_active ? (
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-green-200">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                              </svg>
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
                            onClick={() => toggleModal(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                            onClick={() => openDeleteModal(category.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-400 ml-4"
                            onClick={() => toggleCategoryStatus(category.id)}
                          >
                            {category.is_active ? "Archive" : "Unarchive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delete Confirmation Modal */}
              {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-sm p-5 m-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      Confirm Deletion
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-400">
                      Are you sure you want to delete this category?
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={closeDeleteModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={deleteCategory}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
