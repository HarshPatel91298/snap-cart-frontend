import React, { createContext, useState, useEffect, use } from 'react';
import { UserAuth } from "@/context/AuthContext";
import { fetchGraphQLData } from "@/lib/graphqlClient";
import { gql } from 'graphql-request';
// Create CartContext
const CartContext = createContext();


// GraphQL Queries
const QUERY_GET_PRODUCT = gql`
  query Query($product_id: ID!) {
    products(id: $product_id) {
      id
      name
      description
      price
      color
      brand_id
      category_id
      sub_category_id
      display_image
    }
  }
`;

const QUERY_GET_ATTACHMENT_BY_ID = gql`
  query AttachmentById($attachmentByIdId: ID!) {
    attachmentById(id: $attachmentByIdId) {
      data {
        url
      }
    }
  }
`;

const QUERY_GET_CART = gql`
  query Cart{
    cart {
      message
    status
    data {
      id
      user_id
      products {
        product_id
        quantity
        product {
          id
          name
          description
          cost_price
          price
          color
          brand_id
          category_id
          sub_category_id
          display_image
          images
          sku
          is_active
          created_at
          updated_at
        }
        price
      }
      sub_total
      discount
      tax
      total_price
      coupon_id
      is_active
      created_at
      updated_at
    }
    }
}
`;


const MUTATION_CREATE_CART = `
  mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    data {
      products {
        product_id
        quantity
        product {
          name
          description
          cost_price
          price
          color
          brand_id
          category_id
          sub_category_id
          display_image
          images
          sku
          is_active
          created_at
          updated_at
        }
      }
      user_id
      updated_at
      total_price
      id
      created_at
    }
  }
}
`;



const MUTATION_REDUCE_QUANTITY = `
  mutation ReduceCartItemQuantity($userId: ID!, $productId: ID!, $quantity: Int!) {
  reduceCartItemQuantity(user_id: $userId, product_id: $productId, quantity: $quantity) {
    status
    message
    data {
      id
      user_id
      products {
        product_id
        quantity
        product {
          name
        }
        price
      }
      total_price
      is_active
      created_at
      updated_at
    }
  }
}
`;

const MUTATION_REMOVE_ITEM = `
    mutation Mutation($userId: ID!, $productId: ID!) {
    removeCartItem(user_id: $userId, product_id: $productId) {
        status
        message
    }
}
`;




