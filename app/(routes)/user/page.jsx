"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, User, Edit, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Divider,
  Spinner,
  Avatar,
} from "@heroui/react";
import UserListing from "./_components/UserListing";
import { useRouter } from "next/navigation";
import { useState } from "react";

function UserProfile() {
  const { user, profile, loading, signOut } = useAuth();
  const isAuthenticated = !!user;
  const isLoading = loading;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-listing");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      <h2 className="font-bold text-xl sm:text-2xl mb-4">Profile</h2>

      <Card className="shadow-sm border">
        <CardBody className="p-0">
          {/* Profile Header */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0 self-center sm:self-start">
                <Avatar
                  size="lg"
                  src={
                    user?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || ""
                    )}&background=AFE1AF&color=ffff`
                  }
                  alt={user?.name || "User"}
                  isBordered
                  color="success"
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                  {user?.email}
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link href="/edit-profile" className="flex-1 sm:flex-none">
                    <Button
                      variant="outline"
                      size="sm"
                      startContent={<Edit className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      Edit Profile
                    </Button>
                  </Link>

                  {profile?.user_role?.toLowerCase() === "agent" && (
                    <Button
                      onClick={() => router.push("/agent")}
                      color="primary"
                      size="sm"
                      startContent={<Building2 className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      Go to Dashboard
                    </Button>
                  )}

                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    color="danger"
                    size="sm"
                    startContent={<LogOut className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Tabs Section */}
          <div className="px-3 sm:px-6 pt-2">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
              variant="underlined"
              color="primary"
              aria-label="Profile tabs"
              className="w-full"
            >
              <Tab
                key="profile"
                title={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </div>
                }
              >
                <div className="p-3 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-3">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500">
                            Name
                          </label>
                          <div className="text-sm sm:text-base text-gray-900">
                            {user?.name}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500">
                            Email
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 break-all">
                            {user?.email}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500">
                            Role
                          </label>
                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                profile?.user_role === "Admin"
                                  ? "bg-red-100 text-red-800"
                                  : profile?.user_role === "Agent"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {profile?.user_role === "Admin"
                                ? "Administrator"
                                : profile?.user_role === "Agent"
                                ? "Agent"
                                : profile?.user_role || "User"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-medium text-gray-500">
                            Account Status
                          </label>
                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                profile?.email_verified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {profile?.email_verified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab
                key="my-listing"
                title={
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">My Listings</span>
                  </div>
                }
              >
                <div className="p-3 sm:p-6">
                  <UserListing />
                </div>
              </Tab>
            </Tabs>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default UserProfile;
