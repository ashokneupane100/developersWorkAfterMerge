"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import axios from "axios";

// Component to render the suggestions in a portal
const SuggestionsPortal = ({ suggestions, handleSelect, inputRect }) => {
  const portalRef = useRef(null);
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      portalRef.current = document.createElement('div');
      portalRef.current.className = 'suggestions-portal';
      document.body.appendChild(portalRef.current);
      
      return () => {
        if (portalRef.current) {
          document.body.removeChild(portalRef.current);
        }
      };
    }
  }, []);

  if (!portalRef.current || !inputRect) return null;

  // Position the suggestions below the input
  const style = {
    position: 'absolute',
    width: `${inputRect.width}px`,
    left: `${inputRect.left}px`,
    top: `${inputRect.bottom + window.scrollY}px`,
    zIndex: 9999,
  };

  return createPortal(
    <div style={style}>
      <ul className="bg-white h-auto border border-gray-200 w-full rounded-lg mt-1 shadow-lg overflow-hidden animate-slideDown">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSelect(suggestion)}
            className="p-3 cursor-pointer hover:bg-purple-50 transition-colors duration-150 border-b last:border-b-0 border-gray-100 flex items-center gap-2 suggestion-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>
              {suggestion.properties.name}, {suggestion.properties.city || ""},{" "}
              {suggestion.properties.country}
            </span>
          </li>
        ))}
      </ul>
    </div>,
    portalRef.current
  );
};

function OpenStreetMapSearch({ selectedAddress, setCoordinates }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputRect, setInputRect] = useState(null);
  const inputContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Update the input rect when the input is focused or the window is resized
  const updateInputRect = () => {
    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setInputRect(rect);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateInputRect);
    window.addEventListener("scroll", updateInputRect);
    
    return () => {
      window.removeEventListener("resize", updateInputRect);
      window.removeEventListener("scroll", updateInputRect);
    };
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      try {
        const response = await axios.get("https://photon.komoot.io/api/", {
          params: { q: value, limit: 5 },
        });
        const nepalSuggestions = response.data.features.filter(
          (feature) => feature.properties.country === "Nepal"
        );
        setSuggestions(nepalSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion) => {
    const { name, city, country } = suggestion.properties;
    const { coordinates } = suggestion.geometry;

    const address = `${name}, ${city || ""}, ${country}`.replace(/\s+/g, " ").trim();

    const addressObject = {
      label: address,
      value: suggestion,
    };

    selectedAddress(addressObject);
    setCoordinates({ lat: coordinates[1], lng: coordinates[0] });
    setQuery(address);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    updateInputRect();
  };

  const handleBlur = () => {
    // Delay to allow for selection clicks
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  return (
    <div className="flex items-center w-full">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-l-lg bg-purple-200 transition-all duration-300 ${
          isFocused ? "bg-purple-300" : ""
        }`}
      >
        <Image
          src="/pin.png"
          width={32}
          height={32}
          className={`p-1 transition-transform duration-300 ${isFocused ? "scale-110" : ""}`}
          alt="location pin"
        />
      </div>
      <div className="w-full relative" ref={inputContainerRef}>
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full p-3 pl-4 border rounded-r-lg transition-all duration-300 outline-none text-gray-800 ${
              isFocused ? "border-purple-400 shadow-md" : "border-gray-200"
            } focus:ring-2 focus:ring-purple-200 search-input`}
          />
          {!query && (
            <div className="placeholder-wrapper absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="placeholder-text text-gray-400">Write Here Search Full Address in Nepal</span>
            </div>
          )}
          <Search
            className={`absolute right-3 w-5 h-5 transition-all duration-300 ${
              isFocused ? "text-purple-500 scale-110" : "text-gray-400"
            } ${query ? "opacity-100" : "opacity-70"}`}
          />
        </div>

        {/* Render suggestions through portal when needed */}
        {suggestions.length > 0 && isFocused && (
          <SuggestionsPortal 
            suggestions={suggestions} 
            handleSelect={handleSelect} 
            inputRect={inputRect}
          />
        )}
      </div>
    </div>
  );
}

export default OpenStreetMapSearch;