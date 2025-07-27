"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  HomeIcon,
  BeakerIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";

interface Listings {
  id: number;
  post_title: string;
  address: string;
  full_address: string;
  price: number;
  action: "Rent" | "Sell" | string;
  views: number;
  profileImage?: string;
  rooms: number;
  bathrooms: number;
  area: number;
  featured?: boolean;
  coordinates: { lat: number; lng: number };
  distance?: string;
}

interface Props {
  listings: Listings[];
}

const ListingNearYou: React.FC<Props> = ({ listings = [] }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const availableListings = listings.filter((listing) => !listing.featured);
  const totalPages = Math.ceil(availableListings.length / itemsPerPage);

  const paginatedListings = availableListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full bg-white py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            📍 Top Listings Near You
          </h2>
          <Link
            href="/all-listings"
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            See All
          </Link>
        </div>

        <p className="text-gray-600 mb-6">
          Properties within 3km radius from your location
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {paginatedListings.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <Link href={`/view-listing/${item.id}`} className="block">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={item.profileImage || "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Image of the property"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-blue-600 text-white text-sm font-medium">
                    For {item.action}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-blue-900 font-semibold text-sm">
                    {typeof item.price === "number"
                      ? `Rs ${item.price.toLocaleString()}`
                      : "Price on Request"}
                  </div>
                </div>

                <div className="p-4 pt-3 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {item?.post_title || "Untitled Property"}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm line-clamp-1">
                      {item?.full_address || item?.address || "Location Unknown"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-y-1 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <HomeIcon className="h-4 w-4 text-blue-600" />
                      <span>{item.rooms || "N/A"} Beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <BeakerIcon className="h-4 w-4 text-blue-600" />
                      <span>{item.bathrooms || "N/A"} Baths</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <SquaresPlusIcon className="h-4 w-4 text-blue-600" />
                      <span>{item.area || "N/A"} sqft</span>
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white z-10"
              >
                {favorites.includes(item.id) ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-30">
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded text-sm text-gray-600 disabled:opacity-40"
              >
                &lt; Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "border text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded text-sm text-gray-700 disabled:opacity-40"
              >
                Next &gt;
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, availableListings.length)} of {" "}
              {availableListings.length} listings
            </p>
          </div>
        )}

        {availableListings.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No nearby listings found.
          </div>
        )}
      </div>
    </section>
  );
};

export default ListingNearYou;
