"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();

  // Memoized form validation
  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    const isFirstNameValid = firstName.trim().length >= 2;
    const isLastNameValid = lastName.trim().length >= 2;
    return (
      isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid
    );
  }, [firstName, lastName, email, password]);

  // Update form validity when inputs change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  // Memoized input handlers
  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(e.target.value);
      setError(""); // Clear error when user starts typing
    },
    []
  );

  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(e.target.value);
      setError(""); // Clear error when user starts typing
    },
    []
  );

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

  // Function to format error messages
  const formatErrorMessage = useCallback((errorMessage: string) => {
    if (errorMessage.includes("user_already_exists")) {
      return "This email is already registered. Please try signing in instead.";
    }
    if (errorMessage.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }
    if (errorMessage.includes("Password")) {
      return "Password must be at least 6 characters long.";
    }
    if (errorMessage.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (errorMessage.includes("User already registered")) {
      return "This email is already registered. Please try signing in instead.";
    }
    return errorMessage;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid || isLoading) return;

      setIsLoading(true);
      setError("");

      try {
        console.log("Submitting signup form...");

        // Register the user with our combined signup API
        const signupResponse = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        });

        // Add comprehensive response debugging
        console.log("Signup Response Status:", signupResponse.status);

        // Check response status before parsing
        if (!signupResponse.ok) {
          const errorText = await signupResponse.text();
          console.error("Error Response Body:", errorText);

          // Try to parse as JSON for better error handling
          try {
            const errorData = JSON.parse(errorText);
            const formattedError = formatErrorMessage(
              errorData.message || errorData.details || errorText
            );
            setError(formattedError);
          } catch {
            const formattedError = formatErrorMessage(errorText);
            setError(formattedError);
          }
          return;
        }

        let signupData;
        try {
          signupData = await signupResponse.json();
        } catch (jsonError) {
          console.error("JSON Parsing Error:", jsonError);
          setError("Error processing server response");
          return;
        }

        if (!signupData.success) {
          const formattedError = formatErrorMessage(
            signupData.message || "Something went wrong. Please try again."
          );
          setError(formattedError);
          return;
        }

        console.log("Signup successful, redirecting to verification page");
        toast.success(
          "Account created successfully! Please verify your email."
        );

        // If signup was successful, redirect to OTP verification page
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } catch (err) {
        console.error("Full Signup Error:", err);
        setError("Network error or unexpected issue during signup");
      } finally {
        setIsLoading(false);
      }
    },
    [
      firstName,
      lastName,
      email,
      password,
      isFormValid,
      isLoading,
      router,
      formatErrorMessage,
    ]
  );

  const handleGoogleSignIn = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");
      await signInWithOAuth("google");
    } catch (error: any) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, signInWithOAuth]);

  // Memoized input props for better performance
  const inputProps = useMemo(
    () => ({
      firstName: {
        type: "text",
        label: "First Name",
        placeholder: "Enter your first name",
        value: firstName,
        onChange: handleFirstNameChange,
        disabled: isLoading,
        autoComplete: "given-name",
      },
      lastName: {
        type: "text",
        label: "Last Name",
        placeholder: "Enter your last name",
        value: lastName,
        onChange: handleLastNameChange,
        disabled: isLoading,
        autoComplete: "family-name",
      },
      email: {
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        value: email,
        onChange: handleEmailChange,
        disabled: isLoading,
        autoComplete: "email",
      },
      password: {
        type: "password",
        label: "Password",
        placeholder: "Create a password",
        value: password,
        onChange: handlePasswordChange,
        disabled: isLoading,
        autoComplete: "new-password",
      },
    }),
    [
      firstName,
      lastName,
      email,
      password,
      handleFirstNameChange,
      handleLastNameChange,
      handleEmailChange,
      handlePasswordChange,
      isLoading,
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  {...inputProps.firstName}
                  id="firstName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  {...inputProps.lastName}
                  id="lastName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                {...inputProps.email}
                id="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                {...inputProps.password}
                id="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

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
                      {error.includes("already registered")
                        ? "Account Already Exists"
                        : "Signup Error"}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      {error.includes("already registered") && (
                        <div className="mt-3">
                          <Link
                            href="/login"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            Sign In Instead
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
