"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import OpenStreetMapSearch from "./OpenStreetMapSearch";

const PropertySearch = ({
  currentAction,
  setCurrentAction,
  propertyType,
  setPropertyType,
  onSearch,
  isLoading,
  setCoordinates,
  onAddressChange,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const propertyTypes = ["All", "Room/Flat", "House", "Land", "Shop"];

  return (
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
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Properties" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Search */}
            <div className="col-span-3">
              <label className="block text-white text-sm mb-1">Location</label>
              <div className="bg-white rounded-lg">
                <OpenStreetMapSearch
                  selectedAddress={onAddressChange}
                  setCoordinates={setCoordinates}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xl p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={onSearch}
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
  );
};

export default PropertySearch;
