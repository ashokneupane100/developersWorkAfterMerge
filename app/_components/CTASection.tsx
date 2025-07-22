"use client";

import { Home, Search, Plus, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CTASection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSearchClick = () => {
    // Scroll to search section (assuming there's a search section with id="search-section")
    const searchSection = document.getElementById("search-section");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleListPropertyClick = () => {
    // Navigate to add-new-listing page
    router.push("/add-new-listing");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setMessageType("");

    // Validate email
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Successfully subscribed! You'll receive property alerts soon."
        );
        setMessageType("success");
        setEmail(""); // Clear the form
      } else {
        setMessage(data.error || "Failed to subscribe. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full h-auto bg-gradient-to-br from-green-50 to-green-100 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-screen-xl w-full mx-auto text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <Home className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-green-800">
            OnlineHome.com.np
          </h1>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 leading-tight">
          Find Your Dream Home in Nepal
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-green-700 mb-2 max-w-3xl mx-auto leading-relaxed">
          Discover thousands of properties across Nepal. Whether you're buying,
          selling, or renting, we make your property journey simple and secure.
        </p>
        <p className="text-base md:text-lg text-green-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join thousands of satisfied customers who trust OnlineHome for their
          real estate needs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleSearchClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            <Search className="h-5 w-5" />
            <span>Search Properties</span>
          </button>

          <button
            onClick={handleListPropertyClick}
            className="bg-white hover:bg-green-50 text-green-600 font-semibold py-4 px-8 rounded-lg shadow-lg border-2 border-green-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>List Your Property</span>
          </button>
        </div>

        {/* Email Signup */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-green-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Get Property Alerts
          </h3>
          <p className="text-green-600 mb-6">
            Be the first to know about new properties that match your
            preferences
          </p>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 whitespace-nowrap disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>

          <p className="text-sm text-green-600 mt-4">
            Join 10,000+ property seekers who trust OnlineHome.com.np
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-green-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">5000+</div>
            <div className="text-sm">Properties Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">1000+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">50+</div>
            <div className="text-sm">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
