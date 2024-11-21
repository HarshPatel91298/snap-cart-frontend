'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../../../context/AuthContext';
import { fetchGraphQLData } from '../../../../lib/graphqlClient';
import { addToCart } from '../../../../utils/cartUtils';

const GET_PRODUCT_BY_ID_QUERY = `
  query getProductById($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      color
      brand_id
      category_id
      sub_category_id
      display_image
      images
      sku
      is_active
    }
  }
`;

const QUERY_GET_ATTACHMENT_BY_ID = `
  query AttachmentById($attachmentByIdId: ID!) {
    attachmentById(id: $attachmentByIdId) {
      data {
        id
        url
      }
    }
  }
`;

export default function ProductPage({ params }) {
  const { user } = UserAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [quantity, setQuantity] = useState(1); // New state for quantity

  // Fetch attachment by ID
  const getAttachmentById = async (id) => {
    try {
      const response = await fetchGraphQLData(QUERY_GET_ATTACHMENT_BY_ID, { attachmentByIdId: id });
      return response?.attachmentById?.data?.url || '';
    } catch (error) {
      console.error('Error fetching attachment by ID:', error);
      return '';
    }
  };

  // Fetch product data by ID
  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = params.product_id;
        const data = await fetchGraphQLData(GET_PRODUCT_BY_ID_QUERY, { id: productId });

        if (data && data.product) {
          const product = data.product;

          // Fetch URLs for all image IDs
          const imageIds = [...(product.images || []), product.display_image].filter(Boolean);
          const imageUrls = await Promise.all(imageIds.map((id) => getAttachmentById(id)));

          setImageUrls(imageUrls);
          setSelectedImage(imageUrls[0] || ''); // Set default image
          setProduct(product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    if (params.product_id) {
      fetchProduct();
    }
  }, [params]);

  // Add product to cart
  const handleAddToCart = async (operation) => {
    await addToCart(product, quantity, operation, user);
  };

  // Increase quantity
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  // Decrease quantity
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Image Gallery */}
        <div className="md:w-1/2">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex mt-4 space-x-2">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product Image ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500"
                loading="lazy"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-800 mt-2">${product.price}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">&#9733; &#9733; &#9733; &#9733; &#9734;</span>
          </div>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Color Display */}
          <div className="mt-6">
            <p className="text-gray-600"><strong>Color:</strong> {product.color}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleAddToCart('add')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add to Bag
            </button>
            <button className="border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200">
              &#9825;
            </button>
          </div>

          {/* Accordion Sections */}
          <div className="mt-8 space-y-2">
            {['Features', 'Care', 'Shipping', 'Returns'].map((section, index) => (
              <div key={index} className="border-t border-gray-200 pt-4">
                <button className="w-full text-left text-gray-800 font-semibold flex justify-between items-center">
                  {section}
                  <span className="text-gray-500">+</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
