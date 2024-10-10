'use client'

import { AuthContextProvider } from '@/context/AuthContext'
import PrelineScript from '@/components/PrelineScript'
import MenuBar from './components/MenuBar'
import dynamic from 'next/dynamic'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false })


export default function AdminLayout({ children }) {
  return (
    <AuthContextProvider>
      {/* <NavBar /> */}
      <MenuBar />
      {children}
      <Footer />
      <PrelineScript />
      <NextTopLoader />
    </AuthContextProvider>

  );
}
