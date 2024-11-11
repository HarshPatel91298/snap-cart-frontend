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

const GET_CATEGORIES = gql`
  query {
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

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1).toLocaleString();
  return date;
};

const SubCategoryPage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const subCategoriesResponse = await fetchGraphQLData(GET_SUBCATEGORIES);
        const categoriesResponse = await fetchGraphQLData(GET_CATEGORIES);
        if (
          subCategoriesResponse?.subCategories &&
          categoriesResponse?.categories
        ) {
          setSubCategories(subCategoriesResponse.subCategories);
          setCategories(categoriesResponse.categories);
        } else {
          setError("Error fetching data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createOrUpdateSubCategory = async (event) => {
    event.preventDefault();
    const subCategoryInput = {
      name: subCategoryName,
      description: subCategoryDescription,
      category_id: categoryId,
    };

    try {
      const response = editingSubCategoryId
        ? await fetchGraphQLData(UPDATE_SUBCATEGORY, {
            id: editingSubCategoryId,
            subCategoryData: subCategoryInput,
          })
        : await fetchGraphQLData(CREATE_SUBCATEGORY, {
            newSubCategory: subCategoryInput,
          });

      if (
        response?.createSubCategory?.status ||
        response?.updateSubCategory?.status
      ) {
        let updatedSubCategory;
        if (editingSubCategoryId) {
          updatedSubCategory = response.updateSubCategory.data;
          setSubCategories((prevSubCategories) =>
            prevSubCategories.map((subCategory) =>
              subCategory.id === editingSubCategoryId
                ? { ...subCategory, ...updatedSubCategory }
                : subCategory
            )
          );
        } else {
          updatedSubCategory = response.createSubCategory.data;
          setSubCategories((prevSubCategories) => [
            ...prevSubCategories,
            updatedSubCategory,
          ]);
        }
        toggleModal();
      } else {
        setError(
          response?.createSubCategory?.message ||
            response?.updateSubCategory?.message ||
            "Error saving subcategory"
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSubCategory = async () => {
    try {
      const response = await fetchGraphQLData(DELETE_SUBCATEGORY, {
        id: deleteSubCategoryId,
      });

      if (response?.deleteSubCategoryById?.status) {
        setSubCategories((prevSubCategories) =>
          prevSubCategories.filter(
            (subCategory) => subCategory.id !== deleteSubCategoryId
          )
        );
        closeDeleteModal();
      } else {
        setError("Error deleting subcategory");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSubCategoryStatus = async (subCategoryId) => {
    try {
      const response = await fetchGraphQLData(TOGGLE_SUBCATEGORY_STATUS, {
        id: subCategoryId,
      });

      if (response?.toggleSubCategoryStatusById?.status) {
        const updatedSubCategory = response.toggleSubCategoryStatusById.data;
        setSubCategories((prevSubCategories) =>
          prevSubCategories.map((subCategory) =>
            subCategory.id === subCategoryId
              ? { ...subCategory, is_active: updatedSubCategory.is_active }
              : subCategory
          )
        );
      } else {
        setError("Error toggling subcategory status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleModal = (subCategory = null) => {
    setIsModalOpen(!isModalOpen);
    if (subCategory) {
      setEditingSubCategoryId(subCategory.id);
      setSubCategoryName(subCategory.name);
      setSubCategoryDescription(subCategory.description);
      setCategoryId(subCategory.category_id);
    } else {
      setEditingSubCategoryId(null);
      setSubCategoryName("");
      setSubCategoryDescription("");
      setCategoryId("");
    }
  };

  const openDeleteModal = (subCategoryId) => {
    setDeleteSubCategoryId(subCategoryId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteSubCategoryId(null);
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
                    SubCategories
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Manage your subcategories here.
                  </p>
                </div>
                <div className="inline-flex gap-x-2">
                  <button
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    onClick={toggleModal}
                  >
                    Create SubCategory
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
                            {editingSubCategoryId
                              ? "Edit SubCategory"
                              : "Create SubCategory"}
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
                          {/* Create/Edit SubCategory Form */}
                          <form
                            className="space-y-4"
                            onSubmit={createOrUpdateSubCategory}
                          >
                            <div className="max-w-sm">
                              <label
                                htmlFor="subcategory-name"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                id="subcategory-name"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="SubCategory Name"
                                value={subCategoryName}
                                onChange={(e) =>
                                  setSubCategoryName(e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="max-w-sm">
                              <label
                                htmlFor="subcategory-description"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="subcategory-description"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="SubCategory Description"
                                value={subCategoryDescription}
                                onChange={(e) =>
                                  setSubCategoryDescription(e.target.value)
                                }
                              />
                            </div>
                            <div className="max-w-sm">
                              <label
                                htmlFor="category-id"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Category
                              </label>
                              <select
                                id="category-id"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                              >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
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
                                {editingSubCategoryId ? "Update" : "Create"}
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
                        Category
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
                    {subCategories.map((subCategory) => (
                      <tr key={subCategory.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {subCategory.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {subCategory.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {categories.find(
                            (cat) => cat.id === subCategory.category_id
                          )?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(subCategory.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(subCategory.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {subCategory.is_active ? (
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                <path d="M6.293 9.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414L10 14.414l-4.707-4.707a1 1 0 010-1.414z" />
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
                            onClick={() => toggleModal(subCategory)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                            onClick={() => openDeleteModal(subCategory.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-400 ml-4"
                            onClick={() =>
                              toggleSubCategoryStatus(subCategory.id)
                            }
                          >
                            {subCategory.is_active ? "Archive" : "Unarchive"}
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
                      Are you sure you want to delete this subcategory?
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
                        onClick={deleteSubCategory}
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

export default SubCategoryPage;
