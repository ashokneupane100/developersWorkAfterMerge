"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {toast, Toaster } from "react-hot-toast"
import {
  Search, FileText, Phone, Mail, User, MapPin, DollarSign, Eye,
  CheckCircle, XCircle, Calendar, Trash2, X, AlertCircle,
  MoreHorizontal, CheckSquare,
  SquarePen
} from 'lucide-react';
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
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [editFormData, setEditFormData] = useState<Partial<PropertyRequest>>({});

  const supabase = createClient();

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
      const { data, error } = await supabase.from('property_requests').select('*');
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching property requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdateClick = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  async function updateRequestStatus(id: string, status: string, notes?: string) {
    try {
      const updateData: { status: string; status_notes?: string; status_updated_at?: string } = {
        status,
        status_updated_at: new Date().toISOString()
      };
      if (notes) updateData.status_notes = notes;
      const { error } = await supabase.from('property_requests').update(updateData).eq('id', id);
      if (error) throw error;
      setRequests(requests.map(req => req.id === id ? { ...req, status, status_notes: notes } : req));
      setShowStatusModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }

  const handleDeleteClick = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };



  const confirmDelete = async () => {
    if (!selectedRequest) return;
    try {
      const { error } = await supabase.from('property_requests').delete().eq('id', selectedRequest.id);
      if (error) throw error;
      setRequests(requests.filter(request => request.id !== selectedRequest.id));
      setShowDeleteModal(false);
      setSelectedRequest(null);
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getStatusColorClass = (status: string | null) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const handleEditClick = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setEditFormData(request);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const { error } = await supabase
        .from('property_requests')
        .update({ ...editFormData, updated_at: new Date().toISOString() })
        .eq('id', selectedRequest.id);
      if (error) throw error;
      setRequests(requests.map(req => req.id === selectedRequest.id ? { ...req, ...editFormData } : req));
      setShowEditModal(false);
      setSelectedRequest(null);
      toast.success('Request updated successfully');
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  return (
    <>
    <Toaster />
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
                        {/* <MoreHorizontal className="h-4 w-4 text-gray-400" /> */}
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
                          className="text-green-600 hover:text-indigo-900"
                          title="View Details"
                          onClick={() => handleEditClick(request)}
                        >
                         <SquarePen className="h-5 w-5" />
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
      {/* Add Edit Modal Here */}
      {/* {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Property Request</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.full_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="text"
                    value={editFormData.budget || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    value={editFormData.property_type || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="Land">Land</option>
                    <option value="House">House</option>
                    <option value="Room/Flat">Room/Flat</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Requirements</label>
                  <textarea
                    value={editFormData.additional_requirements || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, additional_requirements: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

    {/* {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Property Request</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Full Name', 'full_name'],
                  ['Email', 'email'],
                  ['Phone', 'phone'],
                  ['Location', 'location'],
                  ['Budget', 'budget'],
                  ['Property Type', 'property_type'],
                  ['Area', 'area'],
                  ['Area Unit', 'area_unit'],
                  ['Road Width', 'road_width'],
                  ['Road Width Unit', 'road_width_unit'],
                  ['No. of Rooms', 'number_of_rooms'],
                  ['No. of People', 'number_of_people'],
                  ['Coordinates', 'coordinates'],
                  ['Admin Notes', 'admin_notes'],
                  ['Status', 'status'],
                  ['Has Paid', 'hasPaid'],
                  ['Email Count', 'emailCount'],
                  ['Message Count', 'messageCount'],
                ].map(([label, key]) => (
                  <div key={key as string}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      value={(editFormData[key as keyof PropertyRequest]?.toString() ?? '') as string}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Requirements</label>
                  <textarea
                    value={editFormData.additional_requirements || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, additional_requirements: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

     {showEditModal && selectedRequest && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 overflow-x-auto max-h-[90vh]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Edit Property Request</h3>
        <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleEditSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            ['Full Name', 'full_name'],
            ['Email', 'email'],
            ['Phone', 'phone'],
            ['Location', 'location'],
            ['Budget', 'budget'],
            ['Area', 'area'],
            ['Coordinates', 'coordinates'],
            ['Admin Notes', 'admin_notes'],
            ['Has Paid', 'hasPaid'],
            ['Email Count', 'emailCount'],
            ['Message Count', 'messageCount'],
            ['No. of Rooms', 'number_of_rooms'],
            ['No. of People', 'number_of_people'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={(editFormData[key as keyof PropertyRequest]?.toString() ?? '')}
                onChange={(e) => setEditFormData(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          ))}

          {/* Property Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select
              value={editFormData.property_type || ''}
              onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Land">Land</option>
              <option value="House">House</option>
              <option value="Room/Flat">Room/Flat</option>
            </select>
          </div>

          {/* Area Unit Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Area Unit</label>
            <select
              value={editFormData.area_unit || ''}
              onChange={(e) => setEditFormData({ ...editFormData, area_unit: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Sq.ft">Sq.ft</option>
              <option value="Ropani">Ropani</option>
              <option value="Aana">Aana</option>
              <option value="Paisa">Paisa</option>
              <option value="Daam">Daam</option>
            </select>
          </div>

          {/* Road Width Unit Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Road Width Unit</label>
            <select
              value={editFormData.road_width_unit || ''}
              onChange={(e) => setEditFormData({ ...editFormData, road_width_unit: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="ft">ft</option>
              <option value="m">m</option>
            </select>
          </div>

          {/* Road Width Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Road Width</label>
            <input
              type="text"
              value={editFormData.road_width || ''}
              onChange={(e) => setEditFormData({ ...editFormData, road_width: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editFormData.status || ''}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Additional Requirements */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Additional Requirements</label>
            <textarea
              value={editFormData.additional_requirements || ''}
              onChange={(e) => setEditFormData({ ...editFormData, additional_requirements: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
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
    </>
  );
};

export default RequestsPage;
