"use client";
import React, { useEffect, useState } from "react";
import { fetchGraphQLData } from "@/lib/graphqlClient";
import { UserAuth } from "@/context/AuthContext";

const statusFlow = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

const OrderDetailPage = () => {
  const { user, claims } = UserAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = "6754cf611be91408d8d7d366"; // Replace with dynamic ID if needed
        const orderResponse = await fetchGraphQLData(
          `
          query GetOrderByID($orderId: ID!) {
            getOrderByID(order_id: $orderId) {
              status
              data {
                id
                cart_id
                order_number
                order_status
                order_date
                orderLines {
                  id
                  product_id
                  quantity
                  price
                }
                total_amount
                payment_method
                address_id {
                  street
                  province
                  postalCode
                  city
                  country
                  name
                }
              }
              message
            }
          }
        `,
          { orderId }
        );

        const orderData = orderResponse?.getOrderByID?.data;
        setOrderDetails(orderData);

        // Fetch product details
        const productIds = orderData?.orderLines?.map((line) => line.product_id) || [];
        if (productIds.length) {
          const productResponse = await fetchGraphQLData(
            `
            query Query($ids: [ID!]!) {
              multiGetProducts(ids: $ids) {
                id
                name
                price
                display_image {
                  url
                }
              }
            }
          `,
            { ids: productIds }
          );

          setProducts(productResponse?.multiGetProducts || []);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (claims) {
      fetchOrderDetails();
    }
  }, [claims]);

  const updateOrderStatus = async (newStatus) => {
    try {
      const orderId = "6754cf611be91408d8d7d366"; // Replace with dynamic ID if needed
      const response = await fetchGraphQLData(
        `
        mutation Mutation($input: UpdateOrderStatusInput!) {
          updateOrderStatus(input: $input) {
            order_status
          }
        }
      `,
        {
          input: {
            order_status: newStatus,
            orderId,
          },
        }
      );
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        order_status: response?.updateOrderStatus?.order_status,
      }));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const {
    order_number,
    order_status,
    order_date,
    orderLines,
    total_amount,
    address_id: address,
  } = orderDetails;

  // Determine the next status to show as a button
  const currentStatusIndex = statusFlow.indexOf(order_status);
  const nextStatus = statusFlow[currentStatusIndex + 1];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Order Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order #{order_number}</h1>
          <p className="text-gray-600">
            Order Date: {new Date(order_date * 1).toLocaleString()}
          </p>
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
            Print order
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
            More actions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fulfillment & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fulfillment Section */}
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{order_status}</h2>
            <div className="max-h-80 overflow-y-auto">
              {orderLines.map((line, index) => {
                const product = products.find((p) => p.id === line.product_id);
                return (
                  <div
                    key={index}
                    className="flex flex-wrap items-center justify-between py-4 border-b last:border-b-0 gap-4"
                  >
                    <img
                      src={product?.display_image?.url || "https://via.placeholder.com/80x80"}
                      alt={product?.name || "Product"}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600">ID: {line.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Qty: {line.quantity}</p>
                      <p className="text-gray-600">${line.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(line.price * line.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {nextStatus && (
                <button
                  onClick={() => updateOrderStatus(nextStatus)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Mark as {nextStatus}
                </button>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Details</h2>
            <p className="text-gray-600">Total Amount: ${total_amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Right Column: Notes & Customer */}
        <div className="space-y-6">
          {/* Customer Section */}
          <div className="bg-white p-6 shadow-lg rounded-md">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Customer Details</h2>
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-900">{address.name}</p>
              <p className="text-gray-600">
                {address.street && `${address.street}, `}
                {address.city && `${address.city}, `}
                {address.province && `${address.province}, `}
                {address.country && `${address.country}, `}
                {address.postalCode && address.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
