import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();
    
    if (!email || !token || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Always normalize email to lowercase to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Password reset attempted for:", normalizedEmail);
    
    // First verify the OTP - this now returns userId if successful
    const verification = await verifyOTP(normalizedEmail, token);
    
    if (!verification.success) {
      console.log("OTP verification failed:", verification.message);
      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 400 }
      );
    }
    
    // Create a fresh admin client for this request
    const supabaseAdmin = createAdminClient();
    
    // If verification succeeded, there should be a userId
    let userId = verification.userId;
    
    // If somehow we don't have a userId (e.g., older OTPs without user_id), look it up
    if (!userId) {
      console.log("OTP verification succeeded but no user ID found. Looking up by email:", normalizedEmail);
      
      // Get user by email
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin
        .listUsers({
          filter: {
            email: normalizedEmail
          }
        });
      
      if (userError) {
        console.error("Error fetching user:", userError);
        return NextResponse.json(
          { success: false, message: "Error fetching user" },
          { status: 500 }
        );
      }
      
      if (!userData || !userData.users || userData.users.length === 0) {
        console.log("User not found with email:", normalizedEmail);
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      
      if (userData.users.length > 1) {
        console.error("Multiple users found with email:", normalizedEmail);
        return NextResponse.json(
          { success: false, message: "Account error: Multiple users with this email" },
          { status: 409 }
        );
      }
      
      const user = userData.users[0];
      userId = user.id;
      
      // Double-check that the email matches exactly (case-sensitive)
      if (user.email.toLowerCase() !== normalizedEmail) {
        console.error("Email mismatch! Requested:", normalizedEmail, "Found:", user.email);
        return NextResponse.json(
          { success: false, message: "Account verification failed" },
          { status: 400 }
        );
      }
    } else {
      // Double-check the user still exists in Supabase Auth
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin
        .getUserById(userId);
      
      if (userError || !userData || !userData.user) {
        console.error("Error retrieving user by ID:", userId, "Error:", userError);
        return NextResponse.json(
          { success: false, message: "User account error" },
          { status: 404 }
        );
      }
      
      // Triple-check email matches
      if (userData.user.email.toLowerCase() !== normalizedEmail) {
        console.error("Critical error: Email mismatch between OTP and Auth user. OTP email:", 
                      normalizedEmail, "Auth email:", userData.user.email);
        return NextResponse.json(
          { success: false, message: "Account verification failed" },
          { status: 400 }
        );
      }
    }
    
    console.log("User verified for password reset. User ID:", userId, "Email:", normalizedEmail);
    
    // Update the password
    const { error: updateError } = await supabaseAdmin.auth.admin
      .updateUserById(userId, {
        password,
      });
    
    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { success: false, message: updateError.message || "Failed to update password" },
        { status: 500 }
      );
    }
    
    console.log("Password updated successfully for user:", userId);
    
    // Try to invalidate all sessions
    try {
      // Method 1: Force refresh token
      await supabaseAdmin.auth.admin.forceRefreshToken(userId);
      console.log("User tokens refreshed for:", userId);
      
      // Method 2: Sign out all sessions
      await supabaseAdmin.auth.admin.signOut(userId, { scope: 'global' });
      console.log("All sessions signed out for user:", userId);
    } catch (sessionError) {
      console.warn("Session invalidation warning (non-critical):", sessionError);
      // Continue even if session invalidation fails, as the password should still be changed
    }
    
    // Update the user profile to mark password as updated (if needed)
    try {
      const timestamp = new Date().toISOString();
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          password_updated_at: timestamp,
        })
        .eq('id', userId);
      
      if (profileError) {
        console.warn("Profile update warning (non-critical):", profileError);
      } else {
        console.log("Profile updated with password change timestamp");
      }
    } catch (profileErr) {
      console.warn("Profile update error (non-critical):", profileErr);
    }
    
    return NextResponse.json({
      success: true,
      message: "Password reset successfully. Please log in with your new password."
    });
  } catch (error) {
    console.error("Error in reset-password API:", error);
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