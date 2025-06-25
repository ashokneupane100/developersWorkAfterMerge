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
  const [currentLocation] = useState("Your Location");

  const availableListings = listings.filter((listing) => !listing.featured);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full bg-white py-10">

     <div className="w-full px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          📍 Top Listings Near You
        </h2>
        <p className="text-gray-600 mb-6">
          Properties within 3km radius from your location
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableListings.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <Link href={`/view-listing/${item.id}`} className="block">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={item.profileImage || "/placeholder.svg"}
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

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
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
