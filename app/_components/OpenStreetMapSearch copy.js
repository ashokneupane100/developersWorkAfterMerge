"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import axios from "axios";

const SuggestionsPortal = ({ suggestions, handleSelect, inputRect }) => {
  const portalRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      portalRef.current = document.createElement("div");
      portalRef.current.className = "suggestions-portal";
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
      <ul className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slideDown">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSelect(suggestion)}
            className="p-3 cursor-pointer hover:bg-purple-50 transition-colors border-b last:border-b-0 flex items-center gap-2"
            style={{ animationDelay: `${index * 50}ms` }}
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
  const cancelTokenRef = useRef(null);

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

  const fetchSuggestions = async (value) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const res = await axios.get("https://photon.komoot.io/api/", {
        params: { q: value, limit: 5 },
        cancelToken: cancelTokenRef.current.token,
      });
      const data = res.data.features
        .filter((f) => f.properties.country === "Nepal")
        .map((f) => ({
          label: `${f.properties.name}, ${f.properties.city || ""}, ${
            f.properties.country
          }`
            .replace(/\s+/g, " ")
            .trim(),
          value: f,
        }));

      setSuggestions(data);
    } catch (err) {
      if (!axios.isCancel(err)) console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      const stored = localStorage.getItem("searchHistory");
      if (stored) setSuggestions(JSON.parse(stored));
      return;
    }

    fetchSuggestions(value);
  };

  const handleSelect = (suggestion) => {
    const { name, city, country } = suggestion.properties;
    const { coordinates } = suggestion.geometry;

    const address = `${name}, ${city || ""}, ${country}`
      .replace(/\s+/g, " ")
      .trim();

    const addressObject = {
      label: address,
      value: suggestion,
    };

    // Update local storage
    const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updated = [
      { label: address, value: suggestion, count: 1 },
      ...stored.filter((item) => item.label !== address),
    ].map((item, i, arr) => {
      if (item.label === address) {
        item.count = (stored.find((s) => s.label === address)?.count || 0) + 1;
      }
      return item;
    });

    localStorage.setItem("searchHistory", JSON.stringify(updated.slice(0, 5)));

    // Use coordinates and clear state
    selectedAddress(addressObject);
    setCoordinates({ lat: coordinates[1], lng: coordinates[0] });
    setQuery(address);
    setSuggestions([]);
    setIsFocused(false);
  };
  const handleFocus = () => {
    setIsFocused(true);
    updateInputRect();

    // Show most searched from localStorage
    const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    if (query.length === 0 && stored.length > 0) {
      setSuggestions(
        stored.sort((a, b) => b.count - a.count).map((s) => s.value)
      );
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
            placeholder="Write Here Search Full Address in Nepal"
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
