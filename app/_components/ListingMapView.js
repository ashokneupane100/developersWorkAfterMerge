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

  const handleSearchClick = async () => {
    try {
      if (!searchedAddress?.label) {
        toast.error("Please provide a search location");
        return;
      }

      const specificLocation = searchedAddress.label
        .split(",")[0]
        .trim()
        .toLowerCase();

      const buildQueryWithFilters = (query) => {
        if (propertyType) {
          query = query.eq("propertyType", propertyType);
        }
        if (roomsCount > 0) {
          query = query.gte("rooms", roomsCount);
        }
        if (bathRoomsCount > 0) {
          query = query.gte("bathrooms", bathRoomsCount);
        }
        if (parkingCount > 0) {
          query = query.gte("parking", parkingCount);
        }
        return query.order("created_at", { ascending: false });
      };

      let query = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .eq("action", currentAction)
        .ilike("address", `%${specificLocation}%`);

      query = buildQueryWithFilters(query);

      const { data: specificMatches, error: specificError } = await query;

      if (specificError) throw specificError;

      if (specificMatches && specificMatches.length > 0) {
        setPrimaryListings(specificMatches);

        // Fetch secondary listings without property type filter
        const { data: secondaryData } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .eq("action", currentAction === "Sell" ? "Rent" : "Sell")
          .ilike("address", `%${specificLocation}%`)
          .order("created_at", { ascending: false });

        setSecondaryListings(secondaryData || []);
        setIsSearchPerformed(true);
        setIsFilterApplied(false);
        setAddress(searchedAddress);
        toast.success(
          `Found ${specificMatches.length} properties in ${specificLocation}`
        );
        return;
      }

      let kathmanduQuery = supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("active", true)
        .eq("action", currentAction)
        .ilike("address", "%kathmandu%");

      kathmanduQuery = buildQueryWithFilters(kathmanduQuery);

      const { data: kathmanduMatches, error: kathmanduError } =
        await kathmanduQuery;

      if (kathmanduError) throw kathmanduError;

      if (kathmanduMatches && kathmanduMatches.length > 0) {
        setPrimaryListings(kathmanduMatches);

        // Fetch secondary listings for Kathmandu without property type filter
        const { data: secondaryData } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("active", true)
          .eq("action", currentAction === "Sell" ? "Rent" : "Sell")
          .ilike("address", "%kathmandu%")
          .order("created_at", { ascending: false });

        setSecondaryListings(secondaryData || []);
        setIsSearchPerformed(true);
        setIsFilterApplied(false);
        setAddress(searchedAddress);
        toast.warning(
          `No properties found in ${specificLocation}. Showing ${kathmanduMatches.length} properties in Kathmandu matching your criteria`
        );
      } else {
        toast.warning("No properties found matching your criteria");
        setPrimaryListings([]);
        setSecondaryListings([]);
        setIsSearchPerformed(true);
        setIsFilterApplied(false);
        setAddress(searchedAddress);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error performing search");
    }
  };

  // Combine primary and secondary listings for the map
  const allListings = [...primaryListings, ...secondaryListings];

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
          isSearchPerformed={isSearchPerformed}
          isFilterApplied={isFilterApplied}
          address={address}
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
                <h2 className="text-lg font-medium text-gray-900">Property Map</h2>
              </div>
            </div>
            <div className="h-[500px]">
              <OpenStreetMapSection
                listing={allListings}
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