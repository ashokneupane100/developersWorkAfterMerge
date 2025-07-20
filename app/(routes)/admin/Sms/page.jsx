"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase/client";
import { Loader, Send, RefreshCw, MapPin, Home, Building, Leaf, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';

// Property type icons mapping
const propertyTypeIcons = {
  'Room/Flat': <Building size={16} className="mr-2" />,
  'House': <Home size={16} className="mr-2" />,
  'Land': <Leaf size={16} className="mr-2" />,
  'Shop': <ShoppingBag size={16} className="mr-2" />
};

export default function SmsNotificationDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [testingItemType, setTestingItemType] = useState(null);
  const [testingResults, setTestingResults] = useState(null);
  const [processingItemId, setProcessingItemId] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.email) return;
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (data && !error) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Fetch recent requests and listings
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setLoading(true);
      try {
        // Fetch recent property requests
        const { data: requests, error: requestsError } = await supabase
          .from('property_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (requestsError) throw requestsError;
        setRecentRequests(requests || []);
        
        // Fetch recent listings
        const { data: listings, error: listingsError } = await supabase
          .from('listing')
          .select('*, listing_details(*)')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (listingsError) throw listingsError;
        setRecentListings(listings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    setRecentRequests([]);
    setRecentListings([]);
    setSelectedItem(null);
    setTestingResults(null);
    
    // Re-fetch data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch recent property requests
        const { data: requests, error: requestsError } = await supabase
          .from('property_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (requestsError) throw requestsError;
        setRecentRequests(requests || []);
        
        // Fetch recent listings
        const { data: listings, error: listingsError } = await supabase
          .from('listing')
          .select('*, listing_details(*)')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (listingsError) throw listingsError;
        setRecentListings(listings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  };

  // Handle item selection
  const handleSelectItem = (item, type) => {
    setSelectedItem(item);
    setTestingItemType(type);
    setTestingResults(null);
  };

  // Trigger SMS notifications for a listing
  const handleTriggerListingNotifications = async (listingId) => {
    if (!listingId) return;
    
    setProcessingItemId(listingId);
    try {
      const response = await axios.post('/api/listing-notification', { listingId });
      
      if (response.data.success) {
        toast.success(`Notifications sent: ${response.data.notifications.sent}, Failed: ${response.data.notifications.failed}, Skipped: ${response.data.notifications.skipped}`);
        setTestingResults({
          success: true,
          message: 'SMS notifications processed successfully',
          notifications: response.data.notifications
        });
      } else {
        toast.error('Failed to process notifications');
        setTestingResults({
          success: false,
          message: 'Failed to process notifications',
          error: response.data.error
        });
      }
    } catch (error) {
      console.error('Error triggering notifications:', error);
      toast.error('Error processing notifications');
      setTestingResults({
        success: false,
        message: 'Error processing notifications',
        error: error.message
      });
    } finally {
      setProcessingItemId(null);
    }
  };

  // If still checking auth or not admin, show loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 text-center">
          You do not have permission to access this admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SMS Notification Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="flex items-center"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Property Requests */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Property Requests</h2>
            
            {recentRequests.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No recent property requests found.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedItem?.id === request.id && testingItemType === 'request' ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectItem(request, 'request')}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          {propertyTypeIcons[request.property_type] || <Home size={16} className="mr-2" />}
                          <span className="font-medium">{request.property_type}</span>
                          <span className="ml-2 text-sm text-gray-500">({request.budget})</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          <span className="truncate max-w-[200px]">{request.location}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          From: {request.full_name} • {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Listings */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
            
            {recentListings.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No recent listings found.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className={`py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedItem?.id === listing.id && testingItemType === 'listing' ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectItem(listing, 'listing')}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          {listing.listing_details?.property_type && propertyTypeIcons[listing.listing_details.property_type] || <Home size={16} className="mr-2" />}
                          <span className="font-medium">
                            {listing.listing_details?.title || listing.address.substring(0, 30) + (listing.address.length > 30 ? '...' : '')}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          <span className="truncate max-w-[200px]">{listing.address}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Type: {listing.listing_details?.property_type || 'N/A'} • 
                          {listing.listing_details?.price_range && ` Price: ${listing.listing_details.price_range} • `}
                          {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerListingNotifications(listing.id);
                        }}
                        disabled={processingItemId === listing.id}
                      >
                        {processingItemId === listing.id ? (
                          <Loader size={14} className="animate-spin mr-1" />
                        ) : (
                          <Send size={14} className="mr-1" />
                        )}
                        Notify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Item Details */}
      {selectedItem && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {testingItemType === 'request' ? 'Property Request Details' : 'Listing Details'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {testingItemType === 'request' ? (
                <>
                  <h3 className="text-lg font-medium mb-2">Request Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedItem.full_name}</div>
                    <div><span className="font-medium">Email:</span> {selectedItem.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedItem.phone}</div>
                    <div><span className="font-medium">Property Type:</span> {selectedItem.property_type}</div>
                    <div><span className="font-medium">Budget:</span> {selectedItem.budget}</div>
                    <div><span className="font-medium">Location:</span> {selectedItem.location}</div>
                    <div><span className="font-medium">Created:</span> {new Date(selectedItem.created_at).toLocaleString()}</div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">Listing Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Address:</span> {selectedItem.address}</div>
                    <div><span className="font-medium">Created By:</span> {selectedItem.createdBy}</div>
                    <div><span className="font-medium">Property Type:</span> {selectedItem.listing_details?.property_type || 'N/A'}</div>
                    <div><span className="font-medium">Title:</span> {selectedItem.listing_details?.title || 'N/A'}</div>
                    <div><span className="font-medium">Price Range:</span> {selectedItem.listing_details?.price_range || 'N/A'}</div>
                    <div><span className="font-medium">Created:</span> {new Date(selectedItem.created_at).toLocaleString()}</div>
                    <div><span className="font-medium">Active:</span> {selectedItem.active ? 'Yes' : 'No'}</div>
                  </div>
                </>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">SMS Notification Testing</h3>
              
              {testingItemType === 'listing' && (
                <Button
                  className="mb-4 w-full"
                  onClick={() => handleTriggerListingNotifications(selectedItem.id)}
                  disabled={processingItemId === selectedItem.id}
                >
                  {processingItemId === selectedItem.id ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Test Send Notifications
                    </>
                  )}
                </Button>
              )}
              
              {testingResults && (
                <div className={`p-4 rounded-md ${testingResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h4 className={`font-medium ${testingResults.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testingResults.message}
                  </h4>
                  
                  {testingResults.notifications && (
                    <div className="mt-2 text-sm">
                      <div><span className="font-medium">Sent:</span> {testingResults.notifications.sent}</div>
                      <div><span className="font-medium">Failed:</span> {testingResults.notifications.failed}</div>
                      <div><span className="font-medium">Skipped:</span> {testingResults.notifications.skipped}</div>
                    </div>
                  )}
                  
                  {testingResults.error && (
                    <div className="mt-2 text-sm text-red-700">
                      <div><span className="font-medium">Error:</span> {testingResults.error}</div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Coordinates</h4>
                {testingItemType === 'request' ? (
                  selectedItem.coordinates ? (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {typeof selectedItem.coordinates === 'object' ? 
                        JSON.stringify(selectedItem.coordinates, null, 2) : 
                        selectedItem.coordinates}
                    </pre>
                  ) : (
                    <div className="text-gray-500">No coordinates available</div>
                  )
                ) : (
                  selectedItem.coordinates ? (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {typeof selectedItem.coordinates === 'object' ? 
                        JSON.stringify(selectedItem.coordinates, null, 2) : 
                        selectedItem.coordinates}
                    </pre>
                  ) : (
                    <div className="text-gray-500">No coordinates available</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}