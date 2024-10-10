'use client'
import { UserAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import Link from 'next/link'

export default function NavBar() {
  const router = useRouter()
  const { user, googleSignIn, logout } = UserAuth()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSingIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full py-7">
        <nav className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto">
          <div className="md:col-span-3">
            {/* Logo */}
            SnapCart
            {/* End Logo */}
          </div>
          {/* Button Group */}
          <div className="flex items-center gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
            {/* Logout  */}

            {user ? (
              <button
                onClick={user ? handleSignOut : handleSingIn}
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white dark:focus:text-white"
              >
                {user ? 'Logout' : 'Login'}
              </button>
            ) : (
              <>
                <Link href="/user/login">
                  <button className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white dark:focus:text-white">
                    Login
                  </button>
                </Link>
                <Link href="/user/signup">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-lime-400 text-black hover:bg-lime-500 focus:outline-none focus:bg-lime-500 transition disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Sign up
                  </button>
                </Link>
              </>
            )}

            {/* <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-lime-400 text-black hover:bg-lime-500 focus:outline-none focus:bg-lime-500 transition disabled:opacity-50 disabled:pointer-events-none"
            >
              Hire us
            </button> */}
            <div className="md:hidden">
              <button
                type="button"
                className="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-[12px] rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                id="hs-header-base-collapse"
                aria-expanded="false"
                aria-controls="hs-header-base"
                aria-label="Toggle navigation"
                data-hs-collapse="#hs-header-base"
              >
                <svg
                  className="hs-collapse-open:hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1={3} x2={21} y1={6} y2={6} />
                  <line x1={3} x2={21} y1={12} y2={12} />
                  <line x1={3} x2={21} y1={18} y2={18} />
                </svg>
                <svg
                  className="hs-collapse-open:block shrink-0 hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Toggle navigation</span>
              </button>
              {/* End Collapse Button */}
            </div>
          </div>
          {/* End Button Group */}
          {/* Collapse */}
          <div
            id="hs-navbar-hcail"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6"
            aria-labelledby="hs-navbar-hcail-collapse"
          >
            <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 md:mt-0">
              <div>
                <Link
                  href="/user"
                  className="relative inline-block text-black focus:outline-none before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 dark:text-white"
                  aria-current="page"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/user/shop"
                  className="inline-block text-black hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-white dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                >
                  Shop
                </Link>
              </div>
              <div>
                <a
                  className="inline-block text-black hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-white dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                  href="#"
                >
                  Offers
                </a>
              </div>
              <div>
                <a
                  className="inline-block text-black hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-white dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                  href="#"
                >
                  Careers
                </a>
              </div>
              <div>
                <a
                  className="inline-block text-black hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-white dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                  href="#"
                >
                  About
                </a>
              </div>
            </div>
          </div>
          {/* End Collapse */}
        </nav>
      </header>
      {/* ========== END HEADER ========== */}
    </>
  )
}
