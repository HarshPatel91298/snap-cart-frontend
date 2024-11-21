'use client';
import { UserAuth } from "../../../context/AuthContext";
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

export default function NavBar() {
  const router = useRouter();
  const { user, googleSignIn, logout } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full py-7">
        <nav className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto">
          <div className="md:col-span-3">
            {/* Logo */}
            SnapCart
          </div>
          <div className="flex items-center gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
            {/* Cart Icon with Badge */}
            <div className="relative">
              <Link href="/user/cart">
                <div className="relative">
                  <div className="absolute top-0 left-5">
                    <p className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      3 {/* Replace with dynamic cart count */}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 text-black"
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
                <div className="relative">
                  <Link href="/user/profile/userdetails">
                    <button type="button" className="flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                      {user.photoURL ? (
                        <img className="w-8 h-8 rounded-full" src={user.photoURL} alt="User" />
                      ) : (
                        <img className="w-8 h-8 rounded-full" src="/images/male_user_8080.png" alt="User" />
                      )}
                    </button>
                  </Link>
                </div>
                <button
                  onClick={handleSignOut}
                  className="py-2 px-3 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/user/login">
                  <button className="py-2 px-3 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none">
                    Login
                  </button>
                </Link>
                <Link href="/user/signup">
                  <button
                    className="py-2 px-3 text-sm font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                  >
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
          <div className="hs-collapse hidden md:block md:w-auto md:col-span-6">
            <div className="flex flex-col gap-y-4 md:flex-row md:justify-center md:gap-x-7">
              <Link href="/user" className="text-black hover:text-gray-600 dark:text-white">
                Home
              </Link>
              <Link href="/user/shop" className="text-black hover:text-gray-600 dark:text-white">
                Shop
              </Link>
              <Link href="#" className="text-black hover:text-gray-600 dark:text-white">
                Offers
              </Link>
              <Link href="#" className="text-black hover:text-gray-600 dark:text-white">
                Careers
              </Link>
              <Link href="#" className="text-black hover:text-gray-600 dark:text-white">
                About
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
