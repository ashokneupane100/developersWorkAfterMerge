"use client"
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface AdminDashboardProps {
  children: ReactNode;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple check for admin token in localStorage
    const checkAdminToken = () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
          // No token found, redirect to login
          router.push('/admin/login');
          return;
        }
        
        // If token exists, set authorized to true
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin token:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminToken();
  }, [router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect will happen in the useEffect)
  if (!isAuthorized) {
    return null;
  }

  // Main dashboard layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed width sidebar takes up space but doesn't affect content flow */}
      <div className="w-64 flex-shrink-0">
        {/* This empty div reserves the space */}
      </div>
      
      {/* Sidebar is positioned fixed and doesn't affect layout flow */}
      <Sidebar />
      
      {/* Main content starts after the reserved sidebar space */}
      <main className="flex-1">
        <div className="py-6 px-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

//making changes...