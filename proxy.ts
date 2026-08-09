import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new name).
// Gates the whole app behind login except /login itself and /api/auth/* (which
// must stay reachable pre-login — it's how the OAuth flow and its callback work).
// Static assets are excluded via `matcher` below rather than checked here.
//
// Unauthenticated pages redirect to /login with a callbackUrl. Unauthenticated
// API routes get a 401 instead — a redirect response makes no sense for fetch/JSON
// callers, and there's no session to carry a callback back to anyway.
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, host, search } = req.nextUrl;
  const isLoginPage = pathname === "/login";
  const isApiRoute = pathname.startsWith("/api");

  // Cloud Run terminates TLS at its own proxy and forwards plain HTTP (see
  // the same note in app/lib/auth.ts), so req.nextUrl.origin resolves to
  // http://. Honor X-Forwarded-Proto so redirects we build here point back
  // to https — otherwise the login redirect downgrades the browser to an
  // insecure origin and the Secure session cookie won't come along.
  const protocol = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const origin = `${protocol}://${host}`;

  if (isLoggedIn || isLoginPage) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("callbackUrl", pathname + search);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
