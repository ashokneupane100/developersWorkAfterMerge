"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import PropertySearch from "./PropertySearch";
import PropertyGrid from "./PropertyGrid";
import FeaturedProperties from "./FeaturedProperties";
import CTASection from "./CTASection";

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

  const itemsPerPage = 9;

  // Initialize properties from props
  useEffect(() => {
    const allProperties = [...listing, ...secondaryListings];
    setProperties(allProperties);
    setFilteredProperties(allProperties);
  }, [listing, secondaryListings]);

  // Filter properties based on current action and property type
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

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [properties, currentAction, propertyType]);

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
  }, [currentAction, propertyType, searchAddress, onAddressDataUpdate]);

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
      />

      {/* Main Content */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          {/* Featured Properties (show only if no search performed) */}
          {!isSearchPerformed && <FeaturedProperties />}

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
