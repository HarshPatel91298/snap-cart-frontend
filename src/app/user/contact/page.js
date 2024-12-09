"use client";
import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16"
        style={{
          backgroundImage: `url('/images/contact-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white">Get in Touch</h1>
          <p className="mt-4 text-lg text-white">
            We'd love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700">Our Address</h3>
                <p className="text-gray-600 mt-2">
                  Waterloo, Ontario, Canada
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700">Contact Info</h3>
                <p className="text-gray-600 mt-2">
                  Email: snapcart@gmail.com
                  <br />
                  Phone: +1 (123) 456-7890
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Working Hours</h3>
                <p className="text-gray-600 mt-2">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h2>
              <form className="bg-gray-50 shadow-lg rounded-lg p-8">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
