import { NextRequest, NextResponse } from "next/server";

function setCommonHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ---------- Cache rules ----------
  // Long-cache static assets
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/i.test(pathname);
  // No-store for API & agent pages
  const isAPI = pathname.startsWith("/api/");
  const isAgentArea = pathname.startsWith("/agent");

  // ---------- Auth guard for /agent ----------
  // You’re using cookies for auth; make it case-insensitive and resilient
  const token = req.cookies.get("agent_token")?.value ?? "";
  const role = (req.cookies.get("agent_role")?.value || "").toLowerCase();

  // Allow login page itself (yours is /login/agent)
  const isAgentLogin = pathname === "/login/agent";

  if (isAgentArea && !isAgentLogin) {
    // If missing token or not an agent -> send to login with callback
    if (!token || role !== "agent") {
      const loginUrl = new URL("/login/agent", req.url);
      // optional: send them back after login
      loginUrl.searchParams.set("redirectTo", pathname + search);
      const redirect = NextResponse.redirect(loginUrl);
      return setCommonHeaders(redirect);
    }
  }

  // Normal pass-through
  const res = setCommonHeaders(NextResponse.next());

  // Apply cache headers AFTER creating res
  if (isStaticAsset) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (isAPI || isAgentArea || pathname.startsWith("/auth/") || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  return res;
}

export const config = {
  // Skip Next internals & common public files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
