// src/app/user/layout.js
'use client'

import { AuthContextProvider } from '@/context/AuthContext'
import PrelineScript from '@/components/PrelineScript'
import NavBar from './components/NavBar'
import dynamic from 'next/dynamic'
import Footer from './components/Footer'

const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false })


export default function UserLayout({ children }) {
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        {children}
      </div>
      <Footer />
      <PrelineScript />
      <NextTopLoader />
    </div>
  );
}

