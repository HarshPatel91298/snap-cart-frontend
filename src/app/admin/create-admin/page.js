'use client';
import React, { useState } from "react";
import { UserAuth } from "@/context/AuthContext";

const AdminCreateForm = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", gender: "male" });
  const [message, setMessage] = useState("");

  const { emailAndPasswordSignUp } = UserAuth(); // Access the function from AuthContext

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    return Array.from({ length: 12 }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, gender } = formData;
    if (!firstName || !lastName || !email) {
      setMessage("Please fill all required fields.");
      return;
    }

    const password = generatePassword();
    const fullName = `${firstName} ${lastName}`;
    try {
      // Call the signup method from AuthContext
      const userData = await emailAndPasswordSignUp({ email, password, name: fullName });

      // Add claims to Firebase
      const userId = userData.user.uid; // Assuming emailAndPasswordSignUp returns the Firebase user
      await userData.setClaims(userId, {
        db_id: userData.db_id, // Assuming db_id is returned from AuthContext
        role: "admin",
      });

      setMessage(`Admin created successfully. Temporary password: ${password}`);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", gender: "male" });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-3/5 px-4 py-10 sm:px-6 lg:px-8 mx-auto">
      <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
            Create Admin Profile
          </h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Set up your admin profile and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid sm:grid-cols-12 gap-4 sm:gap-6">
            <div className="sm:col-span-3">
              <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                Profile photo
              </label>
            </div>
            <div className="sm:col-span-9">
              <div className="flex items-center gap-5">
                <img className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900" src="https://preline.co/assets/img/160x160/img1.jpg" alt="Avatar" />
                <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  Upload photo
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="admin-full-name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                Full name
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="admin-full-name"
                name="firstName"
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="John Doe"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="admin-email" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                Email
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="admin-email"
                name="email"
                type="email"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            
           

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label htmlFor="admin-phone" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Phone
                </label>
                <span className="text-sm text-gray-400 dark:text-neutral-600">(Optional)</span>
              </div>
            </div>
            <div className="sm:col-span-9">
              <input
                id="admin-phone"
                name="phone"
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="+1(555)555-5555"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="admin-gender" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                Gender
              </label>
            </div>
            <div className="sm:col-span-9">
              <div className="sm:flex">
                <label htmlFor="admin-gender-male" className="flex py-2 px-3 w-full border border-gray-200 shadow-sm text-sm rounded-lg">
                  <input type="radio" name="gender" id="admin-gender-male" checked={formData.gender === 'male'} onChange={handleInputChange} value="male" />
                  <span className="ms-2">Male</span>
                </label>
                <label htmlFor="admin-gender-female" className="flex py-2 px-3 w-full border border-gray-200 shadow-sm text-sm rounded-lg">
                  <input type="radio" name="gender" id="admin-gender-female" checked={formData.gender === 'female'} onChange={handleInputChange} value="female" />
                  <span className="ms-2">Female</span>
                </label>
              </div>
            </div>

            <div class="sm:col-span-3">
          <label for="af-account-bio" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            BIO
          </label>
        </div>
       

        <div class="sm:col-span-9">
          <textarea id="af-account-bio" class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Type your message..."></textarea>
        </div>

            <div className="sm:col-span-12">
              <button
                type="submit"
                className="inline-block w-full py-3 px-5 text-sm font-semibold text-center text-white uppercase rounded-lg bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-600"
              >
                Create Admin
              </button>
            </div>
          </div>
        </form>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default AdminCreateForm;
