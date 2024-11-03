'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../../../context/AuthContext';
import { fetchGraphQLData } from '../../../../lib/graphqlClient';

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
      stock
      sku
      is_active
    }
  }
`;

export default function ProductPage({ params }) {
  const { user } = UserAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch product data by ID
  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = params.product_id;
        const data = await fetchGraphQLData(GET_PRODUCT_BY_ID_QUERY, { id: productId });  
        if (data && data.product) {


          // Add display_image
          if (data.product.display_image) {
            data.product.images.push(data.product.display_image);
          }


          console.log("Product data: ", data.product);
          setProduct(data.product);
          setSelectedImage(data.product.display_image || ''); // Set default if display_image is missing
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    if (params.product_id) {
      fetchProduct();
    }
  }, [params, user]);

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
            loading="lazy" // Lazy load for display image
            onError={(e) => { e.target.src = 'default-image.jpg'; }} // Fallback for missing image
          />
          <div className="flex mt-4 space-x-2">
            {product.images.map((image, index) => (

              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500"
                loading="lazy" // Lazy load for gallery images
                onClick={() => setSelectedImage(image)}
                onError={(e) => { e.target.src = 'default-image.jpg'; }} // Fallback for each image
              />
            ))}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-800 mt-2">${product.price}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">&#9733; &#9733; &#9733; &#9733; &#9734;</span> {/* Placeholder rating */}
          </div>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Color Display */}
          <div className="mt-6">
            <p className="text-gray-600"><strong>Color:</strong> {product.color}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Add to Bag
            </button>
            <button className="border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200">
              &#9825; {/* Placeholder for "Add to Wishlist" */}
            </button>
          </div>

          {/* Accordion Sections */}
          <div className="mt-8 space-y-2">
            {["Features", "Care", "Shipping", "Returns"].map((section, index) => (
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
