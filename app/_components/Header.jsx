"use client"
import { memo, useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  PlusIcon,
  PhoneIcon,
  UserIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { FiPhoneCall } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import logo from "../../public/assets/images/homeLogo.png"

// Custom Dropdown Components
const CustomDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}

const DropdownSection = ({ title, children, showDivider = false }) => (
  <>
    {title && <div className="px-4 py-2 text-xs font-semibold text-gray-500">{title}</div>}
    <div className="py-1">{children}</div>
    {showDivider && <hr className="my-1 border-gray-200" />}
  </>
)

const DropdownItem = ({ children, startContent, onClick, href, className = "" }) => {
  const content = (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {startContent && <span className="mr-2">{startContent}</span>}
      <span>{children}</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} prefetch={false}>
        {content}
      </Link>
    )
  }

  return content
}

// Mobile Sidebar Component
const MobileSidebar = ({ isOpen, onClose, user, profile, handleLogout }) => {
  const sidebarRef = useRef(null)
  const isAuthenticated = !!user

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Helper functions
  const getUserInitials = () => {
    const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""
    const nameParts = fullName.trim().split(" ")

    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      return nameParts[0].substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  }

  const getAvatarImage = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[1001] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-[1002] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                  {getAvatarImage() ? (
                    <Image
                      src={getAvatarImage() || "/placeholder.svg"}
                      width={48}
                      height={48}
                      alt={getDisplayName()}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-green-100 text-green-800 font-bold text-sm"
                      style={{ background: "#AFE1AF" }}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 leading-tight">{getDisplayName()}</span>
                  <span className="text-xs text-gray-500 leading-tight">{profile?.user_role || "User"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <nav className="space-y-2 px-4">
              {/* Properties Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Properties</h3>
                <Link
                  href="/all-properties"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">All Properties</span>
                </Link>
                <Link
                  href="/request-property"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Request Property</span>
                </Link>
              </div>

              {/* Account Section */}
              {isAuthenticated && (
                <div className="space-y-2 pt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Account</h3>
                  <Link
                    href="/user"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Profile</span>
                  </Link>
                  <Link
                    href="/user/my-listing"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <HomeIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">My Listings</span>
                  </Link>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Quick Actions</h3>
                <button
                  onClick={() => {
                    window.location.href = "tel:+9779851331644"
                    onClose()
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                >
                  <PhoneIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Call Us: 9851331644</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout()
                  onClose()
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={onClose} className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Login</Button>
                </Link>
                <Link href="/signup" onClick={onClose} className="block">
                  <Button className="w-full border border-green-600 text-green-600 hover:bg-green-700 hover:text-white">
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const buttonClass = `animateGradient text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 hover:opacity-90`

const Header = memo(function Header() {
  const { user, profile, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAuthenticated = !!user
  const isLoading = loading

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/login"
  }

  // Helper function to get user initials
  const getUserInitials = () => {
    const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""
    const nameParts = fullName.trim().split(" ")

    if (nameParts.length >= 2) {
      // First letter of first name + first letter of last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      // If only one name, take first two letters
      return nameParts[0].substring(0, 2).toUpperCase()
    }
    return "U"
  }

  // Helper function to get display name
  const getDisplayName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  }

  // Helper function to get avatar image
  const getAvatarImage = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  }

  return (
    <>
      {/* Style JSX with smooth left-to-right animation */}
      <style jsx global>{`
        @keyframes gradient-animation {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animateGradient {
          background: linear-gradient(90deg, #046d04, #152701);
          background-size: 200% 100%;
          animation: gradient-animation 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="bg-white fixed top-0 w-full z-[1000] border-b shadow-sm">
        {/* Desktop View */}
        <div className="hidden lg:flex px-4 lg:px-10 py-4 items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" prefetch={false}>
            <div className="flex items-center gap-2 group">
              <Image
                src={logo || "/placeholder.svg"}
                width={40}
                height={40}
                alt="logo"
                priority
                className="object-contain w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform duration-200"
              />
              <h1 className="ml-2 font-extrabold text-green-800 text-xl leading-tight text-center pt-1 tracking-tight">
                onlinehome
                <span className="block text-xs text-green-700 font-medium tracking-wide">बर्षौं बर्षको बलियो सम्बन्ध</span>
              </h1>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* All Properties Button */}
            <Link href="/all-properties" prefetch={false}>
              <Button className="bg-green-600 border rounded-lg hover:bg-green-700 text-white transition-colors duration-200 flex items-center gap-2 shadow-sm font-semibold px-4 py-2">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>All Properties</span>
              </Button>
            </Link>

            <Link href="/request-property" prefetch={false}>
              <Button className="bg-white border rounded-lg border-green-600 hover:bg-green-700 text-green-700 hover:text-white transition-colors duration-200 flex items-center gap-2 shadow-sm font-semibold px-4 py-2">
                <PlusIcon className="w-4 h-4" />
                <span>Request Property</span>
              </Button>
            </Link>

            <Link href="/add-new-listing" prefetch={false}>
              <Button className="bg-green-800 rounded-lg hover:bg-green-700 text-white flex items-center gap-2 shadow-sm font-semibold px-4 py-2">
                <PlusIcon className="w-4 h-4" />
                <span>Post Property</span>
              </Button>
            </Link>

            <button
              className={buttonClass}
              onClick={() => (window.location.href = "tel:+9779851331644")}
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
            >
              <FiPhoneCall className="w-4 h-4" />
              <span>9851331644</span>
            </button>

            {/* Profile/Login - Using Custom Dropdown */}
            {isAuthenticated ? (
              <CustomDropdown
                trigger={
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                      {getAvatarImage() ? (
                        <Image
                          src={getAvatarImage() || "/placeholder.svg"}
                          width={40}
                          height={40}
                          alt={getDisplayName()}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-green-100 text-green-800 font-bold text-sm"
                          style={{ background: "#AFE1AF" }}
                        >
                          {getUserInitials()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 leading-tight">{getDisplayName()}</span>
                      <span className="text-xs text-gray-500 leading-tight">{profile?.user_role || "User"}</span>
                    </div>
                  </div>
                }
              >
                <DropdownSection title="My Account" showDivider>
                  <DropdownItem href="/user" startContent={<UserIcon className="w-4 h-4" />}>
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
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Login</Button>
                </Link>
                <Link href="/signup" prefetch={false}>
                  <Button className="border border-green-600 hover:bg-green-700 text-white hover:text-white">
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Header */}
        <div className="lg:hidden flex flex-col">
          {/* Top Row: Logo and Menu */}
          <div className="flex justify-between items-center px-4 py-3">
            <Link href="/" prefetch={false}>
              <div className="flex items-center gap-2 group">
                <Image
                  src={logo || "/placeholder.svg"}
                  width={32}
                  height={32}
                  alt="logo"
                  priority
                  className="object-contain w-8 h-8 drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                />
                <h1 className="ml-1 font-extrabold text-green-800 text-lg leading-tight tracking-tight">
                  onlinehome
                  <span className="block text-xs text-green-700 font-medium tracking-wide mt-[-2px]">
                    बर्षौं बर्षको बलियो सम्बन्ध
                  </span>
                </h1>
              </div>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Bottom Row: Action Buttons */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-3 border-t border-gray-100">
            <Link href="/add-new-listing" prefetch={false} className="w-full">
              <Button className="bg-green-800 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg shadow-sm font-semibold transition-colors duration-200">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Post Property</span>
              </Button>
            </Link>

            <Button
              className={`${buttonClass} py-2 px-3 rounded-lg shadow-sm font-semibold transition-colors duration-200`}
              onClick={() => (window.location.href = "tel:+9779851331644")}
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="text-sm">9851331644</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        profile={profile}
        handleLogout={handleLogout}
      />

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[120px] lg:h-[50px]" />
    </>
  )
})

export default Header
