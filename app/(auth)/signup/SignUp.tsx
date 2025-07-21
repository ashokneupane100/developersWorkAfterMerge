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

  const handleGoogleSignIn = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    // Redirect to Google sign-in
    window.location.href = "/api/auth/signin/google";
  }, [isLoading]);

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
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
