import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  MapPin,
  Ruler,
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/helpers/formatCurrency";
import OpenStreetMapSearch from "./OpenStreetMapSearch";
import FilterSection from "./FilterSection";
import ActionToggle from "./ActionToggle";

function Listing({
  listing,
  handleSearchClick,
  searchedAddress,
  setBathRoomsCount,
  setRoomsCount,
  setParkingCount,
  setPriceRange,
  setArea,
  currentAction,
  setCurrentAction,
  propertyType,
  setPropertyType,
  setCoordinates,
}) {
  const [address, setAddress] = useState();
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const listingRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 3 : 6);
      setCurrentPage(1);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const totalPages = Math.ceil((listing?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listing?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handleSearch = () => {
    handleSearchClick();
    setIsSearchPerformed(true);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToListing();
  };

  const scrollToListing = () => {
    if (listingRef.current) {
      listingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleFavorite = (itemId, e) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleFilterChange = () => {
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            ...
          </span>
        );
      }
      return (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant={currentPage === page ? "default" : "outline"}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200
            ${
              currentPage === page
                ? "bg-[#1f456b] text-white"
                : "hover:bg-[#1f456b] hover:text-white"
            }`}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen rounded-tl-lg rounded-tr-lg mt-[-1.5rem] text-white">
      <div className="container mx-auto px-0 py-6 max-w-full rounded-lg">
        <div
          className="relative min-h-[600px] bg-cover bg-center bg-no-repeat rounded-lg mb-8 pt-20 pb-20 md:pt-16 md:pb-14 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-[.1rem]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.25)), 
            url("https://img.freepik.com/free-photo/photorealistic-house-with-wooden-architecture-timber-structure_23-2151302742.jpg?t=st=1730105549~exp=1730109149~hmac=7d4bcd4b4108ac023e84ec1680ed264d928bd71186920b119d47433f378c8e3a&w=740")`,
          }}
        >
          <div className="container px-0 md:px-1 lg:px-20 py-5 md:py-0 max-w-4xl relative z-10">
            <div className="px-2">
              <div className="bg-white shadow-xl rounded-lg py-4 px-1 md:py-8 border-b-4 border-[#1f456b]">
                <div className="text-center space-y-1 md:space-y-1">
                  {/* Header Section */}
                  <div className="space-y-0">
                    <div className="inline-block px-6 py-3">
                      <h1 className="text-3xl md:text-4xl font-bold text-[#1f456b]">
                        <span className="mr-3"></span>
                        नमस्कार🙏
                      </h1>
                    </div>
                    <p className="text-lg md:text-xl text-blue-900 font-extrabold">
                      अनलाईन मार्फत घरजग्गा र पसल खरीद बिक्री गर्न तथा भाडामा
                      लगाउन
                    </p>
                  </div>

                  {/* Action Toggle */}
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <ActionToggle
                        currentAction={currentAction}
                        setAction={setCurrentAction}
                        propertyType={propertyType}
                        setPropertyType={setPropertyType}
                      />
                    </div>
                  </div>

                  {/* Filter Section - Centered for Land property type */}
                  <div className="max-w-7xl mx-auto">
                    <div
                      className={`bg-gray-50 rounded-xl p-4 ${
                        propertyType === "Land" ? "max-w-xl mx-auto" : ""
                      }`}
                    >
                      <FilterSection
                        setBathRoomsCount={setBathRoomsCount}
                        setRoomsCount={setRoomsCount}
                        setParkingCount={setParkingCount}
                        setPriceRange={setPriceRange}
                        setArea={setArea}
                        currentAction={currentAction}
                        propertyType={propertyType}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  </div>

                  {/* Search Section */}
                  <div className="max-w-2xl mx-auto space-y-5">
                    {/* Map Search */}
                    <div className="bg-white rounded-xl shadow-sm text-black">
                      <OpenStreetMapSearch
                        selectedAddress={(v) => {
                          searchedAddress(v);
                          setAddress(v);
                          setIsSearchPerformed(false);
                        }}
                        setCoordinates={setCoordinates}
                      />
                    </div>

                    {/* Clean Search Button */}
                    <Button
                      className="w-full mx-auto bg-[#1f456b] hover:bg-[#2c5e96] text-white flex items-center justify-center gap-3 text-2xl font-bold rounded-full px-5 py-6 transition-all duration-300"
                      onClick={handleSearch}
                    >
                      <Search className="h-8 w-8" />
                      <span className="tracking-wide">Search Properties</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(isSearchPerformed || isFilterApplied) && address && (
          <div className="flex px-4 mb-6 justify-center items-center text-center">
            <h2 className="text-xl font-semibold text-gray-100">
              Found <span className="text-[#fafbfc] font-bold">{listing?.length}</span> Properties in <span className="text-[#f1f2f3] font-bold">{address?.label}</span>
            </h2>
          </div>
        )}

        <div ref={listingRef} className="px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 mb-1">
          {currentItems.length > 0
            ? currentItems.map(
                (item) =>
                  item?.listingImages[0]?.url && (
                    <div key={item.id} className="relative group">
                      <Link href={`/view-listing/${item.id}`} className="block">
                        <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                          <div className="relative h-80 w-full overflow-hidden">
                            <Image
                              src={item.listingImages[0].url}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              alt="Property Image"
                            />
                            <div className="absolute top-4 right-4 z-10">
                              <button
                                onClick={(e) => toggleFavorite(item.id, e)}
                                className="bg-white/70 p-2 rounded-full hover:bg-white transition-all"
                              >
                                <Heart
                                  className={`h-6 w-6 ${
                                    favorites.includes(item.id)
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-500"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="p-2 justify-center items-center text-center">
                            <div className="flex justify-center items-center mb-1">
                              <h2 className="text-2xl font-bold text-[#1f456b]">
                                Rs {formatCurrency(item.price)}
                              </h2>
                            </div>
                            <div className="flex items-center text-gray-600 mb-3">
                              <MapPin className="h-5 w-5 mr-2 text-[#1f456b]" />
                              <span className="text-sm truncate">
                                {item.address
                                  .split(",")
                                  .filter(
                                    (part) =>
                                      !part
                                        .trim()
                                        .toLowerCase()
                                        .includes("nepal")
                                  )
                                  .join(",")
                                  .trim()}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                {
                                  icon: BedDouble,
                                  value: item.rooms,
                                  label: "Rooms",
                                },
                                {
                                  icon: Bath,
                                  value: item.bathrooms,
                                  label: "Bathrooms",
                                },
                                {
                                  icon: Ruler,
                                  value: item.area,
                                  label: "Area",
                                },
                              ].map(({ icon: Icon, value, label }) => (
                                <div
                                  key={label}
                                  className="flex flex-col items-center bg-[#f4f7fa] rounded-lg p-2"
                                >
                                  <Icon className="h-5 w-5 text-[#1f456b] mb-1" />
                                  <span className="text-xs font-medium text-gray-700">
                                    {value}
                                  </span>
                                  <span className="text-[10px] text-gray-500">
                                    {label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
              )
            : [1, 2, 3, 4, 5, 6].map((_, index) => (
                <div
                  key={index}
                  className="relative bg-white shadow-lg rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
        </div>

        {listing?.length > itemsPerPage && (
          <div className="mt-8 flex flex-col items-center space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="rounded-l-md"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Previous</span>
              </Button>

              <div className="hidden sm:flex items-center space-x-2">
                {renderPaginationNumbers()}
              </div>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="rounded-r-md"
              >
                <span className="mr-2">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-white">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, listing.length)} of {listing.length} listings
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listing;
