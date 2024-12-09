"use client";
import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";
import { UserAuth } from "../../../context/AuthContext";
import Datatable from "../components/Datatable";
import ConfirmationModal from "../components/ConfirmationModel";
import Alert from "../components/Alert";

// GraphQL Queries and Mutations
const GET_CATEGORIES = gql`
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

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  // Archive Modal States (for toggling category status)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveConfrimText, setArchiveConfrimText] = useState("");
  const [archiveCategoryId, setArchiveCategoryId] = useState(null);

  const [currentuser, setCurrentUser] = useState(null);
  const { user } = UserAuth();

  // Alert states and functions
  const [alerts, setAlerts] = useState([]);

  const setAlert = (message, type) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetchGraphQLData(GET_CATEGORIES);
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
      fetchData();
    }
  }, [user]);

  const createOrUpdateCategory = async (event) => {
    event.preventDefault();
    const variables = editingCategoryId
      ? {
          id: editingCategoryId,
          categoryData: {
            name: categoryName,
            description: categoryDescription,
          },
        }
      : {
          newCategory: { name: categoryName, description: categoryDescription },
        };

    const mutation = editingCategoryId ? UPDATE_CATEGORY : CREATE_CATEGORY;

    try {
      const response = await fetchGraphQLData(mutation, variables);

      if (
        editingCategoryId
          ? response?.updateCategory?.status
          : response?.createCategory?.status
      ) {
        const updatedCategory = editingCategoryId
          ? response.updateCategory.data
          : response.createCategory.data;

        setCategories((prev) => {
          if (editingCategoryId) {
            return prev.map((cat) =>
              cat.id === editingCategoryId
                ? { ...cat, ...updatedCategory }
                : cat
            );
          } else {
            return [...prev, updatedCategory];
          }
        });
        setAlert(
          editingCategoryId
            ? "Category updated successfully"
            : "Category created successfully",
          "success"
        );
        toggleModal();
      } else {
        const msg = editingCategoryId
          ? response?.updateCategory?.message
          : response?.createCategory?.message;
        setError(msg || "Error saving category");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await fetchGraphQLData(DELETE_CATEGORY, {
        id: deleteCategoryId,
      });
      if (response?.deleteCategoryById?.status) {
        setCategories((prev) =>
          prev.filter((cat) => cat.id !== deleteCategoryId)
        );
        setAlert("Category deleted successfully", "success");
      } else {
        setError("Error deleting category");
        setAlert("Error deleting category", "failed");
      }
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryStatus = async () => {
    try {
      const response = await fetchGraphQLData(TOGGLE_CATEGORY_STATUS, {
        id: archiveCategoryId,
      });
      if (response?.toggleCategoryStatusById?.status) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === archiveCategoryId
              ? { ...cat, is_active: !cat.is_active }
              : cat
          )
        );
        setAlert("Category status updated successfully", "success");
        closeArchiveModal();
      } else {
        setError("Error updating category status");
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

  const openArchiveModal = (category) => {
    setArchiveConfrimText(category.is_active ? "Inactive" : "Active");
    setArchiveCategoryId(category.id);
    setIsArchiveModalOpen(true);
  };

  const closeArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setArchiveCategoryId(null);
    setArchiveConfrimText("");
  };

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 inline-block align-middle">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                {" "}
                ...Loading{" "}
              </div>
            ) : (
              <Datatable
                title="Categories"
                description="Manage your categories here."
                columns={[
                  { label: "Name", field: "name", type: "text" },
                  { label: "Description", field: "description", type: "text" },
                  { label: "Created At", field: "createdAt", type: "date" },
                  { label: "Updated At", field: "updatedAt", type: "date" },
                  {
                    label: "Status",
                    field: "status",
                    type: "boolean",
                    style: {
                      Active:
                        "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500",
                      Inactive:
                        "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500",
                    },
                    onClick: (category) => openArchiveModal(category),
                  },
                ]}
                data={categories.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  description: cat.description,
                  createdAt: cat.createdAt,
                  updatedAt: cat.updatedAt,
                  status: cat.is_active ? "Active" : "Inactive",
                }))}
                filters={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
                loading={false}
                onCreate={() => toggleModal()}
                onEdit={(item) => toggleModal(item)}
                onDelete={(id) => openDeleteModal(id)}
              />
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
              <div
                id="hs-scroll-inside-body-modal"
                className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center"
              >
                <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-lg p-5 m-4">
                  <div className="flex justify-between items-center pb-3 border-b dark:border-neutral-700">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {editingCategoryId ? "Edit Category" : "Create Category"}
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
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Category Name"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
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
                          required
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

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onCancel={closeDeleteModal}
              onConfirm={deleteCategory}
              message="Are you sure you want to delete this category?"
              confirmText="Delete"
              cancelText="Cancel"
            />

            {/* Archive (Toggle Status) Confirmation Modal */}
            <ConfirmationModal
              isOpen={isArchiveModalOpen}
              onCancel={closeArchiveModal}
              onConfirm={handleCategoryStatus}
              message="Are you sure you want to change the status of this category?"
              confirmText={archiveConfrimText}
              cancelText="Cancel"
            />
          </div>
        </div>
      </div>

      <Alert alerts={alerts} removeAlert={removeAlert} />
    </div>
  );
};

export default CategoryPage;
