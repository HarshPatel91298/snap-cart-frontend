"use client";
import { UserAuth } from "../../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = UserAuth();
  const { cartItemCounter } = useCart();

  useEffect(() => {
    console.log(cartItemCounter);
  }, [cartItemCounter]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <header className="flex w-full py-4 bg-white shadow-md z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="text-lg font-bold">
          <Link href="/">SnapCart</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-x-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/user/shop" className="text-gray-700 hover:text-gray-900">
            Shop
          </Link>
          <Link href="/user/cart" className="text-gray-700 hover:text-gray-900">
            Cart
          </Link>
          <Link
            href="/user/about"
            className="text-gray-700 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            href="/user/contact"
            className="text-gray-700 hover:text-gray-900"
          >
            Contact
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-x-4">
          {/* Cart Icon with Badge */}
          <div className="relative">
            <Link href="/user/cart">
              <div className="relative">
                {cartItemCounter > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {cartItemCounter}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            </Link>
          </div>

          {/* User Profile and Auth Buttons */}
          {user ? (
            <>
              <Link href="/user/profile/userdetails">
                <img
                  className="w-8 h-8 rounded-full border border-gray-300"
                  src={user.photoURL || "/images/default_user.png"}
                  alt="User"
                />
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/user/login">
                <button className="py-2 px-4 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100">
                  Login
                </button>
              </Link>
              <Link href="/user/signup">
                <button className="py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
