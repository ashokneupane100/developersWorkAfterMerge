"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import CTASection from "./CTASection";
import LocationUpdater from "./geolocation/LocationUpdater";
import NearbyListings from "./geolocation/NeaarbyListings";

// Smart Location Search Component
const SmartLocationSearch = ({ value, onChange, placeholder = "Enter location..." }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sample locations with common misspellings - replace this with your actual JSON data
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

  // Common misspellings mapping
  const misspellingMap = {
    'kriti': 'kirtipur',
    'kritipur': 'kirtipur',
    'kathamndu': 'kathmandu',
    'katmandu': 'kathmandu',
    'lalitpur': 'lalitpur',
    'lalitapur': 'lalitpur',
    'bhaktpur': 'bhaktapur',
    'bhaktapur': 'bhaktapur'
  };

  // Enhanced fuzzy search function
  const fuzzySearch = (searchTerm, locations) => {
    const searchLower = searchTerm.toLowerCase().trim();

    // First check if search term matches any misspelling
    const correctedTerm = misspellingMap[searchLower] || searchLower;

    // Filter locations with multiple matching strategies
    const results = locations.filter(location => {
      const locationLower = location.toLowerCase();

      // Strategy 1: Exact start match (highest priority)
      if (locationLower.startsWith(searchLower)) return true;
      if (locationLower.startsWith(correctedTerm)) return true;

      // Strategy 2: Contains the search term
      if (locationLower.includes(searchLower)) return true;
      if (locationLower.includes(correctedTerm)) return true;

      // Strategy 3: Fuzzy match for common typos (simple character swaps)
      if (searchTerm.length >= 3) {
        // Check for adjacent character swaps (like "kriti" vs "kirti")
        for (let i = 0; i < searchTerm.length - 1; i++) {
          const swapped = searchTerm.slice(0, i) +
            searchTerm[i + 1] +
            searchTerm[i] +
            searchTerm.slice(i + 2);
          if (locationLower.includes(swapped.toLowerCase())) return true;
        }
      }

      return false;
    });

    // Sort results: exact matches first, then starts-with, then contains
    return results.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      // Exact start matches first
      const aStartsExact = aLower.startsWith(searchLower);
      const bStartsExact = bLower.startsWith(searchLower);
      if (aStartsExact && !bStartsExact) return -1;
      if (!aStartsExact && bStartsExact) return 1;

      // Then corrected term matches
      const aStartsCorrected = aLower.startsWith(correctedTerm);
      const bStartsCorrected = bLower.startsWith(correctedTerm);
      if (aStartsCorrected && !bStartsCorrected) return -1;
      if (!aStartsCorrected && bStartsCorrected) return 1;

      // Then alphabetical
      return a.localeCompare(b);
    });
  };

  // Filter locations based on search term
  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredLocations([]);
      setShowDropdown(false);
      return;
    }

    // Use enhanced fuzzy search
    const filtered = fuzzySearch(searchTerm, locations).slice(0, 10);



    setFilteredLocations(filtered);
    // Show dropdown only if focused and has results
    setShowDropdown(isFocused && filtered.length > 0);
  }, [searchTerm, isFocused]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSearchTerm(location);
    setShowDropdown(false);
    setIsFocused(false);
    onChange(location);
    if (searchRef.current) {
      searchRef.current.blur();
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm && filteredLocations.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    // Use setTimeout to allow click events on dropdown items to fire first
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowDropdown(false);
      }
    }, 100);
  };

  // Handle click outside to close dropdown
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
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">
                    {location}

                    {searchTerm.toLowerCase() !== location.toLowerCase().substring(0, searchTerm.length) &&
                      !location.toLowerCase().startsWith(searchTerm.toLowerCase()) && (
                        <span className="text-xs text-gray-400 ml-1">
                          (similar to "{searchTerm}")
                        </span>
                      )}
                  </span>
                </button>
              ))}
              {locations.filter(loc =>
                loc.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > 10 && (
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                    Showing top 10 results. Keep typing to narrow down...
                  </div>
                )}
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
import OpenStreetMapSearch from "./OpenStreetMapSearch";
import FilterSection from "./FilterSection";
import ActionToggle from "./ActionToggle";
import FeaturedProperties from "./FeaturedProperties";

const landBudgetOptions = [
  "Under 50 Lakhs",
  "50 Lakhs - 1 Crore",
  "1 Crore - 2 Crores",
  "2 Crores - 5 Crores",
  "Above 5 Crores"
];

const roomBudgetOptions = [
  "Under 10k",
  "10k - 15k",
  "15k - 20k",
  "20k - 25k",
  "Above 25k"
];

const houseBudgetOptions = [
  "Under 1 Lakhs",

  "Under 50 Lakhs",
  "50 Lakhs - 1 Crore",
  "1 Crore - 2 Crores",
  "2 Crores - 5 Crores",
  "Above 5 Crores"
];
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
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={item.listingImages?.[0]?.url || "/default-image.jpg"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={90}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
            className={`absolute top-4 left-4 px-4 py-1 rounded text-white text-base font-medium ${item.action === "Sell" ? "bg-blue-600" : "bg-purple-600"
              }`}
          >
            {item.action === "Sell" ? "Sale" : "Rent"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {item?.post_title || item?.propertyType || "Property Title"}
          </h2>

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
          toggleFavorite(item.id, e);
        }}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
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

function Listing({
  listing,
  secondaryListings,
  handleSearchClick,
  searchedAddress,
  setBathRoomsCount,
  currentAction,
  setCurrentAction,
  propertyType,
  setPropertyType,
  setCoordinates,
  setListing,
  setSecondaryListings,
  onAddressDataUpdate,
}) {
  const [address, setAddress] = useState();
  const [area, setArea] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [roomsCount, setRoomsCount] = useState(0);
  const [bathRoomsCount, setBathRoomsCountLocal] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [priceRange, setPriceRange] = useState(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showListingFilters, setShowListingFilters] = useState(false);
  const [viewFilter, setViewFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // New state for initial page load

  // Filter states for listing section with new property-specific fields
  const [tempFilters, setTempFilters] = useState({

    rooms: 0,
    bathrooms: 0,
    parking: 0,
    propertyType: 'All',
    sortBy: 'newest',
    location: '',
    // Room/Flat specific
    roomType: '',
    hasParking: false,
    waterType: '',
    // House specific
    houseFacing: '',
    houseRoadType: '',
    houseHasParking: false,
    houseArea: '',
    // Land specific
    landArea: '',
    landRoadType: '',
    // Shop specific
    shopArea: '',
    shopHasParking: false,
    shopRoadType: ''
  });

  // Store ALL fetched data from address search
  const [allAddressData, setAllAddressData] = useState([]);
  const [searchAddress, setSearchAddress] = useState(null);

  const listingsContainerRef = useRef(null);

  // Get relevant filters based on property type
  const getRelevantFilters = (propType) => {
    const baseFilters = {
      showPrice: true,
      showArea: true,
      showPropertyType: true
    };

    switch (propType) {
      case 'House':
        return {
          ...baseFilters,
          showRooms: true,
          showBathrooms: true,
          showParking: true,
          showFacing: true,
          showRoadType: true,
          showCustomArea: true
        };
      case 'Room/Flat':
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showRoomType: true,
          showParkingToggle: true,
          showWaterType: true
        };
      case 'Land':
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showCustomArea: true,
          showRoadType: true
        };
      case 'Shop':
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showCustomArea: true,
          showParkingToggle: true,
          showRoadType: true
        };
      default: // 'All' or any other type
        return {
          ...baseFilters,
          showRooms: true,
          showBathrooms: true,
          showParking: true
        };
    }
  };

  const relevantFilters = getRelevantFilters(tempFilters.propertyType);

  // Simple filtering - NO memoization, always fresh logic
  const getFilteredListings = () => {
    let filteredData = [];

    // SIMPLE LOGIC: Location search vs General search
    if (isSearchPerformed && searchAddress && allAddressData.length > 0) {
      // This is a LOCATION search - use location data

      filteredData = [...allAddressData];
    } else {
      // This is a GENERAL search (no location) - use fresh backend data

      filteredData = [...(listing || []), ...(secondaryListings || [])];
    }


    // Apply additional filters only if they have values
    if (locationFilter && locationFilter.trim()) {

      filteredData = filteredData.filter(item =>
        item.address?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        item.full_address?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (roomsCount > 0) {
      filteredData = filteredData.filter(item => (item.rooms || 0) >= roomsCount);
    }
    if (bathRoomsCount > 0) {
      filteredData = filteredData.filter(item => (item.bathrooms || 0) >= bathRoomsCount);
    }
    if (parkingCount > 0) {
      filteredData = filteredData.filter(item => (item.parking || 0) >= parkingCount);
    }

    // Price range filter
    if (priceRange?.length === 2 && (priceRange[0] > 0 || priceRange[1] < Infinity)) {
      filteredData = filteredData.filter(item => {
        const price = parseFloat(item.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Apply sorting
    const sortBy = tempFilters.sortBy || 'newest';
    switch (sortBy) {
      case 'price-low':
        filteredData.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        filteredData.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'area-large':
        filteredData.sort((a, b) => (parseFloat(b.area) || 0) - (parseFloat(a.area) || 0));
        break;
      case 'area-small':
        filteredData.sort((a, b) => (parseFloat(a.area) || 0) - (parseFloat(b.area) || 0));
        break;
      case 'oldest':
        filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'newest':
      default:
        filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }


    return filteredData;
  };

  // Filter by view tabs (all/sale/rent)
  const getDisplayListings = () => {
    const filteredData = getFilteredListings();

    if (viewFilter === "all") return filteredData;
    if (viewFilter === "sale") return filteredData.filter(item => item.action === "Sell");
    if (viewFilter === "rent") return filteredData.filter(item => item.action === "Rent");

    return filteredData;
  };

  const displayListings = getDisplayListings();
  const totalPages = Math.ceil(displayListings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayListings.slice(indexOfFirstItem, indexOfLastItem);

  const toggleFavorite = (itemId, e) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Fetch data - ALWAYS fetch fresh from backend
  const handleSearch = async () => {


    setIsLoading(true);
    setCurrentPage(1);
    scrollToListing();


    setAllAddressData([]);
    setSearchAddress(null);
    setIsSearchPerformed(false);

    try {
      // Build fresh query
      let query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .order("created_at", { ascending: false });

      // Check for location - be very strict about what counts as a location
      const hasLocation = address &&
        address.label &&
        typeof address.label === 'string' &&
        address.label.trim() !== '' &&
        address.label.trim().length > 0;


      if (hasLocation) {
        // LOCATION-BASED SEARCH
        const searchLocation = address.label.split(",")[0]?.trim();


        query = query.ilike("address", `%${searchLocation}%`);

        // Set location search state
        setIsSearchPerformed(true);
        setSearchAddress(searchLocation);

        // Smart tab selection for location searches
        if (currentAction === "Sell") {
          setViewFilter("sale");
        } else if (currentAction === "Rent") {
          setViewFilter("rent");
        }
      } else {
        // NO LOCATION - PROPERTY TYPE SEARCH


        // Keep search state as false for property type searches
        setIsSearchPerformed(false);
        setSearchAddress(null);
      }

      // Add property type filter if not "All"
      if (propertyType && propertyType !== "All") {
        query = query.eq("propertyType", propertyType);
      }

      // EXECUTE THE QUERY

      const { data, error } = await query;

      if (error) {
        console.error("❌ Supabase query failed:", error);
        throw error;
      }



      // Store the results based on search type
      if (hasLocation) {
        // Location search - store in allAddressData

        setAllAddressData(data || []);

        // Clear parent state for location searches
        if (setListing) setListing([]);
        if (setSecondaryListings) setSecondaryListings([]);
      } else {
        // Property type search - store in parent state

        setAllAddressData([]); // Keep empty for property type searches

        // Update parent state with fresh property type data
        if (setListing) setListing(data || []);
        if (setSecondaryListings) setSecondaryListings([]);
      }

      // Notify parent
      if (onAddressDataUpdate) {
        onAddressDataUpdate(data || []);
      }

      // Fallback only for location searches with no results
      if (hasLocation && (!data || data.length === 0)) {


        let fallbackQuery = supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .ilike("address", "%kathmandu%")
          .order("created_at", { ascending: false });

        if (propertyType && propertyType !== "All") {
          fallbackQuery = fallbackQuery.eq("propertyType", propertyType);
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;

        if (!fallbackError && fallbackData?.length > 0) {
          setAllAddressData(fallbackData);
          setSearchAddress("Kathmandu");
          if (onAddressDataUpdate) {
            onAddressDataUpdate(fallbackData);
          }

        }
      }

    } catch (err) {
      console.error("🚨 Search error:", err);
      // Complete cleanup on error
      setAllAddressData([]);
      setSearchAddress(null);
      setIsSearchPerformed(false);
      if (setListing) setListing([]);
      if (setSecondaryListings) setSecondaryListings([]);
    } finally {
      setIsLoading(false);

    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToListing();
  };

  const scrollToListing = () => {
    if (listingsContainerRef.current) {
      listingsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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
          className={`px-3 py-1 text-sm rounded-md ${currentPage === page
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          {page}
        </button>
      );
    });
  };

  // Count active filters (only count relevant ones for the property type)
  const getActiveFiltersCount = () => {
    let count = 0;
    const relevant = getRelevantFilters(tempFilters.propertyType);

    // Always count price, location and property type if set
    if (tempFilters.minPrice || tempFilters.maxPrice) count++;
    if (tempFilters.location && tempFilters.location.trim()) count++;
    if (tempFilters.propertyType !== 'All') count++;
    if (tempFilters.sortBy && tempFilters.sortBy !== 'newest') count++;

    // Only count relevant filters
    if (relevant.showRooms && tempFilters.rooms > 0) count++;
    if (relevant.showBathrooms && tempFilters.bathrooms > 0) count++;
    if (relevant.showParking && tempFilters.parking > 0) count++;

    // Property-specific filters
    if (relevant.showRoomType && tempFilters.roomType) count++;
    if (relevant.showParkingToggle && tempFilters.hasParking) count++;
    if (relevant.showWaterType && tempFilters.waterType) count++;
    if (relevant.showFacing && tempFilters.houseFacing) count++;
    if (relevant.showRoadType && (tempFilters.houseRoadType || tempFilters.landRoadType || tempFilters.shopRoadType)) count++;
    if (relevant.showCustomArea && (tempFilters.houseArea || tempFilters.landArea || tempFilters.shopArea)) count++;

    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();


  const parsePriceRange = (type, label) => {
    if (!label) return null;

    if (type === 'Room/Flat') {
      switch (label) {
        case 'Under 10k': return [0, 10000];
        case '10k - 15k': return [10000, 15000];
        case '15k - 20k': return [15000, 20000];
        case '20k - 25k': return [20000, 25000];
        case 'Above 25k': return [25000, Infinity];
      }
    }

    if (type === 'Land') {
      switch (label) {
        case 'Under 50 Lakhs': return [0, 5000000];
        case '50 Lakhs - 1 Crore': return [5000000, 10000000];
        case '1 Crore - 2 Crores': return [10000000, 20000000];
        case '2 Crores - 5 Crores': return [20000000, 50000000];
        case 'Above 5 Crores': return [50000000, Infinity];
      }
    }

    return null;
  };



  // Apply filters from temp state
  const handleApplyFilters = () => {
    setRoomsCount(tempFilters.rooms);
    setBathRoomsCountLocal(tempFilters.bathrooms);
    setParkingCount(tempFilters.parking);
    setPropertyType(tempFilters.propertyType);
    setLocationFilter(tempFilters.location || '');

    const parsedRange = parsePriceRange(tempFilters.propertyType, tempFilters.priceRange);


    // ✅ Set price range using parsedRange
    if (parsedRange) {
      setPriceRange(parsedRange);
    } else {
      setPriceRange(null);
    }

    setIsFilterApplied(true);
    setShowListingFilters(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const currentPropertyType = tempFilters.propertyType;

    setTempFilters({

      rooms: 0,
      bathrooms: 0,
      parking: 0,
      propertyType: currentPropertyType,
      sortBy: 'newest',
      location: '',
      // Room/Flat specific
      roomType: '',
      hasParking: false,
      waterType: '',
      // House specific
      houseFacing: '',
      houseRoadType: '',
      houseHasParking: false,
      houseArea: '',
      // Land specific
      landArea: '',
      landRoadType: '',
      // Shop specific
      shopArea: '',
      shopHasParking: false,
      shopRoadType: ''
    });

    // Only reset filters that are relevant to current property type
    setRoomsCount(0);
    setBathRoomsCountLocal(0);
    setParkingCount(0);
    setPriceRange(null);
    setLocationFilter('');
    setIsFilterApplied(false);
    setCurrentPage(1);
  };

  const propertyTypes = ['All', 'Room/Flat', 'House', 'Land', 'Shop'];

  // Watch for address changes and reset search state when cleared
  useEffect(() => {
    const hasLocation = address &&
      address.label &&
      typeof address.label === 'string' &&
      address.label.trim() !== '' &&
      address.label.trim().length > 0;

    if (!hasLocation) {
      setIsSearchPerformed(false);
      setSearchAddress(null);
      setAllAddressData([]);
    }
  }, [address]);

  // Reset to "All Properties" tab when no search is performed
  useEffect(() => {
    // If no search has been performed and no address data, default to "all" tab
    if (!isSearchPerformed && allAddressData.length === 0) {
      setViewFilter("all");
    }
  }, [isSearchPerformed, allAddressData.length]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [viewFilter, propertyType, roomsCount, bathRoomsCount, parkingCount, priceRange, locationFilter]);

  // Get counts for each tab
  const getTabCounts = () => {
    const filteredData = getFilteredListings();
    return {
      all: filteredData.length,
      sale: filteredData.filter(item => item.action === "Sell").length,
      rent: filteredData.filter(item => item.action === "Rent").length
    };
  };

  const tabCounts = getTabCounts();

  // Fetch all properties on initial page load
  const fetchInitialData = async () => {

    setIsInitialLoading(true);

    try {
      const query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("❌ Initial data fetch failed:", error);
        throw error;
      }



      // Store in parent state for default display
      if (setListing) setListing(data || []);
      if (setSecondaryListings) setSecondaryListings([]);

      // Notify parent
      if (onAddressDataUpdate) {
        onAddressDataUpdate(data || []);
      }

      // Ensure we start with clean state
      setAllAddressData([]);
      setSearchAddress(null);
      setIsSearchPerformed(false);
      setViewFilter("all");

    } catch (err) {
      console.error("🚨 Initial data fetch error:", err);
      if (setListing) setListing([]);
      if (setSecondaryListings) setSecondaryListings([]);
    } finally {
      setIsInitialLoading(false);

    }
  };

  // Load all properties when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []); // Empty dependency array - runs only once on mount

  return (
    <>
      <LocationUpdater />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Integrated Search */}
        <div
          className="relative min-h-[650px] bg-cover bg-center bg-no-repeat mb-0 flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), 
          url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")`,
          }}
        >
          <div className="container mx-auto px-4 py-10 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                नमस्कार 🙏
              </h1>
              <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
                अनलाईन मार्फत घरजग्गा र पसल खरीद बिक्री गर्न तथा भाडामा लगाउन
              </p>
            </div>

            <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/10 p-6 rounded-xl shadow-xl border border-white/20">
              {/* Search Tabs */}
              <div className="flex mb-6 bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setCurrentAction("Sell")}
                  className={`flex-1 py-2 rounded-lg text-center font-medium ${currentAction === "Sell"
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/20"
                    }`}
                >
                  Buy Property
                </button>
                <button
                  onClick={() => setCurrentAction("Rent")}
                  className={`flex-1 py-2 rounded-lg text-center font-medium ${currentAction === "Rent"
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/20"
                    }`}
                >
                  Rent Property
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Property Type */}
                <div className="col-span-1">
                  <label className="block text-white text-sm mb-1">
                    Property Type
                  </label>
                  <select
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="All">All Properties</option>
                    <option value="Room/Flat">Room/Flat</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>

                {/* Location Search */}
                <div className="col-span-3">
                  <label className="block text-white text-sm mb-1">
                    Location
                  </label>
                  <div className="bg-white rounded-lg">
                    <OpenStreetMapSearch
                      selectedAddress={(v) => {

                        searchedAddress(v);
                        setAddress(v);
                        // Always reset search state when location changes
                        setIsSearchPerformed(false);
                        setAllAddressData([]);
                        setSearchAddress(null);
                      }}
                      setCoordinates={setCoordinates}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span>
                    {showAdvancedFilters
                      ? "Hide Advanced Filters"
                      : "Show Advanced Filters"}
                  </span>
                  {showAdvancedFilters ? (
                    <XMarkIcon className="h-4 w-4" />
                  ) : (
                    <ChevronLeftIcon className="h-4 w-4 transform rotate-90" />
                  )}
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <FilterSection
                    setBathRoomsCount={setBathRoomsCountLocal}
                    setRoomsCount={setRoomsCount}
                    setParkingCount={setParkingCount}
                    setPriceRange={setPriceRange}
                    setArea={setArea}
                    currentAction={currentAction}
                    propertyType={propertyType}
                    onFilterChange={() => setIsFilterApplied(true)}
                  />
                </div>
              )}

              {/* Search Button */}
              <button
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xl p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleSearch}
                disabled={isLoading || isInitialLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  {(isLoading || isInitialLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>{isInitialLoading ? "Loading..." : "Searching..."}</span>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-6 w-6" />
                      <span>
                        {(() => {
                          const hasLocation = address &&
                            address.label &&
                            typeof address.label === 'string' &&
                            address.label.trim() !== '' &&
                            address.label.trim().length > 0;

                          if (hasLocation) {
                            return "Search Properties";
                          } else if (propertyType !== "All") {
                            return `Find All ${propertyType} Properties`;
                          } else {
                            return "Find All Properties";
                          }
                        })()}
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white py-10" ref={listingsContainerRef}>
          {/* Full Screen Loading Overlay */}
          {(isLoading || isInitialLoading) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                  {/* Animated Loading Spinner */}
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Loading Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isInitialLoading ? "Loading Properties..." :
                        address?.label && address.label.trim()
                          ? "Searching Properties..."
                          : "Finding Properties..."
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isInitialLoading ? "Fetching all available properties from database" :
                        address?.label && address.label.trim() ?
                          `Finding properties in ${address.label.split(",")[0]?.trim()}` :
                          propertyType !== "All" ?
                            `Finding all ${propertyType} properties` :
                            "Fetching available properties"
                      }
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <div className="animate-bounce">.</div>
                      <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</div>
                      <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</div>
                    </div>
                  </div>

                  {/* Search Action Indicator */}
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {isInitialLoading ? "🏢 Loading all property listings" :
                      address?.label && address.label.trim() ? (
                        currentAction === "Sell" ? "🏠 Looking for properties to buy" : "🏘️ Looking for properties to rent"
                      ) : (
                        propertyType !== "All" ? `🔍 Searching all ${propertyType} properties` : "🔍 Searching all properties"
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <FeaturedProperties />
          <NearbyListings />

          {/* <CTASection /> */}
          <div className="container mx-auto px-4">
            {/* All Properties Summary (when no filters) */}
            {!isSearchPerformed && !searchAddress && propertyType === "All" && !isInitialLoading && (listing || []).length > 0 && (
              <div className="mb-8 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <BuildingOfficeIcon className="h-5 w-5 flex-shrink-0" />
                  <h2 className="font-medium">
                    Showing All Available Properties
                    <span className="text-sm ml-2 px-2 py-1 bg-gray-100 rounded-md">
                      {(listing || []).length + (secondaryListings || []).length} total properties
                    </span>
                  </h2>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  💡 Browse all properties from database • Select a property type or location to filter results
                </div>
              </div>
            )}

            {/* Filter Tabs with Counts */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex gap-6">
                <button
                  onClick={() => setViewFilter("all")}
                  className={`pb-3 px-1 font-medium relative ${viewFilter === "all"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  All Properties ({tabCounts.all})
                  {viewFilter === "all" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setViewFilter("sale")}
                  className={`pb-3 px-1 font-medium relative ${viewFilter === "sale"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  For Sale ({tabCounts.sale})
                  {viewFilter === "sale" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setViewFilter("rent")}
                  className={`pb-3 px-1 font-medium relative ${viewFilter === "rent"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  For Rent ({tabCounts.rent})
                  {viewFilter === "rent" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Summary with Filter Button */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                  <FunnelIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Active Filters:</span>
                </span>

                <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md">
                  {propertyType === "All" ? "All Properties" : propertyType}
                </span>

                {isSearchPerformed && searchAddress && (
                  <span className="bg-green-50 text-green-800 px-2 py-1 rounded-md">
                    📍 {searchAddress}
                  </span>
                )}

                {/* Location filter from filter panel */}
                {locationFilter && locationFilter.trim() && (
                  <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded-md text-xs">
                    📍 {locationFilter}
                  </span>
                )}

                {viewFilter !== "all" && (
                  <span
                    className={`px-2 py-1 rounded-md ${viewFilter === "sale"
                      ? "bg-blue-50 text-blue-800"
                      : "bg-purple-50 text-purple-800"
                      }`}
                  >
                    For {viewFilter === "sale" ? "Sale" : "Rent"}
                  </span>
                )}

                {/* Only show relevant filters based on property type */}
                {getRelevantFilters(propertyType).showRooms && roomsCount > 0 && (
                  <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded-md text-xs">
                    {roomsCount}+ rooms
                  </span>
                )}

                {getRelevantFilters(propertyType).showBathrooms && bathRoomsCount > 0 && (
                  <span className="bg-cyan-50 text-cyan-800 px-2 py-1 rounded-md text-xs">
                    {bathRoomsCount}+ baths
                  </span>
                )}

                {getRelevantFilters(propertyType).showParking && parkingCount > 0 && (
                  <span className="bg-orange-50 text-orange-800 px-2 py-1 rounded-md text-xs">
                    {parkingCount}+ parking
                  </span>
                )}

                {priceRange && (priceRange[0] > 0 || priceRange[1] < Infinity) && (
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md text-xs">
                    Rs {priceRange[0]?.toLocaleString()} - Rs {priceRange[1] === Infinity ? '∞' : priceRange[1]?.toLocaleString()}
                  </span>
                )}

                {/* Sort filter */}
                {tempFilters.sortBy && tempFilters.sortBy !== 'newest' && (
                  <span className="bg-gray-50 text-gray-800 px-2 py-1 rounded-md text-xs">
                    Sort: {tempFilters.sortBy === 'price-low' ? 'Price Low-High' :
                      tempFilters.sortBy === 'price-high' ? 'Price High-Low' :
                        tempFilters.sortBy === 'area-large' ? 'Area Large-Small' :
                          tempFilters.sortBy === 'area-small' ? 'Area Small-Large' :
                            tempFilters.sortBy === 'oldest' ? 'Oldest First' : tempFilters.sortBy}
                  </span>
                )}

                {/* Property type specific hint */}
                {propertyType === 'Land' && (
                  <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs italic">
                    Land properties only
                  </span>
                )}
                {propertyType === 'Shop' && (
                  <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs italic">
                    Commercial properties
                  </span>
                )}
              </div>

              {/* Filter Toggle Button */}
              <div className="w-full flex flex-col items-center justify-center text-center my-8 px-4">
                <p className="text-xl sm:text-2xl font-bold text-[#1a202c] mb-4 leading-snug">
                  🧐 तपाईको <span className="text-[#3b82f6]">बिशेष रोजाई</span> अझ गहिरोसंग खोज्न <br />
                  <span className="text-pink-600 font-extrabold">"Search Filter"</span> tab Click गर्नुहोस!
                </p>

                <button
                  onClick={() => setShowListingFilters(!showListingFilters)}
                  className={`
      flex items-center gap-3 px-8 py-3 rounded-full text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105
      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white
      hover:from-pink-600 hover:via-red-600 hover:to-yellow-600
    `}
                >
                  <AdjustmentsHorizontalIcon className="h-6 w-6" />
                  <span>{showListingFilters ? 'Hide Filters' : 'Show Filters'}</span>

                  {activeFiltersCount > 0 && (
                    <span className={`
        min-w-[24px] h-6 px-2 rounded-full text-sm font-bold flex items-center justify-center
        bg-white text-pink-600
      `}>
                      {activeFiltersCount}
                    </span>
                  )}

                  {showListingFilters ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5 transform rotate-90" />
                  )}
                </button>
              </div>


            </div>

            {/* Advanced Filters Panel for Listings */}
            {showListingFilters && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-blue-600" />
                    Advanced Property Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {activeFiltersCount} active
                      </span>
                    )}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Property Type</label>
                    <select
                      value={tempFilters.propertyType}
                      onChange={(e) => setTempFilters(prev => ({
                        ...prev,
                        propertyType: e.target.value,
                        roomType: '',
                        rooms: 0,
                        bathrooms: 0,
                        parking: 0,
                        hasParking: false,
                        waterType: '',
                        houseFacing: '',
                        houseRoadType: '',
                        houseHasParking: false,
                        houseArea: '',
                        landArea: '',
                        landRoadType: '',
                        shopArea: '',
                        shopHasParking: false,
                        shopRoadType: ''
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter with Smart Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <SmartLocationSearch
                      value={tempFilters.location || ''}
                      onChange={(value) => setTempFilters(prev => ({ ...prev, location: value }))}
                      placeholder="Search location (e.g., Kathmandu, Lalitpur...)"
                    />
                  </div>



                  {tempFilters.propertyType === 'Room/Flat' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        कोठा प्रकार (Room Type)
                      </label>
                      <select
                        value={tempFilters.roomType || ''}
                        onChange={(e) =>
                          setTempFilters((prev) => ({ ...prev, roomType: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      >
                        <option value="">सबै प्रकार (All Room Types)</option>
                        <option value="Single Room">Single Room</option>
                        <option value="Double Room">Double Room</option>
                        <option value="1BHK">1BHK (Bedroom, Hall, Kitchen)</option>
                        <option value="2BK">2BK (Two Bedrooms, Kitchen)</option>
                        <option value="2BHK">2BHK (Two Bedrooms, Hall, Kitchen)</option>
                        <option value="Larger flats">Larger flats</option>
                      </select>
                    </div>
                  )}


                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sort By</label>
                    <select
                      value={tempFilters.sortBy}
                      onChange={(e) => setTempFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="area-large">Area: Large to Small</option>
                      <option value="area-small">Area: Small to Large</option>
                    </select>
                  </div>
                </div>

                {/* Property Type Specific Fields */}
                {/* Property Type Specific Fields */}
                {tempFilters.propertyType === 'Room/Flat' && tempFilters.roomType && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">कोठा/फ्ल्याटसम्बन्धी विवरण (Room/Flat Specific Fields)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Price Range */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price Range (select property type first)</label>
                        <div className="flex gap-2">
                          {/* Price Range */}


                          <select
                            value={tempFilters.priceRange || ''}
                            onChange={(e) =>
                              setTempFilters((prev) => ({ ...prev, priceRange: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Price Range</option>
                            {tempFilters.propertyType === 'Room/Flat' &&
                              roomBudgetOptions.map((range) => (
                                <option key={range} value={range}>{range}</option>
                              ))}

                          </select>


                        </div>
                      </div>

                      {/* Parking Toggle */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">पार्किङ उपलब्ध छ? (Parking Available?)</label>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            onClick={() => setTempFilters(prev => ({ ...prev, flatHasParking: !prev.flatHasParking }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempFilters.flatHasParking ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempFilters.flatHasParking ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                          <span className="text-sm text-gray-600">
                            {tempFilters.flatHasParking ? 'छ (Yes)' : 'छैन (No)'}
                          </span>
                        </div>
                      </div>

                      {/* Car & Bike Parking - Conditional */}
                      {tempFilters.flatHasParking && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">कार पार्किङ संख्या (No. of Car Parking)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g. 1"
                              value={tempFilters.carParking || ''}
                              onChange={(e) => setTempFilters(prev => ({ ...prev, carParking: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">बाइक पार्किङ संख्या (No. of Bike Parking)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g. 2"
                              value={tempFilters.bikeParking || ''}
                              onChange={(e) => setTempFilters(prev => ({ ...prev, bikeParking: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Water Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">पानीको प्रकार (Water Type)</label>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const newSelection = e.target.value;
                              const currentSelections = tempFilters.waterType || [];
                              if (!currentSelections.includes(newSelection)) {
                                setTempFilters(prev => ({
                                  ...prev,
                                  waterType: [...currentSelections, newSelection]
                                }));
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">पानीको प्रकार चयन गर्नुहोस्</option>
                          {!tempFilters.waterType?.includes("24 hour water on tap") && (
                            <option value="24 hour water on tap">नलबाट २४ घण्टा पानी (24hr Water)</option>
                          )}
                          {!tempFilters.waterType?.includes("Storage water") && (
                            <option value="Storage water">ट्यांकी पानी (Storage)</option>
                          )}
                          {!tempFilters.waterType?.includes("Inar water") && (
                            <option value="Inar water">इनार/कुँडो पानी (Well)</option>
                          )}
                        </select>

                        {/* Selected Options Display */}
                        {tempFilters.waterType && tempFilters.waterType.length > 0 && (
                          <div className="mt-3">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">चयन गरिएका विकल्पहरू (Selected Options):</label>
                            <div className="flex flex-wrap gap-2">
                              {tempFilters.waterType.map((option, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {option}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedOptions = tempFilters.waterType.filter((_, i) => i !== index);
                                      setTempFilters(prev => ({ ...prev, waterType: updatedOptions }));
                                    }}
                                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pet Allowed */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">पाल्तु जनावर (Dog/Cat Allowed?)</label>
                        <select
                          value={tempFilters.petsAllowed || ''}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, petsAllowed: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">पाल्तु जनावर अनुमति? (Allowed?)</option>
                          <option value="Yes">हो (Yes)</option>
                          <option value="No">होइन (No)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}


                {/* House Features */}
                {tempFilters.propertyType === 'House' && (
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">🏠 घरसम्बन्धी विवरण (House Specific Fields)</h4>

                    {/* Bedrooms & Bathrooms - Eye-catching center UI */}
                    <div className="w-full flex flex-col sm:flex-row justify-center gap-6 mb-8">
                      {/* Bedrooms */}
                      <div className="flex flex-col items-center bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md w-full max-w-xs hover:shadow-lg transition">
                        <label className="text-md font-semibold text-blue-800 mb-2">शयनकक्ष (Bedrooms)</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setTempFilters((prev) => ({ ...prev, rooms: Math.max(0, prev.rooms - 1) }))
                            }
                            className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold border border-blue-400 hover:bg-blue-100 transition"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-blue-800">{tempFilters.rooms}</span>
                          <button
                            onClick={() =>
                              setTempFilters((prev) => ({ ...prev, rooms: prev.rooms + 1 }))
                            }
                            className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold border border-blue-400 hover:bg-blue-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Bathrooms */}
                      <div className="flex flex-col items-center bg-pink-50 border border-pink-200 rounded-xl p-4 shadow-md w-full max-w-xs hover:shadow-lg transition">
                        <label className="text-md font-semibold text-pink-800 mb-2">नुहाउने कोठा (Bathrooms)</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setTempFilters((prev) => ({ ...prev, bathrooms: Math.max(0, prev.bathrooms - 1) }))
                            }
                            className="w-10 h-10 rounded-full bg-white text-pink-600 font-bold border border-pink-400 hover:bg-pink-100 transition"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-pink-800">{tempFilters.bathrooms}</span>
                          <button
                            onClick={() =>
                              setTempFilters((prev) => ({ ...prev, bathrooms: prev.bathrooms + 1 }))
                            }
                            className="w-10 h-10 rounded-full bg-white text-pink-600 font-bold border border-pink-400 hover:bg-pink-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Price Range (select property type first)</label>
                      <div className="flex gap-2">
                        {/* Price Range */}


                        <select
                          value={tempFilters.priceRange || ''}
                          onChange={(e) =>
                            setTempFilters((prev) => ({ ...prev, priceRange: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Price Range</option>
                          {tempFilters.propertyType === 'House' &&
                            houseBudgetOptions.map((range) => (
                              <option key={range} value={range}>{range}</option>
                            ))}

                        </select>


                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {/* Parking Toggle */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Parking Available (पार्किङ छ?)</label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              setTempFilters((prev) => ({ ...prev, houseHasParking: !prev.houseHasParking }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempFilters.houseHasParking ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempFilters.houseHasParking ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                          <span className="text-sm text-gray-600">
                            {tempFilters.houseHasParking ? 'Yes (छ)' : 'No (छैन)'}
                          </span>
                        </div>
                      </div>

                      {/* Show if parking is enabled */}
                      {tempFilters.houseHasParking && (
                        <>
                          {/* Car Parking */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Car Parking (कार पार्किङ संख्या)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g. 1"
                              value={tempFilters.houseCarParking || ''}
                              onChange={(e) =>
                                setTempFilters((prev) => ({ ...prev, houseCarParking: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {/* Bike Parking */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Bike Parking (बाइक पार्किङ संख्या)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g. 2"
                              value={tempFilters.houseBikeParking || ''}
                              onChange={(e) =>
                                setTempFilters((prev) => ({ ...prev, houseBikeParking: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Area */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">क्षेत्रफल (Area Unit)</label>
                        <select
                          value={tempFilters.houseArea || ''}
                          onChange={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              houseArea: e.target.value
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">क्षेत्रफल चयन गर्नुहोस्</option>
                          <option value="1 Aana">1 Aana</option>
                          <option value="2 Aana">2 Aana</option>
                          <option value="4 Aana">4 Aana</option>
                          <option value="8 Aana (½ Ropani)">8 Aana (½ Ropani)</option>
                          <option value="1 Ropani">1 Ropani</option>
                          <option value="2 Ropani">2 Ropani</option>
                          <option value="4 Ropani">4 Ropani</option>
                          <option value="1 Kattha">1 Kattha</option>
                          <option value="2 Kattha">2 Kattha</option>
                          <option value="1 Bigha">1 Bigha</option>
                          <option value="Custom">अन्य (Custom)</option>
                        </select>
                      </div>


                      {tempFilters.houseArea === "Custom" && (
                        <div className="space-y-1 mt-7">
                          <input
                            type="text"
                            placeholder="e.g., 3.5 Ropani"
                            value={tempFilters.customHouseArea || ''}
                            onChange={(e) =>
                              setTempFilters((prev) => ({
                                ...prev,
                                customHouseArea: e.target.value
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                          />
                        </div>
                      )}


                      {/* Facing */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">House Facing (घरको दिशा)</label>
                        <select
                          value={tempFilters.houseFacing || ''}
                          onChange={(e) => setTempFilters((prev) => ({ ...prev, houseFacing: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">Direction चयन गर्नुहोस्</option>
                          <option value="North">उत्तर (North)</option>
                          <option value="South">दक्षिण (South)</option>
                          <option value="East">पूर्व (East)</option>
                          <option value="West">पश्चिम (West)</option>
                          <option value="North-East">उत्तर-पूर्व</option>
                          <option value="North-West">उत्तर-पश्चिम</option>
                          <option value="South-East">दक्षिण-पूर्व</option>
                          <option value="South-West">दक्षिण-पश्चिम</option>
                        </select>
                      </div>

                      {/* Road Type */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">सडकको चौडाइ (Road Width)</label>
                        <select
                          value={tempFilters.roadWidth || ''}
                          onChange={(e) => setTempFilters((prev) => ({ ...prev, roadWidth: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">सडकको चौडाइ चयन गर्नुहोस्</option>
                          <option value="lt-12">⬇ १२ फिट भन्दा कम (Less than 12 ft)</option>
                          <option value="12">१२ फिट (12 ft)</option>
                          <option value="20">२० फिट (20 ft)</option>
                          <option value="30">३० फिट (30 ft)</option>
                          <option value="highway">हाइवे / मुख्य सडक (Highway/Main Road)</option>
                        </select>
                      </div>

                    </div>
                  </div>
                )}






                {/* Land Features */}
                {tempFilters.propertyType === 'Land' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Land Specific Fields</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Area */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          क्षेत्रफल (Select Estimated Land Area)
                        </label>
                        <select
                          value={tempFilters.landArea || ''}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, landArea: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                          <option value="">क्षेत्रफल चयन गर्नुहोस् (Choose Area Range)</option>

                          {/* Gharderi (Urban) */}
                          <option value="under-4-aana">⬇ ४ आना भन्दा कम (Less than 4 Aana)</option>
                          <option value="above-4-aana">⬆ ४ आना भन्दा बढी (More than 4 Aana)</option>
                          <option value="above-1-ropani">⬆ १ रोपनी भन्दा बढी (More than 1 Ropani)</option>

                          {/* Terai (Madhesh) */}
                          <option value="under-1-kattha">⬇ १ कठ्ठा भन्दा कम (Less than 1 Kattha)</option>
                          <option value="above-1-kattha">⬆ १ कठ्ठा भन्दा बढी (More than 1 Kattha)</option>
                          <option value="above-4-kattha">⬆ ४ कठ्ठा भन्दा बढी (More than 4 Kattha)</option>
                          <option value="above-1-bigha">⬆ १ बिगाहा भन्दा बढी (More than 1 Bigha)</option>

                          {/* Fallback */}
                          <option value="custom">अन्य (Custom)</option>
                        </select>

                        {tempFilters.landArea === 'custom' && (
                          <input
                            type="text"
                            placeholder="e.g., 3.5 Ropani, 2 Kattha"
                            value={tempFilters.customLandArea || ''}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, customLandArea: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                          />
                        )}
                      </div>




                      {/* Road Type (बाटोको प्रकार) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          बाटोको प्रकार (Road Type)
                        </label>
                        <select
                          value={tempFilters.landRoadType || ''}
                          onChange={(e) => setTempFilters(prev => ({ ...presv, landRoadType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                          <option value="">कुनै पनि बाटो (Any Road Type)</option>
                          <option value="Pitched Road">पक्की बाटो (Pitched Road)</option>
                          <option value="Graveled Road">ग्राभेल बाटो (Graveled Road)</option>
                          <option value="Dirt Road">कच्ची बाटो (Dirt Road)</option>
                          <option value="Main Road">मुख्य बाटो (Main Road)</option>
                          <option value="Sub Road">सहायक बाटो (Sub Road)</option>
                        </select>
                      </div>

                    </div>
                  </div>
                )}

                {/* Shop Features */}
                {tempFilters.propertyType === 'Shop' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">पसल विवरण (Shop Specific Fields)</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {/* Shop Area */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Area (क्षेत्रफल - sq ft)</label>
                        <input
                          type="text"
                          placeholder="e.g., 800"
                          value={tempFilters.shopArea || ''}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, shopArea: e.target.value }))}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Parking Toggle */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Parking Available (पार्किङ उपलब्ध?)</label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              setTempFilters(prev => ({ ...prev, shopHasParking: !prev.shopHasParking }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempFilters.shopHasParking ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempFilters.shopHasParking ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                          <span className="text-sm text-gray-600">
                            {tempFilters.shopHasParking ? 'Yes (छ)' : 'No (छैन)'}
                          </span>
                        </div>
                      </div>

                      {/* Conditionally Show Parking Fields */}
                      {tempFilters.shopHasParking && (
                        <>
                          {/* Car Parking */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Car Parking (कार पार्किङ)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g., 1"
                              value={tempFilters.shopCarParking || ''}
                              onChange={(e) =>
                                setTempFilters(prev => ({ ...prev, shopCarParking: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {/* Bike Parking */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Bike Parking (बाइक पार्किङ)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="e.g., 2"
                              value={tempFilters.shopBikeParking || ''}
                              onChange={(e) =>
                                setTempFilters(prev => ({ ...prev, shopBikeParking: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Road Type */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Road Type (बाटोको प्रकार)</label>
                        <select
                          value={tempFilters.shopRoadType || ''}
                          onChange={(e) =>
                            setTempFilters(prev => ({ ...prev, shopRoadType: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="">कुनै पनि बाटो (Any)</option>
                          <option value="Pitched Road">पक्की बाटो</option>
                          <option value="Graveled Road">ग्राभेल बाटो</option>
                          <option value="Dirt Road">कच्ची बाटो</option>
                          <option value="Main Road">मुख्य बाटो</option>
                          <option value="Sub Road">सहायक बाटो</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}



                {/* Filter Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {(isLoading || isInitialLoading) ? (
                // Loading skeleton cards
                Array.from({ length: 6 }).map((_, index) => (
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
              ) : (
                // Actual property cards
                currentItems.map((item, index) => (
                  <PropertyCard
                    key={`${viewFilter}-${item.id}-${index}`}
                    item={item}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && !isInitialLoading && displayListings.length > itemsPerPage && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-1.5 border rounded-md text-sm ${currentPage === 1
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
                    className={`flex items-center px-3 py-1.5 border rounded-md text-sm ${currentPage === totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, displayListings.length)} of{" "}
                  {displayListings.length} listings
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !isInitialLoading && displayListings.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-50 max-w-md mx-auto p-6 rounded-lg border border-gray-200">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No properties found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isSearchPerformed
                      ? `No properties match your criteria in ${searchAddress}`
                      : "Try searching for a location to see properties"
                    }
                  </p>
                  <button
                    onClick={() => {
                      // Reset all filters
                      setViewFilter("all");
                      setPropertyType("All");
                      setBathRoomsCountLocal(0);
                      setRoomsCount(0);
                      setParkingCount(0);
                      setPriceRange(null);
                      setLocationFilter('');

                      // COMPLETELY reset search state
                      setIsSearchPerformed(false);
                      setSearchAddress(null);
                      setAllAddressData([]);

                      // Clear address input
                      setAddress(null);

                      // Reset filter state
                      handleClearFilters();

                      // Force parent to show default data
                      if (setListing) setListing([]);
                      if (setSecondaryListings) setSecondaryListings([]);
                    }}
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

export default Listing;