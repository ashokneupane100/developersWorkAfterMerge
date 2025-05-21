// app/api/auth/google/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  
  const redirectTo = 
    process.env.NODE_ENV === "production"
      ? "https://onlinehome.com.np/api/auth/callback/google"
      : "http://localhost:3000/api/auth/callback/google";

  // Initiate Google OAuth via Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(new URL("/auth/error", request.url));
}