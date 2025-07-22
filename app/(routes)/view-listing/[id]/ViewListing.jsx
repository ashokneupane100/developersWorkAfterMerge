"use client";

import { supabase } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Slider from "../_components/Slider";
import Details from "../_components/Details";
import VideoSection from "../_components/VideoSection";
import {
  EyeIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ShareIcon,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { PhoneIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/helpers/formatCurrency";

function ViewListing({ params }) {
  const [listingDetail, setListingDetail] = useState();
  const [id, setId] = useState();
  const [timeUntilVacant, setTimeUntilVacant] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showVacancyCountdown, setShowVacancyCountdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveParams() {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    }
    resolveParams();
  }, [params]);

  const updateViewCount = async (listingId, currentViews) => {
    try {
      const { error: updateError } = await supabase
        .from("listing")
        .update({
          views: (currentViews || 0) + 1,
        })
        .eq("id", listingId);

      if (updateError) {
        console.error("Error updating view count:", updateError);
        return;
      }

      setListingDetail((prev) => ({
        ...prev,
        views: (prev.views || 0) + 1,
      }));
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  const GetListingDetail = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listing")
        .select("*, listingImages(url, listing_id), listingVideos(url, listing_id), khali_hune_date")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (error) throw error;

      if (data) {
        setListingDetail(data);
        updateViewCount(id, data.views);
      }
    } catch (error) {
      toast.error("Error loading listing details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      GetListingDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (!listingDetail?.khali_hune_date) return;

    const updateCountdown = () => {
      const now = new Date();
      const vacancyDate = new Date(listingDetail.khali_hune_date);
      const timeDifference = vacancyDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setTimeUntilVacant({ days, hours, minutes, seconds });
        setShowVacancyCountdown(true);
      } else {
        setTimeUntilVacant({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setShowVacancyCountdown(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [listingDetail?.khali_hune_date]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleCall = () => {
    if (listingDetail?.phone) {
      window.location.href = `tel:${listingDetail.phone}`;
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved listings" : "Added to saved listings");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listingDetail?.post_title || "Property Listing",
          text: `Check out this ${listingDetail?.propertyType || "property"} on OnlineHome Nepal!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Page Header with Property Title */}
      <div className="bg-white border-b shadow-sm">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {listingDetail?.post_title || 'Property Listing'}
          </h1>
          <div className="flex items-center text-sm text-gray-600">
            <span className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 text-blue-600" />
              {listingDetail?.address?.split(',')[0]}
            </span>
            <span className="mx-2">•</span>
            <span className="capitalize">{listingDetail?.propertyType || 'Property'}</span>
            {listingDetail?.action && (
              <>
                <span className="mx-2">•</span>
                <span className="capitalize">For {listingDetail.action}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 pt-5">
        {/* Time Ticker (if property will be vacant soon) */}
        {listingDetail?.khali_hune_date && showVacancyCountdown && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-200 p-2 rounded-full text-amber-800">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-amber-800 font-semibold mb-1">Property Available Soon</h3>
                <p className="text-amber-900">
                  This property will be vacant in {" "}
                  <span className="font-bold">
                    {timeUntilVacant.days} days, {timeUntilVacant.hours} hours, {timeUntilVacant.minutes} minutes, {timeUntilVacant.seconds} seconds
                  </span>
                  . Call immediately for booking and inspection.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Left Column: Images & Property Details */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            {/* Image Slider */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <Slider imageList={listingDetail?.listingImages} />
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 p-3 sm:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Property Details</h2>
              <Details listingDetail={listingDetail} />
            </div>

            {/* Video Section */}
            <VideoSection videos={listingDetail?.listingVideos || []} />
          </div>

          {/* Right Column: Price, Actions, Contact */}
          <div className="space-y-3 sm:space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <div className="flex items-center mb-1">
                  <CurrencyRupeeIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Price</h3>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-blue-700">
                    {listingDetail?.price
                      ? `Rs ${formatCurrency(listingDetail.price)}`
                      : "Price on Request"}
                  </div>
                  {listingDetail?.price && (
                    <div className="text-sm text-blue-600 mt-1">Negotiable</div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              <div className="p-4">
                <Button
                  onClick={handleCall}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-6 rounded-lg shadow-sm"
                >
                  <PhoneIcon className="h-5 w-5" />
                  <span className="font-semibold text-lg">
                    {listingDetail?.phone || "Call Owner"}
                  </span>
                </Button>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className={`flex-1 flex items-center justify-center gap-2 py-2 ${
                      isSaved 
                        ? "border-red-200 text-red-600 hover:bg-red-50" 
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isSaved ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIconOutline className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {isSaved ? "Saved" : "Save"}
                    </span>
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <ShareIcon className="h-5 w-5" />
                    <span className="font-medium">Share</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Listing Stats</h3>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {formatNumber(listingDetail?.views || 0)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Views</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <CalendarIcon className="h-4 w-4 text-blue-600 mr-1" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Listed on {new Date(listingDetail?.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-blue-800">
                <p className="mb-2">
                  <span className="font-semibold">Important:</span> Always verify property details and ownership documents before making any payment.
                </p>
                <p>
                  <span className="font-semibold">Note:</span> This listing was updated on {new Date(listingDetail?.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewListing;