"use client";
import { UserAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { user, googleSignIn, emailandPasswordSignUp } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for auth check

  // Separate state variables for each field's error message
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Check if the user is already signed in
  useEffect(() => {
    if (user !== null) {
      router.push('/');  // Redirect to home page if user is signed in
    } else {
      setLoading(false);  // Stop loading when user check is complete
    }
  }, [user, router]);

  const validateFields = () => {
    let valid = true;
    // Reset previous error messages
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("Name is required.");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address.");
        valid = false;
      }
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    return valid;
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await googleSignIn();
      if (response?.success) {
        setResponseMessage("Google sign-in successful!");
        router.push('/');
      } else {
        setResponseMessage(response?.message || "Google sign-in failed.");
      }
    } catch (error) {
      console.log(error);
      setResponseMessage("An error occurred during Google sign-in.");
    }
  };

  const handleEmailandPasswordSignUp = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await emailandPasswordSignUp(email, password, name);
      if (response?.success) {
        setResponseMessage("Sign-up successful!");
        router.push('/');
      } else {
        switch (response?.errorCode) {
          case 'auth/email-already-in-use':
            setEmailError("This email is already in use. Please try another.");
            break;
          case 'auth/invalid-email':
            setEmailError("Invalid email address. Please check and try again.");
            break;
          case 'auth/weak-password':
            setPasswordError("Password is too weak. Please use a stronger password.");
            break;
          default:
            setResponseMessage(response?.message || "Sign-up failed. Please try again.");
            break;
        }
      }
    } catch (error) {
      console.log(error);
      setResponseMessage("An error occurred during sign-up.");
    }
  };

  // Render loading while checking if the user is signed in
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative overflow-hidden">
    <div className="mx-auto max-w-screen-md py-12 px-4 sm:px-6 md:max-w-screen-xl md:py-20 lg:py-32 md:px-8">
      <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
        <h1 className="text-3xl text-gray-800 font-bold md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight dark:text-neutral-200">
          Empowering Your Online Shopping <span className="text-blue-600 dark:text-blue-500">Experience</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-neutral-500">
          At SnapCart, we leverage the latest web technologies to offer a seamless and stunning shopping experience.
        </p>
  
        <div className="mt-8 grid">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
              {/* SVG path here */}
            </svg>
            Sign up with Google
          </button>
        </div>
  
        <div className="py-6 flex items-center text-sm text-gray-400 uppercase">Or</div>
  
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-3 px-4 block w-full border-gray-200 rounded-lg"
            />
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-4 block w-full border-gray-200 rounded-lg"
            />
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 block w-full border-gray-200 rounded-lg"
            />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          </div>
          <button
            type="submit"
            onClick={handleEmailandPasswordSignUp}
            className="py-3 px-4 bg-blue-600 text-white rounded-lg"
          >
            Sign up
          </button>
        </form>
  
        {responseMessage && <div className="mt-4 text-sm text-green-600">{responseMessage}</div>}
      </div>
    </div>
  
    {/* Background Image Section */}
    {/* <div className="hidden md:block md:absolute md:top-0 md:start-1/2 md:end-0 h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')" }}>
    </div> */}
  </div>
  
  );
}
