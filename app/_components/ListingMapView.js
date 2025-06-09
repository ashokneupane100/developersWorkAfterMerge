"use client";
import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from '@/utils/supabase/client';
import { toast } from "sonner";
import OpenStreetMapSection from "./OpenStreetMapSection";
import LoanCalculator from "@/components/helpers/loanCalculator";
import Link from "next/link";
import { MapIcon, CalculatorIcon } from "@heroicons/react/24/outline";

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

  // ✅ NEW: Store all address-based data for map
  const [allAddressData, setAllAddressData] = useState([]);

  // Initialize with props
  useEffect(() => {
    setCurrentAction(initialAction);
    setPropertyType(initialPropertyType);
  }, [initialAction, initialPropertyType]);

  const fetchListings = async (action, setPrimarySecondary = true) => {
    try {
      // Primary listings query (with property type filter)
      let primaryQuery = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .eq("action", action)
        .order("created_at", { ascending: false });

      // Add property type filter if it's not "All"
      if (propertyType && propertyType !== "All") {
        primaryQuery = primaryQuery.eq("propertyType", propertyType);
      }

      if (setPrimarySecondary) {
        const { data: primaryData, error: primaryError } = await primaryQuery;

        if (primaryError) throw primaryError;
        setPrimaryListings(primaryData || []);

        // Secondary listings query
        const oppositeAction = action === "Sell" ? "Rent" : "Sell";
        const { data: secondaryData, error: secondaryError } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .eq("action", oppositeAction)
          .eq("propertyType", propertyType) // Also filter secondary listings by property type
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

  // ✅ UPDATED: This function is now handled differently in the Listing component
  const handleSearchClick = async () => {
    // This is kept for compatibility but actual search is now handled in Listing component
    console.log("Search click handled in Listing component");
  };

  // ✅ NEW: Listen for updates from Listing component
  const handleListingUpdate = (data) => {
    setAllAddressData(data);
  };

  // ✅ UPDATED: Combine data for map display
  const getMapListings = () => {
    // If address search was performed, use that data
    if (allAddressData.length > 0) {
      return allAddressData;
    }
    // Otherwise use default listings
    return [...primaryListings, ...secondaryListings];
  };

  const mapListings = getMapListings();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Listing Component */}
      <div className="w-full">
        <Listing
          listing={primaryListings}
          secondaryListings={secondaryListings}
          handleSearchClick={handleSearchClick}
          searchedAddress={setSearchedAddress}
          setBathRoomsCount={setBathRoomsCount}
          setRoomsCount={setRoomsCount}
          setParkingCount={setParkingCount}
          setPriceRange={setPriceRange}
          setArea={setArea}
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          setCoordinates={setCoordinates}
          setListing={setPrimaryListings}
          setSecondaryListings={setSecondaryListings}
          isSearchPerformed={isSearchPerformed}
          isFilterApplied={isFilterApplied}
          address={address}
          // ✅ NEW: Pass callback to get address data for map
          onAddressDataUpdate={handleListingUpdate}
        />
      </div>

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
                <h2 className="text-lg font-medium text-gray-900">Loan Calculator</h2>
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