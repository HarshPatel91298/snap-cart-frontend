// src/app/admin/page.js

"use client";
import { UserAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { user } = UserAuth()

  return (
    <div className="flex items-center justify-center min-h-screen">
      Admin Dashboard,
      {user ? user.displayName : 'Please log in to access the admin dashboard.'}
    </div>
  );
}
