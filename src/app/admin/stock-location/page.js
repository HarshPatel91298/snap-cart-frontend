"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';
import { UserAuth } from '../../../context/AuthContext';

const LIST_WAREHOUSES_QUERY = gql`
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

const LIST_STOCKLOCATIONS_QUERY = gql`
  query ListStockLocations {
    listStockLocations {
      status
      data {
        id
        name
        warehouse_id
        is_active
        createdAt
        updatedAt
      }
      message
    }
  }
`;

const CREATE_STOCKLOCATION_MUTATION = gql`
  mutation CreateStockLocation($stockLocationInput: StockLocationInput!) {
    addStockLocation(stockLocationInput: $stockLocationInput) {
      status
      message
      data {
        id
        name
        warehouse_id
        is_active
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_STOCKLOCATION_MUTATION = gql`
  mutation UpdateStockLocation($updateStockLocationId: ID!, $stockLocationInput: StockLocationInput!) {
    updateStockLocation(id: $updateStockLocationId, stockLocationInput: $stockLocationInput) {
      status
      message
      data {
        id
        name
        warehouse_id
        is_active
        createdAt
        updatedAt
      }
    }
  }
`;

const DELETE_STOCKLOCATION_MUTATION = gql`
  mutation DeleteStockLocation($deleteStockLocationId: ID!) {
    deleteStockLocation(id: $deleteStockLocationId) {
      status
    }
  }
`;


const GET_WAREHOUSE_BY_ID_QUERY = gql`
    query GetWarehouseById($warehouseId: ID!) {
    getWarehouse(id: $warehouseId) {
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

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1).toLocaleString();
    return date;
};

const StockLocationPage = () => {
    const [stockLocations, setStockLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteStockLocationId, setDeleteStockLocationId] = useState(null);
    const [currentuser, setCurrentUser] = useState(null);


    const [stockLocationName, setStockLocationName] = useState('');
    const [warehouseId, setWarehouseId] = useState('');
    const [editingStockLocationId, setEditingStockLocationId] = useState(null);

    const [warehouses, setWarehouses] = useState([]);


    const { user } = UserAuth();


    async function getWarehouseById(warehouseId) {
        try {
            const response = await fetchGraphQLData(GET_WAREHOUSE_BY_ID_QUERY, {
                warehouseId,
            });
            if (response?.getWarehouse?.status) {
                return response.getWarehouse.data;
            } else {
                setError(response?.getWarehouse?.message || 'Error fetching warehouse');
            }
        } catch (err) {
            setError(err.message);
        }
    }
    
    async function setWarehouseName(stockLocations, warehouses) {
        const warehouseMap = warehouses.reduce((map, warehouse) => {
            map[warehouse.id] = warehouse.name; // Create a mapping of warehouse IDs to names
            return map;
        }, {});
    
        const updatedStockLocations = stockLocations.map((stockLocation) => {
            stockLocation.warehouse_name = warehouseMap[stockLocation.warehouse_id] || 'Unknown'; // Use the mapping
            return stockLocation; // Return the updated stock location
        });
    
        return updatedStockLocations; // Return updated stock locations
    }
    
    async function fetchWarehouses() {
        try {
            const response = await fetchGraphQLData(LIST_WAREHOUSES_QUERY);
            if (response?.listWarehouses?.status) {
                return response.listWarehouses.data; // Return the warehouses to use in the next function
            } else {
                setError(response?.listWarehouses?.message || 'Error fetching warehouses');
                return []; // Return an empty array in case of error
            }
        } catch (err) {
            setError(err.message);
            return []; // Return an empty array in case of error
        }
    }
    
    useEffect(() => {
        if (user) {
            setCurrentUser(user);
    
            const fetchData = async () => {
                setLoading(true);
                try {
                    const stockLocationsResponse = await fetchGraphQLData(LIST_STOCKLOCATIONS_QUERY);
                    if (stockLocationsResponse?.listStockLocations?.status) {
                        const stockLocations = stockLocationsResponse.listStockLocations.data;
    
                        // Fetch warehouses
                        const warehouses = await fetchWarehouses();
    
                        // Set Warehouse Names using the fetched warehouses
                        const updatedStockLocations = await setWarehouseName(stockLocations, warehouses);
    
                        console.log('Stock Locations:', updatedStockLocations);
                        setWarehouses(warehouses); // Set warehouses
                        setStockLocations(updatedStockLocations); // Set updated stock locations
                    } else {
                        setError(stockLocationsResponse?.listStockLocations?.message || 'Error fetching stock locations');
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [user]);
    

    const createStockLocation = async (event) => {
        event.preventDefault();
        const stockLocationInput = {
            name: stockLocationName,
            warehouse_id: warehouseId,
            is_active: true,
        };
    
        try {
            const response = editingStockLocationId
                ? await fetchGraphQLData(UPDATE_STOCKLOCATION_MUTATION, {
                    updateStockLocationId: editingStockLocationId,
                    stockLocationInput,
                })
                : await fetchGraphQLData(CREATE_STOCKLOCATION_MUTATION, {
                    stockLocationInput,
                });
    
            if (response?.addStockLocation?.status || response?.updateStockLocation?.status) {
                let updatedStockLocation;
                if (editingStockLocationId) {
                    updatedStockLocation = response.updateStockLocation.data;
                    setStockLocations((prevStockLocations) =>
                        prevStockLocations.map((stockLocation) =>
                            stockLocation.id === editingStockLocationId ? { ...stockLocation, ...updatedStockLocation } : stockLocation
                        )
                    );
                } else {
                    updatedStockLocation = response.addStockLocation.data;
                    setStockLocations((prevStockLocations) => [...prevStockLocations, updatedStockLocation]);
                }
    
                // Fetch the warehouse name after create or update
                const warehouse = await getWarehouseById(stockLocationInput.warehouse_id);
                if (warehouse) {
                    // Update the stock location with the warehouse name
                    updatedStockLocation.warehouse_name = warehouse.name;
    
                    // Update the state again with the warehouse name
                    setStockLocations((prevStockLocations) =>
                        prevStockLocations.map((stockLocation) =>
                            stockLocation.id === (editingStockLocationId || updatedStockLocation.id) 
                            ? { ...stockLocation, warehouse_name: updatedStockLocation.warehouse_name } 
                            : stockLocation
                        )
                    );
                }
    
                toggleModal();
            } else {
                setError(response?.addStockLocation?.message || response?.updateStockLocation?.message || 'Error saving stock location');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    

    const deleteStockLocation = async () => {
        try {
            const response = await fetchGraphQLData(DELETE_STOCKLOCATION_MUTATION, {
                deleteStockLocationId,
            });

            if (response?.deleteStockLocation?.status) {
                setStockLocations((prevStockLocations) => prevStockLocations.filter((stockLocation) => stockLocation.id !== deleteStockLocationId));
                closeDeleteModal();
            } else {
                setError('Error deleting stock location');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleModal = (stockLocation = null) => {
        setIsModalOpen(!isModalOpen);
        if (stockLocation) {
            setEditingStockLocationId(stockLocation.id);
            setStockLocationName(stockLocation.name);
            setWarehouseId(stockLocation.warehouse_id);
        } else {
            setEditingStockLocationId(null);
            setStockLocationName('');
            setWarehouseId('');
        }
    };

    const openDeleteModal = (stockLocationId) => {
        setDeleteStockLocationId(stockLocationId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteStockLocationId(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                            {/* Header */}
                            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Stock Locations</h2>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">Manage your stock locations here.</p>
                                </div>
                                <div className="inline-flex gap-x-2">
                                    <button
                                        type="button"
                                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                        onClick={toggleModal}
                                    >
                                        Create Stock Location
                                    </button>

                                    {/* Modal for Create/Edit */}
                                    {isModalOpen && (
                                        <div
                                            id="hs-scroll-inside-body-modal"
                                            className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center"
                                        >
                                            <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-lg p-5 m-4">
                                                <div className="flex justify-between items-center pb-3 border-b dark:border-neutral-700">
                                                    <h3 className="font-bold text-gray-800 dark:text-white">
                                                        {editingStockLocationId ? 'Edit Stock Location' : 'Create Stock Location'}
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 dark:text-neutral-400"
                                                        onClick={toggleModal}
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    {/* Create/Edit Stock Location Form */}
                                                    <form className="space-y-4" onSubmit={createStockLocation}>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="stockLocation-name" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="stockLocation-name"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                placeholder="Stock Location Name"
                                                                value={stockLocationName}
                                                                onChange={(e) => setStockLocationName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="warehouse-id" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Warehouse
                                                            </label>
                                                            <select
                                                                id="warehouse-id"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                                                                value={warehouseId}
                                                                onChange={(e) => setWarehouseId(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Select a warehouse</option>
                                                                {warehouses.map((warehouse) => (
                                                                    <option key={warehouse.id} value={warehouse.id}>
                                                                        {warehouse.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                                onClick={toggleModal}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            >
                                                                {editingStockLocationId ? 'Update' : 'Create'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-hidden">
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                                        {stockLocations.map((stockLocation) => (
                                            <tr key={stockLocation.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stockLocation.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{stockLocation.warehouse_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(stockLocation.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(stockLocation.updatedAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                                                    <div className="px-6 py-3">
                                                        {stockLocation.is_active ? (
                                                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                                                <svg className="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                </svg>
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-green-200">
                                                                <svg className="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                                                </svg>
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
                                                        onClick={() => toggleModal(stockLocation)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                                                        onClick={() => openDeleteModal(stockLocation.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {isDeleteModalOpen && (
                                <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-sm p-5 m-4">
                                        <h3 className="font-bold text-gray-800 dark:text-white">Confirm Deletion</h3>
                                        <p className="text-gray-600 dark:text-neutral-400">Are you sure you want to delete this stock location?</p>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                type="button"
                                                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                onClick={closeDeleteModal}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                                onClick={deleteStockLocation}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockLocationPage;