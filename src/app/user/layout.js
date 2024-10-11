// src/app/user/layout.js
"use client";

import { AuthContextProvider } from "../../context/AuthContext";
import PrelineScript from "../../components/PrelineScript";
import NavBar from "./components/NavBar";
import dynamic from 'next/dynamic';

const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false });

export default function UserLayout({ children }) {
  return (
    <AuthContextProvider>
      <NavBar />
      {children}
      <PrelineScript />
      <NextTopLoader />
    </AuthContextProvider>
  );
}
