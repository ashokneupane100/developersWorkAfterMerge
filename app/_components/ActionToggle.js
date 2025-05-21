"use client";

import React, { createElement, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Home, Store, ChevronDown } from "lucide-react";
import Image from "next/image";

function ActionToggle({
  currentAction,
  setAction,
  propertyType = "House",
  setPropertyType,
}) {
  // Define PropertyIcon component to handle icon rendering
  const PropertyIcon = ({ type, className }) => {
    switch(type) {
      case 'House':
        return <Home className={className} />;
      case 'Shop':
        return <Store className={className} />;
      case 'Land':
        return (
          <Image
            src="/assets/images/LandGhaderi.png"
            alt="land"
            width={30}
            height={30}
            className="opacity-75"
          />
        );
      case 'All':
      default:
        return <Building2 className={className} />;
    }
  };

  // Adjusting the breakpoint based on your dimension
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <640 );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-green-800/30 backdrop-blur-sm rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50/80 p-1.5 rounded-lg w-full sm:w-auto">
            <Button
              onClick={() => setAction("Sell")}
              className={cn(
                "h-12 px-8 text-lg font-medium rounded-lg transition-all duration-300",
                currentAction === "Sell"
                  ? "bg-[#144d02] text-white shadow-sm hover:bg-[#144d02]/90"
                  : "bg-transparent text-gray-600 hover:bg-white hover:text-[#144d02]"
              )}
            >
              Buy
            </Button>
            <Button
              onClick={() => setAction("Rent")}
              className={cn(
                "h-12 px-8 text-lg font-medium rounded-lg transition-all duration-300",
                currentAction === "Rent"
                  ? "bg-[#144d02] text-white shadow-sm hover:bg-[#144d02]/90"
                  : "bg-transparent text-gray-600 hover:bg-white hover:text-[#144d02]"
              )}
            >
              Rent
            </Button>
          </div>
          <h3 className='p-[.1rem] rounded-lg text-white text-xl bg-black'>
            {isSmallScreen ? 'Select👇' : 'Select👉'}
          </h3>

          {/* Property Type Select */}
          <Select
            defaultValue="House"
            value={propertyType}
            onValueChange={(value) => setPropertyType(value)}
          >
            <SelectTrigger 
              className={cn(
                "w-[200px] h-14",
                "bg-gray-50/80 border border-gray-200",
                "hover:bg-white hover:border-[#144d02]",
                "focus:ring-2 focus:ring-[#144d02]/20",
                "rounded-lg transition-all duration-300",
                "group cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between w-full gap-2 px-4">
                <div className="flex items-center gap-2">
                  <PropertyIcon 
                    type={propertyType || "House"} 
                    className="w-8 h-8 text-[#144d02]" 
                  />
                  <span className="text-gray-900 font-medium text-lg">
                    {propertyType === "All" ? "All Types" : (propertyType || "House")}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-px bg-gray-300 mx-2"></div>
                  <ChevronDown className="w-8 h-8 text-gray-500 group-hover:text-[#144d02] transition-colors" />
                </div>
              </div>
            </SelectTrigger>

            <SelectContent
              className="bg-green-100 border border-gray-200 shadow-xl rounded-lg overflow-hidden"
              position="popper"
              sideOffset={8}
            >
              <div className="p-1">
                {[
                  { value: "All", label: "All Types" },
                  { value: "House", label: "House" },
                  { value: "Land", label: "Land" },
                  { value: "Shop", label: "Shop" }
                ].map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className={cn(
                      "flex items-center gap-2 p-1 rounded-md cursor-pointer",
                      "hover:bg-[#144d02]/5 focus:bg-[#144d02]/5",
                      "data-[state=checked]:bg-[#144d02]/10",
                      "data-[state=checked]:font-medium",
                      "transition-all duration-200"
                    )}
                  >
                    <PropertyIcon 
                      type={item.value} 
                      className={cn(
                        "w-5 h-5",
                        "text-gray-500",
                        "data-[state=checked]:text-[#144d02]"
                      )} 
                    />
                    <span className={cn("text-gray-900", item.value === propertyType ? "text-lg" : "text-base")}>
                      {item.label}
                    </span>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ActionToggle;