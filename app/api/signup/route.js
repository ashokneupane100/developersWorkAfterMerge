// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { firstName, lastName, email, password } = await request.json();

    // Comprehensive input validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
          fields: {
            firstName: !!firstName,
            lastName: !!lastName,
            email: !!email,
            password: !!password,
          },
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    console.log("Starting signup process for email:", email);

    // Signup with Supabase but disable their email verification
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          firstName,
          lastName,
        },
        // // IMPORTANT: Disable Supabase's email confirmation
        // emailRedirectTo: null,
        // emailConfirm: false,
      },
    });

    if (error) {
      console.error("Supabase signup error (raw):", error);
      console.error(
        "Supabase signup error JSON:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      return NextResponse.json(
        {
          success: false,
          message: error.message ?? "Signup failed",
          details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create user account",
        },
        { status: 500 }
      );
    }

    console.log("User created successfully:", data.user.id);

    // Wait a moment for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate and store OTP with the user ID
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    // Store OTP with user ID directly
    const otpResult = await storeOTPWithUserId(email, otp, data.user.id);

    if (!otpResult.success) {
      console.error("OTP storage failed:", otpResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate verification code",
          details: otpResult.error,
        },
        { status: 500 }
      );
    }

    // Send OTP via email
    const sent = await sendOTPEmail(email, otp, `${firstName} ${lastName}`);

    if (!sent.success) {
      console.error("Email sending failed with error:", sent.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
          details:
            sent.error instanceof Error
              ? sent.error.message
              : JSON.stringify(sent.error),
        },
        { status: 500 }
      );
    }

    console.log("Signup completed successfully for:", email);

    return NextResponse.json({
      success: true,
      message: "Account created. Verification code sent to your email.",
      userId: data.user.id,
      email: email,
      redirectToVerification: true,
    });
  } catch (error) {
    console.error("Comprehensive signup error:", error);
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

// Helper function to store OTP with user ID
async function storeOTPWithUserId(email, otp, userId) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // First check if we already have an OTP for this email
    const { data: existingOTP } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (existingOTP) {
      // Update existing OTP
      const { error } = await supabase
        .from("verification_codes")
        .update({
          code: otp,
          expires_at: expiresAt.toISOString(),
          verified: false,
          attempts: 0,
          user_id: userId,
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
        user_id: userId,
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
