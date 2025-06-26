"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import debounce from "lodash.debounce"; // install with: npm i lodash.debounce


import localPlaces from "./locations.json"; // adjust path if different


// Suggestion dropdown portal
const SuggestionsPortal = ({ suggestions, handleSelect, inputRect }) => {
  const portalRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      portalRef.current = document.createElement("div");
      document.body.appendChild(portalRef.current);
      return () => {
        document.body.removeChild(portalRef.current);
      };
    }
  }, []);

  if (!portalRef.current || !inputRect) return null;

  const style = {
    position: "absolute",
    width: `${inputRect.width}px`,
    left: `${inputRect.left}px`,
    top: `${inputRect.bottom + window.scrollY}px`,
    zIndex: 9999,
  };

  return createPortal(
    <div style={style}>
      <ul className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSelect(suggestion)}
            className="p-3 cursor-pointer hover:bg-purple-50 transition-colors border-b last:border-b-0 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{suggestion.label}</span>
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

  const updateInputRect = () => {
    if (inputContainerRef.current) {
      setInputRect(inputContainerRef.current.getBoundingClientRect());
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

  const fetchSuggestions = debounce(async (value) => {
    const provider = new OpenStreetMapProvider({
      params: {
        viewbox: "85.2408,27.8206,85.5300,27.5916", // Kathmandu Valley
        bounded: 1,
        countrycodes: "np",
      },
      searchUrl: "https://nominatim.openstreetmap.org/search",
    });

    try {
      const results = await provider.search({ query: value });
      const filtered = results.filter((r) =>
        ["Kathmandu", "Lalitpur", "Bhaktapur"].includes(
          r.city || r.town || r.state || ""
        )
      );

      const data = filtered.map((r) => ({
        label: r.label,
        value: {
          coordinates: [r.y, r.x],
          full: r.label,
        },
      }));

      setSuggestions(data);
    } catch (err) {
      console.error("Location Fetch Error:", err);
    }
  }, 300); // debounce 300ms

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      const stored = localStorage.getItem("searchHistory");
      if (stored) setSuggestions(JSON.parse(stored));
      return;
    }

    const filtered = localPlaces
      .filter((place) => place.toLowerCase().includes(value.toLowerCase()))
      .map((name) => ({
        label: name,
        value: {
          coordinates: [0, 0], // dummy coordinates
          full: name,
        },
      }));

    setSuggestions(filtered);
  };

  const handleSelect = (suggestion) => {
    const { full, coordinates } = suggestion.value;

    const addressObject = {
      label: full,
      value: suggestion.value,
    };

    const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updated = [
      { label: full, value: suggestion.value, count: 1 },
      ...stored.filter((item) => item.label !== full),
    ].map((item) => {
      if (item.label === full) {
        item.count = (stored.find((s) => s.label === full)?.count || 0) + 1;
      }
      return item;
    });

    localStorage.setItem("searchHistory", JSON.stringify(updated.slice(0, 5)));

    selectedAddress(addressObject);
    setCoordinates({ lat: coordinates[0], lng: coordinates[1] });
    setQuery(full);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    updateInputRect();

    const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    if (query.length === 0 && stored.length > 0) {
      setSuggestions(stored.sort((a, b) => b.count - a.count).map((s) => s));
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
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
          className={`p-1 ${isFocused ? "scale-110" : ""}`}
          alt="location pin"
        />
      </div>
      <div className="w-full relative" ref={inputContainerRef}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full p-3 pl-4 border rounded-r-lg outline-none text-gray-800 ${
              isFocused ? "border-purple-400 shadow-md" : "border-gray-200"
            } focus:ring-2 focus:ring-purple-200`}
            placeholder="Search location across Nepal / नेपालभरका स्थानहरू खोज्नुहोस्"

          />
          <Search
            className={`absolute right-3 w-5 h-5 ${
              isFocused ? "text-purple-500 scale-110" : "text-gray-400"
            }`}
          />
        </div>
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
