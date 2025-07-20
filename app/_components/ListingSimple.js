"use client";

import React, { useState } from "react";

function ListingSimple(props) {
  // Destructure props to avoid conflicts
  const {
    listing = [],
    secondaryListings = [],
    currentAction = "Sell",
    propertyType = "All",
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
        <p>Current Action: {currentAction}</p>
        <p>Property Type: {propertyType}</p>
        <p>Total Listings: {listing.length + secondaryListings.length}</p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...listing, ...secondaryListings]
              .slice(0, 6)
              .map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {item.title || "Property"}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {item.address || "Address not available"}
                  </p>
                  <p className="text-blue-600 font-bold">
                    {item.price
                      ? `Rs ${Number(item.price).toLocaleString()}`
                      : "Price on request"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.action || "For Sale"} •{" "}
                    {item.propertyType || "Property"}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingSimple;
