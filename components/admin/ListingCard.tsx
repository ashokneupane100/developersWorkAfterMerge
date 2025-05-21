"use client"
import React, { useState } from 'react';
import { Home, MapPin, Tag, Eye, Edit, Trash2, X, AlertCircle, Phone } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: number;
    post_title: string;
    address: string;
    price: number;
    propertyType: string;
    rooms?: number | null;
    bathrooms?: string | null;
    area?: string | null;
    description?: string | null;
    sold: boolean;
    phone?: string | null;
    fullName?: string;
    action?: string;
    parking?: string | null;
    created_at?: string;
    views?: number;
  };
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  if (value >= 10000000) {
    // More than 1 crore
    const crores = value / 10000000;
    return `Rs. ${crores.toFixed(2)} Cr`;
  } else if (value >= 100000) {
    // More than 1 lakh
    const lakhs = value / 100000;
    return `Rs. ${lakhs.toFixed(2)} Lakh`;
  } else {
    // Regular formatting
    return `Rs. ${value?.toLocaleString('en-IN')}`;
  }
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onDelete, onEdit }) => {
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleViewClick = () => {
    setShowViewModal(true);
  };

  const handleEditClick = () => {
    onEdit(listing.id);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(listing.id);
    setShowDeleteModal(false);
  };

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 truncate mb-2 pr-2">
              {truncateText(listing.post_title || 'Untitled Listing', 40)}
            </h3>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                listing.sold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {listing.sold ? 'Sold' : 'Available'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{listing.address || 'Location not specified'}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Home className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{listing.propertyType || 'Property'}</span>
              {listing.rooms && <span className="ml-2">{listing.rooms} rooms</span>}
              {listing.area && <span className="ml-2">• {listing.area}</span>}
            </div>
            
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Tag className="h-4 w-4 mr-1 flex-shrink-0 text-gray-500" />
              <span>{formatCurrency(listing.price)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {listing.action || 'Sell'} • {listing.fullName ? `by ${listing.fullName}` : ''}
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-indigo-500"
                title="View Details"
                onClick={handleViewClick}
              >
                <Eye className="h-5 w-5" />
              </button>
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-yellow-500"
                title="Edit Listing"
                onClick={handleEditClick}
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-red-500"
                title="Delete Listing"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pt-1 pb-2 border-b">
              <h3 className="text-xl font-medium text-gray-900">Listing Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-lg text-gray-900 mb-2">{listing.post_title}</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    listing.sold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {listing.sold ? 'Sold' : 'Available'}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                    {listing.propertyType}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                    {listing.action || 'Sell'}
                  </span>
                  {listing.views !== undefined && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                      {listing.views} views
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Property Details</h5>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{listing.propertyType}</span>
                    </div>
                    {listing.rooms !== undefined && listing.rooms !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{listing.rooms}</span>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bathrooms:</span>
                        <span className="font-medium">{listing.bathrooms}</span>
                      </div>
                    )}
                    {listing.area && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{listing.area}</span>
                      </div>
                    )}
                    {listing.parking && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parking:</span>
                        <span className="font-medium">{listing.parking}</span>
                      </div>
                    )}
                    {listing.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listed on:</span>
                        <span className="font-medium">{formatDate(listing.created_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Location & Price</h5>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right max-w-[60%]">{listing.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-right">{formatCurrency(listing.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {listing.description && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h5>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {listing.fullName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-medium">{listing.fullName}</span>
                    </div>
                  )}
                  {listing.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${listing.phone}`} className="font-medium flex items-center text-indigo-600 hover:text-indigo-800">
                        <Phone className="h-4 w-4 mr-1" /> {listing.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white pt-3 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Listing
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
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4 text-yellow-600">
                <AlertCircle className="h-6 w-6 mr-2" />
                <p className="font-medium">Are you sure you want to delete this listing?</p>
              </div>
              <p className="text-gray-500">
                This action cannot be undone. This will permanently delete the listing 
                <span className="font-medium text-gray-700"> "{truncateText(listing.post_title || 'Untitled', 30)}"</span>.
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
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingCard;