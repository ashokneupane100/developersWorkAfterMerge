"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  HomeIcon,
  BeakerIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

const NearbyPropertiesSection = () => {
  const { user, profile } = useAuth();
  const [nearbyListings, setNearbyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude === 0 && longitude === 0) return;

        // Update user profile with location
        if (user?.email) {
          const { error } = await supabase
            .from("profiles")
            .update({
              latitude,
              longitude,
              location_permission: true,
              location_updated_at: new Date().toISOString(),
            })
            .eq("email", user.email);

          if (!error) {
            setLocationPermission(true);
            fetchNearbyListings(latitude, longitude);
          }
        }
      },
      (error) => {
        console.log("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbyListings = async (userLat: number, userLng: number) => {
    setLoading(true);
    try {
      const { data: listings } = await supabase.from("listing").select("*");

      const nearby = listings?.filter((listing) => {
        const coords = listing.coordinates;
        if (!coords?.lat || !coords?.lng) return false;
        const dist = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          coords.lat,
          coords.lng
        );
        return dist <= 3;
      });

      setNearbyListings(nearby || []);
    } catch (error) {
      console.error("Error fetching nearby listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.latitude && profile?.longitude) {
      setLocationPermission(true);
      fetchNearbyListings(profile.latitude, profile.longitude);
    }
  }, [user, profile]);

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center">
          <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Discover Properties Near You
          </h3>
          <p className="text-gray-600 mb-4">
            Get personalized property recommendations within 3km of your
            location. Sign in to access location-based property alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In to Continue
            </Link>
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg border border-blue-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in but location permission not granted
  if (!locationPermission) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-8 text-center">
          <MapPinIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Enable Location Access
          </h3>
          <p className="text-gray-600 mb-4">
            To show you properties near your location, we need access to your
            location. This helps us find the best properties within 3km of where
            you are.
          </p>
          <button
            onClick={requestLocation}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Enable Location Access
          </button>
        </div>
      </div>
    );
  }

  // Show nearby properties
  return (
    <div className="max-w-6xl mx-auto w-full px-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/*
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">
                Properties Near You
              </h2>
              <span className="text-sm text-gray-600">(within 3km radius)</span>
            </div>
            */}
            {profile?.full_address && (
              <span className="text-sm text-blue-600 font-medium">
                📍 {profile.full_address}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Finding properties near you...</p>
            </div>
          ) : nearbyListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyListings.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/view-listing/${item.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={
                        item.profileImage ||
                        "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
                      }
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Property image"
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

                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {item?.post_title || "Untitled Property"}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span className="text-xs line-clamp-1">
                        {item?.full_address ||
                          item?.address ||
                          "Location Unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="flex items-center gap-1 text-gray-700">
                        <HomeIcon className="h-3 w-3 text-blue-600" />
                        <span>{item.rooms || "N/A"} Beds</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <BeakerIcon className="h-3 w-3 text-blue-600" />
                        <span>{item.bathrooms || "N/A"} Baths</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <SquaresPlusIcon className="h-3 w-3 text-blue-600" />
                        <span>{item.area || "N/A"} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                No nearby properties found within 3km.
              </p>
              <p className="text-sm text-gray-500">
                Try expanding your search area.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyPropertiesSection;
