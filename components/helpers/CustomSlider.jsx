import React from "react";
import { cn } from "@/lib/utils";

const CustomSlider = ({ value, onValueChange, min, max, step }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative py-1">
      <div className="relative h-4">
        <div className="absolute w-full h-1 bg-gray-700 rounded-full top-1/2 -translate-y-1/2" />
        <div 
          className="absolute h-1 bg-blue-500 rounded-full top-1/2 -translate-y-1/2" 
          style={{ width: `${percentage}%` }}
        />
        <input 
          type="range" 
          value={value}
          onChange={(e) => onValueChange(parseFloat(e.target.value))}
          min={min} 
          max={max} 
          step={step}
          className={cn(
            "absolute w-full h-4 bg-transparent cursor-pointer appearance-none",
            "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-colors",
            "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:hover:bg-blue-400",
            "[&::-webkit-slider-runnable-track]:bg-transparent",
            "[&::-moz-range-track]:bg-transparent"
          )}
        />
      </div>
    </div>
  );
};

export default CustomSlider;