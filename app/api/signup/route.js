// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(request) {
  try {
    const supabase = createClient();
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

    // Skip the existing user check to avoid RLS recursion
    // The Supabase auth.signUp will handle duplicate email checking
    console.log("Proceeding with signup for email:", email);

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
        // IMPORTANT: Disable Supabase's email confirmation
        emailRedirectTo: null,
        emailConfirm: false,
      },
    });

    if (error) {
      console.error("Supabase signup error:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          details: JSON.stringify(error),
        },
        { status: 400 }
      );
    }

    // Create profile using service role to bypass RLS
    if (data.user) {
      const supabaseAdmin = createClient();

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: data.user.id,
          user_id: data.user.id,
          full_name: `${firstName} ${lastName}`,
          email: email,
          avatar_url: null,
          email_verified: false,
          user_role: "Buyer", // Default role for new users
          auth_provider: "email",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);

        // If profile already exists, that's okay for signup
        if (profileError.code === "23505") {
          console.log("Profile already exists, continuing...");
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Error creating user profile",
              details: JSON.stringify(profileError),
            },
            { status: 500 }
          );
        }
      }

      // Generate and store OTP
      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      const stored = await storeOTP(email, otp);

      if (!stored.success) {
        console.error("OTP storage failed:", stored.error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to generate verification code",
            details: stored.error,
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
    }

    return NextResponse.json({
      success: true,
      message: "Account created. Verification code sent to your email.",
      userId: data.user?.id,
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
