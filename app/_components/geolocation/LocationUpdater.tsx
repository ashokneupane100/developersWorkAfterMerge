"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const LocationUpdater = () => {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const updateLocation = async () => {
      if (!navigator.geolocation) {
        setStatus("Geolocation not supported.");
        return;
      }

      setStatus("Requesting location...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // ✅ Console log for testing
          console.log("📍 Latitude:", latitude);
          console.log("📍 Longitude:", longitude);

          // Get the current user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !user) {
            setStatus("Failed to get user.");
            return;
          }

          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              latitude,
              longitude,
              location_permission: true,
              location_updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (updateError) {
            setStatus("Error updating location.");
            console.error(updateError);
          } else {
            setStatus("Location updated successfully ✅");
          }
        },
        (error) => {
          setStatus("Location access denied ❌");
          console.error("❌ Geolocation error:", error);
        }
      );
    };

    updateLocation();
  }, []);

  return (
    <div className="text-sm text-gray-600 p-2">
      <p>{status === "idle" ? "Checking location..." : status}</p>
    </div>
  );
};

export default LocationUpdater;
