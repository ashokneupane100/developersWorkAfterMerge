// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // Get credentials from request body
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Create supabase client
//     const supabase = createClient();

//     // Authenticate with Supabase
//     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });

//     if (authError || !authData.user) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Get the user ID from the authenticated user
//     const userId = authData.user.id;

//     // Query the profiles table to check if the user is an admin
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("isAdmin")
//       .eq("id", userId)
//       .single();

//     if (profileError || !profile) {
//       return NextResponse.json(
//         { error: "User profile not found" },
//         { status: 404 }
//       );
//     }

//     // Check if user is admin
//     if (!profile.isAdmin) {
//       // Sign out the user since they're not an admin
//       await supabase.auth.signOut();

//       return NextResponse.json(
//         { error: "User does not have admin privileges" },
//         { status: 403 }
//       );
//     }

//     // Generate admin token
//     const token = Buffer.from(`admin-${userId}-${Date.now()}`).toString('base64');

//     return NextResponse.json({
//       success: true,
//       isAdmin: true,
//       token,
//       userId
//     });

//   } catch (error) {
//     console.error("Admin login error:", error);
//     return NextResponse.json(
//       { error: "An error occurred during login" },
//       { status: 500 }
//     );
//   }
// }

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate user with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // Fetch the user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if the user is an admin
    if (profile.user_role !== "Admin") {
      await supabase.auth.signOut(); // Optional: force logout
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Generate a dummy token (for localStorage or session use)
    const token = Buffer.from(`admin-${userId}-${Date.now()}`).toString(
      "base64"
    );

    return NextResponse.json({
      success: true,
      token,
      userId,
      role: profile.user_role,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
