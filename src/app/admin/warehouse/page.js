"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';
import { UserAuth } from '../../../context/AuthContext';
import Datatable from '../components/Datatable';
import ConfirmationModal from '../components/ConfirmationModel';
import Alert from '../components/Alert';
import { set } from 'mongoose';


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
        is_active
        createdAt
        updatedAt
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

const TOGGEL_WAREHOUSE_STATUS_MUTATION = gql`
    mutation ToggleWarehouseStatus($toggleWarehouseId: ID!) {
        toggleWarehouse(id: $toggleWarehouseId) {
            status
            message
            data {
                id
                is_active
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

const warehouseColumns = [
    { label: 'Name', field: 'name' },
    { label: 'Location', field: 'location' },
    { label: 'Created At', field: 'createdAt' },
    { label: 'Updated At', field: 'updatedAt' },
    { label: 'Status', field: 'status' },
];


const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteWarehouseId, setDeleteWarehouseId] = useState(null);
    const [currentuser, setCurrentUser] = useState(null);


    // Archiv Modal States
    const [archiveConfrimText, setArchiveConfrimText] = useState('');
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [archiveWarehouseId, setArchiveWarehouseId] = useState(null);

    const [warehouseName, setWarehouseName] = useState('');
    const [warehouseLocation, setWarehouseLocation] = useState('');
    const [editingWarehouseId, setEditingWarehouseId] = useState(null);

    const { user } = UserAuth();

    // Alert

    const [alerts, setAlerts] = useState([]);


    const setAlert = (message, type) => {
        const id = Date.now(); // Generate a unique ID for each alert
        setAlerts((prev) => [...prev, { id, message, type }]);

        // Automatically remove the alert after 3 seconds
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 3000);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };



    useEffect(() => {
        if (user) {
            setCurrentUser(user);

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
        }

    }, [user]);


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
                editingWarehouseId ? setAlert('Warehouse updated successfully', 'success') :
                    setAlert('Warehouse created successfully', 'success');

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
                setAlert('Warehouse deleted successfully', 'success');

            } else {
                setError('Error deleting warehouse');
                setAlert('Error deleting warehouse', 'failed');
            }
            closeDeleteModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleWarehosueStatus = async () => {
        try {
            const response = await fetchGraphQLData(TOGGEL_WAREHOUSE_STATUS_MUTATION, {
                toggleWarehouseId: archiveWarehouseId,
            });

            if (response?.toggleWarehouse?.status) {
                setWarehouses((prevWarehouses) => prevWarehouses.map((warehouse) => {
                    if (warehouse.id === archiveWarehouseId) {
                        return { ...warehouse, is_active: !warehouse.is_active }
                    }
                    return warehouse;
                }));
                setAlert('Warehouse status updated successfully', 'success');
                closeArchiveModal();
            } else {
                setError('Error updating warehouse status');
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

    const openArchiveModal = (warehouse) => {
        setArchiveConfrimText(warehouse.status == "Inactive" ? 'Active' : 'Inactive');
        setArchiveWarehouseId(warehouse.id);
        setIsArchiveModalOpen(true);
    }

    const closeArchiveModal = () => {
        setIsArchiveModalOpen(false);
        setArchiveWarehouseId(null);
        setArchiveConfrimText(null);

    }





    return (

        <div>

            <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

                <div className="flex flex-col">

                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 inline-block align-middle">

                            {loading ? (
                                <div className="flex justify-center items-center h-96"> ...Loading </div>)
                                : (
                                    <Datatable
                                        title="Warehouse Inventory"
                                        description="Manage your warehouse data here."
                                        columns={[
                                            { label: 'Name', field: 'name', type: 'text' },
                                            { label: 'Location', field: 'location', type: 'text' },
                                            { label: 'Created At', field: 'createdAt', type: 'date' },
                                            { label: 'Updated At', field: 'updatedAt', type: 'date' },
                                            {
                                                label: 'Status', field: 'status', type: 'boolean', style: {
                                                    'Active': 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500',
                                                    'Inactive': 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500'
                                                },
                                                onClick: (warehouse) => openArchiveModal(warehouse)
                                            }
                                        ]}

                                        data={warehouses.map((warehouse) => ({
                                            id: warehouse.id,
                                            name: warehouse.name,
                                            location: warehouse.location,
                                            createdAt: warehouse.createdAt,
                                            updatedAt: warehouse.updatedAt,
                                            status: warehouse.is_active ? 'Active' : 'Inactive',
                                        }
                                        ))}
                                        filters={
                                            [
                                                { label: 'Active', value: 'Active' },
                                                { label: 'Inactive', value: 'Inactive' },
                                            ]
                                        }
                                        loading={false}
                                        onCreate={() => toggleModal()}
                                        onEdit={(item) => toggleModal(item)}
                                        onDelete={(id) => openDeleteModal(id)}
                                    />
                                )}
                        </div>



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
                        {/* Delete Confirmation Modal */}
                        <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onCancel={closeDeleteModal}
                            onConfirm={deleteWarehouse}
                            message="Are you sure you want to delete this warehouse?"
                            confirmText="Delete"    // Optional
                            cancelText="Cancel"    // Optional
                        />

                        {/* Archive Confirmation Modal*/}
                        <ConfirmationModal
                            isOpen={isArchiveModalOpen}
                            onCancel={closeArchiveModal}
                            onConfirm={handleWarehosueStatus}
                            message="Are you sure you want to archive this warehouse?"
                            confirmText={archiveConfrimText}   // Optional
                            cancelText="Cancel"    // Optional
                        />

                    </div>
                </div>
            </div>


            <Alert alerts={alerts} removeAlert={removeAlert} />


        </div>



    );
};

export default WarehousePage;
