"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Checkbox,
} from "@heroui/react";
import { EyeIcon, MailIcon, LockIcon, XCircle } from "lucide-react";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import GoogleSignInButton from "./GoogleSignInButtton";
import FacebookSignInButton from "./FacebookLogin";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  // Memoized form validation
  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    return isEmailValid && isPasswordValid;
  }, [email, password]);

  // Update form validity when inputs change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  useEffect(() => {
    const resetStatus = searchParams?.get("reset");
    if (resetStatus === "success") {
      clearStoredCredentials();
      toast.success("Password has been reset successfully. Please log in.");
    }
  }, [searchParams]);

  const clearStoredCredentials = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("next-auth.session-token");
      sessionStorage.removeItem("next-auth.callback-url");
      sessionStorage.removeItem("next-auth.csrf-token");

      localStorage.removeItem("supabase.auth.token");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  const toggleVisibility = useCallback(
    () => setIsVisible(!isVisible),
    [isVisible]
  );

  // Function to format error messages
  const formatErrorMessage = useCallback((errorMessage: string) => {
    if (errorMessage.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Please verify your email address before signing in.";
    }
    if (errorMessage.includes("Too many requests")) {
      return "Too many login attempts. Please wait a few minutes before trying again.";
    }
    if (errorMessage.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (errorMessage.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }
    return errorMessage;
  }, []);

  // Optimized form submission with debouncing
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid || isLoading) return;

      setIsLoading(true);
      setError("");

      try {
        clearStoredCredentials();

        const result = await signIn(email, password);

        if (result?.error) {
          const formattedError = formatErrorMessage(
            result.error.message || result.error
          );
          setError(formattedError);
          return;
        }

        // Store email for future use
        if (typeof window !== "undefined") {
          sessionStorage.setItem("email", email);
          localStorage.setItem("email", email);
          document.cookie = `email=${email}; path=/`;
        }

        // Success will be handled by auth context
      } catch (err) {
        console.error("Login error:", err);
        setError("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    },
    [
      email,
      password,
      signIn,
      clearStoredCredentials,
      isFormValid,
      isLoading,
      formatErrorMessage,
    ]
  );

  // Memoized input handlers
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setError(""); // Clear error when user starts typing
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setError(""); // Clear error when user starts typing
    },
    []
  );

  // Memoized component props
  const emailInputProps = useMemo(
    () => ({
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
      value: email,
      onChange: handleEmailChange,
      startContent: <MailIcon className="w-4 h-4" />,
      disabled: isLoading,
      autoComplete: "email",
    }),
    [email, handleEmailChange, isLoading]
  );

  const passwordInputProps = useMemo(
    () => ({
      type: isVisible ? "text" : "password",
      label: "Password",
      placeholder: "Enter your password",
      value: password,
      onChange: handlePasswordChange,
      startContent: <LockIcon className="w-4 h-4" />,
      endContent: (
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          disabled={isLoading}
        >
          {isVisible ? (
            <EyeSlashIcon className="w-4 h-4 text-default-400 pointer-events-none" />
          ) : (
            <EyeIcon className="w-4 h-4 text-default-400 pointer-events-none" />
          )}
        </button>
      ),
      disabled: isLoading,
      autoComplete: "current-password",
    }),
    [password, handlePasswordChange, isVisible, toggleVisibility, isLoading]
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary/20 p-4">
      <Card className="w-full max-w-md shadow-md bg-white rounded-xl p-6">
        <CardHeader className="flex flex-col items-center space-y-2 pb-0 pt-6">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <LockIcon className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">Login</h2>
          <p className="text-gray-500 text-sm text-center">
            Welcome back! Please enter your details.
          </p>
        </CardHeader>

        <CardBody className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input {...emailInputProps} />
            <Input {...passwordInputProps} />

            {/* Beautiful Error Display */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error.includes("Invalid email or password")
                        ? "Login Failed"
                        : "Login Error"}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      {error.includes("Email not confirmed") && (
                        <div className="mt-3">
                          <Link
                            href="/signup"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            Create New Account
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Checkbox size="sm">Remember me</Checkbox>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              disabled={!isFormValid || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <GoogleSignInButton />
              <FacebookSignInButton />
            </div>
          </div>
        </CardBody>

        <CardFooter className="pt-0">
          <div className="text-center w-full">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
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
