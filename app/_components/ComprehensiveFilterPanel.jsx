"use client";

import React from "react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import FilterSection from "./FilterSection";

const ComprehensiveFilterPanel = ({
  tempFilters,
  setTempFilters,
  getActiveListingFiltersCount,
  setBathRoomsCount,
  setRoomsCount,
  setParkingCount,
  setPriceRange,
  setArea,
  currentAction,
  handleListingFilterChange,
  handleApplyListingFilters,
  handleClearListingFilters,
  houseBudgetOptions,
}) => {
  return (
    <div className="mt-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FunnelIcon className="h-6 w-6 text-blue-600" />
          🔧 Comprehensive Property Filters
          {getActiveListingFiltersCount() > 0 && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              {getActiveListingFiltersCount()} active
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600">🎯 Filter properties by detailed specifications for precise results</p>
      </div>

      {/* Basic Filters Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🏠 Basic Property Filters
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select
              value={tempFilters.propertyType}
              onChange={(e) => setTempFilters(prev => ({ ...prev, propertyType: e.target.value }))}
              className="w-full h-12 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium shadow-sm"
            >
              <option value="All">All Properties</option>
              <option value="Room/Flat">Room/Flat</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
              <option value="Shop">Shop</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={tempFilters.sortBy}
              onChange={(e) => setTempFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full h-12 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area-large">Area: Large to Small</option>
              <option value="area-small">Area: Small to Large</option>
            </select>
          </div>

          {/* Location Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Filter</label>
            <input
              type="text"
              placeholder="Search by location..."
              value={tempFilters.location}
              onChange={(e) => setTempFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full h-12 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>



      {/* Property-Specific Comprehensive Filters */}
      {/* Room/Flat Specific Filters */}
      {tempFilters.propertyType === 'Room/Flat' && (
        <div className="mb-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            🏠 कोठा/फ्ल्याटसम्बन्धी विवरण (Room/Flat Specific Fields)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Room Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">कोठाको प्रकार (Room Type)</label>
              <select
                value={tempFilters.roomType}
                onChange={(e) => setTempFilters(prev => ({ ...prev, roomType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">कोठाको प्रकार चयन गर्नुहोस्</option>
                <option value="Single Room">सिंगल कोठा (Single Room)</option>
                <option value="Double Room">डबल कोठा (Double Room)</option>
                <option value="Master Room">मास्टर कोठा (Master Room)</option>
                <option value="Flat">फ्ल्याट (Flat)</option>
              </select>
            </div>

            {/* Budget Range for Room/Flat */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">💰 Budget Range</label>
              <select
                value={tempFilters.priceRange || ''}
                onChange={(e) => {
                  setTempFilters(prev => ({ ...prev, priceRange: e.target.value }));
                  // Parse and set price range for filtering
                  if (e.target.value) {
                    const ranges = {
                      "0-10000": [0, 10000],
                      "10000-15000": [10000, 15000], 
                      "15000-20000": [15000, 20000],
                      "20000-25000": [20000, 25000],
                      "25000-100000000": [25000, Infinity]
                    };
                    setPriceRange(ranges[e.target.value] || null);
                  } else {
                    setPriceRange(null);
                  }
                  handleListingFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Budget</option>
                <option value="0-10000">Rs 1 – Rs 10K</option>
                <option value="10000-15000">Rs 10K – Rs 15K</option>
                <option value="15000-20000">Rs 15K – Rs 20K</option>
                <option value="20000-25000">Rs 20K – Rs 25K</option>
                <option value="25000-100000000">Above Rs 25K</option>
              </select>
            </div>

            {/* Parking Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">पार्किङ उपलब्ध छ? (Parking Available?)</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTempFilters(prev => ({ ...prev, hasParking: !prev.hasParking }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tempFilters.hasParking ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tempFilters.hasParking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {tempFilters.hasParking ? 'छ (Yes)' : 'छैन (No)'}
                </span>
              </div>
            </div>

            {/* Conditionally Show Parking Fields */}
            {tempFilters.hasParking && (
              <>
                {/* Car Parking */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">कार पार्किङ संख्या (Car Parking)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 1"
                    value={tempFilters.carParking || ''}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, carParking: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Bike Parking */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">बाइक पार्किङ संख्या (Bike Parking)</label>
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

            {/* Pet Allowed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">पाल्तु जनावर (Dog/Cat Allowed?)</label>
              <select
                value={tempFilters.petsAllowed}
                onChange={(e) => setTempFilters(prev => ({ ...prev, petsAllowed: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">पाल्तु जनावर अनुमति? (Allowed?)</option>
                <option value="Yes">हो (Yes)</option>
                <option value="No">होइन (No)</option>
              </select>
            </div>
          </div>

          {/* Water Type - Multiple Select */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">पानीको प्रकार (Water Type)</label>
            <select
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

            {/* Selected Water Types Display */}
            {tempFilters.waterType && tempFilters.waterType.length > 0 && (
              <div className="mt-3">
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
        </div>
      )}

      {/* House Specific Filters */}
      {tempFilters.propertyType === 'House' && (
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            🏠 घरसम्बन्धी विवरण (House Specific Fields)
          </h4>



          {/* Budget Range for House */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">💰 Budget Range</label>
            <select
              value={tempFilters.priceRange || ''}
              onChange={(e) => {
                setTempFilters((prev) => ({ ...prev, priceRange: e.target.value }));
                // Parse and set price range for house properties
                if (e.target.value) {
                  const ranges = {
                    "0-10000000": [0, 10000000],
                    "10000000-20000000": [10000000, 20000000],
                    "20000000-50000000": [20000000, 50000000], 
                    "50000000-1000000000": [50000000, Infinity]
                  };
                  setPriceRange(ranges[e.target.value] || null);
                } else {
                  setPriceRange(null);
                }
                handleListingFilterChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Budget</option>
              <option value="0-10000000">Up to 1 Crore</option>
              <option value="10000000-20000000">1 – 2 Crores</option>
              <option value="20000000-50000000">2 – 5 Crores</option>
              <option value="50000000-1000000000">Above 5 Crores</option>
            </select>
          </div>

          {/* Rooms and Bathrooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Rooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">🛏️ Bedrooms</label>
              <select
                value={tempFilters.rooms || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempFilters(prev => ({ ...prev, rooms: parseInt(value) || 0 }));
                  setRoomsCount(parseInt(value) || 0);
                  handleListingFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Any Rooms</option>
                <option value="1">1+ Rooms</option>
                <option value="2">2+ Rooms</option>
                <option value="3">3+ Rooms</option>
                <option value="4">4+ Rooms</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">🛁 Bathrooms</label>
              <select
                value={tempFilters.bathrooms || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempFilters(prev => ({ ...prev, bathrooms: parseInt(value) || 0 }));
                  setBathRoomsCount(parseInt(value) || 0);
                  handleListingFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathrooms</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Parking Toggle */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Parking Available (पार्किङ छ?)</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTempFilters((prev) => ({ ...prev, houseHasParking: !prev.houseHasParking }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tempFilters.houseHasParking ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tempFilters.houseHasParking ? 'translate-x-6' : 'translate-x-1'
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
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, houseCarParking: e.target.value }))}
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
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, houseBikeParking: e.target.value }))}
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
                onChange={(e) => setTempFilters((prev) => ({ ...prev, houseArea: e.target.value }))}
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

            {/* Custom Area Input - Only show when Custom is selected */}
            {tempFilters.houseArea === "Custom" && (
              <div className="space-y-1 mt-7">
                <input
                  type="text"
                  placeholder="e.g., 3.5 Ropani"
                  value={tempFilters.customHouseArea || ''}
                  onChange={(e) => setTempFilters((prev) => ({ ...prev, customHouseArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                />
              </div>
            )}

            {/* Facing */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">House Facing (घरको दिशा)</label>
              <select
                value={tempFilters.houseFacing || ''}
                onChange={(e) => setTempFilters(prev => ({ ...prev, houseFacing: e.target.value }))}
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
                onChange={(e) => setTempFilters(prev => ({ ...prev, roadWidth: e.target.value }))}
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

      {/* Land Specific Filters */}
      {tempFilters.propertyType === 'Land' && (
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Land Specific Fields
          </h4>

          {/* Budget Range for Land */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">💰 Budget Range</label>
            <select
              value={tempFilters.priceRange || ''}
              onChange={(e) => {
                setTempFilters((prev) => ({ ...prev, priceRange: e.target.value }));
                // Parse and set price range for land properties
                if (e.target.value) {
                  const ranges = {
                    "0-5000000": [0, 5000000],
                    "5000000-10000000": [5000000, 10000000],
                    "10000000-20000000": [10000000, 20000000],
                    "20000000-1000000000": [20000000, Infinity]
                  };
                  setPriceRange(ranges[e.target.value] || null);
                } else {
                  setPriceRange(null);
                }
                handleListingFilterChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Budget</option>
              <option value="0-5000000">Below 50 Lakhs</option>
              <option value="5000000-10000000">50 Lakhs – 1 Crore</option>
              <option value="10000000-20000000">1 – 2 Crores</option>
              <option value="20000000-1000000000">Above 2 Crores</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">क्षेत्रफल (Select Estimated Land Area)</label>
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

              {/* Custom Land Area Input - Only show when custom is selected */}
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
              <label className="text-sm font-medium text-gray-700">बाटोको प्रकार (Road Type)</label>
              <select
                value={tempFilters.landRoadType || ''}
                onChange={(e) => setTempFilters(prev => ({ ...prev, landRoadType: e.target.value }))}
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

      {/* Shop Specific Filters */}
      {tempFilters.propertyType === 'Shop' && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            पसल विवरण (Shop Specific Fields)
          </h4>

          {/* Budget Range for Shop */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">💰 Budget Range</label>
            <select
              value={tempFilters.priceRange || ''}
              onChange={(e) => {
                setTempFilters((prev) => ({ ...prev, priceRange: e.target.value }));
                // Parse and set price range for shop properties
                if (e.target.value) {
                  const ranges = {
                    "10000-25000": [10000, 25000],
                    "25000-50000": [25000, 50000],
                    "50000-100000000": [50000, Infinity]
                  };
                  setPriceRange(ranges[e.target.value] || null);
                } else {
                  setPriceRange(null);
                }
                handleListingFilterChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Budget</option>
              <option value="10000-25000">Rs 10K – Rs 25K</option>
              <option value="25000-50000">Rs 25K – Rs 50K</option>
              <option value="50000-100000000">Above Rs 50K</option>
            </select>
          </div>

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
                  onClick={() => setTempFilters(prev => ({ ...prev, shopHasParking: !prev.shopHasParking }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tempFilters.shopHasParking ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tempFilters.shopHasParking ? 'translate-x-6' : 'translate-x-1'
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
                    onChange={(e) => setTempFilters(prev => ({ ...prev, shopCarParking: e.target.value }))}
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
                    onChange={(e) => setTempFilters(prev => ({ ...prev, shopBikeParking: e.target.value }))}
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
                onChange={(e) => setTempFilters(prev => ({ ...prev, shopRoadType: e.target.value }))}
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

      {/* Apply and Clear Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleApplyListingFilters}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Apply Comprehensive Filters
        </button>
        <button
          onClick={handleClearListingFilters}
          className="px-8 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default ComprehensiveFilterPanel; 