// lib/otp.ts
import { createClient } from "@/utils/supabase/server";

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in the database with 10 minutes expiration
export async function storeOTP(email: string, otp: string) {
  try {
    // Always normalize email to lowercase to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // First verify this is a valid user in our system
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("user_id, email")
      .ilike("email", normalizedEmail)
      .single();

    if (userError || !userData || !userData.user_id) {
      console.warn(
        `User not found for email ${normalizedEmail} during OTP generation`
      );
      // Don't reveal that the user doesn't exist (security best practice)
      return { success: true }; // Pretend success to prevent user enumeration
    }

    // Now we have verified the user exists and have their ID
    const userId = userData.user_id;
    console.log(
      `Generating OTP for user ID: ${userId}, email: ${normalizedEmail}`
    );

    // First check if we already have an OTP for this email
    const { data: existingOTP } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    if (existingOTP) {
      // Update existing OTP
      const { error } = await supabase
        .from("verification_codes")
        .update({
          code: otp,
          expires_at: expiresAt.toISOString(),
          verified: false,
          attempts: 0,
          user_id: userId, // Add the user ID for verification
        })
        .eq("email", normalizedEmail);

      if (error) {
        console.error("Error updating OTP:", error);
        return { success: false, error };
      }
    } else {
      // Create new OTP record
      const { error } = await supabase.from("verification_codes").insert({
        email: normalizedEmail,
        code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempts: 0,
        user_id: userId, // Store the user ID with the OTP
      });

      if (error) {
        console.error("Error storing OTP:", error);
        return { success: false, error };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("OTP storage error:", error);
    return { success: false, error };
  }
}

// Verify the OTP
export async function verifyOTP(email: string, code: string) {
  try {
    // Always normalize email to lowercase to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Get the OTP record
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Verification code not found",
      };
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      return {
        success: false,
        message: "Verification code has expired",
      };
    }

    // Check if max attempts reached
    if (data.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code",
      };
    }

    // Increment attempts
    await supabase
      .from("verification_codes")
      .update({ attempts: data.attempts + 1 })
      .eq("email", normalizedEmail);

    // Verify the code
    if (data.code !== code) {
      return {
        success: false,
        message: "Invalid verification code",
      };
    }

    // Verify the associated user still exists
    if (data.user_id) {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("user_id, email")
        .eq("user_id", data.user_id)
        .single();

      if (userError || !userData) {
        console.error(
          `User ID ${data.user_id} no longer exists but has valid OTP`
        );
        return {
          success: false,
          message: "Account verification failed",
        };
      }

      // Double-check email matches
      if (userData.email.toLowerCase() !== normalizedEmail) {
        console.error(
          `Email mismatch: OTP for ${normalizedEmail}, but user_id ${data.user_id} has email ${userData.email}`
        );
        return {
          success: false,
          message: "Account verification failed",
        };
      }
    }

    // Mark as verified
    await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("email", normalizedEmail);

    // Return the verified user ID along with success status
    return {
      success: true,
      userId: data.user_id || null, // Include user ID in successful response
      email: normalizedEmail,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "Server error during verification",
    };
  }
}
