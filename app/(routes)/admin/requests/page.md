"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, FileText, Phone, Mail, User, MapPin, DollarSign, Eye, CheckCircle, XCircle, Calendar, Trash2, X, AlertCircle, MoreHorizontal, CheckSquare } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface PropertyRequest {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  property_type: string | null;
  location: string | null;
  budget: string | null;
  status: string | null;
  created_at: string | null;
  area?: string | null;
  area_unit?: string | null;
  road_width?: string | null;
  road_width_unit?: string | null;
  number_of_rooms?: number | null;
  number_of_people?: number | null;
  additional_requirements?: string | null;
  financing?: boolean;
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [statusNotes, setStatusNotes] = useState<string>('');
  
  const supabase = createClient();
  
  // Define status options with colors
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'processed', label: 'Processed', color: 'bg-blue-100 text-blue-800', icon: <CheckSquare className="h-4 w-4" /> },
    { value: 'contacted', label: 'Contacted', color: 'bg-indigo-100 text-indigo-800', icon: <Phone className="h-4 w-4" /> },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from('property_requests')
        .select('*')
          
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching property requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = requests.filter(request => {
    // Search filter
    const matchesSearch = 
      request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Open Status Update Modal
  const handleStatusUpdateClick = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  // Update Request Status
  async function updateRequestStatus(id: string, status: string, notes?: string) {
    try {
      const updateData: { status: string; status_notes?: string; status_updated_at?: string } = { 
        status,
        status_updated_at: new Date().toISOString()
      };
      
      if (notes) {
        updateData.status_notes = notes;
      }
      
      const { error } = await supabase
        .from('property_requests')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status, status_notes: notes } : req
      ));
      
      setShowStatusModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }

  // Delete Request
  const handleDeleteClick = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await supabase
        .from('property_requests')
        .delete()
        .eq('id', selectedRequest.id);
        
      if (error) throw error;
      
      // Update local state
      setRequests(requests.filter(request => request.id !== selectedRequest.id));
      setShowDeleteModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string | null) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminDashboard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Property Requests</h2>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget & Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.full_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" /> {request.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" /> {request.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.property_type}
                      </div>
                      {request.property_type === 'Land' || request.property_type === 'House' ? (
                        <div className="text-sm text-gray-500">
                          {request.area} {request.area_unit}
                          {request.road_width && (
                            <span>, Road: {request.road_width} {request.road_width_unit}</span>
                          )}
                        </div>
                      ) : request.property_type === 'Room/Flat' ? (
                        <div className="text-sm text-gray-500">
                          {request.number_of_rooms} room(s), for {request.number_of_people} people
                        </div>
                      ) : null}
                      {request.additional_requirements && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {request.additional_requirements}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" /> 
                        {request.budget}
                        {request.financing && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            Financing
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" /> 
                        <span className="truncate max-w-xs">{request.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleStatusUpdateClick(request)}
                        className="flex items-center space-x-1 focus:outline-none hover:bg-gray-50 px-2 py-1 rounded-md"
                      >
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(request.status)}`}>
                          {request.status || 'Pending'}
                        </span>
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {request.created_at 
                          ? new Date(request.created_at).toLocaleDateString() 
                          : 'Unknown'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Delete Request"
                          onClick={() => handleDeleteClick(request)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {requests.length === 0 ? 'No property requests found.' : 'No matching property requests found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                <span className="font-medium">{selectedRequest.full_name}</span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Current status: 
                <span className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(selectedRequest.status)}`}>
                  {selectedRequest.status || 'Pending'}
                </span>
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateRequestStatus(selectedRequest.id, option.value, statusNotes)}
                      className={`flex items-center px-4 py-3 border rounded-md transition-colors ${
                        selectedRequest.status === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${option.color.replace('text-', 'text-white ').replace('bg-', 'bg-')}`}>
                        {option.icon}
                      </div>
                      <span className="ml-3 font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="statusNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    id="statusNotes"
                    rows={3}
                    placeholder="Add any notes about this status update..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4 text-yellow-600">
                <AlertCircle className="h-6 w-6 mr-2" />
                <p className="font-medium">Are you sure you want to delete this request?</p>
              </div>
              <p className="text-gray-500">
                This action cannot be undone. This will permanently delete the property request from
                <span className="font-medium text-gray-700"> {selectedRequest?.full_name}</span>.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboard>
  );
};

export default RequestsPage;