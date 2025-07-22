"use client";
import React, { useEffect, useState } from "react";
import ListingNew from "./ListingNew";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import OpenStreetMapSection from "./OpenStreetMapSection";
import LoanCalculator from "@/components/helpers/loanCalculator";
import NearbyPropertiesSection from "./NearbyPropertiesSection";
import Link from "next/link";
import {
  MapIcon,
  CalculatorIcon,
  FunnelIcon,
  XMarkIcon,
  HomeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

function ListingMapView({
  initialAction = "Sell",
  initialPropertyType = "House",
}) {
  const [primaryListings, setPrimaryListings] = useState([]);
  const [secondaryListings, setSecondaryListings] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState();
  const [roomsCount, setRoomsCount] = useState(0);
  const [bathRoomsCount, setBathRoomsCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [priceRange, setPriceRange] = useState(null);
  const [area, setArea] = useState(null);
  const [propertyType, setPropertyType] = useState(initialPropertyType);
  const [coordinates, setCoordinates] = useState(null);
  const [currentAction, setCurrentAction] = useState(initialAction);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [address, setAddress] = useState();
  const [allAddressData, setAllAddressData] = useState([]);

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: 0,
    bathrooms: 0,
    parking: 0,
    propertyType: "All",
  });

  // Initialize with props
  useEffect(() => {
    setCurrentAction(initialAction);
    setPropertyType(initialPropertyType);
    setTempFilters((prev) => ({ ...prev, propertyType: initialPropertyType }));
  }, [initialAction, initialPropertyType]);

  const fetchListings = async (action, setPrimarySecondary = true) => {
    try {
      let primaryQuery = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .eq("action", action)
        .order("created_at", { ascending: false });

      if (propertyType && propertyType !== "All") {
        primaryQuery = primaryQuery.eq("propertyType", propertyType);
      }

      if (setPrimarySecondary) {
        const { data: primaryData, error: primaryError } = await primaryQuery;

        if (primaryError) throw primaryError;
        setPrimaryListings(primaryData || []);

        const oppositeAction = action === "Sell" ? "Rent" : "Sell";
        const { data: secondaryData, error: secondaryError } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .eq("action", oppositeAction)
          .eq("propertyType", propertyType)
          .order("created_at", { ascending: false });

        if (secondaryError) throw secondaryError;
        setSecondaryListings(secondaryData || []);
      } else {
        const { data, error } = await primaryQuery;
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch listings");
      return [];
    }
  };

  useEffect(() => {
    fetchListings(currentAction);
  }, [currentAction, propertyType]);

  const handleSearchClick = async () => {
    console.log("Search click handled in Listing component");
  };

  const handleListingUpdate = (data) => {
    setAllAddressData(data);
  };

  const getMapListings = () => {
    if (allAddressData.length > 0) {
      return allAddressData;
    }
    return [...primaryListings, ...secondaryListings];
  };

  const mapListings = getMapListings();

  // Filter handlers
  const handleApplyFilters = () => {
    // Update the main filter states
    setRoomsCount(tempFilters.rooms);
    setBathRoomsCount(tempFilters.bathrooms);
    setParkingCount(tempFilters.parking);
    setPropertyType(tempFilters.propertyType);

    // Set price range
    if (tempFilters.minPrice || tempFilters.maxPrice) {
      setPriceRange({
        min: tempFilters.minPrice ? parseInt(tempFilters.minPrice) : 0,
        max: tempFilters.maxPrice ? parseInt(tempFilters.maxPrice) : Infinity,
      });
    } else {
      setPriceRange(null);
    }

    // Set area range
    if (tempFilters.minArea || tempFilters.maxArea) {
      setArea({
        min: tempFilters.minArea ? parseInt(tempFilters.minArea) : 0,
        max: tempFilters.maxArea ? parseInt(tempFilters.maxArea) : Infinity,
      });
    } else {
      setArea(null);
    }

    setIsFilterApplied(true);
    setShowFilters(false);
    toast.success("Filters applied successfully!");
  };

  const handleClearFilters = () => {
    setTempFilters({
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      rooms: 0,
      bathrooms: 0,
      parking: 0,
      propertyType: "All",
    });

    setRoomsCount(0);
    setBathRoomsCount(0);
    setParkingCount(0);
    setPriceRange(null);
    setArea(null);
    setPropertyType("All");
    setIsFilterApplied(false);

    toast.success("Filters cleared!");
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilters.minPrice || tempFilters.maxPrice) count++;
    if (tempFilters.minArea || tempFilters.maxArea) count++;
    if (tempFilters.rooms > 0) count++;
    if (tempFilters.bathrooms > 0) count++;
    if (tempFilters.parking > 0) count++;
    if (tempFilters.propertyType !== "All") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const propertyTypes = [
    "All",
    "House",
    "Apartment",
    "Condo",
    "Townhouse",
    "Villa",
    "Studio",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Active Filters Display */}
      {isFilterApplied && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <FunnelIcon className="h-4 w-4" />
              <span className="font-medium">Active Filters:</span>
              <div className="flex gap-2 flex-wrap">
                {priceRange && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    ${priceRange.min || 0} - $
                    {priceRange.max === Infinity ? "∞" : priceRange.max}
                  </span>
                )}
                {area && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {area.min || 0} - {area.max === Infinity ? "∞" : area.max}{" "}
                    sq ft
                  </span>
                )}
                {roomsCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {roomsCount}+ bedrooms
                  </span>
                )}
                {bathRoomsCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {bathRoomsCount}+ bathrooms
                  </span>
                )}
                {parkingCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {parkingCount}+ parking
                  </span>
                )}
                {propertyType !== "All" && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {propertyType}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Main Listing Component */}
      <div className="w-full">
        <ListingNew
          listing={primaryListings}
          secondaryListings={secondaryListings}
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          setCoordinates={setCoordinates}
          onAddressDataUpdate={handleListingUpdate}
        />
      </div>

      {/* Nearby Properties Section */}
      <NearbyPropertiesSection />

      {/* Map and Calculator Section */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  Property Map
                  {mapListings.length > 0 && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({mapListings.length} properties)
                    </span>
                  )}
                </h2>
              </div>
              {allAddressData.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  📍 Showing properties from search results
                </div>
              )}
            </div>
            <div className="h-[500px]">
              <OpenStreetMapSection
                listing={mapListings}
                coordinates={coordinates}
              />
            </div>
          </div>

          {/* Calculator Section */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  Loan Calculator
                </h2>
              </div>
            </div>
            <div className="h-[500px] overflow-y-auto">
              <Link href="/kistacalculator" className="block h-full">
                <LoanCalculator />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingMapView;
