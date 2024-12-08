"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';
import { UserAuth } from '../../../context/AuthContext';
import { set } from 'mongoose';


const LIST_PRODUCTS_QUERY = gql`
    query ListProducts {
         products {
            id
            name
            sku
            is_active
        }
    }
`;

const GET_PRODUCT_BY_ID_QUERY = gql`
    query GetProductById($productId: ID!) {
         product(id: $productId) {
            id
            name
            stock
            sku
            is_active
        }
    }   
`;  

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


const LIST_STOCK_LOCATIONS_QUERY = gql`
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

const GET_STOCK_LOCATION_BY_ID_QUERY = gql`
    query GetStockLocationById($stockLocationId: ID!) {
    getStockLocation(id: $stockLocationId) {
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

const LIST_STOCK_QUERY = gql`
  query ListStock {
    listStock {
      status
      data {
        id
        product_id
        warehouse_id
        stock_location_id
        quantity
        createdAt
        updatedAt
      }
      message
    }
  }
`;

const CREATE_STOCK_MUTATION = gql`
  mutation CreateStock($stockInput: StockMgmtInput!) {
    addStock(stockInput: $stockInput) {
      status
      message
      data {
        id
        product_id
        warehouse_id
        stock_location_id
        quantity
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_STOCK_MUTATION = gql`
  mutation UpdateStock($updateStockId: ID!, $stockInput: StockMgmtInput!) {
    updateStock(id: $updateStockId, stockInput: $stockInput) {
      status
      message
      data {
        id
        product_id
        warehouse_id
        stock_location_id
        quantity
        createdAt
        updatedAt
      }
    }
  }
`;

const DELETE_STOCK_MUTATION = gql`
  mutation DeleteStock($deleteStockId: ID!) {
    deleteStock(id: $deleteStockId) {
      status
    }
  }
`;

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1).toLocaleString();
    return date;
};

const StockManagementPage = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteStockId, setDeleteStockId] = useState(null);
    const [currentuser, setCurrentUser] = useState(null);

    const [productId, setProductId] = useState('');
    const [warehouseId, setWarehouseId] = useState('');
    const [stockLocationId, setStockLocationId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingStockId, setEditingStockId] = useState(null);

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [stockLocations, setStockLocations] = useState([]);

    const { user } = UserAuth();

    async function fetchProducts() {
        try {
            const response = await fetchGraphQLData(LIST_PRODUCTS_QUERY);
            if (response?.products) {
                return response.products; // Return the products to use in the next function
            }
            setError(response?.message || 'Error fetching products');
            return []; // Return an empty array in case of error
        } catch (err) {
            setError(err.message);
            return []; // Return an empty array in case of error
        }
    }

    async function getProductById(productId) {
        try {
            const response = await fetchGraphQLData(GET_PRODUCT_BY_ID_QUERY, {
                productId,
            });
            if (response?.product) {
                return response.product; // Return the product to use in the next function
            }
            setError(response?.message || 'Error fetching product');
        } catch (err) {
            setError(err.message);
        }
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

    async function fetchStockLocations() {
        try {
            const response = await fetchGraphQLData(LIST_STOCK_LOCATIONS_QUERY);
            if (response?.listStockLocations?.status) {
                return response.listStockLocations.data;
            } else {
                setError(response?.listStockLocations?.message || 'Error fetching stock locations');
                return [];
            }
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    async function getStockLocationById(stockLocationId) {
        try {
            const response = await fetchGraphQLData(GET_STOCK_LOCATION_BY_ID_QUERY, {
                stockLocationId,
            });
            if (response?.getStockLocation?.status) {
                return response.getStockLocation.data;
            } else {
                setError(response?.getStockLocation?.message || 'Error fetching stock location');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // Set Warehouse, Stock Location, and Product to the stock data
    async function setStockManagementData(stock, warehouses, stockLocations, products) {

        const warehouseMap = warehouses.reduce((acc, warehouse) => {
            acc[warehouse.id] = warehouse;
            return acc;
        }
        , {});

        const stockLocationMap = stockLocations.reduce((acc, stockLocation) => {
            acc[stockLocation.id] = stockLocation;
            return acc;
        }
        , {});

        const productMap = products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }
        , {});

        console.log("Warehouse Map: ", warehouseMap);
        console.log("Stock Location Map: ", stockLocationMap);
        console.log("Product Map: ", productMap);

        return stock.map((stockItem) => ({
            ...stockItem,
            warehouse: warehouseMap[stockItem.warehouse_id],
            stockLocation: stockLocationMap[stockItem.stock_location_id],
            product: productMap[stockItem.product_id],
        }));

    }



    useEffect(() => {
        if (user) {
            setCurrentUser(user);

            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fetchGraphQLData(LIST_STOCK_QUERY);
                    if (response?.listStock?.status) {

                        const stock = response.listStock.data;

                        // Fetch warehouses
                        const warehouses = await fetchWarehouses();
                        setWarehouses(warehouses);

                        // Fetch stock locations
                        const stockLocations = await fetchStockLocations();
                        setStockLocations(stockLocations);

                        // Fetch products
                        const products = await fetchProducts();
                        setProducts(products);

                        // Set Warehouse, Stock Location, and Product to the stock data
                        const updatedStockManagement = await setStockManagementData(stock, warehouses, stockLocations, products);

                        console.log("Stock Management: ", updatedStockManagement);



                        setStocks(updatedStockManagement);
                    } else {
                        setError(response?.listStock?.message || 'Error fetching stock data');
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

    const isProductAlreadyCreated = (productId) => {
        return stocks.some((stock) => stock.product_id === productId);
    };

    const createStock = async (event) => {
        event.preventDefault();

        if (isProductAlreadyCreated(productId)) {
            setError('Product already exists in the stock data');
            return;
        }
        const stockInput = {
            product_id: productId,
            warehouse_id: warehouseId,
            stock_location_id: stockLocationId,
            quantity: parseInt(quantity, 10),
        };
    
        try {
            const response = editingStockId
                ? await fetchGraphQLData(UPDATE_STOCK_MUTATION, {
                    updateStockId: editingStockId,
                    stockInput,
                })
                : await fetchGraphQLData(CREATE_STOCK_MUTATION, {
                    stockInput,
                });
    
            if (response?.addStock?.status || response?.updateStock?.status) {
                // Get the complete stock data including warehouse, stock location, and product
                const stockData = editingStockId 
                    ? response.updateStock.data 
                    : response.addStock.data;
    
                // Assuming stockData contains the IDs for warehouse, stock location, and product
                const updatedStockItem = {
                    ...stockData,
                    warehouse: warehouses.find(w => w.id === stockData.warehouse_id),
                    stockLocation: stockLocations.find(s => s.id === stockData.stock_location_id),
                    product: products.find(p => p.id === stockData.product_id),
                };
    
                if (editingStockId) {
                    setStocks((prevStocks) =>
                        prevStocks.map((stock) =>
                            stock.id === editingStockId ? updatedStockItem : stock
                        )
                    );
                } else {
                    setStocks((prevStocks) => [...prevStocks, updatedStockItem]);
                }
                toggleModal();
            } else {
                setError(response?.addStock?.message || response?.updateStock?.message || 'Error saving stock data');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    

    const deleteStock = async () => {
        try {
            const response = await fetchGraphQLData(DELETE_STOCK_MUTATION, {
                deleteStockId,
            });

            if (response?.deleteStock?.status) {
                setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== deleteStockId));
                closeDeleteModal();
            } else {
                setError('Error deleting stock data');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleModal = (stock = null) => {
        setIsModalOpen(!isModalOpen);
        if (stock) {
            setEditingStockId(stock.id);
            setProductId(stock.product_id);
            setWarehouseId(stock.warehouse_id);
            setStockLocationId(stock.stock_location_id);
            setQuantity(stock.quantity);
        } else {
            setEditingStockId(null);
            setProductId('');
            setWarehouseId('');
            setStockLocationId('');
            setQuantity('');
        }
    };

    const openDeleteModal = (stockId) => {
        setDeleteStockId(stockId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteStockId(null);
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
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Stock Management</h2>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">Manage your stock data here.</p>
                                </div>
                                <div className="inline-flex gap-x-2">
                                    <button
                                        type="button"
                                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                        onClick={toggleModal}
                                    >
                                        Create Stock
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
                                                        {editingStockId ? 'Edit Stock' : 'Create Stock'}
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
                                                    {/* Create/Edit Stock Form */}
                                                    <form className="space-y-4" onSubmit={createStock}>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="product-id" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Product ID
                                                            </label>
                                                            <select
                                                                id="product-id"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                value={productId}
                                                                onChange={(e) => setProductId(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Select Product</option>
                                                                {products.map((product) => (
                                                                    <option key={product.id} value={product.id}>
                                                                        {product.name}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                        </div>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="warehouse-id" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Warehouse ID
                                                            </label>
                                                            <select

                                                                id="warehouse-id"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                value={warehouseId}
                                                                onChange={(e) => setWarehouseId(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Select Warehouse</option>
                                                                {warehouses.map((warehouse) => (
                                                                    <option key={warehouse.id} value={warehouse.id}>
                                                                        {warehouse.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="stock-location-id" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Stock Location ID
                                                            </label>
                                                            <select

                                                                id="stock-location-id"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                value={stockLocationId}
                                                                onChange={(e) => setStockLocationId(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Select Stock Location</option>
                                                                {stockLocations.filter((stockLocation) => stockLocation.warehouse_id === warehouseId).map((stockLocation) => (
                                                                    <option key={stockLocation.id} value={stockLocation.id}>
                                                                        {stockLocation.name}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                        </div>
                                                        <div className="max-w-sm">
                                                            <label htmlFor="quantity" className="block text-sm font-medium mb-2 dark:text-white">
                                                                Quantity
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="quantity"
                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                placeholder="Quantity"
                                                                value={quantity}
                                                                onChange={(e) => setQuantity(e.target.value)}
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
                                                                {editingStockId ? 'Update' : 'Create'}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Location ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                                        {stocks.map((stock) => (
                                            <tr key={stock.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stock.product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{stock.warehouse.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{stock.stockLocation.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{stock.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(stock.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{formatDate(stock.updatedAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
                                                        onClick={() => toggleModal(stock)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                                                        onClick={() => openDeleteModal(stock.id)}
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
                                        <p className="text-gray-600 dark:text-neutral-400">Are you sure you want to delete this stock?</p>
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
                                                onClick={deleteStock}
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

export default StockManagementPage;