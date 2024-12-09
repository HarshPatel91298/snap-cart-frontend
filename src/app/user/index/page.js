"use client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faTruck,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Page = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="container mx-auto py-10">
          <div className="relative">
            <Image
              src="/hero-image.jpg"
              alt="Hero Image"
              width={1200}
              height={500}
              className="rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black bg-opacity-50 rounded-lg">
              <h1 className="text-4xl font-bold mb-4">Fall Favorites</h1>
              <p className="mb-6">
                Our always in-season staple, in brand new colors and your
                favorite fits.
              </p>
              <a
                href="#"
                className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Shop Women's Clothing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {["T-Shirts", "Trousers", "Shoes", "Jackets"].map((category, idx) => (
            <div key={idx} className="text-center group">
              <Image
                src={`/categories/${category.toLowerCase()}.jpg`}
                alt={category}
                width={100}
                height={100}
                className="mx-auto mb-4 transform group-hover:scale-105 transition-transform"
              />
              <h3 className="font-medium text-gray-800">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Shop with Us?</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: faShieldAlt,
                title: "Secure Checkout",
                desc: "Shop with confidence using our encrypted payment system.",
              },
              {
                icon: faTruck,
                title: "Free Shipping",
                desc: "Enjoy free delivery on orders over $75.",
              },
              {
                icon: faUndoAlt,
                title: "30-Day Returns",
                desc: "Not satisfied? Return your item within 30 days for a refund.",
              },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <FontAwesomeIcon
                  icon={benefit.icon}
                  size="2x"
                  className="text-blue-600 mb-4"
                />
                <h3 className="font-medium">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
            <FontAwesomeIcon icon={faTwitter} size="2x" />
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </div>
          <p>&copy; 2024 YourStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
