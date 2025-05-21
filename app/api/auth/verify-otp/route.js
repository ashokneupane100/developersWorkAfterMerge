// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/utils/supabase/admin";

const supabaseAdmin = createAdminClient();

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    console.log("Verifying OTP for email:", email);

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Verify the OTP using our custom verification system
    const verification = await verifyOTP(email, code);
    
    if (!verification.success) {
      console.error("OTP verification failed:", verification.message);
      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 400 }
      );
    }

    console.log("OTP verification successful, updating user status");

    // If OTP verification is successful, mark the user's email as verified in Supabase
    const supabase = createClient();
    
    // First, get the user ID from profiles table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) {
      console.error("User lookup error:", userError);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Update the email_verified flag in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('id', userData.id);
    
    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to verify email" },
        { status: 500 }
      );
    }

    // Also update Supabase Auth user metadata (optional but recommended)
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { email_verified: true }
    );

    if (authUpdateError) {
      console.error("Auth update error:", authUpdateError);
      // We'll continue since the profiles table was updated successfully
    }

    console.log("User email verification status updated successfully");
    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      redirectTo: "/login"
    });
  } catch (error) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error", 
        details: error instanceof Error ? error.message : JSON.stringify(error)
      },
      { status: 500 }
    );
  }
}