import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

function AgentDetail({ listingDetail }) {
  const defaultPhone = "9851331644";
  return (
    <div className="flex flex-col gap-4 items-center justify-between p-4 rounded-lg shadow-lg border my-6 bg-white">
      {/* Agent Info */}
      <div className="flex items-center gap-6">
        <Image
          src={
            listingDetail?.profileImage || "/assets/images/fallbackAgent.webp"
          } // Fallback image if none provided
          alt="Agent Profile"
          width={60}
          height={60}
          className="rounded-full shadow-md"
        />
        <div>
          <h2 className="text-xl font-bold">
            {listingDetail?.fullName || "onlinehome.com.np"}
          </h2>
          <h3 className="text-gray-500">
            {listingDetail?.createdBy || "Not Specified"}
          </h3>
        </div>
      </div>

      {/* Contact Options */}
      <div className="flex gap-4 items-center">
        <a
          href={`mailto:${listingDetail?.createdBy || ""}`}
          className="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Send Message
        </a>
        <a
          href={`tel:${listingDetail?.phone || ""}`}
          className="flex items-center gap-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow"
        >
          <Phone className="w-5 h-5" />
          Call: {listingDetail?.phone || defaultPhone}
        </a>
      </div>
    </div>
  );
}

export default AgentDetail;
