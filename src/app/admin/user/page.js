"use client";

import React, { useState, useEffect } from "react";
import Datatable from "../../admin/components/Datatable";
import { gql } from "graphql-request";
import { fetchGraphQLData } from "../../../../src/lib/graphqlClient";

// GraphQL Query to Fetch User Details
const GET_USERS = gql`
  query Users {
    users {
      id
      email
      displayName
      firebaseUID
      photoURL
      emailVerified
      phoneNumber
      createdAt
      lastLoginAt
      userRole
    }
  }
`;

export default function UserDetailsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLData(GET_USERS);
        if (response && response.users) {
          // Map fetched data to a compatible format for the datatable
          const formattedUsers = response.users.map((user) => ({
            _id: user.id,
            email: user.email,
            displayName: user.displayName,
            firebaseUID: user.firebaseUID,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber || "N/A",
            createdAt: new Date(parseInt(user.createdAt)).toISOString(),
            lastLoginAt: new Date(parseInt(user.lastLoginAt)).toISOString(),
            userRole: user.userRole,
          }));

          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (user) => {
    console.log("Edit clicked for user:", user);
    // Add logic for editing user details (e.g., open a modal)
  };

  const handleDelete = (userId) => {
    console.log("Delete clicked for user ID:", userId);
    // Add logic for deleting the user
  };

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <Datatable
          title="Users"
          description="Manage user details."
          data={users}
          columns={[
            { label: "ID", field: "_id", type: "text" },
            { label: "Email", field: "email", type: "text" },
            { label: "Name", field: "displayName", type: "text" },
            {
              label: "Photo",
              field: "photoURL",
              type: "image",
              formatter: (photoURL) => (
                <img
                  src={photoURL}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full"
                />
              ),
            },
            {
              label: "Email Verified",
              field: "emailVerified",
              type: "boolean",
            },
            { label: "Phone", field: "phoneNumber", type: "text" },
            { label: "Created At", field: "createdAt", type: "date" },
            { label: "Last Login", field: "lastLoginAt", type: "date" },
            { label: "Role", field: "userRole", type: "text" },
          ]}
          filters={[
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ]}
          loading={loading}
          onCreate={() => console.log("Create button clicked")}
          onEdit={handleEdit}
          onDelete={(user) => handleDelete(user._id)}
        />
      </div>
    </div>
  );
}
