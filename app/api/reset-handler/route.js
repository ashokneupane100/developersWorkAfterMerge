// Create this as /api/reset-handler.js or /app/api/reset-handler/route.js
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    
    if (!userId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=InvalidRequest`);
    }
    
    console.log("Reset handler called for user:", userId);
    
    const supabaseAdmin = createAdminClient();
    
    // Force refresh all tokens for this user
    try {
      await supabaseAdmin.auth.admin.signOut(userId, { scope: 'global' });
      console.log("All sessions terminated for user:", userId);
    } catch (error) {
      console.warn("Error terminating sessions:", error);
    }
    
    // Redirect to login with success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL}/login?reset=success`);
  } catch (error) {
    console.error("Reset handler error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=ServerError`);
  }
}