import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // For debugging - will help identify which provider is being used
  const provider = requestUrl.searchParams.get("provider") || "unknown";
  console.log(`Auth callback triggered. Provider hint: ${provider}`);

  if (code) {
    const supabase = await createClient();

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL(`/login?error=AuthError&provider=${provider}`, request.url)
        );
      }

      // For debugging
      console.log(
        `Successfully authenticated with ${
          data.user?.app_metadata?.provider || "unknown provider"
        }`
      );

      // Update or create user profile
      if (data.user) {
        try {
          // Extract provider-specific data
          const providerName = data.user.app_metadata?.provider || "unknown";

          // Handle profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: data.user.id,
                full_name:
                  data.user.user_metadata?.full_name ||
                  data.user.user_metadata?.name ||
                  data.user.email?.split("@")[0] ||
                  "",
                email: data.user.email,
                avatar_url:
                  data.user.user_metadata?.avatar_url ||
                  data.user.user_metadata?.picture,
                email_verified: true,
                auth_provider: providerName,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "id",
              }
            );

          if (profileError) {
            console.error("Error updating profile:", profileError);
            // Continue despite profile update error
          } else {
            console.log("Profile updated successfully");
          }
        } catch (err) {
          console.error("Profile update error:", err);
          // Continue despite profile update error
        }
      }

      // Get redirect URL from session storage or use default
      let redirectTo = "/add-new-listing"; // Default redirect

      // Successful authentication, redirect to the intended page
      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (err) {
      console.error("Unexpected error in auth callback:", err);
      return NextResponse.redirect(
        new URL("/login?error=UnexpectedError", request.url)
      );
    }
  }

  // If there's no code, redirect to the login page
  console.error("No code provided in auth callback");
  return NextResponse.redirect(new URL("/login?error=NoCode", request.url));
}
