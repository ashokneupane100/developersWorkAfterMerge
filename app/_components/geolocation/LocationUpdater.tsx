"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const LocationUpdater = () => {
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const apiKey = process.env.GEO_API_KEY || "AIzaSyCVIoYXA9Ky4q8dXYv72wblihwZmN8xVdc";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results?.length > 0) {
        return data.results[0].formatted_address;
      } else {
        console.warn("⚠️ No address returned. Status:", data.status);
      }
    } catch (err) {
      console.error("❌ Error during reverse geocoding:", err);
    }
    return null;
  };

  useEffect(() => {
    const updateProfileLocation = async (latitude: number, longitude: number) => {
      const email =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("email") || localStorage.getItem("email"));

      if (!email) {
        console.log("ℹ️ No email in session/localStorage. Skipping location update.");
        return;
      }

      const address = await getAddressFromCoords(latitude, longitude);

      // ✅ Update the user's profile by email
      const { data, error } = await supabase
        .from("profiles")
        .update({
          latitude,
          longitude,
          full_address: address,
          location_permission: true,
          location_updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select();

      if (error) {
        console.error("❌ Failed to update user profile:", error);
      } else {
        console.log("✅ User profile updated with location:", data);
      }
    };

    const requestLocation = () => {
      const emailExists =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("email") || localStorage.getItem("email"));

      if (!emailExists) return;

      if (!navigator.geolocation) {
        console.warn("❌ Geolocation is not supported.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude === 0 && longitude === 0) {
            console.warn("⚠️ Invalid coordinates, skipping update.");
            return;
          }
          updateProfileLocation(latitude, longitude);
        },
        (error) => {
          console.error("❌ Geolocation error:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    requestLocation(); // Trigger on page load
  });

  return null;
};

export default LocationUpdater;
