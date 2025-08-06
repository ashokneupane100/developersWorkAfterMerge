import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. Add security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 2. Add caching headers for static assets
  if (
    req.nextUrl.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i
    )
  ) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // 3. Add no-cache headers for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    res.headers.set("Cache-Control", "no-store, max-age=0");
  }

  // 4. Add no-cache headers for auth routes
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

  // 5. Protect /agent routes using cookies
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/agent");
  const token = req.cookies.get("agent_token")?.value;
  const role = req.cookies.get("agent_role")?.value;

  if (isProtectedRoute && (!token || role !== "Agent")) {
    const loginUrl = new URL("/agent/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Apply to everything except:
     * - _next/static (Next.js internals)
     * - _next/image (image optimization)
     * - favicon.ico
     * - anything in /public/
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
