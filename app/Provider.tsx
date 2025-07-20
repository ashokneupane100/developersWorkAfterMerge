"use client";

import React, { useState, useEffect } from "react";
import Header from "./_components/Header";
import { LoadScript } from "@react-google-maps/api";
import Footer from "./_components/Footer";
// AuthProvider removed - now handled in layout.js
import { usePathname } from "next/navigation";

function Provider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    // Ensure this only runs client-side
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      setClientPathname(path);
      setIsAdmin(path.startsWith("/admin"));
    }
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ""}
      libraries={["places"]}
    >
      {!isAdmin && <Header />}
      <div className="pt-[0rem]">{children}</div>
      {!isAdmin && <Footer />}
    </LoadScript>
  );
}

export default Provider;
