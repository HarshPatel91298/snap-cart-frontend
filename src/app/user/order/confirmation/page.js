"use client";

import React, { useEffect, useState } from "react";
import { OrderConfirmation } from "../../components/OrderConfirmation";
import { OrderSummary } from "../../components/OrderSummary";
import { fetchGraphQLData } from "../../../../lib/graphqlClient";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/AuthContext";

export default function OrderConfirmationPage() {
  const { user } = UserAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract address_id and cart_id from URL
  const selectedAddressID = searchParams.get("address_id");
  const cart_id = searchParams.get("cart_id");

  useEffect(() => {
    if (user) {
      // Delay the creation of the order by 3 seconds after user is available
      setTimeout(() => {
        console.log("cart_id", cart_id);
        console.log("selectedAddressID", selectedAddressID);

        // Redirect if required details are missing
        if (!cart_id || !selectedAddressID) {
          console.error("Required details missing. Redirecting to cart page...");
          router.push("/user/cart");
          return;
        }

        createOrder();
      }, 3000); // 3-second delay
    }
  }, [user, cart_id, selectedAddressID, router]);

  // Function to create order
  const createOrder = async () => {
    const query = `
      mutation Mutation($input: CreateOrderInput!) {
        createOrder(input: $input) {
          id
          order_status
          order_date
          total_amount
          payment_method
          created_at
          updated_at
        }
      }
    `;

    const variables = {
      input: {
        address_id: selectedAddressID,
        cart_id,
        payment_method: "Credit Card",
      },
    };

    try {
      const response = await fetchGraphQLData(query, variables);
      console.log("Order creation response:", response);
      const createdOrder = response.createOrder;

      if (createdOrder) {
        setOrderDetails(createdOrder);
        setIsLoading(false); // Set loading to false when order details are available
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setIsLoading(false); // Stop loading on error
    }
  };

  if (isLoading) {
    return <div className="relative z-50 w-full h-screen">
    {/* Loading Spinner */}
    <div className="absolute inset-0 flex flex-col justify-center items-center">
      {/* Truck Loader */}
      <div className="truck-loader mt-4">
        <div className="truck bg-blue-500 h-8 rounded flex items-center justify-center relative">
          <div className="truck-body bg-blue-500 w-12 h-6 rounded-t-sm">
            <span className="companyname text-white mb-3 absolute inset-0 flex items-center justify-center">
              SnapCart
            </span>
          </div>
          <div className="front bg-yellow-500 w-4 h-8 rounded-sm absolute right-0"></div>
          <div className="wheel1 bg-black w-4 h-4 rounded-full absolute bottom-0 left-2"></div>
          <div className="wheel2 bg-black w-4 h-4 rounded-full absolute bottom-0 right-2"></div>
        </div>
      </div>
      <div className="road-container w-48  h-12 bg-gray-800 flex items-center justify-center">
        <div className="road relative w-4/5 h-3 bg-gray-900">
          <div className="stripe-container absolute w-full h-full flex space-x-2">
            <div className="stripe w-4 h-full bg-white"></div>
            <div className="stripe w-4 h-full bg-gray-900"></div>
            <div className="stripe w-4 h-full bg-white"></div>
            <div className="stripe w-4 h-full bg-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  </div>; // Render loading state until orderDetails is available
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {/* Pass orderDetails only if it is available */}
            {orderDetails ? <OrderConfirmation order={orderDetails} /> : <div>No Order Details</div>}
          </div>
          <div className="lg:pl-12">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
