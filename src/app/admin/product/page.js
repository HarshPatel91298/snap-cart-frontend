"use client";

import React, { useEffect, useState, useCallback } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";
import { UserAuth } from "@/context/AuthContext";
import { useDropzone } from "react-dropzone";
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { storage } from "../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";


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
      brand_id
      category_id
      sub_category_id
      display_image
      images
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
        brand_id
        category_id
        sub_category_id
        display_image
        images
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
        brand_id
        category_id
        sub_category_id
        display_image
        images
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

const GET_BRANDS_CATEGORIES_SUBCATEGORIES = gql`
  query BrandsCategoriesSubCategories {
    brands {
      id
      name
    }
    categories {
      id
      name
    }
    subCategories {
      id
      name
      category_id
    }
  }
`;



const MUTATION_ADD_ATTACHMENT = gql`
    mutation addAttachment($attachmentInput: NewAttachmentInput!) {
        addAttachment(attachmentInput: $attachmentInput) {
            status
            data {
                id
                name
                url
                type
                created_at
                updated_at
            }
            message
        }
    }
`;

const QUERY_GET_ATTACHMENT_BY_ID = gql`
query AttachmentById($attachmentByIdId: ID!) {
  attachmentById(id: $attachmentByIdId) {
    status
    message
    data {
      id
      name
      url
      type
      created_at
      updated_at
    }
  }
}
`;


