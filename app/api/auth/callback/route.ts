// app/auth/callback/route.js
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Extract provider info for debugging
  const provider =
    requestUrl.searchParams.get("provider") ||
    requestUrl.searchParams.get("p") ||
    "unknown";
  console.log(`Auth callback triggered. Provider hint: ${provider}`);

  if (!code) {
    console.error("No code provided in auth callback");
    return NextResponse.redirect(new URL("/login?error=NoCode", request.url));
  }

  const supabase = await createClient();

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(`Error exchanging code for session (${provider}):`, error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            error.message
          )}&provider=${provider}`,
          request.url
        )
      );
    }

    // For debugging
    const providerName = data.user?.app_metadata?.provider || "unknown";
    console.log(`Successfully authenticated with ${providerName}`);

    // Create or update user profile
    if (data.user) {
      try {
        // Check if profile already exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking existing profile:", fetchError);
        }

        // Prepare profile data according to Prisma schema
        const profileData = {
          user_id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "",
          email: data.user.email || "",
          avatar_url:
            data.user.user_metadata?.avatar_url ||
            data.user.user_metadata?.picture ||
            null,
          email_verified: true,
          auth_provider: providerName,
          user_role: "Buyer", // Default role
          created_at: existingProfile
            ? existingProfile.created_at
            : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log(
          "Upserting user profile with data:",
          JSON.stringify(profileData, null, 2)
        );

        let profileResult;
        if (existingProfile) {
          // Update existing profile
          const { data: updateData, error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: profileData.full_name,
              email: profileData.email,
              avatar_url: profileData.avatar_url,
              email_verified: profileData.email_verified,
              auth_provider: profileData.auth_provider,
              updated_at: profileData.updated_at,
            })
            .eq("user_id", data.user.id)
            .select()
            .single();

          profileResult = { data: updateData, error: updateError };
        } else {
          // Create new profile
          const { data: insertData, error: insertError } = await supabase
            .from("profiles")
            .insert(profileData)
            .select()
            .single();

          profileResult = { data: insertData, error: insertError };
        }

        if (profileResult.error) {
          console.error(
            "Error updating/creating profile:",
            profileResult.error
          );
        } else {
          console.log(
            "Profile updated/created successfully:",
            profileResult.data
          );
        }
      } catch (err) {
        console.error("Profile update error:", err);
      }
    }

    // Successful authentication, redirect to the intended page
    return NextResponse.redirect(new URL("/add-new-listing", request.url));
  } catch (err) {
    console.error(`Unexpected error in auth callback (${provider}):`, err);
    return NextResponse.redirect(
      new URL(`/login?error=UnexpectedError&provider=${provider}`, request.url)
    );
  }
}
