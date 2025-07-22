import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

function AgentDetail({ listingDetail }) {
  const defaultPhone = "9851331644";
  return (
    <div className="flex flex-col gap-3 sm:gap-4 items-center justify-between p-2 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
      {/* Agent Info */}
              <div className="flex items-center gap-2 sm:gap-4 w-full">
        <Image
          src={
            listingDetail?.profileImage || "/assets/images/fallbackAgent.webp"
          } // Fallback image if none provided
          alt="Agent Profile"
          width={60}
          height={60}
          className="rounded-full shadow-md flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {listingDetail?.fullName || "onlinehome.com.np"}
          </h2>
          <h3 className="text-gray-500 text-sm truncate">
            {listingDetail?.createdBy || "ashokabrother@gmail.com"}
          </h3>
        </div>
      </div>

      {/* Contact Options */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
        <a
          href={`mailto:${listingDetail?.createdBy || "ashokabrother@gmail.com"}`}
          className="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-sm text-center transition-colors"
        >
          Send Message
        </a>
        <a
          href={`tel:${listingDetail?.phone || defaultPhone}`}
          className="flex items-center justify-center gap-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-sm transition-colors"
        >
          <Phone className="w-5 h-5" />
          Call: {listingDetail?.phone || defaultPhone}
        </a>
      </div>
    </div>
  );
}

export default AgentDetail;
