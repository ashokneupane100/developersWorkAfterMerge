"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Home, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && pathname?.startsWith(path);
  };
  
  return (
    <aside className="w-64 fixed bg-white border-r border-gray-200 shadow-lg h-screen">
      <div className="flex flex-col h-full">
        {/* Return to main site link */}
        <div className="px-6 pt-6 pb-2">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium mt-4 bg-green-600 text-white rounded-lg px-8 py-3 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Return to Main Site
          </Link>
        </div>
        
        {/* Admin portal title */}
        <div className="px-6 pt-2 pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
        </div>
        
        {/* Navigation items */}
        <nav className="mt-6 flex-1 px-4 space-y-1">
          <Link 
            href="/admin" 
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
              isActive('/admin') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
            } transition-colors`}
          >
            <BarChart3 className={`mr-3 h-5 w-5 ${
              isActive('/admin') ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-500'
            }`} />
            Dashboard
          </Link>
          
          <Link 
            href="/admin/users" 
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
              isActive('/admin/users') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
            } transition-colors`}
          >
            <Users className={`mr-3 h-5 w-5 ${
              isActive('/admin/users') ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-500'
            }`} />
            Users
          </Link>
          
          <Link 
            href="/admin/listings" 
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
              isActive('/admin/listings') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
            } transition-colors`}
          >
            <Home className={`mr-3 h-5 w-5 ${
              isActive('/admin/listings') ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-500'
            }`} />
            Listings
          </Link>
          
          <Link 
            href="/admin/requests" 
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
              isActive('/admin/requests') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
            } transition-colors`}
          >
            <FileText className={`mr-3 h-5 w-5 ${
              isActive('/admin/requests') ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-500'
            }`} />
            Requests
          </Link>
          
          <Link 
            href="/admin/settings" 
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
              isActive('/admin/settings') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
            } transition-colors`}
          >
            <Settings className={`mr-3 h-5 w-5 ${
              isActive('/admin/settings') ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-500'
            }`} />
            Settings
          </Link>
        </nav>
        
        {/* Logout button */}
        <div className="px-4 py-6 mt-auto border-t border-gray-200">
          <button className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-900 hover:bg-red-50 hover:text-red-700 transition-colors w-full">
            <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;