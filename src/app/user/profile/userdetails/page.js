"use client";
import React, { useEffect, useState } from 'react';
import { UserAuth } from "../../../../context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfileSidebar from '../../components/ProfileSidebar';

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const { user, updateUserProfile, sendEmailValidation } = UserAuth();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setLoading(false);
      console.log('User:', user);
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      setProfile({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        photoURL: currentUser.photoURL || ''
      });
      console.log('Profile:', profile);
    }
  }, [currentUser]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSaveChanges = async () => {
    console.log('Save Changes:', profile);
    const { success, message } = await updateUserProfile(currentUser, profile.displayName, profile.email, profile.phone);
    if (success) {
      console.log(message);
      setNotification("Profile updated successfully.");
    }
  }

  const handleSendEmailValidation = async () => {
    console.log('Send Email Validation:', currentUser);
    const { success, message } = await sendEmailValidation(currentUser);
    if (success) {
      setNotification("We have sent a verification email. Please confirm it.");
    }
  }

  if (loading) {
    return (
      <div className="relative z-50 w-full h-screen">
        {/* Loading Spinner */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {/* Truck Loader */}
          <div className="truck-loader mt-4">
            <div className="truck bg-blue-500 h-8 rounded flex items-center justify-center relative">
              <div className="truck-body bg-blue-500 w-12 h-6 rounded-t-sm">
                <span className="companyname text-white mb-3 absolute inset-0 flex items-center justify-center">
                  SnapCart
                </span>
              </div>
              <div className="front bg-yellow-500 w-4 h-8 rounded-sm absolute right-0"></div>
              <div className="wheel1 bg-black w-4 h-4 rounded-full absolute bottom-0 left-2"></div>
              <div className="wheel2 bg-black w-4 h-4 rounded-full absolute bottom-0 right-2"></div>
            </div>
          </div>
          <div className="road-container w-48  h-12 bg-gray-800 flex items-center justify-center">
            <div className="road relative w-4/5 h-3 bg-gray-900">
              <div className="stripe-container absolute w-full h-full flex space-x-2">
                <div className="stripe w-4 h-full bg-white"></div>
                <div className="stripe w-4 h-full bg-gray-900"></div>
                <div className="stripe w-4 h-full bg-white"></div>
                <div className="stripe w-4 h-full bg-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex">
      <ProfileSidebar /> {/* Sidebar component */}

      <div className="flex-1"> {/* Main content area */}
        {notification && (
          <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-lg">
            {notification}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            {profile.photoURL ? (
              <img
                className="w-24 h-24 rounded-full"
                src={profile.photoURL}
                alt="User Avatar"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full">
                <img className="w-24 h-24 rounded-full" src="/images/male_user_8080.png" alt="User Avatar" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{profile.displayName || 'No Name'}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                />
              </div>
              <div>
                <div className="flex">
                  <label className="block text-gray-700">Email</label>
                  {currentUser?.emailVerified ? (
                    <span className="ml-2 text-green-500">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  ) : (
                    <span className="ml-2 text-red-500">
                      <i className="fas fa-times-circle"></i>
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <input
                    type="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm"
                    value={profile.email}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {currentUser.emailVerified ? (
              <button
                className="mt-6 border-2 border-gray-300 text-black font-thin px-4 py-2 rounded-md hover:border-gray-500 bg-gray-100 transition-colors"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="mt-6 border-2 border-gray-300 text-black font-thin px-4 py-2 rounded-md hover:border-gray-500 bg-gray-100 transition-colors"
                onClick={handleSendEmailValidation}
              >
                Verify Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
