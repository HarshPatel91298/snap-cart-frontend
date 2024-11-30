"use client";
import React, { useEffect } from "react";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { logout } = UserAuth(); // Access the logout function from AuthContext
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout(); // Perform logout
        router.push("/admin/auth"); // Redirect to auth page
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    performLogout();
  }, [logout, router]); // Dependencies ensure the effect runs once on load

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}
