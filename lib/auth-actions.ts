"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Helper function for error handling
function handleAuthError(error: any, redirectTo: string = "/error") {
  console.error("Authentication Error:", error);
  redirect(redirectTo);
}

// Login with email and password
export async function login(formData: FormData) {
  const supabase = createClient();

  // Validate inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    handleAuthError("Email and password are required.", "/login");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    handleAuthError(error, "/login");
  }

  // Revalidate and redirect on success
  revalidatePath("/", "layout");
  redirect("/");
}

// Signup with email and password
export async function signup(formData: FormData) {
  const supabase = createClient();

  // Validate inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    handleAuthError("All fields are required for signup.", "/signup");
  }

  // Create the user in Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    handleAuthError(error.message, "/signup");
  }

  // Revalidate and redirect on success
  revalidatePath("/", "layout");
  redirect("/");
}

// Logout the user
export async function signout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    handleAuthError(error, "/logout");
  }

  // Redirect to logout page
  redirect("/logout");
}

// Sign in with Google
export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    handleAuthError(error, "/login");
  }

  if (data?.url) {
    redirect(data.url); // Redirect user to Google login
  } else {
    handleAuthError("Redirect URL is null.", "/login");
  }
}

// Sign in with Apple
export async function signInWithApple() {
  const supabase = createClient();

  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://onlinehome.com.np"
      : "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo,
    },
  });

  if (error) {
    handleAuthError(error, "/login");
  }

  if (data?.url) {
    redirect(data.url); // Redirect user to Apple login
  } else {
    handleAuthError("Redirect URL is null.", "/login");
  }
}

// Sign in with Facebook
export async function signInWithFacebook() {
  const supabase = createClient();

  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://onlinehome.com.np"
      : "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("Error signing in with Facebook:", error);
    redirect("/error"); // Redirect to error page if there's an issue
  }

  if (data?.url) {
    redirect(data.url); // Redirect user to Facebook login
  } else {
    console.error("Redirect URL is null.");
    redirect("/error"); // Handle missing redirect URL
  }
}

export async function signInWithX() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter", // Twitter is still the actual provider name used in Supabase
    options: {
      redirectTo: process.env.NODE_ENV === "production"
        ? "https://onlinehome.com.np"
        : "http://localhost:3000",
    },
  });

  if (error) {
    console.error("X Sign-In Error:", error);
    redirect("/error");
  } else if (data?.url) {
    redirect(data.url); // Redirect user to X (Twitter) login
  } else {
    console.error("X Sign-In failed: No redirect URL.");
    redirect("/error");
  }
}