// Image store format
// {
//   file: { name: "image.jpg", type: "image/jpeg" },
//   url: "https://example.com/image.jpg",
//   isUploaded: true,
//   isDisplayImage: true,
//   attachmentId: "1234567890"
// }


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
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const { user } = UserAuth();


  // State to update the product images to be deleted
  const [deletedImages, setDeletedImages] = useState([]); // Helps update the deleted images

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productData = await fetchGraphQLData(GET_PRODUCTS);
      const data = await fetchGraphQLData(GET_BRANDS_CATEGORIES_SUBCATEGORIES);

      setProducts(productData.products || []);
      setBrands(data.brands || []);
      setCategories(data.categories || []);
      setSubCategories(data.subCategories || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // On Edit, set the image data for display image and other images
  const setProductImages = async (product) => {

    if (!product.display_image || !product.images) {
      return;
    }
    const displayImage = await getAttachmentById(product.display_image);
    console.log("displayImage DDDD", displayImage);
    setDisplayImage({
      file: { name: displayImage.name, type: displayImage.type },
      url: displayImage.url,
      isUploaded: true,
      attachmentId: displayImage.id,
    });

    const images = await Promise.all(product.images.map((imageId) => getAttachmentById(imageId)));
    // Set the images with display image at the first index
    setImageIds(images.map((image) => (
      { file: { name: image.name, type: image.type, attachmentId: image.id }, url: image.url, isUploaded: true, attachmentId: image.id }
    )));
  };

  const openModal = async (product = null) => {
    if (product) {

      console.log("product $$$$$", product);

      setEditingProduct(product);
      await setProductImages(product);

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
    // Reset the file upload state
    setFiles([]);
    setDisplayImage(null);
    setImageIds([]);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Validation function
  const validateFields = (currentProduct) => {
    const errors = {};

    if (!currentProduct.name || currentProduct.name.trim() === "") {
      errors.name = "Product name is required.";
    }

    if (!currentProduct.description || currentProduct.description.trim() === "") {
      errors.description = "Description is required.";
    }

    if (!currentProduct.price || currentProduct.price <= 0) {
      errors.price = "Price must be greater than zero.";
    }

    if (currentProduct.stock < 0) {
      errors.stock = "Stock cannot be negative.";
    }

    if (!currentProduct.sku || currentProduct.sku.trim() === "") {
      errors.sku = "SKU is required.";
    }

    if (!currentProduct.brand_id) {
      errors.brand_id = "Please select a brand.";
    }

    if (!currentProduct.category_id) {
      errors.category_id = "Please select a category.";
    }

    if (!currentProduct.sub_category_id) {
      errors.sub_category_id = "Please select a sub-category.";
    }

    // Add other validations as needed for images, etc.
    if (editingProduct) {
    if (!imageIds.length && deletedImages.length >= 0 && !files.length) {
        errors.images = "Please upload at least one image.";
    }
  } else {
    if (!files.length) {
      errors.images = "Please upload at least one image.";
    }
  }

    if (!displayImage) {
      errors.images = "Please select a display image.";
    }

    return errors;
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();


    const errors = validateFields(editingProduct ? editingProduct : newProduct);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    } else {
      setErrors({});
    }



    const mutation = editingProduct ? UPDATE_PRODUCT : ADD_PRODUCT;

    const attachmentData = await uploadFiles(); // Upload images to storage and save to MongoDB
    console.log("attachmentData", attachmentData);


    await deleteFirebaseImages(); // Delete images from storage

    console.log("displayImage RRRR", displayImage);

    // Convert stock and price to float
    const productData = editingProduct
      ? {
        ...editingProduct, stock: parseFloat(editingProduct.stock), price: parseFloat(editingProduct.price),
        display_image: displayImage.attachmentId || attachmentData.find((attachment) => attachment.name === displayImage.file.name)?.id || "",
        images: [...imageIds.map((image) => image.attachmentId), ...attachmentData.map((attachment) => attachment.id)]
      }
      : {
        ...newProduct, stock: parseFloat(newProduct.stock), price: parseFloat(newProduct.price),
        display_image: attachmentData.find((attachment) => attachment.name === displayImage.file.name)?.id || "",
        images: attachmentData.map((attachment) => attachment.id),

      };

    if (editingProduct) {
      delete productData.id;
      delete productData.created_at;
      delete productData.updated_at;
    }

    const variables = editingProduct
      ? { updateProductId: editingProduct.id, productData }
      : { newProduct: productData };

    try {
      const response = await fetchGraphQLData(mutation, variables);
      const updatedProduct = (response.addProduct && response.addProduct.data) ||
        (response.updateProduct && response.updateProduct.data) || {};

      // Update the product to the state
      if (editingProduct) {
        const stateProducts = products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );

        setProducts(stateProducts);
      } else {
        setProducts([...products, updatedProduct]);
      }
      // const stateProducts = products.map((product) =>
      //   product.id === updatedProduct.id ? updatedProduct : product
      // );


      //


      // console.log("stateProducts %%%%%%", stateProducts);

      // setProducts(stateProducts);


      setDeletedImages([]); // Reset the deleted images
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };


  const handleDeleteProduct = async (id) => {
    try {
      await fetchGraphQLData(DELETE_PRODUCT, { deleteProductId: id });
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleProductStatus = async (id) => {
    try {
      const response = await fetchGraphQLData(TOGGLE_PRODUCT_STATUS, { toggleProductStatusByIdId: id });
      if (response.toggleProductStatusById.status === false) {
        console.error("Error toggling product status:", response.toggleProductStatusById.message);
        return;
      }

      const updatedProduct = response.toggleProductStatusById.data;
      const stateProducts = products.map((product) => {
        if (product.id === updatedProduct.id) {
          product.is_active = updatedProduct.is_active;
        }
        return product;
      })

      setProducts(stateProducts);



      
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const getBrandName = (id) => brands.find((brand) => brand.id === id)?.name || "Unknown";
  const getCategoryName = (id) => categories.find((category) => category.id === id)?.name || "Unknown";
  const getSubCategoryName = (id) => subCategories.find((subCategory) => subCategory.id === id)?.name || "Unknown";
  const getSubCategoriesByCategoryId = (categoryId) => subCategories.filter((subCategory) => subCategory.category_id === categoryId);



  // File Upload code
  const [files, setFiles] = useState([]);
  const [displayImage, setDisplayImage] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


  const onDrop = useCallback((acceptedFiles) => {
    console.log("acceptedFiles @@@@@@", acceptedFiles);

    // Check for duplicates (files already present in either `files` or `imageIds`)
    const isDuplicate = acceptedFiles.some((file) =>
      files.some((f) => f.file.name === file.name) || imageIds.some((image) => image.file.name === file.name)
    );

    console.log("isDuplicate", isDuplicate);

    // Filter out duplicates and map the new files
    const newFiles = acceptedFiles.filter((file) => {
      return !files.some((f) => f.file.name === file.name) && !imageIds.some((image) => image.file.name === file.name);
    }).map((file) => ({
      file,
      name: file.name,
      size: file.size,
      progress: 0,
    }));

    console.log("newFiles", newFiles);

    // If no new files, return
    if (newFiles.length === 0) {
      return;
    }

    // Add new files to the state
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

  }, [files, imageIds]);  // Depend on files and imageIds to re-run the callback when they change


  const uploadFiles = async () => {
    const attachmentData = []; // Store the uploaded image data of MongoDB

    // Loop over files with for...of to ensure each upload completes before continuing
    for (const file of files) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file.file);

      // Wait for the upload process to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file.name === file.file.name ? { ...f, progress } : f
              )
            );
          },
          (error) => {
            console.error("Upload error: ", error);
            reject(error); // Reject promise in case of an error
          },
          async () => {
            try {
              const url = await getDownloadURL(storageRef);
              const fileType = file.file.type;
              const imageName = file.file.name;

              const variables = {
                attachmentInput: {
                  name: imageName,
                  url: url,
                  type: fileType,
                },
              };

              const response = await fetchGraphQLData(MUTATION_ADD_ATTACHMENT, variables);
              if (response.addAttachment && response.addAttachment.status === true) {
                // Save the uploaded image data to MongoDB
                attachmentData.push(response.addAttachment.data);

                setImageIds((prevIds) => [
                  ...prevIds,
                  {
                    file: { name: imageName, type: fileType },
                    url: url,
                    isUploaded: true,
                    attachmentId: response.addAttachment.data.id
                  },
                ]);
                // Remove the uploaded file from the list
                setFiles((prevFiles) => prevFiles.filter((f) => f.file.name !== file.file.name));
              } else {
                // Delete the uploaded file from storage if the attachment was not saved
                const storageRef = ref(storage, `images/${file.name}`);
                deleteObject(storageRef).then(() => {
                  console.log("File deleted from storage");
                }).catch((error) => {
                  console.error("Error deleting file from storage: ", error);
                });
              }
              resolve(); // Resolve the promise after the upload task finishes successfully
            } catch (err) {
              console.error("Error saving attachment:", err);
              reject(err); // Reject promise in case of an error
            }
          }
        );
      });
    }

    // Return attachmentData after all files are uploaded
    return attachmentData;
  };


  // Make sure user won't able to uplaod already uploaded images
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  // Remove image from the list and local storage
  const handleRemove = (fileToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.file.name !== fileToRemove.file.name);
      if (displayImage && displayImage.file.name === fileToRemove.file.name) {
        setDisplayImage(null);
      }
      return updatedFiles;
    });
  };

  // Remove image imageIds a
  const handleDeleteImage = (previewImage) => {
    setDeletedImages((prevImages) => [...prevImages, previewImage]);
    // setFiles((prevFiles) => prevFiles.filter((file) => file.file.name !== fileToRemove.file.name));

    // Remove Image from ImageIds
    setImageIds((prevImagesIds) =>
      prevImagesIds.filter(
        (imageId) => imageId.attachmentId !== previewImage.attachmentId
      )
    );
    if (displayImage && displayImage.attachmentId === previewImage.attachmentId) {
      setDisplayImage(null);
    }
  };

  // Remove image from storage
  const deleteFirebaseImages = async () => {
    deletedImages.forEach(async (image) => {
      const storageRef = ref(storage, `images/${image.file.name}`);
      deleteObject(storageRef).then(() => {
        console.log("Image deleted from storage");
      }).catch((error) => {
        console.error("Error deleting image from storage: ", error);
      });
    }
    );
  }


  // Get attachment data by ID
  const getAttachmentById = async (id) => {
    try {
      const response = await fetchGraphQLData(QUERY_GET_ATTACHMENT_BY_ID, { attachmentByIdId: id });
      return response.attachmentById.data;
    } catch (error) {
      console.error("Error fetching attachment by ID:", error);
    }
  };

  const openPreview = (file) => {
    setPreviewImage(file);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleSetDisplayImage = (file) => {
    setDisplayImage({
      file: { name: file.file.name, type: file.file.type },
      url: file.url || URL.createObjectURL(file.file),
      isUploaded: file.isUploaded,
      attachmentId: file.attachmentId,
    });
  };

  const allImages = [
    ...imageIds.map((image) => ({
      ...image,
      isDisplayImage: displayImage && image.file.name === displayImage.file.name,
    })),
    ...files.map((file) => ({
      file: { name: file.name, type: file.type },
      url: URL.createObjectURL(file.file),
      isUploaded: false,
      attachmentById: null,
      isDisplayImage: displayImage && file.name === displayImage.file.name,
    })),
  ];


  return (
    <>
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
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
                      <th className="px-6 py-3 text-left">Brand</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Sub Category</th>
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
                          <td className="px-6 py-4">{getBrandName(product.brand_id)}</td>
                          <td className="px-6 py-4">{getCategoryName(product.category_id)}</td>
                          <td className="px-6 py-4">{getSubCategoryName(product.sub_category_id)}</td>
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
                              className={`${product.is_active
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
        <>

          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-lg p-6 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '80vh', overflowY: 'auto', maxWidth: '50vw' }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleCreateOrUpdateProduct}>
                {/* Product Name */}
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
                  {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
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
                  {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                </div>

                {/* Price */}
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
                  {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                </div>
                

                {/* Stock */}
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
                  {errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}
                </div>

                {/* SKU */}
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
                  {errors.sku && <span className="text-red-500 text-sm">{errors.sku}</span>}
                </div>

                {/* Brand */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select
                    name="brand_id"
                    value={editingProduct ? editingProduct.brand_id : newProduct.brand_id}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                {errors.brand_id && <span className="text-red-500 text-sm">{errors.brand_id}</span>}
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category_id"
                    value={editingProduct ? editingProduct.category_id : newProduct.category_id}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                {errors.category_id && <span className="text-red-500 text-sm">{errors.category_id}</span>}
                </div>

                {/* Sub Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Sub Category</label>
                  <select
                    name="sub_category_id"
                    value={editingProduct ? editingProduct.sub_category_id : newProduct.sub_category_id}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategoriesByCategoryId(newProduct.category_id).map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                {errors.sub_category_id && <span className="text-red-500 text-sm">{errors.sub_category_id}</span>}
                </div>

                {/* File Upload Section */}
                <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg shadow-md">
                  <label className="font-medium text-lg text-gray-800 dark:text-white">Product Images</label>
                  <div
                    {...getRootProps({
                      className:
                        "cursor-pointer p-12 flex justify-center items-center bg-white border border-dashed border-gray-300 rounded-xl transition hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-700",
                    })}
                  >
                    <input {...getInputProps()} />
                    <div className="text-center">
                      <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">
                        Pick a file up to 2MB.
                      </p>
                      {errors.images && <span className="text-red-500 text-sm mt-3">{errors.images}</span>}
                    </div>
                    
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {allImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative p-3 border border-solid rounded-xl ${displayImage && displayImage.file.name === image.file.name
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600"
                          }`}
                      >
                        <span
                          className="flex justify-center items-center border border-gray-200 rounded-lg dark:border-neutral-700 cursor-pointer"
                          onClick={() => openPreview(image)}
                        >
                          <img
                            className="w-16 h-16 object-cover rounded-lg"
                            src={image.url}
                            alt={image.file.name}
                          />
                        </span>
                        {!image.isUploaded && (
                          <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => handleRemove(image)}
                          >
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                          </button>
                        )}

                        {/* Badge for selected image */}
                        {displayImage && displayImage.file.name === image.file.name && (
                          <span className="absolute top-2 left-2 px-2 py-1 text-xs text-white bg-blue-500 rounded-full">
                            Display
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Image Preview Image Modal */}
                  {isPreviewOpen && previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                      <div className="relative p-6 bg-white rounded-lg shadow-lg">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                          onClick={closePreview}
                        >
                          <XIcon className="w-6 h-6" />
                        </button>
                        <img
                          src={previewImage.url}
                          alt={previewImage.file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            handleSetDisplayImage(previewImage);
                            closePreview();
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Set as Display Image
                        </button>
                        {previewImage.isUploaded && (
                          <button
                            onClick={() => {
                              handleDeleteImage(previewImage);
                              closePreview();
                            }}
                            className="mx-3 mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          > Delete </button>)}
                      </div>
                    </div>
                  )}
                </div>



                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}