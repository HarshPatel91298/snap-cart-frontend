import React, { useState, useEffect } from 'react';

export default function Datatable({
    title = "Table",
    description = "Manage your data here.",
    data = [],
    columns = [],
    filters = [],
    loading = false,
    onCreate = () => { },
    onEdit = () => { },
    onDelete = () => { },
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        const filterValue = event.target.value;
        setSelectedFilter(filterValue);
    };

    // Filter data based on search query
    useEffect(() => {
        let filtered = data;

        // console.log({ columns });
        console.log({ data });

        // Apply filter if selected
        if (selectedFilter) {
            filtered = filtered.filter((row) => row.status === selectedFilter); // Adjust key if different
        }

        // Apply search query filter
        if (searchQuery) {
            filtered = filtered.filter((row) =>
                columns.some((column) =>
                    String(row[column.field]).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        setFilteredData(filtered);
    }, [searchQuery, selectedFilter, data, columns]);

    // Pagination logic
    const itemsPerPage = 10; // Set the items per page to 15
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Change page handler
    const changePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1).toLocaleString();
        return date;
    };
    

    // Hide pagination if the total records are less than 15
    const showPagination = filteredData.length > itemsPerPage;

    return (


        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">{title}</h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{description}</p>
                </div>

                
               
                {/* Search */}
                <div className="py-3 w-1/3">
                    <div className="relative">
                        <label htmlFor="hs-table-input-search" className="sr-only">Search</label>
                        <input
                            type="text"
                            name="hs-table-search"
                            id="hs-table-input-search"
                            className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            placeholder="Search for items"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                            <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {filters.length > 0 && (
                    <select
                        className="py-2  border-gray-200 shadow-sm rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        {filters.map((filter) => (
                            <option key={filter.value} value={filter.value}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                )}
                

                {/* Create Button */}
                <div className="inline-flex gap-x-2">
                    <button
                        type="button"
                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                        onClick={onCreate}
                    >
                        Create {title}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                <table id="datatable" className='min-w-full'>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th

                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: '20vw' }}
                                >
                                    {column.label}
                                </th>

                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="w-full bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-4">Loading...</td>
                            </tr>
                        ) : (
                            (paginatedData && paginatedData.length > 0) ? (
                                paginatedData.map((row) => (
                                    <tr key={row.id}>
                                        {columns.map((column) => (
                                            <td key={column.field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                                                {column.type === 'boolean' ? (

                                                // Toggle switch for active/inactive
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={row[column.field]} // Dynamically check the value
                                                        onChange={() => column.onClick(row)} // Handle the toggle change
                                                    />
                                                    <span className="slider"></span>
                                                </label>

                                                ) : column.type === 'badge' ? (
                                                     <span
                                                        className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full ${column.style[row[column.field]]}`}
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={16}
                                                            height={16}
                                                            fill="currentColor"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                                            <path d="M6.293 9.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414L10 14.414l-4.707-4.707a1 1 0 010-1.414z" />
                                                        </svg>
                                                        {column.formatter ? column.formatter(row[column.field]) : row[column.field]}
                                                    </span>

                                            ) : column.type === 'amount' ? (
                                                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row[column.field]
                                                )
                                                ) : column.type === 'date' ? (
                                                    formatDate(row[column.field]) // Apply formatDate for 'date' type
                                            ) : (
                                                column.formatter ? column.formatter(row[column.field]) : row[column.field] // Default to row[column.field] if no type is specified
                                            )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
                                                onClick={() => onEdit(row)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 ml-4"
                                                onClick={() => onDelete(row.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center py-4">No data found</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {showPagination && (
                    <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-neutral-700">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                <span className="font-semibold text-gray-800 dark:text-neutral-200">
                                    {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)}
                                </span> of <span className="font-semibold text-gray-800 dark:text-neutral-200">{filteredData.length}</span>
                            </p>
                        </div>

                        <div>
                            <div className="inline-flex gap-x-2">
                                <button
                                    type="button"
                                    className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                    disabled={currentPage === 1}
                                    onClick={() => changePage(currentPage - 1)}
                                >
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18L9 12l6-6" />
                                    </svg>
                                    Prev
                                </button>

                                {/* Page numbers */}
                                {[...Array(totalPages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        className={`p-2.5 min-w-[40px] inline-flex justify-center items-center text-sm rounded-full ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                        onClick={() => changePage(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                    disabled={currentPage === totalPages}
                                    onClick={() => changePage(currentPage + 1)}
                                >
                                    Next
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18L15 12L9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}
