"use client";

import { memo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  PlusIcon, 
  PhoneIcon, 
  UserIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { FiPhoneCall } from 'react-icons/fi';
import { Button } from "@heroui/react";
import { useAuth } from "../../components/Provider/useAuth"

// Custom Dropdown Components
const CustomDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownSection = ({ title, children, showDivider = false }) => (
  <>
    {title && (
      <div className="px-4 py-2 text-xs font-semibold text-gray-500">
        {title}
      </div>
    )}
    <div className="py-1">
      {children}
    </div>
    {showDivider && <hr className="my-1 border-gray-200" />}
  </>
);

const DropdownItem = ({ children, startContent, onClick, href, className = "" }) => {
  const content = (
    <div 
      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {startContent && <span className="mr-2">{startContent}</span>}
      <span>{children}</span>
    </div>
  );

  if (href) {
    return <Link href={href} prefetch={false}>{content}</Link>;
  }
  
  return content;
};

const buttonClass = `animateGradient text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 hover:opacity-90`;

const Header = memo(function Header() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Style JSX remains the same */}
      <style jsx global>{`
        @keyframes gradient-animation {
          0% { background-position: 200% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animateGradient {
          background: linear-gradient(90deg, rgb(8, 98, 8), #152701, #152701);
          background-size: 200% 100%;
          animation: gradient-animation 0.8s linear infinite;
        }
      `}</style>
      <div className="bg-white fixed top-0 w-full z-[1000] border-b shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:flex px-4 lg:px-8 py-4 items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" prefetch={false}>
            <div className="flex items-center">
              <Image 
                src="/homeLogo.jpg" 
                width={32} 
                height={32} 
                alt="logo" 
                priority 
                className="object-contain" 
              />
              
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* All Properties Button */}
            <Link href="/all-properties" prefetch={false}>
              <Button 
                className="bg-green-600 border rounded-md hover:bg-green-700 text-white transition-colors duration-300 flex items-center gap-2"
              >
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>All Properties</span>
              </Button>
            </Link>
            
            <Link href="/request-property" prefetch={false}>
              <Button 
                className="bg-white border rounded-md border-green-600 hover:bg-green-700 text-green-700 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Request Property</span>
              </Button>
            </Link>
            <Link href="/add-new-listing" prefetch={false}>
              <Button 
                className="bg-green-600 rounded-md hover:bg-green-700 text-white flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Post Property</span>
              </Button>
            </Link>
            
            <button 
              className={buttonClass} 
              onClick={() => window.location.href='tel:+9779851331644'}
            >
              <FiPhoneCall className="w-4 h-4" />
              <span>9851331644</span>
            </button>

            {/* Profile/Login - Using Custom Dropdown */}
            {isAuthenticated ? (
              <CustomDropdown
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                    <div 
                      className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden"
                    >
                      {user?.image ? (
                        <Image 
                          src={user.image} 
                          width={32} 
                          height={32} 
                          alt={user?.name || "User"} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center bg-green-100 text-green-800 font-bold"
                          style={{ background: "#AFE1AF" }}
                        >
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{user?.name}</span>
                  </div>
                }
              >
                <DropdownSection title="My Account" showDivider>
                  <DropdownItem
                    href="/user"
                    startContent={<UserIcon className="w-4 h-4" />}
                  >
                    Profile
                  </DropdownItem>
                </DropdownSection>
                <DropdownItem
                  onClick={handleLogout}
                  startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                  className="text-red-600"
                >
                  Logout
                </DropdownItem>
              </CustomDropdown>
            ) : (
              <>
                <Link href="/login" prefetch={false}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" prefetch={false}>
                  <Button className="border border-green-600 hover:bg-green-700 text-green-600 hover:text-white">
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header - similar changes */}
        <div className="md:hidden flex flex-col">
          {/* Logo and Auth Row */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <Link href="/" prefetch={false}>
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  width={24}
                  height={24}
                  alt="logo"
                  priority
                  className="object-contain"
                />
                <h1 className="ml-2 font-bold text-green-800 text-lg leading-tight">
                  onlinehome
                  <span className="block text-xs text-green-700">
                  बर्षौं बर्षको बलियो सम्बन्ध
                  </span>
                </h1>
              </div>
            </Link>
            
            {/* Mobile Profile/Login - Using Custom Dropdown */}
            {isAuthenticated ? (
              <CustomDropdown
                trigger={
                  <div 
                    className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {user?.image ? (
                      <Image 
                        src={user.image} 
                        width={32} 
                        height={32} 
                        alt={user?.name || "User"} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center bg-green-100 text-green-800 font-bold"
                        style={{ background: "#AFE1AF" }}
                      >
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                }
              >
                <DropdownSection title="My Account" showDivider>
                  <DropdownItem
                    href="/user"
                    startContent={<UserIcon className="w-4 h-4" />}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    href="/user/my-listing"
                    startContent={<HomeIcon className="w-4 h-4" />}
                  >
                    My Listings
                  </DropdownItem>
                </DropdownSection>
                <DropdownItem
                  onClick={handleLogout}
                  startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                  className="text-red-600"
                >
                  Logout
                </DropdownItem>
              </CustomDropdown>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" prefetch={false}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" prefetch={false}>
                  <Button className="border border-green-600 hover:bg-green-700 text-green-600 hover:text-white" size="sm">
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Action Buttons Row - Updated for Mobile */}
          <div className="grid grid-cols-3 gap-2 p-2">
            {/* All Properties Button for Mobile */}
            <Link href="/all-properties" prefetch={false} className="w-full">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-1"
                size="sm"
              >
                <BuildingOfficeIcon className="w-4 h-4" />
                <span className="text-xs">All Properties</span>
              </Button>
            </Link>
            
            <Link href="/add-new-listing" prefetch={false} className="w-full">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-1"
                size="sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-xs">Post Property</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className={buttonClass}
              size="sm"
              onClick={() => window.location.href='tel:+9779851331644'}
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="text-xs">9851331644</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[108px] md:h-[80px]" />
    </>
  );
});

export default Header;