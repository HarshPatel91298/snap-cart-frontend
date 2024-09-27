"use client";
import { UserAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
// import { useRouter } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app';
import Link from 'next/link'

export default function page() {
  const router = useRouter();
  const { user, googleSignIn, emailandPasswordSignIn } = UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // Error state for email
  const [passwordError, setPasswordError] = useState(""); // Error state for password
  const [errorMessage, setErrorMessage] = useState(""); // General error message


  // Redirect to home page if user is already signed in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }
  , [user]);

  // Validation function
  const validateFields = () => {
    let valid = true;
    setEmailError(""); // Clear previous email errors
    setPasswordError(""); // Clear previous password errors

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password validation (non-empty and at least 6 characters)
    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    return valid;
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setResponseMessage("Google sign-in successful!");
      setErrorMessage(""); // Clear any previous error message
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailandPasswordSignIn = async (e) => {
    e.preventDefault();

    // Perform validation before sign-in
    if (!validateFields()) {
      return; // Stop if validation fails
    }

    try {
      const response = await emailandPasswordSignIn(email, password);
      if (response?.success) {
        setResponseMessage("Sign-in successful!");
        setErrorMessage(""); // Clear any previous error message
        router.push('/');
      } else {
        // Display a user-friendly message based on errorCode
        switch (response?.errorCode) {
          case 'auth/user-not-found':
            setErrorMessage("User not found. Please check your email and try again.");
            break;
          case 'auth/invalid-credential':
            setErrorMessage("Email or Password is incorrect. Please check and try again.");
            break;
          case 'auth/invalid-email':
            setErrorMessage("Invalid email address. Please check and try again.");
            break;
          default:
            setErrorMessage(response?.message || "Sign-in failed. Please try again.");
            break;
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred during sign-in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account yet?
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                href="/user/signup"
              >
                Sign up here
              </Link>
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </button>
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>
            {/* Form */}
            <form>
              <div className="grid gap-y-4">
                {/* Email */}
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
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {emailError && (
                    <div className="mt-2 text-sm text-red-600">
                      {emailError}
                    </div>
                  )}
                </div>
                {/* Password */}
                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Password
                    </label>
                    
                    <Link href="/user/forgot-password"
                      className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
  
                    >
                      Forgot password?
                    </Link>
                   
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="password-error"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {passwordError && (
                    <div className="mt-2 text-sm text-red-600">
                      {passwordError}
                    </div>
                  )}
                </div>
                {/* Remember Me */}
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ms-3">
                    <label
                      htmlFor="remember-me"
                      className="text-sm dark:text-white"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleEmailandPasswordSignIn}
                >
                  Sign in
                </button>
              </div>
            </form>
            {/* Display general sign-in error */}
            {errorMessage && (
              <div className="mt-4 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
