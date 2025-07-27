"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

import {
  HomeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BeakerIcon,
  SquaresPlusIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/components/helpers/formatCurrency";

// Smart Location Search Component
const SmartLocationSearch = ({ value, onChange, placeholder = "Enter location..." }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sample locations - replace with your actual JSON data
  const locations = [
    "Kathmandu", "Kirtipur", "Kalanki", "Koteshwor", "Kapan", "Kamalpokhari",
    "Lalitpur", "Lagankhel", "Lubhu", "Lokanthali",
    "Bhaktapur", "Banepa", "Balaju", "Baneshwor", "Budhanilkantha", "Basundhara",
    "Pokhara", "Patan", "Pulchowk", "Panipokhari",
    "Thamel", "Tripureshwor", "Tokha", "Thankot",
    "Swayambhu", "Sankhamul", "Sanepa", "Sinamangal",
    "Maharajgunj", "Maitidevi", "Mitrapark",
    "New Baneshwor", "Naxal", "New Road", "Naya Bazaar",
    "Chabahil", "Chhetrapati", "Chapagaun", "Chandragiri",
    "Dillibazar", "Dhulikhel", "Dhapasi", "Dhobighat",
    "Gongabu", "Gwarko", "Godawari", "Greenland",
    "Hattisar", "Hattiban", "Harisiddhi",
    "Imadol", "Itahari",
    "Jawalakhel", "Jhamsikhel", "Jorpati",
    "Kalimati", "Kumaripati", "Kupondole",
    "Ring Road", "Ratnapark", "Ramshah Path",
    "Samakhusi", "Sitapaila", "Shankharapur",
    "Tahachal", "Tinkune", "Thapathali",
    "Uttardhoka", "Urlabari",
    "VDC", "Valley",
    "Waling", "Ward",
    "Yala", "Yakkha"
  ];

  // Enhanced fuzzy search function
  const fuzzySearch = (searchTerm, locations) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    const results = locations.filter(location => {
      const locationLower = location.toLowerCase();
      return locationLower.startsWith(searchLower) || locationLower.includes(searchLower);
    });
    
    return results.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      const aStartsExact = aLower.startsWith(searchLower);
      const bStartsExact = bLower.startsWith(searchLower);
      if (aStartsExact && !bStartsExact) return -1;
      if (!aStartsExact && bStartsExact) return 1;
      
      return a.localeCompare(b);
    });
  };

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredLocations([]);
      setShowDropdown(false);
      return;
    }

    const filtered = fuzzySearch(searchTerm, locations).slice(0, 10);
    setFilteredLocations(filtered);
    setShowDropdown(isFocused && filtered.length > 0);
  }, [searchTerm, isFocused]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  const handleLocationSelect = (location) => {
    setSearchTerm(location);
    setShowDropdown(false);
    setIsFocused(false);
    onChange(location);
    if (searchRef.current) {
      searchRef.current.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm && filteredLocations.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = (e) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowDropdown(false);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={searchRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        autoComplete="off"
      />
      
      {showDropdown && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            <>
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{location}</span>
                </button>
              ))}
            </>
          ) : searchTerm && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No locations found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({ item, toggleFavorite, favorites }) => {
  const propertyLocation =
    item.address
      ?.split(",")
      .filter((part) => !part.trim().toLowerCase().includes("nepal"))
      .join(",")
      .trim() || "Unknown Location";

  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <Link href={`/view-listing/${item.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer">
          <Image
            src={item.listingImages?.[0]?.url || "/default-image.jpg"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={90}
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            alt={`${item.propertyType || "Property"} in ${propertyLocation}`}
          />

          {/* Status Badge */}
          {item.sold && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-red-500 text-white text-sm font-medium">
              Sold
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded text-blue-900 font-semibold text-sm">
            {item.price ? `Rs ${formatCurrency(item.price)}` : "Price on Request"}
          </div>

          {/* Action Tag (Rent/Sale) */}
          <div
            className={`absolute top-4 left-4 px-4 py-1 rounded text-white text-base font-medium ${
              item.action === "Sell" ? "bg-blue-600" : "bg-purple-600"
            }`}
          >
            {item.action === "Sell" ? "Sale" : "Rent"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {item?.post_title || "Property Title"}
          </h2>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-1 line-clamp-1">
            {item?.description || "A beautiful property with all the amenities you need."}
          </p>
          <p className="text-blue-600 text-xs font-medium mb-2">Click for details...</p>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {item?.full_address || item?.address || propertyLocation}
            </span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <HomeIcon className="h-4 w-4 text-blue-600" />
              <span>{item.rooms || "N/A"} Rooms</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <BeakerIcon className="h-4 w-4 text-blue-600" />
              <span>{item.bathrooms || "N/A"} Baths</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <SquaresPlusIcon className="h-4 w-4 text-blue-600" />
              <span>{item.area || "N/A"}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(item.id, e);
        }}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200 z-10"
      >
        {favorites.includes(item.id) ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
        )}
      </button>
    </div>
  );
};

function AllProperties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    propertyType: 'All',
    action: 'All',
    location: '',
    minPrice: '',
    maxPrice: '',
    rooms: 0,
    bathrooms: 0,
    sortBy: 'newest'
  });

  const itemsPerPage = 12;
  const propertyTypes = ['All', 'Room/Flat', 'House', 'Land', 'Shop'];
  const actionTypes = ['All', 'Sell', 'Rent'];

  // Fetch all properties on component mount
  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setIsLoading(true);
    try {
      const query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} properties`);
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Property type filter
    if (filters.propertyType !== 'All') {
      filtered = filtered.filter(item => item.propertyType === filters.propertyType);
    }

    // Action filter (Sell/Rent)
    if (filters.action !== 'All') {
      filtered = filtered.filter(item => item.action === filters.action);
    }

    // Location filter
    if (filters.location && filters.location.trim()) {
      filtered = filtered.filter(item => 
        item.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
        item.full_address?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(item => (parseFloat(item.price) || 0) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => (parseFloat(item.price) || 0) <= parseFloat(filters.maxPrice));
    }

    // Rooms filter
    if (filters.rooms > 0) {
      filtered = filtered.filter(item => (item.rooms || 0) >= filters.rooms);
    }

    // Bathrooms filter
    if (filters.bathrooms > 0) {
      filtered = filtered.filter(item => (item.bathrooms || 0) >= filters.bathrooms);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [filters, properties]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const toggleFavorite = (itemId, e) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: 'All',
      action: 'All',
      location: '',
      minPrice: '',
      maxPrice: '',
      rooms: 0,
      bathrooms: 0,
      sortBy: 'newest'
    });
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Loading All Properties...</h3>
                <p className="text-sm text-gray-600">Fetching properties from database</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-transparent border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <p className="text-gray-600">
                  Browse {filteredProperties.length} properties from our complete database
                </p>
                {/* Fetched Properties Count */}
                <div className="mt-2 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {properties.length} Total Properties Fetched
                  </span>
                </div>
              </div>
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {actionTypes.map(action => (
                    <option key={action} value={action}>{action === 'All' ? 'All Types' : action === 'Sell' ? 'For Sale' : 'For Rent'}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <SmartLocationSearch
                  value={filters.location}
                  onChange={(value) => handleFilterChange('location', value)}
                  placeholder="Search location..."
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rooms</label>
                <select
                  value={filters.rooms}
                  onChange={(e) => handleFilterChange('rooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={5}>5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProperties.length)} of {filteredProperties.length} properties
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Properties Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            // Loading skeleton cards
            Array.from({ length: 12 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-[16/9] w-full bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <PropertyCard
                key={`${item.id}-${index}`}
                item={item}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            ))
          ) : (
            // No results
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 max-w-md mx-auto p-6 rounded-lg border border-gray-200">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredProperties.length > itemsPerPage && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1.5 border rounded-md text-sm ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                <span>Previous</span>
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                {renderPaginationNumbers()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1.5 border rounded-md text-sm ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProperties.length)} of {filteredProperties.length} properties
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProperties;