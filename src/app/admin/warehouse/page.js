"use client";

import { useState, useEffect } from 'react';
import { fetchGraphQLData } from '../../../lib/graphqlClient'; // Ensure this is your utility

// GraphQL Queries and Mutations
const LIST_WAREHOUSES_QUERY = `
  query ListWarehouses {
    listWarehouses {
      status
      data {
        id
        name
        location
        is_active
        createdAt
        updatedAt
      }
      message
    }
  }
`;

const CREATE_WAREHOUSE_MUTATION = `
  mutation CreateWarehouse($warehouseInput: WarehouseInput!) {
    addWarehouse(warehouseInput: $warehouseInput) {
      status
      message
      data {
        id
        name
        location
      }
    }
  }
`;

const UPDATE_WAREHOUSE_MUTATION = `
  mutation UpdateWarehouse($updateWarehouseId: ID!, $warehouseInput: WarehouseInput) {
    updateWarehouse(id: $updateWarehouseId, warehouseInput: $warehouseInput) {
      status
      message
      data {
        name
        location
      }
    }
  }
`;

const DELETE_WAREHOUSE_MUTATION = `
  mutation DeleteWarehouse($deleteWarehouseId: ID!) {
    deleteWarehouse(id: $deleteWarehouseId) {
      status
    }
  }
`;

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    location: '',
  });
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  // Fetch warehouses from the GraphQL endpoint
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await fetchGraphQLData(LIST_WAREHOUSES_QUERY);
        setWarehouses(data.listWarehouses.data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingWarehouse) {
      setEditingWarehouse((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewWarehouse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateWarehouse = async () => {
    try {
      const data = await fetchGraphQLData(CREATE_WAREHOUSE_MUTATION, { warehouseInput: newWarehouse });
      setWarehouses([...warehouses, data.addWarehouse.data]);
      setNewWarehouse({ name: '', location: '' });
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };

  const handleUpdateWarehouse = async () => {
    try {
      const data = await fetchGraphQLData(UPDATE_WAREHOUSE_MUTATION, {
        updateWarehouseId: editingWarehouse.id,
        warehouseInput: {
          name: editingWarehouse.name,
          location: editingWarehouse.location,
        },
      });

      setWarehouses(
        warehouses.map((warehouse) =>
          warehouse.id === data.updateWarehouse.data.id ? data.updateWarehouse.data : warehouse
        )
      );
      setEditingWarehouse(null);
    } catch (error) {
      console.error('Error updating warehouse:', error);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      const data = await fetchGraphQLData(DELETE_WAREHOUSE_MUTATION, { deleteWarehouseId: id });
      if (data?.deleteWarehouse?.status) {
        setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Admin Portal - Manage Warehouses</h1>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
        </h2>
        <form>
          <input
            type="text"
            name="name"
            value={editingWarehouse ? editingWarehouse.name : newWarehouse.name}
            onChange={handleInputChange}
            placeholder="Warehouse Name"
            className="border p-2 rounded w-full mb-4 bg-white dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            name="location"
            value={editingWarehouse ? editingWarehouse.location : newWarehouse.location}
            onChange={handleInputChange}
            placeholder="Warehouse Location"
            className="border p-2 rounded w-full mb-4 bg-white dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={editingWarehouse ? handleUpdateWarehouse : handleCreateWarehouse}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
          </button>
          {editingWarehouse && (
            <button
              type="button"
              onClick={() => setEditingWarehouse(null)}
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Warehouse List</h2>
        <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Updated At</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-4">{warehouse.name}</td>
                <td className="p-4">{warehouse.location}</td>
                <td className="p-4">{new Date(warehouse.createdAt).toLocaleString()}</td>
                <td className="p-4">{new Date(warehouse.updatedAt).toLocaleString()}</td>
                <td className="p-4">{warehouse.is_active ? 'Active' : 'Inactive'}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    onClick={() => setEditingWarehouse(warehouse)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehousePage;
