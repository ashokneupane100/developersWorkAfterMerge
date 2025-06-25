"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import ListingNearYou from "./ListingNearYou";

const NearbyListingsFetcher = () => {
  const [nearbyListings, setNearbyListings] = useState<any[]>([]);

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

  useEffect(() => {
    const fetchNearbyListings = async () => {
      const email =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("email") || localStorage.getItem("email"));

      if (!email) return;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("latitude, longitude, full_address")
        .eq("email", email)
        .single();

      if (!userProfile?.latitude || !userProfile?.longitude) return;

      const { latitude, longitude } = userProfile;

      const { data: listings } = await supabase.from("listing").select("*");

      const nearby = listings?.filter((listing) => {
        const coords = listing.coordinates;
        if (!coords?.lat || !coords?.lng) return false;
        const dist = getDistanceFromLatLonInKm(latitude, longitude, coords.lat, coords.lng);
        return dist <= 3;
      });

      setNearbyListings(nearby || []);
    };

    fetchNearbyListings();
  }, []);

  return <ListingNearYou listings={nearbyListings} />;
};

export default NearbyListingsFetcher;
