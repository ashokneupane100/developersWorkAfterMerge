// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    const supabase = await createClient();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    console.log("Verifying OTP for email:", email);

    // Verify the OTP
    const verificationResult = await verifyOTP(email, code);

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, message: verificationResult.message },
        { status: 400 }
      );
    }

    console.log("OTP verified successfully for:", email);

    // Get the user from profiles table using the user_id from OTP
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", verificationResult.userId)
      .single();

    if (profileError || !profileData) {
      console.error("Error getting profile:", profileError);
      return NextResponse.json(
        { success: false, message: "User profile not found" },
        { status: 404 }
      );
    }

    // Update profile to mark email as verified
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", verificationResult.userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update profile" },
        { status: 500 }
      );
    }

    console.log("Email verification completed successfully for:", email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
      userId: verificationResult.userId,
      email: email,
      redirectToLogin: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
