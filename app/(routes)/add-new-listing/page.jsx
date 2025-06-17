"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/Provider/useAuth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
// Replace GoogleAddressSearch with EnhancedGooglePlacesSearch
import EnhancedGooglePlacesSearch from '@/app/_components/GoogleAddressSearch';
import Loading from "./loading";

function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const { user, isLoading: authLoading } = useAuth();
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  // Move authentication redirect to useEffect to prevent render-time navigation
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const trimNepalFromAddress = (address) => {
    // Remove ", Nepal" or " Nepal" from the end of the address
    return address.replace(/,?\s*Nepal\s*$/i, '').trim();
  };

  const nextHandler = async () => {
    try {
      setLoader(true);
      
      // Enhanced validation with better error messages
      if (!selectedAddress?.label) {
        toast.error("Please select a location from the search results");
        return;
      }
      
      if (!coordinates?.lat || !coordinates?.lng) {
        toast.error("Unable to get coordinates for selected location. Please try selecting again.");
        return;
      }
      
      if (!user?.email) {
        toast.error("User authentication error. Please log in again.");
        return;
      }

      // Trim Nepal from the address
      const trimmedAddress = trimNepalFromAddress(selectedAddress.label);

      console.log('Creating listing with:', {
        address: trimmedAddress,
        coordinates,
        createdBy: user.email
      });

      // Insert the initial listing data
      const { data, error } = await supabase
        .from("listing")
        .insert({
          address: trimmedAddress,
          coordinates: coordinates,
          createdBy: user.email,
          active: true
        })
        .select('id')
        .single();

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to create listing. Please try again.");
        return;
      }

      if (data) {
        toast.success("नयाँ ठेगाना थपियो, फोटोहरू र विवरण अपलोड गर्नुहोस् र अगाडि बढ्नुहोस्...");
        router.replace("/edit-listing/" + data.id);
      }

    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoader(false);
    }
  };

  // Handle authentication loading state
  if (authLoading) {
    return <Loading />;
  }

  // Don't render content while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 items-center justify-center to-white mt-12 md:mt-0 ">
      <div className="w-full max-w-xl mx-auto flex flex-col py-5 px-1 md:px-10 md:py-0">
        {/* Card Container */}
        <div className="bg-white shadow-lg rounded-lg">
          {/* Image Section - Reduced height for medium and large screens */}
          <div className="relative h-[172px] sm:h-[300px] md:h-[320px] w-4/5 mx-auto">
            <Image 
              src="/handShake.jpg" 
              alt="Property Listing" 
              fill
              priority
              className="object-cover object-[50%_28%]"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          {/* Form Section */}
          <div className="p-1 sm:p-6">
            <div className="text-center">
              <h2 className="text-lg sm:text-2xl font-bold text-primary">
                बेच्न तथा भाडामा लगाउन पोस्ट गर्नुहोस्
              </h2>
              <p className="text-gray-800 text-lg mt-[-.2rem] mb-1 font-semibold">
                Search for any place in Nepal and click Next...
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Enhanced Google Places Search Component */}
              <EnhancedGooglePlacesSearch
                selectedAddress={(value) => {
                  console.log('Address selected:', value);
                  setSelectedAddress(value);
                }}
                setCoordinates={(value) => {
                  console.log('Coordinates set:', value);
                  setCoordinates(value);
                }}
              />

            

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl text-lg mt-4 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedAddress || !coordinates.lat || !coordinates.lng || loader}
                onClick={nextHandler}
              >
                {loader ? (
                  <>
                    <Loader className="animate-spin mr-3" />
                    Creating Listing...
                  </>
                ) : (
                  <>
                    {selectedAddress && coordinates.lat ? 
                      "Click Next to Continue" : 
                      "Select a Location First"
                    }
                  </>
                )}
              </Button>

              {/* Help text */}
              <div className="mt-3 text-center text-sm text-gray-500">
                Try searching for: "Kathmandu restaurants", "Pokhara hotels", "Lalitpur shops", or any address
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;