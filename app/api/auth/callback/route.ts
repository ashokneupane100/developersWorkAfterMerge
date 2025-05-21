// app/auth/callback/route.js
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request:any) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  // Extract provider info for debugging
  const provider = requestUrl.searchParams.get("provider") || 
                  requestUrl.searchParams.get("p") || "unknown";
  console.log(`Auth callback triggered. Provider hint: ${provider}`);

  if (!code) {
    console.error("No code provided in auth callback");
    return NextResponse.redirect(new URL("/login?error=NoCode", request.url));
  }

  const supabase = createClient();
  
  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error(`Error exchanging code for session (${provider}):`, error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}&provider=${provider}`, 
        request.url)
      );
    }
    
    // For debugging
    const providerName = data.user?.app_metadata?.provider || "unknown";
    console.log(`Successfully authenticated with ${providerName}`);
    
    // Update or create user profile
    if (data.user) {
      try {
        // Prepare profile data
        const profileData = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || 
                    data.user.user_metadata?.name || 
                    data.user.email?.split('@')[0] || '',
          email: data.user.email,
          avatar_url: data.user.user_metadata?.avatar_url || 
                     data.user.user_metadata?.picture,
          email_verified: true,
          auth_provider: providerName,
          updated_at: new Date().toISOString()
        };
        
        console.log("Upserting user profile with data:", JSON.stringify(profileData));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          console.log("Profile updated successfully");
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