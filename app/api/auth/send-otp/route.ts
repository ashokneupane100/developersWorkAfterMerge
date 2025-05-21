// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendOTPEmail } from "@/lib/mail";
import { generateOTP, storeOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    console.log("Received OTP request for:", email, name);

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: "Email and name are required" },
        { status: 400 }
      );
    }

    // Check environment variables
    console.log("Email environment variables:");
    console.log("HOST:", process.env.EMAIL_SERVER_HOST);
    console.log("PORT:", process.env.EMAIL_SERVER_PORT);
    console.log("USER:", process.env.EMAIL_SERVER_USER);
    console.log("FROM NAME:", process.env.EMAIL_FROM_NAME);
    console.log("FROM ADDRESS:", process.env.EMAIL_FROM_ADDRESS);
    // Don't log the password for security reasons

    // Generate a 6-digit OTP
    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    
    // Store the OTP in the database with an expiration time
    const stored = await storeOTP(email, otp);
    
    if (!stored.success) {
      console.error("OTP storage failed:", stored.error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to generate verification code",
          details: stored.error
        },
        { status: 500 }
      );
    }
    
    console.log("OTP stored successfully, attempting to send email");
    
    // Send the OTP via email
    const sent = await sendOTPEmail(email, otp, name);
    
    if (!sent.success) {
      console.error("Email sending failed with error:", sent.error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to send verification email",
          details: sent.error instanceof Error 
            ? sent.error.message 
            : JSON.stringify(sent.error)
        },
        { status: 500 }
      );
    }

    console.log("Email sent successfully to:", email);
    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email"
    });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        details: error instanceof Error 
          ? error.message 
          : JSON.stringify(error)
      },
      { status: 500 }
    );
  }
}