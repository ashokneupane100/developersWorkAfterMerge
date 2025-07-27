"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
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
import { formatCurrency } from "@/components/helpers/formatCurrency";

type ListingType = {
  isFeatured: string;
  id: string;
  post_title?: string;
  propertyType?: string;
  address?: string;
  full_address?: string;
  price?: number;
  rooms?: number;
  bathrooms?: number;
  area?: string;
  action?: string;
  listingImages?: { url: string; listing_id: string }[];
  description?: string;
};

const FeaturedProperties: React.FC = () => {
  const [featuredListings, setFeaturedListings] = useState<ListingType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      const { data, error } = await supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .eq("isFeatured", true)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setFeaturedListings(data);
      } else {
        console.error("Error fetching featured listings:", error);
      }
    };

    fetchFeaturedListings();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Special Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((item) => {
            const propertyLocation =
              item.address
                ?.split(",")
                .filter((part) => !part.toLowerCase().includes("nepal"))
                .join(",")
                .trim() || "Unknown Location";

            return (
              <div
                key={item.id}
                className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <Link href={`/view-listing/${item.id}`} className="block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer">
                    <Image
                      src={item.listingImages?.[0]?.url || "/default-image.jpg"}
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      alt={`${item.propertyType} in ${propertyLocation}`}
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-orange-500 text-white text-sm font-medium">
                      🔥 Featured
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded text-blue-900 font-semibold text-sm">
                      {item.price
                        ? `Rs ${formatCurrency(item.price)}`
                        : "Price on Request"}
                    </div>
                    <div
                      className={`absolute top-4 left-20 px-4 py-1 rounded text-white text-base font-medium ${
                        item.isFeatured === "true"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    >
                      {item.isFeatured === "true" ? "Hot" : "Featured"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item?.post_title ||
                        item?.propertyType ||
                        "Property Title"}
                    </h2>
                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-1 line-clamp-1">
                      {item?.description ||
                        "A beautiful property with all the amenities you need."}
                    </p>
                    <p className="text-blue-600 text-xs font-medium mb-2">
                      Click for details...
                    </p>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm line-clamp-1">
                        {item?.full_address ||
                          item?.address ||
                          propertyLocation}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <HomeIcon className="h-4 w-4 text-blue-600" />
                        <span>{item.rooms || "N/A"} Rooms</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <BeakerIcon className="h-4 w-4 text-blue-600" />
                        <span>{item.bathrooms || "N/A"} Baths</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <SquaresPlusIcon className="h-4 w-4 text-blue-600" />
                        <span>{item.area || "N/A"}</span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