// CartProvider component
const CartProvider = ({ children }) => {
    const { user, claims, redirectURL, setRedirectURL } = UserAuth();
    const [cartProducts, setCartProducts] = useState([]);
    const [cart, setCart] = useState(null);
    const [cart_id, setCartId] = useState(null);

    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [cartloading, setCartLoading] = useState(true);

    const [cartItemCounter, setCartItemCounter] = useState(0);

    // Checkout Page Data
    const [selectedAddressID, setSelectedAddressID] = useState(null);


    // Fetch cart data on component mount
    useEffect(() => {
        const cartLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
        if (claims && claims.db_id) {

            (cartLocalStorage && cartLocalStorage.length > 0) ? createNewCart() : fetchCartData();
          } else {
            // If user is not logged in, fetch cart from localStorage
            setCart(cartLocalStorage);
            fetchProducts(cartLocalStorage);
          }
    }, [claims?.db_id]);


    // Update cart summary when cart products change
    useEffect(() => {
        console.log('Cart products:', cartProducts);
        setOrderSummary();

        const count = cartProducts.reduce((acc, item) => acc + item.quantity, 0);
        console.log('Cart item count:', count);
        setCartItemCounter(count);
    }, [cartProducts]);



    // Fetch product details and their images
    const fetchProducts = async (products) => {
        try {
            const fetchedProducts = await Promise.all(
                products.map(async (product) => {
                    const productData = await fetchGraphQLData(QUERY_GET_PRODUCT, { product_id: product.product_id });
                    if (productData?.products?.length > 0) {
                        const productDetails = productData.products[0];
                        const imageResponse = await fetchGraphQLData(QUERY_GET_ATTACHMENT_BY_ID, {
                            attachmentByIdId: productDetails.display_image,
                        });
                        productDetails.display_image_url = imageResponse?.attachmentById?.data?.url || '/placeholder-image.png';
                        productDetails.quantity = product.quantity;
                        return productDetails;
                    }
                    return null;
                })
            );

            console.log('Fetched products:', fetchedProducts);
            setCartProducts(fetchedProducts.filter((item) => item !== null));
            setCartLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setCartLoading(false);
        }
    };

    // Fetch cart data from API if user is logged in
    const fetchCartData = async () => {
        try {

            const db_user_id = claims.db_id;
            const response = await fetchGraphQLData(QUERY_GET_CART);
            console.log('Response from fetchCartData:', response);

            if (response?.cart && response.cart.data) {
                const cartData = response.cart.data;
                setCartId(cartData.id);
                setCart([
                    ...cartData.products.map((product) => ({
                        product_id: product.product_id,
                        quantity: product.quantity,
                    })),
                ]);
                await fetchProducts(cartData.products);
                await setOrderSummary();
                
                
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
        setCartLoading(false);
    };

    // Calculate Order Summary
    const calculateOrderSummary = () => {
        const subtotal = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * 0.13; // Example tax: 13%
        const total = subtotal + tax;

        return { subtotal, tax, total };
    };

    // Set Order Summary
    const setOrderSummary = async () => {
        const { subtotal, tax, total } = calculateOrderSummary();
        setSubTotal(subtotal);
        setTax(tax);
        setTotal(total);
    };
    

    

// ################ METHODS FOR ADDING, REMOVING, AND UPDATING CART ITEMS ################
    


    const createNewCart = async () => {
        try {
            // Get the current cart from localStorage, or initialize it as an empty array

            console.log(" ########## Calling createNewCart #########");
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log('Current cart:', currentCart);

            // Add items to the cart in the database for the logged-in user
            if (currentCart.length > 0) {
                await addToCart(currentCart);
                // Clear the cart in localStorage after adding items to the database
                localStorage.removeItem('cart');
            }
        } catch (error) {
            console.error('Error creating new cart:', error);
        }
    };



    // ##################### Add products to the cart ###################

    const addToCart = async (products) => {
        try {
            console.log("ADDING TO CART");
            
            if (user && claims && claims.db_id) {
                // Handle cart for logged-in users (e.g., call backend API)
                addToCartDatabase(products);
            } else {
                // Handle cart for guest users (localStorage)
                addToCartLocalStorage(products);
            }
        } catch (error) {
            console.error('Error handling add to cart:', error);
        }
    };

    // producst format: [{product_id: 1, quantity: 2}, {product_id: 2, quantity: 3}]
    // localStorage format: [{product_id: 1, quantity: 2}, {product_id: 2, quantity: 3}]

    const addToCartLocalStorage = (products) => {
        try {
            console.log("Products:", products);
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            // Process each product in the provided products array
            products.forEach(product => {
                const productIndex = currentCart.findIndex(item => item.product_id === product.product_id);

                if (productIndex > -1) {
                    // Update existing product quantity
                    currentCart[productIndex].quantity += product.quantity;
                } else {
                    // Add new product to the cart
                    currentCart.push({ product_id: product.product_id, quantity: product.quantity });
                }
            });

            // Update the cart in localStorage
            localStorage.setItem('cart', JSON.stringify(currentCart));
            console.log('Updated cart in localStorage:', currentCart);
        } catch (error) {
            console.error('Error handling add to cart:', error);
        }
    };


    const addToCartDatabase = async (products) => {
        // Handle cart for logged-in users (e.g., call backend API)
        try {

            const input = {
                user_id: claims.db_id,
                products: products
            };

            console.log('Adding products to the cart:', input);
            const data = await fetchGraphQLData(MUTATION_CREATE_CART, { input });
            console.log('Response from addToCart mutation:', data);
        }
        catch (error) {
            console.error('Error handling add to cart:', error);
        }
    }

    // ##################### Remove products from the cart ###################


    // Remove products from the cart 
    const reduceQty = async (product_id, quantity) => {
        try {
            if (claims && claims.db_id) {
                // Handle cart for logged-in users (e.g., call backend API)
                reduceQtyFromDatabase(product_id, quantity);
            } else {
                // Handle cart for guest users (localStorage)
                reduceQtyFromLocalStorage(product_id, quantity);
            }
        } catch (error) {
            console.error('Error handling remove from cart:', error);
        }
    };

    const reduceQtyFromLocalStorage = (product_id, quantity) => {
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

            // Process each product in the productsToRemove array

            const productIndex = currentCart.findIndex(item => item.product_id === product_id);

            if (productIndex > -1) {
                const currentProduct = currentCart[productIndex];

                // Reduce the quantity of the product by the specified amount
                if (currentProduct.quantity > quantity) {
                    currentProduct.quantity -= quantity;
                } else {
                    // If the quantity to remove is greater than or equal to the current quantity, remove the product from the cart
                    currentCart.splice(productIndex, 1);
                }
            }


            // Update the cart in localStorage
            localStorage.setItem('cart', JSON.stringify(currentCart));
            console.log('Updated cart in localStorage after quantity removal:', currentCart);
        } catch (error) {
            console.error('Error handling remove from cart:', error);
        }
    };



    const reduceQtyFromDatabase = async (product_id, quantity) => {
        try {

            const input = {
                userId: claims.db_id,
                productId: product_id,
                quantity: quantity
            };

            console.log('Removing product from the cart:', input);
            const data = await fetchGraphQLData(MUTATION_REDUCE_QUANTITY, input);
            console.log('Response from reduceCartItemQuantity mutation:', data);


        } catch (error) {
            console.error('Error handling remove from cart:', error);
        }
    };

    const deleteItemFromCart = async (product_id) => {
        try {
            if (claims && claims.db_id) {
                // Handle cart for logged-in users (e.g., call backend API)
                // You can make an API call here to completely remove the product from the user's cart in the database.
                deleteItemFromDatabase(product_id);
            } else {
                // Handle cart for guest users (localStorage)
                deleteItemFromLocalStorage(product_id);
            }
        } catch (error) {
            console.error('Error handling delete item from cart:', error);
        }
    };

    const deleteItemFromLocalStorage = (product_id) => {
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const productIndex = currentCart.findIndex(item => item.product_id === product_id);

            if (productIndex > -1) {
                // Completely remove the product from the cart
                currentCart.splice(productIndex, 1);
            }

            // Update the cart in localStorage
            localStorage.setItem('cart', JSON.stringify(currentCart));
            console.log('Updated cart in localStorage after item removal:', currentCart);
        } catch (error) {
            console.error('Error handling delete item from cart:', error);
        }
    }

    const deleteItemFromDatabase = async (product_id) => {
        try {
            // Handle cart for logged-in users (e.g., call backend API)
            const input = {
                userId: claims.db_id,
                productId: product_id
            };
            const data = await fetchGraphQLData(MUTATION_REMOVE_ITEM, input);

            if (data.status === 'true') {
                console.log('Product removed from the cart:', data);
            } else {
                console.error('Error removing product from the cart:', data.error);
            }

        } catch (error) {
            console.error('Error handling delete item from cart:', error);
        }
    };

    // Log Address ID on Set
    useEffect(() => {
        console.log('Selected Address ID ##:', selectedAddressID);
    }, [selectedAddressID]);

    const value = {
        createNewCart,
        addToCart,
        reduceQty,
        deleteItemFromCart,
        setCartProducts,
        cartProducts,
        setCart,
        cart,
        subTotal,
        tax,
        total,
        cartloading,
        cartItemCounter,
        cart_id,
        setSelectedAddressID,
        selectedAddressID
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the CartContext
const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { CartProvider, useCart };
