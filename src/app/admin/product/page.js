"use client";

import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";

// GraphQL Queries and Mutations
const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      description
      price
      stock
      sku
      is_active
      created_at
      updated_at
      brand_id
      category_id
      sub_category_id
      display_image
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($newProduct: NewProductInput!) {
    addProduct(newProduct: $newProduct) {
      status
      data {
        id
        name
        description
        price
        stock
        sku
        is_active
      }
      message
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductId: ID!, $productData: UpdateProductInput!) {
    updateProduct(id: $updateProductId, productData: $productData) {
      status
      data {
        id
        name
        description
        price
        stock
        sku
        is_active
      }
      message
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
      status
      message
    }
  }
`;

const TOGGLE_PRODUCT_STATUS = gql`
  mutation ToggleProductStatusById($toggleProductStatusByIdId: ID!) {
    toggleProductStatusById(id: $toggleProductStatusByIdId) {
      status
      data {
        id
        is_active
      }
      message
    }
  }
`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    brand_id: "",
    category_id: "",
    sub_category_id: "",
    display_image: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchGraphQLData(GET_PRODUCTS);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        sku: "",
        brand_id: "",
        category_id: "",
        sub_category_id: "",
        display_image: "",
      });
      setEditingProduct(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    const mutation = editingProduct ? UPDATE_PRODUCT : ADD_PRODUCT;
    const variables = editingProduct
      ? { updateProductId: editingProduct.id, productData: { ...editingProduct } }
      : { newProduct: { ...newProduct } };

    try {
      await fetchGraphQLData(mutation, variables);
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetchGraphQLData(DELETE_PRODUCT, { deleteProductId: id });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleProductStatus = async (id) => {
    try {
      await fetchGraphQLData(TOGGLE_PRODUCT_STATUS, { toggleProductStatusByIdId: id });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
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
                      Products
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Manage your products here.
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
                      Add Product
                    </button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Price</th>
                      <th className="px-6 py-3 text-left">Stock</th>
                      <th className="px-6 py-3 text-left">SKU</th>
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
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4">{product.name}</td>
                          <td className="px-6 py-4">{product.description}</td>
                          <td className="px-6 py-4">{product.price}</td>
                          <td className="px-6 py-4">{product.stock}</td>
                          <td className="px-6 py-4">{product.sku}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.is_active ? (
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
                              onClick={() => openModal(product)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleToggleProductStatus(product.id)}
                              className={`${
                                product.is_active
                                  ? "text-yellow-600 hover:text-yellow-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {product.is_active ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))
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
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleCreateOrUpdateProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct ? editingProduct.name : newProduct.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Product Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={
                    editingProduct
                      ? editingProduct.description
                      : newProduct.description
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct ? editingProduct.price : newProduct.price}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Price"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editingProduct ? editingProduct.stock : newProduct.stock}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="Stock"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={editingProduct ? editingProduct.sku : newProduct.sku}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  placeholder="SKU"
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
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
