"use client";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Categories data
  const categories = [
    { name: "Phones", image: "/images/phone.jpg" },
    { name: "Accessories", image: "/images/accessories.jpg" },
    { name: "Covers", image: "/images/cover.jpg" },
    { name: "Chargers", image: "/images/charger.jpg" },
  ];

  // Products data
  const products = [
    { name: "IPhone 13 Pro", image: "/images/mobile1.jpg", price: "$750.00" },
    { name: "IPhone 14", image: "/images/mobile2.jpg", price: "$850.00" },
    {
      name: "Apple iPhone 15 Pro Max",
      image: "/images/mobile3.jpg",
      price: "$1499.00",
    },
    { name: "iPhone 16 Pro", image: "/images/mobile4.jpg", price: "$1499.00" },
  ];

  return (
    <Box className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <Box
        className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(173, 216, 230, 0.7), rgba(173, 216, 230, 0.7)), url('/images/banner.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: 'lightgrey'
        }}
      >
        <Box className="max-w-screen-xl mx-auto px-6 py-16 flex flex-col items-center md:items-start">
          <Typography variant="h2" className="font-bold">
            Find the Best Mobile Devices & Accessories
          </Typography>
          <Typography variant="subtitle1" className="mt-4">
            Shop the latest phones, covers, and accessories at unbeatable
            prices!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            className="mt-6"
            size="large"
            onClick={() => router.push("/user/shop")}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box className="py-16 bg-gray-100">
        <Typography variant="h4" align="center" className="font-bold mb-10">
          Explore Categories
        </Typography>
        <Grid container spacing={4} className="max-w-screen-xl mx-auto px-6">
          {categories.map((category, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardMedia
                  component="img"
                  height="150"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products Section */}
      <Box className="py-16 bg-white">
        <Typography variant="h4" align="center" className="font-bold mb-10">
          Featured Products
        </Typography>
        <Grid container spacing={4} className="max-w-screen-xl mx-auto px-6">
          {products.map((product, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" className="font-semibold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-4"
                    fullWidth
                    onClick={() => router.push("/user/shop")}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box className="py-16 bg-gray-100">
        <Typography variant="h4" align="center" className="font-bold mb-10">
          What Our Customers Say
        </Typography>
        <Grid container spacing={4} className="max-w-screen-xl mx-auto px-6">
          {[1, 2, 3].map((testimonial, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box className="bg-white p-6 rounded-lg shadow-md">
                <Typography variant="body1" className="text-gray-700">
                  "This website has the best products and prices! Highly
                  recommended."
                </Typography>
                <Typography variant="subtitle2" className="mt-4 text-gray-500">
                  - Customer {idx + 1}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Newsletter Section */}
      <Box className="py-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <Box className="max-w-screen-xl mx-auto px-6 text-center">
          <Typography variant="h4" className="font-bold">
            Stay Updated!
          </Typography>
          <Typography variant="subtitle1" className="mt-4">
            Subscribe to our newsletter for the latest deals and offers.
          </Typography>
          <Box className="mt-6 flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-l-md px-4 py-2 text-gray-800"
            />
            <Button
              variant="contained"
              color="secondary"
              className="rounded-r-md px-6"
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
