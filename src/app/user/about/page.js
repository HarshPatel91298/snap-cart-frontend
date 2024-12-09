import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16"
        style={{
          backgroundImage: `url('/images/about-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold p-3">About SnapCart</h1>
          <p className="mt-4 text-lg">
            Transforming your online shopping experience with ease and
            innovation.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600">
              SnapCart is a cutting-edge e-commerce platform dedicated to
              delivering the best products, unbeatable convenience, and a
              seamless shopping experience. We aim to bridge the gap between
              quality and affordability, empowering customers to make informed
              purchases from the comfort of their homes.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To make online shopping simple, fast, and enjoyable while
                ensuring customer satisfaction is our top priority.
              </p>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To become a globally recognized platform for online shopping
                that redefines convenience and innovation.
              </p>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Our Values
              </h3>
              <p className="text-gray-600">
                Integrity, customer-first mindset, innovation, and teamwork are
                at the heart of everything we do.
              </p>
            </div>
          </div>

          {/* Meet the Team */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Meet Our Founders
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our founders are dedicated visionaries committed to shaping the
              future of e-commerce.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Founder 1 */}
              <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                <div className="h-32 w-32 mx-auto mb-4">
                  <img
                    src="/images/founder1.jpg"
                    alt="Founder 1"
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Zeel Patel
                </h3>
                <p className="text-sm text-gray-600">Founder & CEO</p>
                <p className="mt-4 text-gray-600">
                  Zeel is the driving force behind SnapCart, with over a decade
                  of experience in e-commerce and tech innovation.
                </p>
              </div>
              {/* Founder 2 */}
              <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                <div className="h-32 w-32 mx-auto mb-4">
                  <img
                    src="/images/founder2.jpg"
                    alt="Founder 2"
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Ishan Kaundal
                </h3>
                <p className="text-sm text-gray-600">Co-Founder & COO</p>
                <p className="mt-4 text-gray-600">
                  Ishan ensures smooth operations at SnapCart, leveraging her
                  expertise in business management and customer engagement.
                </p>
              </div>
              {/* Founder 3 */}
              <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                <div className="h-32 w-32 mx-auto mb-4">
                  <img
                    src="/images/founder3.jpg"
                    alt="Founder 3"
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Harsh Patel
                </h3>
                <p className="text-sm text-gray-600">Co-Founder & CTO</p>
                <p className="mt-4 text-gray-600">
                  Harsh leads the tech innovations at SnapCart, ensuring a
                  seamless and secure shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
