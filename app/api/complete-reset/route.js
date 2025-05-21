// API route: /api/complete-reset.js
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const newPassword = searchParams.get('newPassword');
    
    if (!userId || !newPassword) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=InvalidRequest`);
    }
    
    console.log("Completing password reset for user:", userId);
    
    const supabaseAdmin = createAdminClient();
    
    // Directly update password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        password: newPassword,
      }
    );
    
    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=ResetFailed`);
    }
    
    // Invalidate all existing sessions
    await supabaseAdmin.auth.admin.signOut(userId, true);

    // Redirect to login with success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?reset=success`);
  } catch (error) {
    console.error("Complete reset error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=ServerError`);
  }
}