const Footer = () => {
  return (
    <>
      {/* ========== FOOTER ========== */}
      <footer className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
          <div className="col-span-full hidden lg:col-span-1 lg:block">
            <a
              className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white"
              href="#"
              aria-label="Brand"
            >
              SnapCart
            </a>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
              © 2024 SnapCart Inc.
            </p>
          </div>
          {/* End Col */}
          {/* Add other footer columns here as in your example */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Product
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Pricing
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Changelog
                </a>
              </p>
              {/* more footer links will be added as needed */}
            </div>
          </div>
        </div>
      </footer>
      {/* ========== END FOOTER ========== */}
    </>
  )
}

export default Footer
