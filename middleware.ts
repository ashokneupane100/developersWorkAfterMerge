import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. Add security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 2. Cache static assets
  if (
    req.nextUrl.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i
    )
  ) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // 3. No-cache for API
  if (req.nextUrl.pathname.startsWith("/api/")) {
    res.headers.set("Cache-Control", "no-store, max-age=0");
  }

  // 4. No-cache for auth-related routes
  if (
    req.nextUrl.pathname.startsWith("/auth/") ||
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup")
  ) {
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  // 5. Protect /agent routes — but exclude /agent/login to prevent infinite redirect
  const token = req.cookies.get("agent_token")?.value;
  const role = req.cookies.get("agent_role")?.value;

  const isAgentProtectedRoute =
    req.nextUrl.pathname.startsWith("/agent") &&
    !req.nextUrl.pathname.startsWith("/login/agent");

  if (isAgentProtectedRoute && (!token || role !== "Agent")) {
    const loginUrl = new URL("/login/agent", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Match everything except static, image, favicon, and public
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
