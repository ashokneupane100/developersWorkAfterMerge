import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get token from request body
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Decode token
    let decoded;
    try {
      decoded = Buffer.from(token, "base64").toString();
    } catch (error) {
      return NextResponse.json(
        { valid: false, error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Parse decoded token
    // Expected format: admin-{userId}-{timestamp}
    const parts = decoded.split("-");
    if (parts.length !== 3 || parts[0] !== "admin") {
      return NextResponse.json(
        { valid: false, error: "Invalid token structure" },
        { status: 400 }
      );
    }

    const userId = parts[1];
    const timestamp = parseInt(parts[2]);

    // Check if token is expired (e.g., 8 hours)
    const now = Date.now();
    const tokenAge = now - timestamp;
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

    if (tokenAge > maxAge) {
      return NextResponse.json(
        { valid: false, error: "Token has expired" },
        { status: 401 }
      );
    }

    // Verify user is still an admin
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("id", userId)
      .single();

    if (error || !profile || !profile.isAdmin) {
      return NextResponse.json(
        { valid: false, error: "User not found or not an admin" },
        { status: 403 }
      );
    }

    return NextResponse.json({ valid: true, userId });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { valid: false, error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
