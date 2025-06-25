"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Checkbox
} from "@heroui/react";
import { EyeIcon, MailIcon, LockIcon } from "lucide-react";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import GoogleSignInButton from "./GoogleSignInButtton";
import { useAuth } from "@/components/Provider/useAuth";
import { toast } from "sonner";
import FacebookSignInButton from "./FacebookLogin";

const Login = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { signInWithCredentials } = useAuth();

  // Clear stored credentials when the component mounts or when reset=success
  useEffect(() => {
    // Check if the user just completed a password reset
    const resetStatus = searchParams.get('reset');
    if (resetStatus === 'success') {
      // Clear stored credentials
      clearStoredCredentials();
      toast.success("Password has been reset successfully. Please log in with your new password.");
    }
  }, [searchParams]);
  
  // Function to clear all stored credentials
  const clearStoredCredentials = () => {
    console.log("Clearing stored credentials");
    
    // Clear any NextAuth session storage
    if (typeof window !== "undefined") {
      if (window.sessionStorage) {
        sessionStorage.removeItem('next-auth.session-token');
        sessionStorage.removeItem('next-auth.callback-url');
        sessionStorage.removeItem('next-auth.csrf-token');
      }
      
      if (window.localStorage) {
        // Clear any Supabase-related storage
        localStorage.removeItem('supabase.auth.token');
        
        // Also clear any token that starts with sb-
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      clearStoredCredentials();
  
      const result = await signInWithCredentials(email, password, {
        redirect: false,
      });
  
      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        const { token, user } = result; // Ensure your auth method returns these
  
        if (typeof window !== "undefined") {
          // Store in sessionStorage
          sessionStorage.setItem("email", email);
  
          // Store in localStorage (optional for persistence)
          localStorage.setItem("email", email);
  
          // Store in cookies (basic client-side cookie)
          document.cookie = `email=${email}; path=/`;
        }
  
        // Redirect to homepage and reload
        window.location.href = "/";

      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary/20 p-4">
      <Card className="w-full max-w-md shadow-md bg-white rounded-xl p-6">
        <CardHeader className="flex flex-col items-center space-y-2 pb-0 pt-6">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <LockIcon className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">Login</h2>
          <p className="text-gray-500 text-sm text-center">
            Welcome back! Please enter your details
          </p>
        </CardHeader>
        
        <CardBody className="pt-6">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded px-4 py-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v5M12 17.01l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={
                  <MailIcon className="text-gray-400 w-4 h-4" />
                }
                className="w-full"
                isRequired
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={
                  <LockIcon className="text-gray-400 w-4 h-4" />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="text-gray-400 w-4 h-4" />
                    ) : (
                      <EyeIcon className="text-gray-400 w-4 h-4" />
                    )}
                  </button>
                }
                className="w-full"
                isRequired
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Checkbox size="sm">
                <span className="text-sm">Remember me</span>
              </Checkbox>
              <Link href="/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              color="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isLoading ? "logging in..." : "Log in"}
            </Button>
          </form>
        </CardBody>
        
        <CardFooter className="pb-6 px-6 flex flex-col gap-4">
          <p className="text-center text-sm text-gray-500">or continue with</p>
          <div className="grid grid-cols-2 gap-3">
            <GoogleSignInButton/>
            <FacebookSignInButton/>
          </div>
          <div className="w-full text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;