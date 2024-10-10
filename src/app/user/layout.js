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
    <AuthContextProvider>
      <NavBar />
      {children}
      <Footer />
      <PrelineScript />
      <NextTopLoader />
    </AuthContextProvider>
  )
}
