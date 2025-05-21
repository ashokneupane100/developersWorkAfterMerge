"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';
import { Mail, Phone, MoreVertical, User, UserCheck, UserX, Search, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
// Fix the import or use a different loading spinner
// import { Spinner } from '@heroicons/react'; // Incorrect import
import { RefreshCw as Spinner } from 'lucide-react'; // Using RefreshCw as a spinner for now

// Common interface that can represent users from both tables
interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  created_at: string | null;
  provider?: string; // 'google', 'email', or 'manual'
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const supabase = createClient();
  
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);

      // Use admin client to fetch auth users (server-side only)
      const fetchAuthUsers = async () => {
        try {
          const response = await fetch('/api/admin/users');
          if (!response.ok) {
            throw new Error('Failed to fetch auth users');
          }
          return await response.json();
        } catch (err) {
          console.error('Error fetching auth users:', err);
          return { data: [] };
        }
      };

      // Fetch profiles from the public profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
          
      if (profilesError) throw profilesError;

      // Fetch auth users via API route
      const { data: authUsersData } = await fetchAuthUsers();

      // Transform auth users to match UserProfile structure
      const transformedAuthUsers: UserProfile[] = (authUsersData || []).map((user: any) => {
        const isGoogleUser = user.app_metadata?.provider === 'google' || 
                            user.identities?.some((identity: any) => identity.provider === 'google');
        
        return {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          email: user.email,
          phone: user.phone || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          email_verified: !!user.email_confirmed_at,
          created_at: user.created_at,
          provider: isGoogleUser ? 'google' : 'email'
        };
      });

      // Add provider info to manual profiles
      const transformedProfiles: UserProfile[] = (profilesData || []).map(profile => ({
        ...profile,
        provider: 'manual'
      }));

      // Combine both arrays and sort by email
      const allUsers = [...transformedProfiles, ...transformedAuthUsers].sort((a, b) => {
        if (!a.email) return 1;
        if (!b.email) return -1;
        return a.email.localeCompare(b.email);
      });

      // Remove duplicate users if they exist in both tables
      // Use a Map to efficiently identify duplicates by email
      const uniqueUsersMap = new Map();
      allUsers.forEach(user => {
        if (!user.email) return;
        // Prefer auth users over profile users when both exist
        if (!uniqueUsersMap.has(user.email) || user.provider !== 'manual') {
          uniqueUsersMap.set(user.email, user);
        }
      });

      const uniqueUsers = Array.from(uniqueUsersMap.values());

      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modify the loading state to NOT use a full-screen overlay
  return (
    <AdminDashboard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Users</h2>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <button 
              onClick={fetchUsers}
              className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              title="Refresh Users"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add User
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name || 'User avatar'} 
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-indigo-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Unnamed User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.provider === 'google' 
                          ? 'bg-blue-100 text-blue-800' 
                          : user.provider === 'email'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.provider === 'google' 
                          ? 'Google' 
                          : user.provider === 'email'
                          ? 'Email'
                          : 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.email_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.email_verified ? (
                          <span className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UserX className="h-4 w-4 mr-1" /> Unverified
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {users.length === 0 ? 'No users found.' : 'No matching users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default UsersPage;