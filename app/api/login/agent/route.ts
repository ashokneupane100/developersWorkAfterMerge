import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data: authData, error: authError } = await (await supabase).auth.signInWithPassword({ email, password });

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userId = authData.user.id;

    const { data: profile, error: profileError } = await (await supabase)
      .from("profiles")
      .select("user_role, full_name, email") // <-- make sure these fields exist in your table
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Agent profile not found." }, { status: 404 });
    }

    if (profile.user_role !== "Agent") {
      await (await supabase).auth.signOut();
      return NextResponse.json({ error: "Access denied. Agents only." }, { status: 403 });
    }

    const cookieStore = cookies();

    const token = Buffer.from(`agent-${userId}-${Date.now()}`).toString("base64");

    // Store all required values in cookies
    (await
          // Store all required values in cookies
          cookieStore).set("agent_token", token, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    (await cookieStore).set("agent_role", profile.user_role, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    (await cookieStore).set("agent_id", userId, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    (await cookieStore).set("agent_email", profile.email, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    (await cookieStore).set("agent_name", profile.full_name, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    

    
    
    return NextResponse.json({ success: true, userId, role: profile.user_role });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
