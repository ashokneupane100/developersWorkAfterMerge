"use client";

import { useEffect } from "react";

export default function ChatwootWidget() {
  useEffect(() => {
    if (typeof window === "undefined" || window.chatwootSDK) return;

    // Global Chatwoot settings
    window.chatwootSettings = {
      position: "right",
      type: "expanded_bubble",
      launcherTitle: "हामीसँग सिधा कुरा गर्नुहोस्",
    };

    const BASE_URL = "https://app.chatwoot.com";
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: "WqrqeuHEXrscRRXdiDJGoDa4",
        baseUrl: BASE_URL,
      });
    };

    document.head.appendChild(script);

    return () => {
      // Optional cleanup on unmount
      const existing = document.querySelector(`script[src="${BASE_URL}/packs/js/sdk.js"]`);
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
