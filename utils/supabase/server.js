import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables:");
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL:",
      supabaseUrl ? "✅ Set" : "❌ Missing"
    );
    console.error(
      "NEXT_PUBLIC_SUPABASE_API_KEY:",
      supabaseKey ? "✅ Set" : "❌ Missing"
    );
    throw new Error(
      "Supabase environment variables are not configured properly"
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      async get(name) {
        const cookie = await cookieStore.get(name);
        return cookie?.value;
      },
      async set(name, value, options) {
        try {
          await cookieStore.set(name, value, options);
        } catch (error) {
          // Handle cookie setting errors gracefully
          console.warn("Cookie set error:", error);
        }
      },
      async remove(name, options) {
        try {
          await cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch (error) {
          // Handle cookie removal errors gracefully
          console.warn("Cookie remove error:", error);
        }
      },
    },
  });
}
