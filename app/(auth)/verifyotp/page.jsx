"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      toast.error("Email address is missing");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        // Navigate to reset password page
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}`);
      } else {
        toast.error(data.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          name: "User" // Since we don't have name here, use a default
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("New verification code sent");
        setTimer(600); // Reset timer
        setCanResend(false);
      } else {
        toast.error(data.message || "Failed to send new verification code");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative h-16 w-16">
            <Image
              src="/logo.png" 
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Verify Email</h1>
            <p className="mt-2 text-gray-600">
              We've sent a verification code to <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="relative">
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="pl-10 text-center text-lg tracking-widest"
                  disabled={isLoading}
                  maxLength={6}
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                {canResend ? (
                  <button 
                    type="button" 
                    onClick={handleResendOTP}
                    className="text-primary hover:underline focus:outline-none"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                ) : (
                  <span>
                    Resend code in <span className="font-medium">{formatTime(timer)}</span>
                  </span>
                )}
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
            
            <div className="mt-4 text-center text-sm">
              <Link 
                href="/login"
                className="text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}