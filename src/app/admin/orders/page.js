"use client";
import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";

import { UserAuth } from "@/context/AuthContext";
import { fetchGraphQLData } from "../../../lib/graphqlClient";
import Datatable from "../components/Datatable";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const GET_ORDERS_QUERY = gql`
  query GetOrders {
    getOrders {
      status
      data {
        id
        user_id {
            email
            displayName
            id
        }
        order_number
        order_status
        order_date
        total_amount
        payment_method
        created_at
        updated_at
        orderLines {
          id
          product_id
          quantity
          price
          created_at
          updated_at
        }
      }
      message
    }
  }
`;

const orderColumns = [
  { label: "Order Number", field: "order_number", type: "text" },
  { lable: "Order By", field: "displayName", type: "text" }, // This is a custom field, not a direct field from the database
  { label: "Status", field: "order_status"},
  { label: "Order Date", field: "order_date", type: "date" },
  { label: "Payment Method", field: "payment_method" },
  { label: "Total Amount", field: "total_amount" },
];

const OrderPage = () => {

  const { user, claims } = UserAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const setAlert = (message, type) => {
    const id = Date.now(); // Unique ID for each alert
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLData(GET_ORDERS_QUERY);
        if (response?.getOrders?.status) {
          console.log(response.getOrders.data);
          setOrders(response.getOrders.data);
        } else {
          setError(response?.getOrders?.message || "Error fetching orders");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (claims) {
      fetchOrders();
    }

  }, [claims]);

  if (loading) {
    return <Loader />;
  }

  
  return (

    
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <Alert alerts={alerts} removeAlert={(id) => setAlerts((prev) => prev.filter((alert) => alert.id !== id))} />

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 inline-block align-middle">
              <Datatable
                title="Orders"
                description="Manage and view all orders placed by users."
                columns={orderColumns}
                data={orders.map((order) => ({
                  ...order,
                  displayName: order.user_id.displayName,
                }))}
                loading={false}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
