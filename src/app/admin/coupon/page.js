"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';
import { UserAuth } from '../../../context/AuthContext';
import Datatable from '../components/Datatable';
import ConfirmationModal from '../components/ConfirmationModel';
import Alert from '../components/Alert';

import Select from 'react-select';
import { set } from 'mongoose';



const QUERY_GET_COUPONS = gql`
    query ListCoupons {
        coupons {
            id
            code
            description
            type
            discount
            max_discount
            min_order_amount
            valid_from
            valid_until
            applicable_products {
            id
            name
            }
            applicable_categories {
            id
            name
            }
            applicable_subcategories {
            id
            name
            }
            usage_limit
            max_use_per_user
            used_count
            active
            user_usage {
            userId
            usage_count
            }
    }
}
`;

// UPDATE COUPON
const QUERY_UPDATE_COUPON = gql`
    mutation UpdateCoupon($updateCouponId: ID!, $input: UpdateCouponInput!) {
    updateCoupon(id: $updateCouponId, input: $input) {
        id
        code
        description
        type
        discount
        max_discount
        min_order_amount
        valid_from
        valid_until
        applicable_products {
        id
        name
        }
        applicable_categories {
        id
        name
        }
        applicable_subcategories {
        id
        name
        }
        usage_limit
        max_use_per_user
        used_count
        active
        user_usage {
        userId
        usage_count
        }
    }
}
`;

// GET PRODUCTS, CATEGORIES, SUBCATEGORIES
const QUERY_GET_DATA = gql`
    query ListData {
        products {
            id
            name
        }
        categories {
            id
            name
        }
        subCategories {
            id
            name
        }
    }
`;



const QUERY_CREATE_COUPON = gql`
    mutation CreateCoupon($input: CreateCouponInput!) {
        createCoupon(input: $input){
            id
            code
            description
            type
            discount
            max_discount
            min_order_amount
            valid_from
            valid_until
            applicable_products {
                id
                name
            }
            applicable_categories {
                id
                name
            }
            applicable_subcategories {
                id
                name
            }
            usage_limit
            max_use_per_user
            used_count
            active
        }
    }
`;





