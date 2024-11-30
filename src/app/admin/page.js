// src/app/admin/page.js

"use client";
import { UserAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

export default function AdminHome() {
  const { user } = UserAuth(); // Access user authentication context
  const router = useRouter();

  useEffect(() => {
    console.log({user});
    if (user) {
      // Redirect to dashboard if user is authenticated
      router.push("/admin/dashboard");
    } else {
      // Redirect to auth if user is not authenticated
      router.push("/admin/auth");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}
