/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

export default function HeroSection() {
  return (
    <div className="relative bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-12 px-6">
        <div className="max-w-lg space-y-5">
          <h1 className="text-4xl font-bold text-gray-900">
            Shop with Confidence, Save Big with SnapCart
          </h1>

          <p className="text-gray-500">
            At SnapCart, we’re committed to providing you with an unparalleled
            shopping experience. Explore a wide variety of categories, discover
            exclusive deals, and enjoy fast, reliable shipping – all with just a
            few clicks.
          </p>

          <Link href="/shop">
            <button className="bg-black text-white px-6 py-2 mt-4 rounded-lg hover:bg-gray-800">
              Show Now
            </button>
          </Link>
        </div>
        <div className="mt-8 md:mt-0">
          <img
            src="/images/snapcart_image.png"
            alt="Fashion"
            className="w-full max-w-sm rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}
