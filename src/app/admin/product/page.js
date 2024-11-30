"use client";

import React, { useEffect, useState, useCallback } from "react";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../lib/graphqlClient";
import { UserAuth } from "@/context/AuthContext";
import { useDropzone } from "react-dropzone";
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { storage } from "../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Datatable from '../components/Datatable';
import ConfirmationModal from '../components/ConfirmationModel';
import Alert from '../components/Alert';


// GraphQL Queries and Mutations
const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      description
      price
      cost_price
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
        cost_price
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
        cost_price
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


const MUTATION_DELETE_ATTACHMENT = gql`
  mutation deleteAttachment($deleteAttachmentId: ID!) {
    deleteAttachment(id: $deleteAttachmentId) {
      status
      message
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
    cost_price: 0,
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


  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);


  // Archiv Modal States
  const [archiveConfrimText, setArchiveConfrimText] = useState('');
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveProductId, setArchiveProductId] = useState(null);


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
    console.log("Setting product images", product);

    if (!product.display_image && !product.images) {
      console.log("No images to set");
      return;
    }

    // Fetch the images using their IDs
    const images = await Promise.all(
      product.images.map((imageId) => getAttachmentById(imageId))
    );

    // Format the image data
    const formattedImages = images.map((image) => ({
      file: { name: image.name, type: image.type, attachmentId: image.id },
      url: image.url,
      isUploaded: true,
      attachmentId: image.id,
    }));

    // Set the images
    setImageIds(formattedImages);

    // Find the display image
    const displayImage = formattedImages.find(
      (image) => product.display_image === image.attachmentId
    );

    // Set the display image
    setDisplayImage(displayImage);
  };


  const toggleModal = async (product = null) => {
    if (product) {
      console.log("product $$$$$", product);
      setEditingProduct(product);
      await setProductImages(product);
    } else {
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        cost_price: 0,
        sku: "",
        brand_id: "",
        category_id: "",
        sub_category_id: "",
        display_image: "",
      });
    }
    setIsModalOpen(!isModalOpen);


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

    // Ensure cost_price is a number and is not negative
    if (currentProduct.cost_price && isNaN(currentProduct.cost_price)) {
      errors.cost_price = "Cost price must be a valid number.";
    } else if (parseFloat(currentProduct.cost_price) < 0) {
      errors.cost_price = "Cost price cannot be negative.";
    }

    // Ensure price is a number and greater than zero
    if (currentProduct.price && isNaN(currentProduct.price)) {
      errors.price = "Price must be a valid number.";
    } else if (parseFloat(currentProduct.price) <= 0) {
      errors.price = "Price must be greater than zero.";
    }

    // Ensure cost_price is not greater than price
    if (
      parseFloat(currentProduct.cost_price) > parseFloat(currentProduct.price)
    ) {
      errors.cost_price = "Cost price cannot be greater than the price.";
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
    await deleteFirebaseImages(); // Delete images from storage


    // Convert Cost Price and price to float
    const productData = editingProduct
      ? {
        ...editingProduct, cost_price: parseFloat(editingProduct.cost_price), price: parseFloat(editingProduct.price),
        display_image: displayImage.attachmentId || attachmentData.find((attachment) => attachment.name === displayImage.file.name)?.id || "",
        images: [...imageIds.map((image) => image.attachmentId), ...attachmentData.map((attachment) => attachment.id)]
      }
      : {
        ...newProduct, cost_price: parseFloat(newProduct.cost_price), price: parseFloat(newProduct.price),
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

      setDeletedImages([]); // Reset the deleted images
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };


  const handleDeleteProduct = async () => {
    try {
      const response = await fetchGraphQLData(DELETE_PRODUCT, { deleteProductId: deleteProductId });

      if (response.deleteProduct.status === true) {

        // Delete the product from the state
        const stateProducts = products.filter((product) => product.id !== deleteProductId);
        setProducts(stateProducts);
      } else {
        console.error("Error deleting product:", response.deleteProduct.message);
      }
      // Close the modal
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleProductStatus = async () => {
    console.log("archiveProductId", archiveProductId);
    try {
      const response = await fetchGraphQLData(TOGGLE_PRODUCT_STATUS, { toggleProductStatusByIdId: archiveProductId });
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

      // Close the modal
      toggleArchiveModal();

    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const getBrandName = (id) => brands.find((brand) => brand.id === id)?.name || "Unknown";
  const getCategoryName = (id) => categories.find((category) => category.id === id)?.name || "Unknown";
  const getSubCategoryName = (id) => subCategories.find((subCategory) => subCategory.id === id)?.name || "Unknown";
  const getSubCategoriesByCategoryId = (categoryId) => {

    return subCategories.filter((subCategory) => subCategory.category_id === categoryId);
  };



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
      deleteObject(storageRef).then(async () => {
        console.log("Image deleted from storage");

        await deleteAttachmentById(image.attachmentId);
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


  const deleteAttachmentById = async (attachmentId) => {
    console.log("Deleting attachment with ID:", attachmentId);
    try {
      const response = await fetchGraphQLData(MUTATION_DELETE_ATTACHMENT, { deleteAttachmentId: attachmentId });
      if (response.deleteAttachment.status === true) {
        console.log("Attachment deleted successfully");
      } else {
        console.error("Error deleting attachment:", response.deleteAttachment.message);
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
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

  const toggleDeleteModal = async (product = null) => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
    if (product) {
      setDeleteProductId(product);
    } else {
      setDeleteProductId(null);
    }
  }

  // const openDeleteModal = (product) => {
  //     setDeleteProductId(product.id);
  //     setIsDeleteModalOpen(true);
  // }

  // const closeDeleteModal = () => {
  //     setIsDeleteModalOpen(false);
  //     setDeleteProductId(null);
  // }

  const toggleArchiveModal = async (product = null) => {
    setIsArchiveModalOpen(!isArchiveModalOpen);
    if (product) {
      setArchiveProductId(product.id);
    } else {
      setArchiveProductId(null);
    }
  }

  const openArchiveModal = (product) => {
    setArchiveConfrimText(product.status == "Inactive" ? 'Active' : 'Inactive');
    setArchiveProductId(product.id);
    setIsArchiveModalOpen(true);
  }

  const closeArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setArchiveProductId(null);
    setArchiveConfrimText(null);
  }


  return (
    <>


      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col" >

          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">

              <Datatable

                title="Products"
                description="List of all products"
                columns={[
                  { label: "Name", field: "name", type: "text" },
                  { label: "Description", field: "description", type: "text" },
                  { label: "Brand", field: "brand_id", type: "text", formatter: (brand_id) => getBrandName(brand_id) },
                  { label: "Category", field: "category_id", type: "text", formatter: (category_id) => getCategoryName(category_id) },
                  { label: "Sub Category", field: "sub_category_id", type: "text", formatter: (sub_category_id) => getSubCategoryName(sub_category_id) },
                  { label: "Price", field: "price", type: "amount" },
                  { label: "Cost Price", field: "cost_price", type: "amount" },
                  { label: "SKU", field: "sku", type: "text" },
                  {
                    label: "Status", field: "is_active", type: "boolean",
                    style: {
                      'Active': 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500',
                      'Inactive': 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500'
                    },
                    onClick: (product) => toggleArchiveModal(product),

                  },
                ]}
                data={products.map((product) => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  brand_id: product.brand_id,
                  category_id: product.category_id,
                  sub_category_id: product.sub_category_id,
                  display_image: product.display_image,
                  images: product.images,
                  price: product.price,
                  cost_price: product.cost_price,
                  sku: product.sku,
                  is_active: product.is_active,
                }))}
                filters={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                loading={false}
                onCreate={() => toggleModal()}
                onEdit={(product) => toggleModal(product)}
                onDelete={(product) => toggleDeleteModal(product)}
              />


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

                {/* Cost Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Cost Price</label>
                  <input
                    type="text"
                    name="cost_price"
                    value={editingProduct ? editingProduct.cost_price : newProduct.cost_price}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                    placeholder="Cost Price"
                  />
                  {errors.cost_price && <span className="text-red-500 text-sm">{errors.cost_price}</span>}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
                    placeholder="Price"
                  />
                  {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
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
                    value={editingProduct?.brand_id || newProduct?.brand_id || ""}
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
                    {getSubCategoriesByCategoryId(editingProduct ? editingProduct.category_id : newProduct.category_id).map((subCategory) => (
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={toggleDeleteModal}
        onConfirm={handleDeleteProduct}
        message="Are you sure you want to delete this product?"
        confirmText="Delete"    // Optional
        cancelText="Cancel"    // Optional
      />

      {/* Archive Confirmation Modal*/}
      <ConfirmationModal
        isOpen={isArchiveModalOpen}
        onCancel={toggleArchiveModal}
        onConfirm={handleToggleProductStatus}
        message="Are you sure you want to archive this product?"
        confirmText={archiveConfrimText}   // Optional
        cancelText="Cancel"    // Optional
      />

    </>
  );
}