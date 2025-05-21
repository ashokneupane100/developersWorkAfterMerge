"use client"
import React, { useState, useEffect } from 'react'
import Header from './_components/Header'
import { LoadScript } from '@react-google-maps/api'
import Footer from './_components/Footer'
import AuthProvider from '@/components/Provider/AuthProvider'

function Provider({ children }: any) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = window.location.pathname!;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(pathname.startsWith('/admin'));
    }
  }, [pathname]);

  return (
    <AuthProvider>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY!}
        libraries={['places']}
      >
        {!isAdmin && <Header />}
        <div className='pt-[0rem]'>
          {children}
        </div>
        {!isAdmin && <Footer />}
      </LoadScript>
    </AuthProvider>
  )
}

export default Provider