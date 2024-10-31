"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';

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

const CREATE_WAREHOUSE_MUTATION = gql`
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

const UPDATE_WAREHOUSE_MUTATION = gql`
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

const DELETE_WAREHOUSE_MUTATION = gql`
  mutation DeleteWarehouse($deleteWarehouseId: ID!) {
    deleteWarehouse(id: $deleteWarehouseId) {
      status
    }
  }
`;

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1).toLocaleString();
    return date;
};

const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteWarehouseId, setDeleteWarehouseId] = useState(null);

    const [warehouseName, setWarehouseName] = useState('');
    const [warehouseLocation, setWarehouseLocation] = useState('');
    const [editingWarehouseId, setEditingWarehouseId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchGraphQLData(LIST_WAREHOUSES_QUERY);
                if (response?.listWarehouses?.status) {
                    setWarehouses(response.listWarehouses.data);
                } else {
                    setError(response?.listWarehouses?.message || 'Error fetching warehouses');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const createWarehouse = async (event) => {
        event.preventDefault();
        const warehouseInput = {
            name: warehouseName,
            location: warehouseLocation,
        };

        try {
            const response = editingWarehouseId
                ? await fetchGraphQLData(UPDATE_WAREHOUSE_MUTATION, {
                    updateWarehouseId: editingWarehouseId,
                    warehouseInput,
                })
                : await fetchGraphQLData(CREATE_WAREHOUSE_MUTATION, {
                    warehouseInput,
                });

            if (response?.addWarehouse?.status || response?.updateWarehouse?.status) {
                if (editingWarehouseId) {
                    setWarehouses((prevWarehouses) =>
                        prevWarehouses.map((warehouse) =>
                            warehouse.id === editingWarehouseId ? { ...warehouse, name: response.updateWarehouse.data.name, location: response.updateWarehouse.data.location } : warehouse
                        )
                    );
                } else {
                    setWarehouses((prevWarehouses) => [...prevWarehouses, response.addWarehouse.data]);
                }
                toggleModal();
            } else {
                setError(response?.addWarehouse?.message || response?.updateWarehouse?.message || 'Error saving warehouse');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteWarehouse = async () => {
        try {
            const response = await fetchGraphQLData(DELETE_WAREHOUSE_MUTATION, {
                deleteWarehouseId,
            });

            if (response?.deleteWarehouse?.status) {
                setWarehouses((prevWarehouses) => prevWarehouses.filter((warehouse) => warehouse.id !== deleteWarehouseId));
                closeDeleteModal();
            } else {
                setError('Error deleting warehouse');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleModal = (warehouse = null) => {
        setIsModalOpen(!isModalOpen);
        if (warehouse) {
            setEditingWarehouseId(warehouse.id);
            setWarehouseName(warehouse.name);
            setWarehouseLocation(warehouse.location);
        } else {
            setEditingWarehouseId(null);
            setWarehouseName('');
            setWarehouseLocation('');
        }
    };

    const openDeleteModal = (warehouseId) => {
        setDeleteWarehouseId(warehouseId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteWarehouseId(null);
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
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Warehouse Inventory</h2>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">Manage your warehouse data here.</p>
                                </div>
                                <div className="inline-flex gap-x-2">
                                    <button
                                        type="button"
                                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                        onClick={toggleModal}
                                    >
                                        Create Warehouse
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
                                                        {editingWarehouseId ? 'Edit Warehouse' : 'Create Warehouse'}
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
                                                    {/* Create/Edit Warehouse Form */}
                                                    <form className="space-y-4" onSubmit={createWarehouse}>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="warehouse-name" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="warehouse-name"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                placeholder="Warehouse Name"
                                                                value={warehouseName}
                                                                onChange={(e) => setWarehouseName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="warehouse-location" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Location
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="warehouse-location"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                placeholder="Warehouse Location"
                                                                value={warehouseLocation}
                                                                onChange={(e) => setWarehouseLocation(e.target.value)}
                                                                required
                                                            />
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
                                                                {editingWarehouseId ? 'Update' : 'Create'}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                                        {warehouses.map((warehouse) => (
                                            <tr key={warehouse.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{warehouse.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{warehouse.location}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(warehouse.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(warehouse.updatedAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                                                    <div class="px-6 py-3">
                                                        {warehouse.is_active ? (
                                                            <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                                                <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                </svg>
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-green-200">
                                                                <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                                                </svg>
                                                                In Active
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
                                                        onClick={() => toggleModal(warehouse)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                                                        onClick={() => openDeleteModal(warehouse.id)}
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
                                        <p className="text-gray-600 dark:text-neutral-400">Are you sure you want to delete this warehouse?</p>
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
                                                onClick={deleteWarehouse}
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

export default WarehousePage;
