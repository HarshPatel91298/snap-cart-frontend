"use client";
import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

// GraphQL Queries and Mutations
const GET_BRANDS = gql`
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
`;

const CREATE_BRAND = gql`
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
`;

const UPDATE_BRAND = gql`
  mutation UpdateBrand($id: ID!, $brandData: UpdateBrandInput!) {
    updateBrand(id: $id, brandData: $brandData) {
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
`;

const DELETE_BRAND = gql`
  mutation DeleteBrandById($id: ID!) {
    deleteBrandById(id: $id) {
      status
      message
    }
  }
`;

const TOGGLE_BRAND_STATUS = gql`
  mutation ToggleBrandStatusById($id: ID!) {
    toggleBrandStatusById(id: $id) {
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

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBrandId, setDeleteBrandId] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandLogoURL, setBrandLogoURL] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLData(GET_BRANDS);
        if (response?.brands) {
          setBrands(response.brands);
        } else {
          setError("Error fetching brands");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const createOrUpdateBrand = async (event) => {
    event.preventDefault();
    const brandInput = {
      name: brandName,
      description: brandDescription,
      logoURL: brandLogoURL,
    };

    try {
      const response = editingBrandId
        ? await fetchGraphQLData(UPDATE_BRAND, {
            id: editingBrandId,
            brandData: brandInput,
          })
        : await fetchGraphQLData(CREATE_BRAND, {
            newBrand: brandInput,
          });

      if (response?.createBrand?.status || response?.updateBrand?.status) {
        let updatedBrand;
        if (editingBrandId) {
          updatedBrand = response.updateBrand.data;
          setBrands((prevBrands) =>
            prevBrands.map((brand) =>
              brand.id === editingBrandId
                ? { ...brand, ...updatedBrand }
                : brand
            )
          );
        } else {
          updatedBrand = response.createBrand.data;
          setBrands((prevBrands) => [...prevBrands, updatedBrand]);
        }
        toggleModal();
      } else {
        setError(
          response?.createBrand?.message ||
            response?.updateBrand?.message ||
            "Error saving brand"
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBrand = async () => {
    try {
      const response = await fetchGraphQLData(DELETE_BRAND, {
        id: deleteBrandId,
      });

      if (response?.deleteBrandById?.status) {
        setBrands((prevBrands) =>
          prevBrands.filter((brand) => brand.id !== deleteBrandId)
        );
        closeDeleteModal();
      } else {
        setError("Error deleting brand");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleBrandStatus = async (brandId) => {
    try {
      const response = await fetchGraphQLData(TOGGLE_BRAND_STATUS, {
        id: brandId,
      });

      if (response?.toggleBrandStatusById?.status) {
        const updatedBrand = response.toggleBrandStatusById.data;
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.id === brandId
              ? { ...brand, is_active: updatedBrand.is_active }
              : brand
          )
        );
      } else {
        setError("Error toggling brand status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleModal = (brand = null) => {
    setIsModalOpen(!isModalOpen);
    if (brand) {
      setEditingBrandId(brand.id);
      setBrandName(brand.name);
      setBrandDescription(brand.description);
      setBrandLogoURL(brand.logoURL);
    } else {
      setEditingBrandId(null);
      setBrandName("");
      setBrandDescription("");
      setBrandLogoURL("");
    }
  };

  const openDeleteModal = (brandId) => {
    setDeleteBrandId(brandId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteBrandId(null);
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
                    Brands
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Manage your brands here.
                  </p>
                </div>
                <div className="inline-flex gap-x-2">
                  <button
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    onClick={toggleModal}
                  >
                    Create Brand
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
                            {editingBrandId ? "Edit Brand" : "Create Brand"}
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
                          {/* Create/Edit Brand Form */}
                          <form
                            className="space-y-4"
                            onSubmit={createOrUpdateBrand}
                          >
                            <div className="max-w-sm">
                              <label
                                htmlFor="brand-name"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                id="brand-name"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Brand Name"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="max-w-sm">
                              <label
                                htmlFor="brand-description"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="brand-description"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Brand Description"
                                value={brandDescription}
                                onChange={(e) =>
                                  setBrandDescription(e.target.value)
                                }
                              />
                            </div>
                            <div className="max-w-sm">
                              <label
                                htmlFor="brand-logo-url"
                                className="block text-sm font-medium mb-2 dark:text-white"
                              >
                                Logo URL
                              </label>
                              <input
                                type="text"
                                id="brand-logo-url"
                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Logo URL"
                                value={brandLogoURL}
                                onChange={(e) =>
                                  setBrandLogoURL(e.target.value)
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
                                {editingBrandId ? "Update" : "Create"}
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
                        Logo
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
                    {brands.map((brand) => (
                      <tr key={brand.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {brand.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {brand.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {brand.logoURL ? (
                            <img
                              src={brand.logoURL}
                              alt={brand.name}
                              className="h-10 w-10 object-cover rounded-full"
                            />
                          ) : (
                            "No Logo"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(brand.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(brand.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {brand.is_active ? (
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
                            onClick={() => toggleModal(brand)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                            onClick={() => openDeleteModal(brand.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-400 ml-4"
                            onClick={() => toggleBrandStatus(brand.id)}
                          >
                            {brand.is_active ? "Archive" : "Unarchive"}
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
                      Are you sure you want to delete this brand?
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
                        onClick={deleteBrand}
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

export default AdminBrands;
