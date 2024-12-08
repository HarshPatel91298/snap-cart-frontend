"use client";
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { fetchGraphQLData } from '../../../lib/graphqlClient';
import { UserAuth } from '../../../context/AuthContext';
import Datatable from '../components/Datatable';
import ConfirmationModal from '../components/ConfirmationModel';
import Alert from '../components/Alert';

const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdmin($adminInput: AdminInput!) {
    createAdmin(adminInput: $adminInput) {
      status
      message
      data {
        id
        name
        email
        role
        createdAt
      }
    }
  }
`;

const adminColumns = [
  { label: 'Name', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Role', field: 'role' },
  { label: 'Created At', field: 'createdAt' },
];

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPhoto, setAdminPhoto] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [alerts, setAlerts] = useState([]);

  const { user } = UserAuth();

  // Set alert
  const setAlert = (message, type) => {
    const id = Date.now(); // Generate a unique ID for each alert
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Automatically remove the alert after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch admin data or perform other necessary queries here
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const validateForm = () => {
    // Validate admin name
    if (!adminName.trim()) {
      setAlert('Name is required', 'error');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      setAlert('Invalid email address', 'error');
      return false;
    }

    // Validate phone number (only digits, length between 10 and 15)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(adminPhone)) {
      setAlert('Invalid phone number. It should be 10-15 digits.', 'error');
      return false;
    }

    // Validate role selection
    if (!adminRole || (adminRole !== 'admin' && adminRole !== 'superadmin')) {
      setAlert('Please select a valid role', 'error');
      return false;
    }

    return true;
  };

  const createAdmin = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const adminInput = {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      role: adminRole,
    };

    try {
      const response = await fetchGraphQLData(CREATE_ADMIN_MUTATION, { adminInput });

      if (response?.createAdmin?.status) {
        setAdmins((prevAdmins) => [...prevAdmins, response.createAdmin.data]);
        setAlert('Admin created successfully', 'success');
        toggleModal();
      } else {
        setError(response?.createAdmin?.message || 'Error creating admin');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
    setAdminRole('');
  };

  return (
    <div>
      {/* Render Alerts */}
      {alerts.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          {alerts.map((alert) => (
            <Alert key={alert.id} message={alert.message} type={alert.type} />
          ))}
        </div>
      )}

      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 inline-block align-middle">
              {loading ? (
                <div className="flex justify-center items-center h-96"> ...Loading </div>
              ) : (
                <Datatable
                  title="Admin List"
                  description="Manage your admin users here."
                  columns={adminColumns}
                  data={admins}
                  loading={false}
                  onCreate={() => toggleModal()}
                  // Implement other actions like edit and delete
                />
              )}
            </div>
          </div>

          {/* Modal for Create Admin */}
          {isModalOpen && (
            <div
              id="create-admin-modal"
              className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-lg p-5 m-4">
                <div className="flex justify-between items-center pb-3 border-b dark:border-neutral-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">Create Admin</h3>
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
                  {/* Create Admin Form */}
                  <form className="space-y-4" onSubmit={createAdmin}>
                    <div className="max-w-sm">
                      <label htmlFor="admin-name" className="block text-sm font-medium mb-2 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id="admin-name"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Admin Name"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="max-w-sm">
                      <label htmlFor="admin-email" className="block text-sm font-medium mb-2 dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        id="admin-email"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Admin Email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="max-w-sm">
                      <label htmlFor="admin-phone" className="block text-sm font-medium mb-2 dark:text-white">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="admin-phone"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Phone Number"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="max-w-sm">
                      <label htmlFor="admin-role" className="block text-sm font-medium mb-2 dark:text-white">
                        Role
                      </label>
                      <select
                        id="admin-role"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        value={adminRole}
                        onChange={(e) => setAdminRole(e.target.value)}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                      >
                        Create Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