export default function CouponPage() {
    const [coupons, setCoupons] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Static Values
    const couponTypes = ['FIXED', 'PERCENTAGE']

    // Create or Edit Modal
    const newCouponTemplate = {
        code: '',
        description: '',
        type: 'FIXED',
        discount: '',
        max_discount: '',
        min_order_amount: '',
        valid_from: '',
        valid_until: '',
        applicable_products: [],
        applicable_categories: [],
        applicable_subcategories: [],
        usage_limit: '',
        max_use_per_user: '',
        active: true
    }
    const [newCoupon, setNewCoupon] = useState(newCouponTemplate)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [editingCouponId, setEditingCouponId] = useState(null)
    const [editLoading, setEditLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    // Store Selected Products, Categories, Subcategories from Modal
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);



    // Values to show in Modal
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])

    // Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteCouponId, setDeleteCouponId] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Archive Modal
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [archiveCouponId, setArchiveCouponId] = useState(null)
    const [archiveConfrimText, setArchiveConfrimText] = useState('');
    const [archiveLoading, setArchiveLoading] = useState(false)


    // User Auth
    const { user } = UserAuth();

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                await fetchCoupons();
            };

            fetchData();
        } else {
            console.log('No user found');
        }
        console.log('User:', user);
        console.log('Coupon:', coupons);
    }, [user]);

    // Fetch Coupons
    const fetchCoupons = async () => {
        try {
            const response = await fetchGraphQLData(QUERY_GET_COUPONS);
            setCoupons(response.data.coupons);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError(error);
            setLoading(false);
        }
    };

    // Fetch Products, Categories, Subcategories
    const fetchPCSData = async () => {
        try {
            const response = await fetchGraphQLData(QUERY_GET_DATA);
            console.log('Response:', response);
            if (response.error) {
                console.error('Error fetching data:', response.error);
                throw new Error(response.error.status);
            }

            setProducts(response.data.products);
            setCategories(response.data.categories);
            setSubcategories(response.data.subCategories);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const convertToHTMLDate = (dateString) => {
        // Parse the date string into a JavaScript Date object
        const date = new Date(dateString);

        if (isNaN(date)) {
            console.error("Invalid date string");
            return null;
        }

        // Format the date into `YYYY-MM-DDTHH:MM`
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        // const hours = String(date.getHours()).padStart(2, '0');
        // const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // Create Coupon
    const createCoupon = async () => {
        console.log('Creating Coupon:', newCoupon);
        try {

            // Formate date fields
            newCoupon.valid_from = new Date(newCoupon.valid_from).toISOString();
            newCoupon.valid_until = new Date(newCoupon.valid_until).toISOString();


            // Formate number fields
            newCoupon.discount = Number(newCoupon.discount);
            newCoupon.max_discount = Number(newCoupon.max_discount);
            newCoupon.min_order_amount = Number(newCoupon.min_order_amount);
            newCoupon.usage_limit = Number(newCoupon.usage_limit);
            newCoupon.max_use_per_user = Number(newCoupon.max_use_per_user);

            newCoupon.applicable_products = selectedProducts.map((product) => product.value);
            newCoupon.applicable_categories = selectedCategories.map((category) => category.value);
            newCoupon.applicable_subcategories = selectedSubcategories.map((subCategory) => subCategory.value);


            const response = await fetchGraphQLData(QUERY_CREATE_COUPON, {
                input: newCoupon,
            });
            console.log('Created Coupon Res#:', response);
        } catch (error) {
            console.error('Error creating coupon:', error);
        }
    };

    // Update Coupon
    const updateCoupon = async () => {
        console.log('Updating Coupon:', editingCoupon);

        // Prepare the payload with formatted fields
        const variables = {
            description: editingCoupon.description,
            type: editingCoupon.type,
            discount: Number(editingCoupon.discount),
            max_discount: Number(editingCoupon.max_discount),
            min_order_amount: Number(editingCoupon.min_order_amount),
            valid_from: new Date(editingCoupon.valid_from).toISOString(),
            valid_until: new Date(editingCoupon.valid_until).toISOString(),
            applicable_products: selectedProducts.map((product) => product.value),
            applicable_categories: selectedCategories.map((category) => category.value),
            applicable_subcategories: selectedSubcategories.map((subCategory) => subCategory.value),
            usage_limit: Number(editingCoupon.usage_limit),
            max_use_per_user: Number(editingCoupon.max_use_per_user),
        };

        try {
            setEditLoading(true);

            // Send the updated coupon to the backend
            const response = await fetchGraphQLData(QUERY_UPDATE_COUPON, {
                updateCouponId: editingCouponId,
                input: variables,
            });

            console.log('Updated Coupon Res#:', response);

            if (!response.error) {

                // Update the coupon list state
                const updatedCoupon = response.data.updateCoupon;
                
                updateCoupon.valid_from = convertToHTMLDate(new Date(updatedCoupon.valid_from * 1));
                updateCoupon.valid_until = convertToHTMLDate(new Date(updatedCoupon.valid_until * 1));

                setCoupons((prevCoupons) =>
                    prevCoupons.map((coupon) =>
                        coupon.id === editingCouponId ? { ...coupon, ...updatedCoupon } : coupon
                    )
                );

                setIsModalOpen(false);
                setEditingCoupon(null);
                setSelectedProducts([]);
                setSelectedCategories([]);
                setSelectedSubcategories([]);

                setEditLoading(false);
            } else {
                console.error('Error updating coupon:', response.error);
                throw new Error(response.error.status);
            }

            // Close the modal and reset states

        } catch (error) {
            console.error('Error updating coupon:', error);
        } finally {
            console.log('Finally');
        }
    };

    const validateForm = () => {
        const errors = {};
    
        // Code validation
        if (!newCoupon.code) {
            errors.code = 'Code is required.';
        } else if (newCoupon.code.length < 5) {
            errors.code = 'Code must be at least 5 characters long.';
        } else if (!isNaN(newCoupon.code)) {
            errors.code = 'Code must not be a number.';
        }
    
        // Description validation
        if (!newCoupon.description) {
            errors.description = 'Description is required.';
        } else if (!isNaN(newCoupon.description)) {
            errors.description = 'Description must not be a number.';
        }
    
        // Discount, Max Discount, and Minimum Order Amount validation
        [['discount', 'Discount'], ['max_discount', 'Max Discount'], ['min_order_amount', 'Min Order Amount']].forEach((field) => {
            if (!newCoupon[field[0]]) {
                errors[field[0]] = `${field[1].replace(/_/g, ' ')} is required.`;
            } else if (isNaN(newCoupon[field[0]])) {
                errors[field[0]] = `${field[1].replace(/_/g, ' ')} must be a number.`;
            }
        });
    
        // Usage Limit and Max Use Per User validation
        ['usage_limit', 'max_use_per_user'].forEach((field) => {
            if (!newCoupon[field]) {
                errors[field] = `${field.replace(/_/g, ' ')} is required.`;
            } else if (isNaN(newCoupon[field])) {
                errors[field] = `${field.replace(/_/g, ' ')} must be a number.`;
            }
        });


        // Valid From and Valid Until validation
        if (!newCoupon.valid_from) {
            errors.valid_from = 'Valid From date is required.';
        }
        if (!newCoupon.valid_until) {
            errors.valid_until = 'Valid Until date is required.';
        }
    
        // Applicable Products, Categories, Subcategories validation
        if (!selectedProducts.length) {
            errors.applicable_products = 'At least one product must be selected.';
        }
        if (!selectedCategories.length) {
            errors.applicable_categories = 'At least one category must be selected.';
        }
        if (!selectedSubcategories.length) {
            errors.applicable_subcategories = 'At least one subcategory must be selected.';
        }
    
        return errors;
    };
    
    
    



    // Create or Update Coupon
    const handleCreateOrUpdate = (event) => {
        event.preventDefault();

        const errors = validateForm();
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors); // Set errors to state to display them
        return;
    }


        if (editingCoupon) {
            updateCoupon();
        } else {
            createCoupon();
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Name:', name);
        console.log('Value:', value);
        if (editingCoupon) {
            setEditingCoupon((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewCoupon((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetModel = () => {
        setNewCoupon(newCouponTemplate);
        setEditingCoupon(null);
        setEditingCouponId(null);
        setSelectedProducts([]);
        setSelectedCategories([]);
        setSelectedSubcategories([]);
    }


    const toggleModal = async (coupon = null) => {

        // Fetch Products, Categories, Subcategories for the first time only
        if (!selectedProducts.length || !selectedCategories.length || !selectedSubcategories.length) {
            fetchPCSData();
        }

        if (coupon) {

            // Set the date fields
            coupon.valid_from = convertToHTMLDate(new Date(coupon.valid_from * 1));
            coupon.valid_until = convertToHTMLDate(new Date(coupon.valid_until * 1));

            // Set the selected products, categories, subcategories formate {value: id, label: name}
            const selectedProducts = coupon.applicable_products.map((product) => ({
                value: product.id,
                label: product.name,
            }));

            const selectedCategories = coupon.applicable_categories.map((category) => ({
                value: category.id,
                label: category.name,
            }));

            const selectedSubcategories = coupon.applicable_subcategories.map((subCategory) => ({
                value: subCategory.id,
                label: subCategory.name,
            }));
            setSelectedProducts(selectedProducts);
            setSelectedCategories(selectedCategories);
            setSelectedSubcategories(selectedSubcategories);

            console.log('Selected Products:', selectedProducts);
            console.log('Selected Categories:', selectedCategories);
            console.log('Selected Subcategories:', selectedSubcategories);


            setEditingCoupon(coupon);
            setEditingCouponId(coupon.id);
        } else {
            resetModel();
        }
        setIsModalOpen(!isModalOpen);
    }

    const openDeleteModal = (id) => {
        setIsDeleteModalOpen(true);
        setDeleteCouponId(id);
    }

    const openArchiveModal = (id) => {
        setIsArchiveModalOpen(true);
        setArchiveCouponId(id);
    }

    // Handle the selected options of products, categories, subcategories
    const handleSelect = (selectedOptions, type) => {
        // Handle the selected options based on the type (product, category, subcategory)
        console.log('Selected Options:', selectedOptions);
        console.log('Type:', type);
        if (type === 'product') {
            setSelectedProducts(selectedOptions);
        } else if (type === 'category') {
            setSelectedCategories(selectedOptions);
        } else if (type === 'subcategory') {
            setSelectedSubcategories(selectedOptions);
        }
    };



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
                                        title="Coupons"
                                        description="Manage your coupons here"
                                        columns={[
                                            { field: 'code', label: 'Code', type: 'text' },
                                            { field: 'type', label: 'Type', type: 'text' },
                                            { field: 'discount', label: 'Discount', type: 'text' },
                                            { field: 'max_discount', label: 'Max Discount', type: 'text' },
                                            { field: 'min_order_amount', label: 'Min Order Amount', type: 'text' },
                                            { field: 'valid_from', label: 'Valid From', type: 'date' },
                                            { field: 'valid_until', label: 'Valid Until', type: 'date' },
                                            { field: 'used_count', label: 'Used Count', type: 'text' },
                                            // { id: 'active', label: 'Active' },

                                        ]}

                                        data={coupons.map((coupon) => ({
                                            id: coupon.id,
                                            code: coupon.code,
                                            description: coupon.description,
                                            type: coupon.type,
                                            discount: coupon.discount,
                                            max_discount: coupon.max_discount,
                                            min_order_amount: coupon.min_order_amount,
                                            valid_from: coupon.valid_from,
                                            valid_until: coupon.valid_until,
                                            used_count: coupon.used_count,
                                            applicable_products: coupon.applicable_products,
                                            applicable_categories: coupon.applicable_categories,
                                            applicable_subcategories: coupon.applicable_subcategories,
                                            usage_limit: coupon.usage_limit,
                                            max_use_per_user: coupon.max_use_per_user,

                                        })

                                        )}
                                        // filters={
                                        //     [
                                        //         { label: 'Active', value: 'Active' },
                                        //         { label: 'Inactive', value: 'Inactive' },
                                        //     ]
                                        // }
                                        loading={false}
                                        onCreate={() => toggleModal()}
                                        onEdit={(coupon) => toggleModal(coupon)}
                                        onDelete={(id) => openDeleteModal(id)}
                                    />
                                )}
                        </div>

                    </div>
                </div>
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
                                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-500 dark:text-neutral-400"
                                onClick={() => toggleModal(null)}
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
                        <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Create/Edit Coupon Form */}
                            <form className="space-y-4" onSubmit={handleCreateOrUpdate}>
                                {/* Code */}
                                <div>
                                    <label htmlFor="coupon-code" className="block text-sm font-medium mb-2 dark:text-white">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        id="coupon-code"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        placeholder="Coupon Code"
                                        value={editingCoupon ? editingCoupon.code : newCoupon.code}
                                        onChange={handleInputChange}

                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.code}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="coupon-description" className="block text-sm font-medium mb-2 dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        id="coupon-description"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        placeholder="Description"
                                        value={editingCoupon ? editingCoupon.description : newCoupon.description}
                                        onChange={handleInputChange}

                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                                </div>

                                {/* Type */}
                                <div>
                                    <label htmlFor="coupon-type" className="block text-sm font-medium mb-2 dark:text-white">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        id="coupon-type"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        value={editingCoupon ? editingCoupon.type : newCoupon.type}
                                        onChange={handleInputChange}

                                    >
                                        {couponTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.type}</p>}
                                </div>

                                {/* Discount Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="coupon-discount" className="block text-sm font-medium mb-2 dark:text-white">
                                            Discount
                                        </label>
                                        <input
                                            type="text"
                                            name="discount"
                                            id="coupon-discount"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                            placeholder="Discount %"
                                            value={editingCoupon ? editingCoupon.discount : newCoupon.discount}
                                            onChange={handleInputChange}

                                        />
                                        {formErrors.code && <p className="text-red-500 text-sm">{formErrors.discount}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="coupon-max-discount" className="block text-sm font-medium mb-2 dark:text-white">
                                            Max Discount
                                        </label>
                                        <input
                                            type="text"
                                            name="max_discount"
                                            id="coupon-max-discount"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                            placeholder="Max Discount"
                                            value={editingCoupon ? editingCoupon.max_discount : newCoupon.max_discount}
                                            onChange={handleInputChange}

                                        />
                                        {formErrors.code && <p className="text-red-500 text-sm">{formErrors.max_discount}</p>}
                                    </div>
                                </div>


                                {/* Min Order Amount */}
                                <div>
                                    <label htmlFor="coupon-min-order-amount" className="block text-sm font-medium mb-2 dark:text-white">
                                        Minimum Order Amount
                                    </label>
                                    <input
                                        type="text"
                                        name="min_order_amount"
                                        id="coupon-min-order-amount"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        placeholder="Minimum Order Amount"
                                        value={editingCoupon ? editingCoupon.min_order_amount : newCoupon.min_order_amount}
                                        onChange={handleInputChange}

                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.min_order_amount}</p>}
                                </div>

                                {/* Applicable Products */}
                                <div>
                                    <label className='className="block text-sm font-medium mb-2 dark:text-white"'>Applicable Products</label>
                                    <Select
                                        isMulti
                                        options={products.map((product) => ({
                                            value: product.id,
                                            label: product.name,
                                        }))
                                        }
                                        value={selectedProducts}
                                        onChange={(selectedProducts) => handleSelect(selectedProducts, 'product')}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        classNamePrefix="select"
                                        placeholder="Select applicable products"
                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.applicable_products}</p>}
                                </div>

                                {/* Applicable Categories */}
                                <div>
                                    <label className='className="block text-sm font-medium mb-2 dark:text-white"'>Applicable Categories</label>
                                    <Select
                                        isMulti
                                        options={categories.map((category) => ({
                                            value: category.id,
                                            label: category.name,
                                        }))
                                        }
                                        value={selectedCategories}
                                        onChange={(selectedCategories) => handleSelect(selectedCategories, 'category')}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        classNamePrefix="select"
                                        placeholder="Select applicable categories"
                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.applicable_categories}</p>}
                                </div>

                                {/* Applicable SubCategories */}
                                <div>
                                    <label className='className="block text-sm font-medium mb-2 dark:text-white"'>Applicable SubCategories</label>
                                    <Select
                                        isMulti
                                        options={subcategories.map((subCategory) => ({
                                            value: subCategory.id,
                                            label: subCategory.name,
                                        }))
                                        }
                                        value={selectedSubcategories}
                                        onChange={(selectedSubcategories) => handleSelect(selectedSubcategories, 'subcategory')}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        classNamePrefix="select"
                                        placeholder="Select applicable subcategories"
                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.applicable_subcategories}</p>}
                                </div>

                                {/* Validity Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="coupon-valid-from" className="block text-sm font-medium mb-2 dark:text-white">
                                            Valid From
                                        </label>
                                        <input
                                            type="date"
                                            name="valid_from"
                                            id="coupon-valid-from"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                            value={editingCoupon ? editingCoupon.valid_from : newCoupon.valid_from}
                                            onChange={handleInputChange}

                                        />
                                        {formErrors.code && <p className="text-red-500 text-sm">{formErrors.valid_from}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="coupon-valid-until" className="block text-sm font-medium mb-2 dark:text-white">
                                            Valid Until
                                        </label>
                                        <input
                                            type="date"
                                            name="valid_until"
                                            id="coupon-valid-until"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                            value={editingCoupon ? editingCoupon.valid_until : newCoupon.valid_until}
                                            onChange={handleInputChange}

                                        />
                                        {formErrors.code && <p className="text-red-500 text-sm">{formErrors.valid_until}</p>}
                                    </div>
                                </div>

                                {/* Usages Limit */}
                                <div>
                                    <label htmlFor="coupon-usages-limit" className="block text-sm font-medium mb-2 dark:text-white">
                                        Usages Limit
                                    </label>
                                    <input
                                        type="text"
                                        name="usage_limit"
                                        id="coupon-usages-limit"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        placeholder="Total Usages Limit"
                                        value={editingCoupon ? editingCoupon.usage_limit : newCoupon.usage_limit}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.usage_limit}</p>}
                                </div>

                                {/* Max Use Per User */}
                                <div>
                                    <label htmlFor="coupon-max-use-per-user" className="block text-sm font-medium mb-2 dark:text-white">
                                        Max Use Per User
                                    </label>
                                    <input
                                        type="text"
                                        name="max_use_per_user"
                                        id="coupon-max-use-per-user"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        placeholder="Max Use Per User"
                                        value={editingCoupon ? editingCoupon.max_use_per_user : newCoupon.max_use_per_user}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.code && <p className="text-red-500 text-sm">{formErrors.max_use_per_user}</p>}
                                </div>


                            


                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        onClick={() => toggleModal(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        {editingCoupon ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
