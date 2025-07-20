"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Building2, User, Edit, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Divider,
  Spinner,
  Avatar
} from "@heroui/react";
import UserListing from './_components/UserListing';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function UserProfile() {
  const { user, profile, loading, signOut } = useAuth();
  const isAuthenticated = !!user;
  const isLoading = loading;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-listing");
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className='my-6 md:px-10 lg:px-32 w-full max-w-screen-xl mx-auto'>
      <h2 className='font-bold text-2xl py-3'>Profile</h2>
      
      <Card className="shadow-md rounded-xl">
        <CardBody className="p-0">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              <Avatar
                size="xl"
                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=AFE1AF&color=ffff`}
                alt={user?.name || "User"}
                isBordered
                color="success"
                className="w-24 h-24"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/edit-profile">
                  <Button 
                    variant="outline"
                    size="md"
                    startContent={<Edit className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  color="danger"
                  size="md"
                  startContent={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className="px-6 pt-4">
            <Tabs 
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
              variant="underlined"
              color="primary"
              aria-label="Profile tabs"
            >
              <Tab 
                key="profile" 
                title={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                }
              >
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Account Information</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Name</label>
                          <div className="mt-1 text-gray-900">{user?.name}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <div className="mt-1 text-gray-900">{user?.email}</div>
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
                    <span>My Listings</span>
                  </div>
                }
              >
                <div className="p-6">
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