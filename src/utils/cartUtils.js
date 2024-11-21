import React from 'react'
import { UserAuth } from '../context/AuthContext'   


const addToCart = async (product, quantity = 1, operation = "add", user) => {
    try {
      if (user) {
        // Handle cart for logged-in users (e.g., call backend API)
        console.log("User is logged in:", user);
  

      } else {
        // Handle cart for guest users (localStorage)
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = currentCart.findIndex(item => item.product_id === product.id);
  
        if (productIndex > -1) {
          // Update existing product quantity
          if (operation === 'add') {
            currentCart[productIndex].quantity += quantity;
          } else if (operation === 'minus') {
            currentCart[productIndex].quantity -= quantity;
            // Remove item if quantity is zero or less
            if (currentCart[productIndex].quantity <= 0) {
              currentCart.splice(productIndex, 1);
            }
          }
        } else if (operation === 'add') {
          // Add new product to the cart
          currentCart.push({ product_id: product.id, quantity });
        }
  
        // Update the cart in localStorage
        localStorage.setItem('cart', JSON.stringify(currentCart));
        console.log('Updated cart in localStorage:', currentCart);
      }
    } catch (error) {
      console.error('Error handling cart:', error);
    }
  };



module.exports = { addToCart }