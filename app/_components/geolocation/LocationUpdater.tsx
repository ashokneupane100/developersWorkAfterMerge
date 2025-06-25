"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const LocationUpdater = () => {
  const getAddresses = async (
    lat: number,
    lng: number
  ): Promise<{ address: string | null; fullAddress: string | null }> => {
    try {
      const apiKey =
        process.env.GEO_API_KEY || "AIzaSyCVIoYXA9Ky4q8dXYv72wblihwZmN8xVdc";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      const fullAddress = data?.results?.[0]?.formatted_address || null;
      const placeName = data?.results?.[4]?.formatted_address?.split(",")[0].trim() || null;

      return { address: placeName, fullAddress };
    } catch (err) {
      return { address: null, fullAddress: null };
    }
  };

  useEffect(() => {
    const updateProfileLocation = async (latitude: number, longitude: number) => {
      const email =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("email") || localStorage.getItem("email"));

      if (!email) {
        return;
      }

      const { address, fullAddress } = await getAddresses(latitude, longitude);
      if (!address || !fullAddress) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          latitude,
          longitude,
          address,     
          full_address: fullAddress, // ➜ e.g., "M8WJ+67X, Kathmandu 44600, Nepal"
          location_permission: true,
          location_updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select();

      if (error) {
      } else {
        return ;
      }
    };

    const requestLocation = () => {
      const emailExists =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("email") || localStorage.getItem("email"));

      if (!emailExists) return;

      if (!navigator.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude === 0 && longitude === 0) {
            return;
          }
          updateProfileLocation(latitude, longitude);
        },
        (error) => {  
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    requestLocation();
  });

  return null;
};

export default LocationUpdater;
