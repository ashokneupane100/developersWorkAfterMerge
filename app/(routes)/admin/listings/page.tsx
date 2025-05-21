"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Home, MapPin, Filter, Plus, AlertCircle, X, Trash2, Edit, HomeIcon, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ListingCard from '@/components/admin/ListingCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatCurrency } from '@/components/helpers/formatCurrency';

interface ListingImage {
  id: number;
  url: string;
  listing_id: number;
}

interface Listing {
  id: number;
  created_at: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdBy?: string;
  active: boolean;
  propertyType: string;
  rooms?: number | null;
  bathrooms?: string | null;
  parking?: string | null;
  area?: string | null;
  price: number;
  description?: string | null;
  profileImage?: string;
  fullName?: string;
  action?: string;
  gharbeti_number?: string | null;
  real_address_?: string | null;
  gharbeti_name?: string | null;
  phone?: string | null;
  post_title: string;
  sold: boolean;
  views?: number;
  khali_hune_date?: string | null;
  listingImages?: ListingImage[];
}

interface EditFormState {
  title: string;
  address: string;
  price: string;
  propertyType: string;
  status: string;
  description: string;
  rooms: string;
  bathrooms: string;
  area: string;
  phone: string;
  parking: string;
}

const PropertyListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const listingsPerPage = 9;
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  async function fetchListings() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch listings from Supabase with their images
      const { data, error } = await supabase
        .from('listing')
        .select('*, listingImages(id, url, listing_id)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setListings(data || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const filteredListings = listings.filter(listing => {
    // Search filter
    const matchesSearch = 
      listing.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      listing.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesFilter = 
      filter === 'all' || 
      listing.propertyType?.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const propertyTypes = ['all', 'house', 'land', 'apartment', 'room', 'commercial'];

  // Open Delete Confirmation Modal
  const openDeleteModal = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Delete Listing
  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      setLoading(true);
      
      // First delete the listing images
      const { error: imagesError } = await supabase
        .from('listingImages')
        .delete()
        .eq('listing_id', deletingId);
        
      if (imagesError) {
        console.error('Error deleting listing images:', imagesError);
        // Continue with deletion anyway
      }
      
      // Then delete the listing itself
      const { error } = await supabase
        .from('listing')
        .delete()
        .eq('id', deletingId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setListings(listings.filter(listing => listing.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      
      // Recalculate current page if necessary
      const newTotalPages = Math.ceil((filteredListings.length - 1) / listingsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      // Show success notification
      alert('Listing deleted successfully');
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Edit Page
  const handleEdit = (id: number) => {
    router.replace(`/edit-listing/${id}?returnToAdmin=true`);
  };

  // Get primary image for a listing
  const getListingImage = (listing: Listing) => {
    if (listing.listingImages && listing.listingImages.length > 0) {
      return listing.listingImages[0].url;
    }
    return null;
  };

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center mt-8 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, i) => {
            // Show pagination numbers with ellipsis for large page counts
            const pageNumber = i + 1;
            
            // Always show first page, last page, current page, and pages around current page
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => paginate(pageNumber)}
                  className={`h-8 w-8 rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-indigo-50'
                  }`}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            }
            
            // Show ellipsis (but only once on each side)
            if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return <span key={i} className="px-1">...</span>;
            }
            
            return null;
          })}
        </div>
        
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <AdminDashboard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Property Listings</h2>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <div className="relative inline-flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/admin/listings/new'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Listing
            </button>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="text-sm text-gray-500">
          {filteredListings.length > 0 && (
            <p>
              Showing {indexOfFirstListing + 1}-{Math.min(indexOfLastListing, filteredListings.length)} of {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex space-x-2">
                    <button
                      onClick={() => handleEdit(listing.id)}
                      className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition-colors"
                      aria-label="Edit listing"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(listing.id)}
                      className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition-colors"
                      aria-label="Delete listing"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                  
                  <div className="h-48 bg-gray-200">
                    {listing.listingImages && listing.listingImages.length > 0 ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={listing.listingImages[0].url}
                          alt={listing.post_title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                          {listing.listingImages.length} {listing.listingImages.length === 1 ? 'photo' : 'photos'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <span className="text-sm">No images</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">{listing.post_title}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>
                    </div>
                    
                    <div className="ml-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.sold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {listing.sold ? 'Sold' : 'Active'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">Rs {formatCurrency(listing.price || 0)}</span>
                        {listing.action === 'Rent' && <span className="ml-1">/month</span>}
                      </p>
                      
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        {listing.rooms && (
                          <span>{listing.rooms} Rooms</span>
                        )}
                        {listing.bathrooms && (
                          <span>{listing.bathrooms} Bath</span>
                        )}
                        {listing.area && (
                          <span>{listing.area}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <span>
                        {new Date(listing.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredListings.length === 0 && (
              <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                {listings.length === 0 ? 'No listings found.' : 'No matching listings found.'}
              </div>
            )}
          </div>
        )}
        
        {/* Pagination controls */}
        <PaginationControls />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Listing</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md  text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboard>
  );
};

export default PropertyListingsPage;