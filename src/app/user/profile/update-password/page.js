'use client';
import React, { useState } from 'react';
import { UserAuth } from "../../../../context/AuthContext";
import { useRouter } from 'nextjs-toploader/app';

const ChangePassword = () => {
  const { validateUserPassword, setUserPassword, logout } = UserAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const verifyOldPassword = async () => {
    try {
      const data = await validateUserPassword(oldPassword);
      if (!data.success) {
        throw new Error('Old password is incorrect');
      }
      return true;
    } catch {
      setErrorMessages((prev) => ({ ...prev, oldPassword: 'Old password is incorrect' }));
      return false;
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessages({}); // Reset errors
    setSuccessMessage(''); // Reset success message

    // Verify old password
    const isOldPasswordValid = await verifyOldPassword();
    if (!isOldPasswordValid) {
      return; // Old password validation failed
    }

    // Validate new passwords
    if (newPassword !== confirmPassword) {
      setErrorMessages((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    // Update password
    await setUserPassword(newPassword);
    
    // Show success message
    setSuccessMessage('Password changed successfully. Logging out...');
    
    // Log out the user
    await logout();
    router.push('/user/login');

    // Optionally, redirect or navigate to a different page if needed
    console.log('User logged out successfully');
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessages((prev) => ({ ...prev, [e.target.name]: '' })); // Reset specific error
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Remembered your old password? Please enter your new password below.
            </p>
          </div>
          <div className="mt-5">
            <form onSubmit={handleChangePassword}>
              <div className="grid gap-y-4">
                {/* Old Password Group */}
                <div>
                  <label htmlFor="old-password" className="block text-sm mb-2 dark:text-white">
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    name="oldPassword"
                    className={`py-3 px-4 block w-full border ${errorMessages.oldPassword ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
                    required
                    value={oldPassword}
                    onChange={handleChange(setOldPassword)}
                  />
                  {errorMessages.oldPassword && <p className="text-xs text-red-600 mt-2">{errorMessages.oldPassword}</p>}
                </div>

                {/* New Password Group */}
                <div>
                  <label htmlFor="new-password" className="block text-sm mb-2 dark:text-white">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    name="newPassword"
                    className={`py-3 px-4 block w-full border ${errorMessages.newPassword ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
                    required
                    value={newPassword}
                    onChange={handleChange(setNewPassword)}
                  />
                  {errorMessages.newPassword && <p className="text-xs text-red-600 mt-2">{errorMessages.newPassword}</p>}
                </div>

                {/* Confirm Password Group */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    className={`py-3 px-4 block w-full border ${errorMessages.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
                    required
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                  />
                  {errorMessages.confirmPassword && <p className="text-xs text-red-600 mt-2">{errorMessages.confirmPassword}</p>}
                </div>

                {/* Success Message */}
                {successMessage && <p className="text-xs text-green-600 mt-2">{successMessage}</p>}

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
