"use client";

import { AuthContextProvider } from "../../context/AuthContext";
import PrelineScript from "../../components/PrelineScript";
import { SidebarDemo } from "./components/Sidebar";
import dynamic from 'next/dynamic';



const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false });

export default function AdminLayout({ children }) {
  console.log(children);


  return (
    <AuthContextProvider>
        {children}
      <PrelineScript />
      <NextTopLoader />
    </AuthContextProvider>
  );
}
