"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function Slider({ imageList }) {
  if (!imageList) {
    return (
      <div className="w-full aspect-[1.91/1] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-gray-400">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-50 rounded-xl">
      <Carousel className="w-full">
        <CarouselContent>
          {imageList.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-[1.91/1] overflow-hidden rounded-xl">
                <div className="absolute inset-0">
                  <Image
                    src={item.url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                    priority={index === 0}
                    quality={90}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 shadow-lg hover:bg-white focus:outline-none h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full transition-all duration-200 ease-in-out" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 shadow-lg hover:bg-white focus:outline-none h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full transition-all duration-200 ease-in-out" />
      </Carousel>
    </div>
  );
}

export default Slider;