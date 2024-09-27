import React from 'react'

export default function MenuBar() {
    return (
        <>
            {/* ========== MAIN CONTENT ========== */}
            {/* Breadcrumb */}
            <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex items-center py-2">
                    {/* Navigation Toggle */}
                    <button
                        type="button"
                        className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="hs-application-sidebar"
                        aria-label="Toggle navigation"
                        data-hs-overlay="#hs-application-sidebar"
                    >
                        <span className="sr-only">Toggle Navigation</span>
                        <svg
                            className="shrink-0 size-4"
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
                            <rect width={18} height={18} x={3} y={3} rx={2} />
                            <path d="M15 3v18" />
                            <path d="m8 9 3 3-3 3" />
                        </svg>
                    </button>
                    {/* End Navigation Toggle */}
                    {/* Breadcrumb */}
                    <ol className="ms-3 flex items-center whitespace-nowrap">
                        <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
                            Application Layout
                            <svg
                                className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </li>
                        <li
                            className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                            aria-current="page"
                        >
                            Dashboard
                        </li>
                    </ol>
                    {/* End Breadcrumb */}
                </div>
            </div>
            {/* End Breadcrumb */}
            {/* Sidebar */}
            <div
                id="hs-application-sidebar"
                className="hs-overlay  [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px] h-full
  hidden
  fixed inset-y-0 start-0 z-[60]
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700"
                role="dialog"
                tabIndex={-1}
                aria-label="Sidebar"
            >
                <div className="relative flex flex-col h-full max-h-full">
                    SnapCart
                    {/* Content */}
                    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <nav
                            className="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
                            data-hs-accordion-always-open=""
                        >
                            <ul className="flex flex-col space-y-1">
                                <li>
                                    <a
                                        className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-white"
                                        href="#"
                                    >
                                        <svg
                                            className="shrink-0 size-4"
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
                                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Dashboard
                                    </a>
                                </li>
 
                            </ul>
                        </nav>
                    </div>
                    {/* End Content */}
                </div>
            </div>
            {/* End Sidebar */}
            {/* Content */}
            <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
                {/* your content goes here ... */}
            </div>
            {/* End Content */}
            {/* ========== END MAIN CONTENT ========== */}
        </>


    )
}
