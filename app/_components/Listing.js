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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/components/helpers/formatCurrency";
import OpenStreetMapSearch from "./OpenStreetMapSearch";
import FilterSection from "./FilterSection";
import ActionToggle from "./ActionToggle";

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
}) {
  const [address, setAddress] = useState();
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [roomsCount, setRoomsCount] = useState(0);
  const [bathRoomsCount, setBathRoomsCountLocal] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [priceRange, setPriceRange] = useState(null);
  const [area, setArea] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewFilter, setViewFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ NEW: Store ALL fetched data from address search
  const [allAddressData, setAllAddressData] = useState([]);
  const [searchAddress, setSearchAddress] = useState(null);
  
  const listingsContainerRef = useRef(null);

  // ✅ FIXED: Filter logic based on search state
  const getFilteredListings = () => {
    // If search was performed, use address-based data
    if (isSearchPerformed && allAddressData.length > 0) {
      let filteredData = [...allAddressData];
      
      // Apply property type filter
      if (propertyType && propertyType !== "All") {
        filteredData = filteredData.filter(item => item.propertyType === propertyType);
      }
      
      // Apply additional filters
      if (roomsCount > 0) {
        filteredData = filteredData.filter(item => (item.rooms || 0) >= roomsCount);
      }
      if (bathRoomsCount > 0) {
        filteredData = filteredData.filter(item => (item.bathrooms || 0) >= bathRoomsCount);
      }
      if (parkingCount > 0) {
        filteredData = filteredData.filter(item => (item.parking || 0) >= parkingCount);
      }
      if (priceRange?.length === 2) {
        filteredData = filteredData.filter(item => {
          const price = parseFloat(item.price) || 0;
          return price >= priceRange[0] && price <= priceRange[1];
        });
      }
      if (area?.length === 2) {
        filteredData = filteredData.filter(item => {
          const itemArea = parseFloat(item.area) || 0;
          return itemArea >= area[0] && itemArea <= area[1];
        });
      }
      
      return filteredData;
    }
    
    // If no search performed, use default listings
    return [...(listing || []), ...(secondaryListings || [])];
  };

  // ✅ NEW: Filter by view tabs (all/sale/rent)
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

  // ✅ UPDATED: Fetch ALL data from address, no action filtering
  const handleSearch = async () => {
    console.log("🔍 Starting address-based search...");
    
    if (!address?.label) {
      console.log("❌ No address provided");
      return;
    }

    setIsLoading(true);
    setIsSearchPerformed(true);
    setCurrentPage(1);
    scrollToListing();

    try {
      const searchLocation = address.label.split(",")[0]?.trim();
      console.log("🔍 Searching for address:", searchLocation);

      // ✅ FETCH ALL PROPERTIES FROM THIS ADDRESS (NO ACTION FILTER)
      let query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .ilike("address", `%${searchLocation}%`)
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("❌ Supabase query failed:", error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} total properties in ${searchLocation}`);
      console.log("📋 All fetched data:", data);

      // ✅ Store ALL data from this address
      setAllAddressData(data || []);
      setSearchAddress(searchLocation);
      
      // ✅ Clear parent state since we're now using allAddressData
      if (setListing && typeof setListing === 'function') {
        setListing([]);
      }
      if (setSecondaryListings && typeof setSecondaryListings === 'function') {
        setSecondaryListings([]);
      }

      // If no results in specific location, try Kathmandu
      if (!data || data.length === 0) {
        console.log("🔍 No results found, trying Kathmandu...");
        
        const { data: kathmanduData, error: kathmanduError } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .ilike("address", "%kathmandu%")
          .order("created_at", { ascending: false });

        if (!kathmanduError && kathmanduData?.length > 0) {
          setAllAddressData(kathmanduData);
          setSearchAddress("Kathmandu");
          console.log(`✅ Found ${kathmanduData.length} properties in Kathmandu`);
        }
      }

    } catch (err) {
      console.error("🚨 Search error:", err);
      setAllAddressData([]);
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

  // ✅ Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [viewFilter, propertyType, roomsCount, bathRoomsCount, parkingCount, priceRange, area]);

  // ✅ NEW: Get counts for each tab
  const getTabCounts = () => {
    const filteredData = getFilteredListings();
    return {
      all: filteredData.length,
      sale: filteredData.filter(item => item.action === "Sell").length,
      rent: filteredData.filter(item => item.action === "Rent").length
    };
  };

  const tabCounts = getTabCounts();

  return (
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
                className={`flex-1 py-2 rounded-lg text-center font-medium ${
                  currentAction === "Sell"
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/20"
                }`}
              >
                Buy Property
              </button>
              <button
                onClick={() => setCurrentAction("Rent")}
                className={`flex-1 py-2 rounded-lg text-center font-medium ${
                  currentAction === "Rent"
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
                      setIsSearchPerformed(false);
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
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    <span>Search Properties</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="bg-white py-10" ref={listingsContainerRef}>
        <div className="container mx-auto px-4">
          {/* Search Results Summary */}
          {isSearchPerformed && searchAddress && (
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <MapPinIcon className="h-5 w-5 flex-shrink-0" />
                <h2 className="font-medium">
                  Found{" "}
                  <span className="font-bold">{allAddressData.length}</span>{" "}
                  Total Properties in{" "}
                  <span className="font-bold">{searchAddress}</span>
                  {propertyType !== "All" && (
                    <span> • Filtered by: {propertyType}</span>
                  )}
                </h2>
              </div>
            </div>
          )}

          {/* Filter Tabs with Counts */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-6">
              <button
                onClick={() => setViewFilter("all")}
                className={`pb-3 px-1 font-medium relative ${
                  viewFilter === "all"
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
                className={`pb-3 px-1 font-medium relative ${
                  viewFilter === "sale"
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
                className={`pb-3 px-1 font-medium relative ${
                  viewFilter === "rent"
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

          {/* Filter Summary */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
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

            {viewFilter !== "all" && (
              <span
                className={`px-2 py-1 rounded-md ${
                  viewFilter === "sale"
                    ? "bg-blue-50 text-blue-800"
                    : "bg-purple-50 text-purple-800"
                }`}
              >
                For {viewFilter === "sale" ? "Sale" : "Rent"}
              </span>
            )}
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
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
              currentItems.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && displayListings.length > itemsPerPage && (
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
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, displayListings.length)} of{" "}
                {displayListings.length} listings
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && displayListings.length === 0 && (
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
                    setViewFilter("all");
                    setPropertyType("All");
                    setBathRoomsCountLocal(0);
                    setRoomsCount(0);
                    setParkingCount(0);
                    setPriceRange(null);
                    setArea(null);
                    setIsSearchPerformed(false);
                    setAllAddressData([]);
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
  );
}

export default Listing;