"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { formatCurrency } from "@/components/helpers/formatCurrency";

const PropertyCard = ({ item, toggleFavorite, favorites }) => {
  const isFavorite = favorites.includes(item.id);

  // Safely handle image URL
  const imageUrl =
    item?.listingImages?.[0]?.url || "/assets/images/placeholder.svg";

  // Safely handle location
  const location =
    item?.address?.split(", Nepal")[0]?.trim() || "Unknown Location";

  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full cursor-pointer">
        <Image
          src={imageUrl}
          alt={item.title || "Property"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.target.src = "/assets/images/placeholder.svg";
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(item.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

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
          For {item.action === "Sell" ? "Sale" : "Rent"}
        </div>
      </div>

      {/* Content */}
      <Link href={`/view-listing/${item.id}`} className="block">
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
            {item.title || item.post_title || "Property Title"}
          </h3>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-1 line-clamp-1">
            {item.description ||
              "A beautiful property with all the amenities you need."}
          </p>
          <p className="text-blue-600 text-xs font-medium mb-2">
            Click for details...
          </p>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm truncate">{location}</span>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
            {item.rooms && (
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                <span>{item.rooms} bed</span>
              </div>
            )}
            {item.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{item.bathrooms} bath</span>
              </div>
            )}
            {item.area && (
              <div className="flex items-center">
                <Ruler className="h-4 w-4 mr-1" />
                <span>{item.area} sq ft</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const PropertyGrid = ({
  properties,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  favorites,
  toggleFavorite,
}) => {
  // Memoize the current items calculation for performance
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return properties.slice(indexOfFirstItem, indexOfLastItem);
  }, [properties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(properties.length / itemsPerPage);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse"
          >
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
        ))}
      </div>
    );
  }

  // No results
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 max-w-md mx-auto p-6 rounded-lg border border-gray-200">
          <div className="h-12 w-12 text-gray-400 mx-auto mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No properties found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((item, index) => (
          <PropertyCard
            key={`property-${item.id}-${index}`}
            item={item}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md text-sm ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 rounded-md text-sm ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md text-sm ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {Math.min(currentPage * itemsPerPage, properties.length)} of{" "}
        {properties.length} properties
      </div>
    </div>
  );
};

export default PropertyGrid;
