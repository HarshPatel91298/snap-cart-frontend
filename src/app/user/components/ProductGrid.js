/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { fetchGraphQLData } from "@/lib/graphqlClient";

const ATTACHMENT_BY_ID_QUERY = `
  query AttachmentById($attachmentByIdId: ID!) {
    attachmentById(id: $attachmentByIdId) {
      data {
        url
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      status
      message
      data {
        id
        user_id
        products {
          product_id
          quantity
        }
      }
    }
  }
`;

export default function ProductGrid({ products, userId }) {
  const [productImages, setProductImages] = useState({});
  const [cart, setCart] = useState([]); // Local cart state for demo

  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = {};
      for (const product of products) {
        if (product.display_image) {
          try {
            const response = await fetchGraphQLData(ATTACHMENT_BY_ID_QUERY, {
              attachmentByIdId: product.display_image,
            });
            imageMap[product.id] =
              response?.attachmentById?.data?.url ||
              "https://via.placeholder.com/150";
          } catch (error) {
            console.error("Error fetching image:", error);
            imageMap[product.id] = "https://via.placeholder.com/150";
          }
        } else {
          imageMap[product.id] = "https://via.placeholder.com/150";
        }
      }
      setProductImages(imageMap);
    };

    fetchImages();
  }, [products]);

  const handleAddToCart = async (product) => {
    console.log("Product for Add to Cart:", product); // Debug log

    if (!userId) {
      alert("Please log in to add products to your cart.");
      return;
    }

    try {
      const variables = {
        input: {
          products: {
            product_id: product.id,
            quantity: 1,
          },
          user_id: userId,
        },
      };

      console.log("Add to Cart Variables:", variables);

      const response = await fetchGraphQLData(ADD_TO_CART_MUTATION, variables);
      console.log("Add to Cart Response:", response);

      if (response?.addToCart?.status === "success") {
        setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
        alert(`${product.name} added to your cart.`);
      } else {
        alert(
          `Error: ${response?.addToCart?.message || "Unable to add to cart."}`
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding the product to your cart.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative overflow-hidden rounded-lg h-48">
              <img
                src={
                  productImages[product.id] || "https://via.placeholder.com/150"
                }
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-2">${product.price}</p>
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
