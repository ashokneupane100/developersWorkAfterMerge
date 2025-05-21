"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Home, FileText, DollarSign } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface Stats {
  users: number;
  listings: number;
  requests: number;
  revenue: number;
}

interface PropertyRequest {
  id: string;
  full_name: string | null;
  location: string | null;
  property_type: string | null;
  status: string | null;
  created_at: string | null;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    listings: 0,
    requests: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [recentRequests, setRecentRequests] = useState<PropertyRequest[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // Fetch listings count
        const { count: listingCount, error: listingError } = await supabase
          .from('listing')
          .select('*', { count: 'exact', head: true });
        
        if (listingError) throw listingError;
        
        // Fetch requests count
        const { count: requestCount, error: requestError } = await supabase
          .from('property_requests')
          .select('*', { count: 'exact', head: true });
        
        if (requestError) throw requestError;
        
        // Fetch recent requests
        const { data: recentRequestsData, error: recentRequestsError } = await supabase
          .from('property_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentRequestsError) throw recentRequestsError;
        setRecentRequests(recentRequestsData || []);
        
        // Set stats
        setStats({
          users: userCount || 0,
          listings: listingCount || 0,
          requests: requestCount || 0,
          revenue: 0 // Placeholder for actual revenue data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <AdminDashboard>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.users} 
                icon={<Users className="h-6 w-6" />}
                color="indigo"
              />
              <StatCard 
                title="Active Listings" 
                value={stats.listings} 
                icon={<Home className="h-6 w-6" />}
                color="blue"
              />
              <StatCard 
                title="Property Requests" 
                value={stats.requests} 
                icon={<FileText className="h-6 w-6" />}
                color="green"
              />
              <StatCard 
                title="Revenue" 
                value={`${stats.revenue.toLocaleString()}`} 
                icon={<DollarSign className="h-6 w-6" />}
                color="yellow"
              />
            </div>
            
            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Property Requests</h3>
                  <a href="/admin/requests" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </a>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request.id} className="px-6 py-4 flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-indigo-500" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.full_name}</p>
                            <p className="text-sm text-gray-500">
                              {request.property_type} in {request.location}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full 
                            ${!request.status || request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : request.status === 'processed' 
                              ? 'bg-blue-100 text-blue-800'
                              : request.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {request.status || 'Pending'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {request.created_at 
                            ? new Date(request.created_at).toLocaleDateString() 
                            : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No recent property requests.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;