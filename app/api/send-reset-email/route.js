// app/api/send-reset-email/route.js
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_API_KEY) throw new Error('Missing SUPABASE_API_KEY');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    console.log("Attempting password reset for:", email);

    // Using the correct method with proper error handling
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      }
    );

    if (error) {
      console.error("Reset error:", error);
      
      if (error.status === 429) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Please wait a minute before requesting another reset"
          }),
          { status: 429 }
        );
      }

      if (error.message.includes('recovery email')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Error with email service. Please try again later."
          }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: error.message || "Failed to send reset email"
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "If an account exists with this email, you will receive a reset link"
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Password reset error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error. Please try again later."
      }),
      { status: 500 }
    );
  }
}