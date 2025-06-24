"use client";

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Bath, BedDouble, CarFront, BadgeDollarSign } from 'lucide-react';

function FilterSection({
    setBathRoomsCount,
    setRoomsCount,
    setParkingCount,
    setPriceRange,
    currentAction,
    propertyType,
    onFilterChange
}) {
    const handleValueChange = (setter) => (value) => {
        setter(value);
        onFilterChange();
    };

    const getPriceRanges = () => {
        // Rent-based options
        if (currentAction === "Rent") {
            if (propertyType === "Room/Flat") {
                return [
                    { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
                    { label: "Rs 1 – Rs 10K", value: "0-10000" },
                    { label: "Rs 10K – Rs 15K", value: "10000-15000" },
                    { label: "Rs 15K – Rs 20K", value: "15000-20000" },
                    { label: "Rs 20K – Rs 25K", value: "20000-25000" },
                    { label: "Above Rs 25K", value: "25000-100000000" }
                ];
            }
    
            if (propertyType === "House") {
                return [
                    { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
                    { label: "Rs 20K – Rs 40K", value: "20000-40000" },
                    { label: "Rs 40K – Rs 60K", value: "40000-60000" },
                    { label: "Rs 60K – Rs 80K", value: "60000-80000" },
                    { label: "Above Rs 80K", value: "80000-100000000" }
                ];
            }
    
            if (propertyType === "Shop") {
                return [
                    { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
                    { label: "Rs 10K – Rs 25K", value: "10000-25000" },
                    { label: "Rs 25K – Rs 50K", value: "25000-50000" },
                    { label: "Above Rs 50K", value: "50000-100000000" }
                ];
            }
    
            return [
                { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
                { label: "Rs 1 – Rs 10K", value: "0-10000" },
                { label: "Rs 10K – Rs 20K", value: "10000-20000" },
                { label: "Above Rs 20K", value: "20000-100000000" }
            ];
        }
    
        // Sell-based options (Buyers)
        if (propertyType === "Land") {
            return [
                { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
                { label: "Below 50 Lakhs", value: "0-5000000" },
                { label: "50 Lakhs – 1 Crore", value: "5000000-10000000" },
                { label: "1 – 2 Crores", value: "10000000-20000000" },
                { label: "Above 2 Crores", value: "20000000-1000000000" }
            ];
        }
    
        return [
            { label: "Select Budget", value: "0-10000000000", isPlaceholder: true },
            { label: "Up to 1 Crore", value: "0-10000000" },
            { label: "1 – 2 Crores", value: "10000000-20000000" },
            { label: "2 – 5 Crores", value: "20000000-50000000" },
            { label: "Above 5 Crores", value: "50000000-1000000000" }
        ];
    };
    

    const getFilterConfig = () => {
        const priceFilter = {
            value: undefined,
            onChange: handleValueChange(setPriceRange),
            placeholder: "Select Budget",
            icon: BadgeDollarSign,
            items: getPriceRanges(),
            labelFormatter: (item) => item.label
        };

        if (propertyType === "Land") {
            return [priceFilter];
        }

        return [
            priceFilter,
            {
                value: undefined,
                onChange: handleValueChange(setRoomsCount),
                placeholder: "Select Rooms",
                icon: BedDouble,
                items: [
                    { label: "1 Room or more", value: "1-100" },
                    { label: "2 Rooms or more", value: "2-100" },
                    { label: "3 Rooms or more", value: "3-100" },
                    { label: "4 Rooms or more", value: "4-100" }
                ],
                labelFormatter: (item) => item.label
            },
            {
                value: undefined,
                onChange: handleValueChange(setBathRoomsCount),
                placeholder: "Select Bathrooms",
                icon: Bath,
                items: [
                    { label: "1 Bathroom or more", value: "1-100" },
                    { label: "2 Bathrooms or more", value: "2-100" },
                    { label: "3 Bathrooms or more", value: "3-100" },
                    { label: "4 Bathrooms or more", value: "4-100" }
                ],
                labelFormatter: (item) => item.label
            },
            {
                value: undefined,
                onChange: handleValueChange(setParkingCount),
                placeholder: "Select Parking",
                icon: CarFront,
                items: [
                    { label: "No Parking", value: "0-100" },
                    { label: "1 or more", value: "1-100" },
                    { label: "2 or more", value: "2-100" },
                    { label: "3 or more", value: "3-100" }
                ],
                labelFormatter: (item) => item.label
            }
        ];
    };

    const renderSelect = (options) => {
        const {
            value,
            onChange,
            placeholder,
            icon: Icon,
            items,
            labelFormatter
        } = options;

        return (
            <div className="w-full">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger 
                        className={`
                            w-full h-12 sm:h-11
                            bg-white/90 backdrop-blur-sm
                            border border-gray-200
                            hover:border-[#1f456b]/20 hover:bg-gray-50
                            focus:border-[#1f456b]/30 focus:ring-2 focus:ring-[#1f456b]/10
                            transition-all duration-300 rounded-2xl
                            text-gray-700 font-medium shadow-sm
                            hover:shadow-md
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-[#1f456b] opacity-70" />
                            <SelectValue placeholder={placeholder} />
                        </div>
                    </SelectTrigger>
                    <SelectContent 
                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border-gray-100"
                        position="popper"
                        sideOffset={8}
                    >
                        <div className="p-1">
                            {items.filter(item => !item.isPlaceholder).map((item, index) => (
                                <SelectItem 
                                    key={index} 
                                    value={typeof item === 'object' ? item.value : item.toString()}
                                    className={`
                                        block
                                        w-full
                                        px-2
                                        py-2
                                        rounded-lg
                                        text-sm
                                        cursor-pointer
                                        select-none
                                        outline-none
                                        data-[highlighted]:bg-[#1f456b]/10
                                        data-[highlighted]:text-[#1f456b]
                                        hover:bg-[#1f456b]/10
                                        data-[state=checked]:bg-[#1f456b]/10
                                        data-[state=checked]:text-[#1f456b]
                                        transition-colors
                                        duration-150
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-[#1f456b]"/>
                                        <span className="font-medium">
                                            {labelFormatter(item)}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </div>
                    </SelectContent>
                </Select>
            </div>
        );
    };

    return (
        <div className="w-full max-w-screen-md mx-auto">
            <div 
                className={`
                    relative grid
                    ${propertyType === "Land" 
                        ? "grid-cols-1 sm:grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2"
                    }
                    gap-2 sm:gap-3 p-0
                `}
            >
                {getFilterConfig().map((filterProps, index) => (
                    <React.Fragment key={index}>
                        {renderSelect(filterProps)}
                    </React.Fragment>
                ))}

                {/* Decorative Elements */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none rounded-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
            </div>
        </div>
    );
}

export default FilterSection;