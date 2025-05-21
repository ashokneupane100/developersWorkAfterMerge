// app/(auth)/testprofile/page.tsx (or wherever this file lives)
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/Provider/useAuth";

// Define the User type based on your useAuth implementation
interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// Define the Profile type based on your Supabase 'profiles' table schema
interface Profile {
  avatar_url?: string;
  full_name?: string;
  email_verified?: boolean;
  created_at?: string;
}

export default function UserProfile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsProfileLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (!isLoading) {
      fetchUserProfile();
    }
  }, [user, isLoading]);

  if (isLoading || isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || "User"}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{profile?.full_name}</h2>
          <p className="text-gray-600">{user.email}</p>
          {profile?.email_verified && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Account Details</h3>
        <dl className="mt-2 divide-y divide-gray-200">
          <div className="py-2 flex justify-between">
            <dt className="text-gray-500">User ID</dt>
            <dd className="text-gray-900 truncate">{user.id}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{user.email}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="text-gray-500">Provider</dt>
            <dd className="text-gray-900">Google</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="text-gray-500">Created At</dt>
            <dd className="text-gray-900">
              {profile?.created_at &&
                new Date(profile.created_at).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
        }}
        className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Sign Out
      </button>
    </div>
  );
}