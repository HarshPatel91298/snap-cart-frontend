'use client';
import Link from 'next/link';
import { UserAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useRouter } from 'nextjs-toploader/app';

export default function Page() {
  const { resetPassword } = UserAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await resetPassword(email);
      router.push('/user/login');
    } catch (err) {
      setError("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Remember your password?
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                href="/user/login"
              >
                Sign in here
              </Link>
            </p>
          </div>
          <div className="mt-5">
            {/* Form */}
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`py-3 px-4 block w-full border ${
                        error ? "border-red-500" : "border-gray-200"
                      } rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(""); // Reset error when user starts typing
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
                {/* End Form Group */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Reset password
                </button>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
    </div>
  );
}
