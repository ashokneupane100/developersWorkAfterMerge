"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import PropertySearch from "./PropertySearch";
import PropertyGrid from "./PropertyGrid";
import FeaturedProperties from "./FeaturedProperties";
import CTASection from "./CTASection";
import FilterSection from "./FilterSection";
import ComprehensiveFilterPanel from "./ComprehensiveFilterPanel";
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const ListingNew = ({
  listing = [],
  secondaryListings = [],
  currentAction,
  setCurrentAction,
  propertyType,
  setPropertyType,
  setCoordinates,
  onAddressDataUpdate,
}) => {
  // Local state
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [searchAddress, setSearchAddress] = useState(null);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  // Advanced filter states
  const [roomsCount, setRoomsCount] = useState(0);
  const [bathRoomsCount, setBathRoomsCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [priceRange, setPriceRange] = useState(null);
  const [area, setArea] = useState(null);

  // Advanced listing filters (after featured properties) - COMPREHENSIVE SYSTEM FROM bySangit
  const [showListingFilters, setShowListingFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    rooms: 0,
    bathrooms: 0,
    parking: 0,
    propertyType: "All",
    sortBy: "newest",
    location: "",
    priceRange: "",

    // Room/Flat specific filters (comprehensive)
    roomType: "",
    hasParking: false,
    waterType: [], // Array for multiple selections
    petsAllowed: "",
    carParking: "",
    bikeParking: "",

    // House specific filters (comprehensive)
    houseFacing: "",
    houseRoadType: "",
    houseHasParking: false,
    houseArea: "",
    customHouseArea: "",
    houseCarParking: "",
    houseBikeParking: "",
    roadWidth: "",

    // Land specific filters (comprehensive)
    landArea: "",
    customLandArea: "",
    landRoadType: "",

    // Shop specific filters (comprehensive)
    shopArea: "",
    shopHasParking: false,
    shopRoadType: "",
    shopCarParking: "",
    shopBikeParking: "",
  });

  const itemsPerPage = 9;

  // Price range options from bySangit branch
  const houseBudgetOptions = [
    "Under 1 Lakhs",
    "Under 50 Lakhs",
    "50 Lakhs - 1 Crore",
    "1 Crore - 2 Crores",
    "2 Crores - 5 Crores",
    "Above 5 Crores",
  ];

  // Initialize properties from props
  useEffect(() => {
    const allProperties = [...listing, ...secondaryListings];
    setProperties(allProperties);
    setFilteredProperties(allProperties);
  }, [listing, secondaryListings]);

  // Filter properties based on current action, property type, and advanced filters
  useEffect(() => {
    let filtered = [...properties];

    // Filter by action (Sell/Rent)
    if (currentAction !== "All") {
      filtered = filtered.filter((item) => item.action === currentAction);
    }

    // Filter by property type
    if (propertyType !== "All") {
      filtered = filtered.filter((item) => item.propertyType === propertyType);
    }

    // Advanced filters
    if (roomsCount > 0) {
      filtered = filtered.filter((item) => (item.rooms || 0) >= roomsCount);
    }

    if (bathRoomsCount > 0) {
      filtered = filtered.filter(
        (item) => (item.bathrooms || 0) >= bathRoomsCount
      );
    }

    if (parkingCount > 0) {
      filtered = filtered.filter((item) => (item.parking || 0) >= parkingCount);
    }

    // Price range filter
    if (priceRange && priceRange.length === 2) {
      filtered = filtered.filter((item) => {
        const price = parseFloat(item.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Area filter
    if (area && area.length === 2) {
      filtered = filtered.filter((item) => {
        const itemArea = parseFloat(item.area) || 0;
        return itemArea >= area[0] && itemArea <= area[1];
      });
    }

    // Location filter from tempFilters
    if (tempFilters.location && tempFilters.location.trim()) {
      filtered = filtered.filter((item) => {
        const address = item.address || item.full_address || "";
        return address
          .toLowerCase()
          .includes(tempFilters.location.toLowerCase());
      });
    }

    // Apply sorting from tempFilters
    const sortBy = tempFilters.sortBy || "newest";
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0)
        );
        break;
      case "area-large":
        filtered.sort(
          (a, b) => (parseFloat(b.area) || 0) - (parseFloat(a.area) || 0)
        );
        break;
      case "area-small":
        filtered.sort(
          (a, b) => (parseFloat(a.area) || 0) - (parseFloat(b.area) || 0)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    properties,
    currentAction,
    propertyType,
    roomsCount,
    bathRoomsCount,
    parkingCount,
    priceRange,
    area,
    tempFilters.sortBy,
    tempFilters.location,
  ]);

  // Handle search functionality
  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setCurrentPage(1);

    try {
      let query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .order("created_at", { ascending: false });

      // Apply action filter
      if (currentAction !== "All") {
        query = query.eq("action", currentAction);
      }

      // Apply property type filter
      if (propertyType !== "All") {
        query = query.eq("propertyType", propertyType);
      }

      // Apply location filter if search address exists
      if (searchAddress) {
        const searchLocation = searchAddress.label?.split(",")[0]?.trim();
        if (searchLocation) {
          query = query.ilike("address", `%${searchLocation}%`);
          setIsSearchPerformed(true);
        }
      }

      // Apply advanced filters
      if (roomsCount > 0) {
        query = query.gte("rooms", roomsCount);
      }

      if (bathRoomsCount > 0) {
        query = query.gte("bathrooms", bathRoomsCount);
      }

      if (parkingCount > 0) {
        query = query.gte("parking", parkingCount);
      }

      // Apply price range filter
      if (priceRange && priceRange.length === 2) {
        if (priceRange[0] > 0) {
          query = query.gte("price", priceRange[0]);
        }
        if (priceRange[1] < Infinity) {
          query = query.lte("price", priceRange[1]);
        }
      }

      // Apply area filter
      if (area && area.length === 2) {
        if (area[0] > 0) {
          query = query.filter("area::numeric", "gte", area[0]);
        }
        if (area[1] < Infinity) {
          query = query.filter("area::numeric", "lte", area[1]);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Search error:", error);
        toast.error("Failed to search properties");
        return;
      }

      setProperties(data || []);

      // Notify parent component
      if (onAddressDataUpdate) {
        onAddressDataUpdate(data || []);
      }

      if (data?.length === 0) {
        toast.info("No properties found matching your criteria");
      } else {
        toast.success(`Found ${data?.length || 0} properties`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentAction,
    propertyType,
    searchAddress,
    onAddressDataUpdate,
    roomsCount,
    bathRoomsCount,
    parkingCount,
    priceRange,
    area,
  ]);

  // Handle address change from search component
  const handleAddressChange = useCallback((address) => {
    setSearchAddress(address);
    if (!address) {
      setIsSearchPerformed(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Get relevant filters based on property type
  const getRelevantFilters = (propType) => {
    const baseFilters = {
      showPrice: true,
      showArea: true,
      showPropertyType: true,
    };

    switch (propType) {
      case "House":
        return {
          ...baseFilters,
          showRooms: true,
          showBathrooms: true,
          showParking: true,
          showFacing: true,
          showRoadType: true,
          showCustomArea: true,
        };
      case "Room/Flat":
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showRoomType: true,
          showParkingToggle: true,
          showWaterType: true,
        };
      case "Land":
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showCustomArea: true,
          showRoadType: true,
        };
      case "Shop":
        return {
          ...baseFilters,
          showRooms: false,
          showBathrooms: false,
          showParking: false,
          showCustomArea: true,
          showParkingToggle: true,
          showRoadType: true,
        };
      default: // 'All' or any other type
        return {
          ...baseFilters,
          showRooms: true,
          showBathrooms: true,
          showParking: true,
        };
    }
  };

  // Count active listing filters (comprehensive from bySangit)
  const getActiveListingFiltersCount = () => {
    let count = 0;

    // Basic filters
    if (tempFilters.priceRange) count++;
    if (tempFilters.location && tempFilters.location.trim()) count++;
    if (tempFilters.propertyType !== "All") count++;
    if (tempFilters.sortBy && tempFilters.sortBy !== "newest") count++;
    if (tempFilters.rooms > 0) count++;
    if (tempFilters.bathrooms > 0) count++;
    if (tempFilters.parking > 0) count++;

    // Room/Flat specific comprehensive filters
    if (tempFilters.roomType) count++;
    if (tempFilters.hasParking) count++;
    if (tempFilters.waterType && tempFilters.waterType.length > 0) count++;
    if (tempFilters.petsAllowed) count++;
    if (tempFilters.carParking) count++;
    if (tempFilters.bikeParking) count++;

    // House specific comprehensive filters
    if (tempFilters.houseFacing) count++;
    if (tempFilters.houseHasParking) count++;
    if (tempFilters.houseArea) count++;
    if (tempFilters.customHouseArea) count++;
    if (tempFilters.houseCarParking) count++;
    if (tempFilters.houseBikeParking) count++;
    if (tempFilters.roadWidth) count++;

    // Land specific comprehensive filters
    if (tempFilters.landArea) count++;
    if (tempFilters.customLandArea) count++;
    if (tempFilters.landRoadType) count++;

    // Shop specific comprehensive filters
    if (tempFilters.shopArea) count++;
    if (tempFilters.shopHasParking) count++;
    if (tempFilters.shopRoadType) count++;
    if (tempFilters.shopCarParking) count++;
    if (tempFilters.shopBikeParking) count++;

    return count;
  };

  // Parse range values from FilterSection (e.g., "10000-15000" -> [10000, 15000])
  const parseRangeValue = (value) => {
    if (value && value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      return [min, max === 100000000 ? Infinity : max];
    } else if (value && !isNaN(Number(value))) {
      return Number(value);
    }
    return null;
  };

  // Handle filter changes from FilterSection
  const handleListingFilterChange = () => {
    // This will be called by FilterSection when filters change
    setCurrentPage(1);
  };

  // Apply listing filters (no need for separate apply - filters are applied immediately)
  const handleApplyListingFilters = () => {
    setShowListingFilters(false);
    setCurrentPage(1);
    toast.success("Filters applied successfully!");
  };

  // Clear listing filters (comprehensive from bySangit)
  const handleClearListingFilters = () => {
    const currentPropertyType = tempFilters.propertyType;

    setTempFilters({
      rooms: 0,
      bathrooms: 0,
      parking: 0,
      propertyType: currentPropertyType,
      sortBy: "newest",
      location: "",
      priceRange: "",

      // Room/Flat specific filters (comprehensive)
      roomType: "",
      hasParking: false,
      waterType: [], // Array for multiple selections
      petsAllowed: "",
      carParking: "",
      bikeParking: "",

      // House specific filters (comprehensive)
      houseFacing: "",
      houseRoadType: "",
      houseHasParking: false,
      houseArea: "",
      customHouseArea: "",
      houseCarParking: "",
      houseBikeParking: "",
      roadWidth: "",

      // Land specific filters (comprehensive)
      landArea: "",
      customLandArea: "",
      landRoadType: "",

      // Shop specific filters (comprehensive)
      shopArea: "",
      shopHasParking: false,
      shopRoadType: "",
      shopCarParking: "",
      shopBikeParking: "",
    });

    // Reset all filters
    setRoomsCount(0);
    setBathRoomsCount(0);
    setParkingCount(0);
    setPriceRange(null);
    setArea(null);
    setCurrentPage(1);
    toast.success("All comprehensive filters cleared!");
  };

  // Handle favorite toggle
  const toggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("propertyFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("propertyFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <PropertySearch
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        onSearch={handleSearch}
        isLoading={isLoading}
        setCoordinates={setCoordinates}
        onAddressChange={handleAddressChange}
        // Advanced filter props
        setBathRoomsCount={setBathRoomsCount}
        setRoomsCount={setRoomsCount}
        setParkingCount={setParkingCount}
        setPriceRange={setPriceRange}
        setArea={setArea}
        roomsCount={roomsCount}
        bathRoomsCount={bathRoomsCount}
        parkingCount={parkingCount}
        priceRange={priceRange}
        area={area}
      />

      {/* Main Content */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          {/* Featured Properties (show only if no search performed) */}
          {!isSearchPerformed && <FeaturedProperties />}

          {/* Advanced Listing Filters Section (After Featured Properties) */}
          {!isSearchPerformed && (
            <div className="mb-8">
              <div className="flex justify-center">
                <button
                  onClick={() => setShowListingFilters(!showListingFilters)}
                  className={`
                    flex items-center gap-3 px-8 py-3 rounded-full text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white
                    hover:from-pink-600 hover:via-red-600 hover:to-yellow-600
                  `}
                >
                  <AdjustmentsHorizontalIcon className="h-6 w-6" />
                  <span>
                    {showListingFilters ? "Hide Filters" : "Show Filters"}
                  </span>

                  {getActiveListingFiltersCount() > 0 && (
                    <span
                      className={`
                        min-w-[24px] h-6 px-2 rounded-full text-sm font-bold flex items-center justify-center
                        bg-white text-pink-600
                      `}
                    >
                      {getActiveListingFiltersCount()}
                    </span>
                  )}

                  {showListingFilters ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5 transform rotate-90" />
                  )}
                </button>
              </div>

              {/* COMPREHENSIVE Advanced Filters Panel for Listings - From bySangit Branch */}
              {showListingFilters && (
                <ComprehensiveFilterPanel
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  getActiveListingFiltersCount={getActiveListingFiltersCount}
                  setBathRoomsCount={setBathRoomsCount}
                  setRoomsCount={setRoomsCount}
                  setParkingCount={setParkingCount}
                  setPriceRange={setPriceRange}
                  setArea={setArea}
                  currentAction={currentAction}
                  handleListingFilterChange={handleListingFilterChange}
                  handleApplyListingFilters={handleApplyListingFilters}
                  handleClearListingFilters={handleClearListingFilters}
                  houseBudgetOptions={houseBudgetOptions}
                />
              )}
            </div>
          )}

          {/* Results Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSearchPerformed
                  ? `Search Results ${
                      searchAddress?.label
                        ? `in ${searchAddress.label.split(",")[0]}`
                        : ""
                    }`
                  : "All Properties"}
              </h2>
              <div className="text-sm text-gray-600">
                {filteredProperties.length} properties found
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              {["All", "Sell", "Rent"].map((action) => (
                <button
                  key={action}
                  onClick={() => setCurrentAction(action)}
                  className={`pb-2 px-1 font-medium relative ${
                    currentAction === action
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {action === "All" ? "All Properties" : `For ${action}`}
                  {currentAction === action && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Property Grid */}
          <PropertyGrid
            properties={filteredProperties}
            isLoading={isLoading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />

          {/* CTA Section (show only if no search performed) */}
          {!isSearchPerformed && <CTASection />}
        </div>
      </div>
    </div>
  );
};

export default ListingNew;
