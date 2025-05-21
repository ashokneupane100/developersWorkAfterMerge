"use client";

import { useAuth } from "@/components/Provider/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function FacebookSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithFacebook } = useAuth();
  const router = useRouter(); // Initialize the router

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithFacebook(); // Perform the Facebook sign-in
      // If sign-in is successful, redirect to /add-new-listing
      router.push("/add-new-listing");
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      // Optionally, display an error message to the user
      alert("Failed to sign in with Facebook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFacebookSignIn}
      disabled={isLoading}
      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
      {isLoading ? "Connecting..." : "Sign in with Facebook"}
    </button>
  );
}