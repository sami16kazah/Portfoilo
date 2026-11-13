import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isAdmin = Boolean(req.auth?.user && req.auth.user.role === "admin");
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnLogin = pathname.startsWith("/admin/login");
  const isOnSetup = pathname.startsWith("/setup");

  if (isOnAdmin) {
    const hasResetReason = req.nextUrl.searchParams.has("reason");
    if (isOnLogin && isAdmin && !hasResetReason) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (!isOnLogin && !isAdmin) {
      const signInUrl = new URL("/admin/login", req.url);
      const relativeTarget = `${pathname}${search}`;
      if (relativeTarget.startsWith("/admin") && !relativeTarget.startsWith("/admin/login")) {
        signInUrl.searchParams.set("callbackUrl", relativeTarget);
      }
      return NextResponse.redirect(signInUrl);
    }
  }

  let detectedLocale = "en";
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    detectedLocale = "ar";
  } else if (pathname === "/de" || pathname.startsWith("/de/")) {
    detectedLocale = "de";
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-portfolio-locale", detectedLocale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (isOnAdmin || isOnSetup) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt|manifest\\.webmanifest|opengraph-image|twitter-image|google[a-z0-9]+\\.html|.*\\.(?:png|jpg|jpeg|webp|svg|ico|mp4|html)$).*)",
  ],
};
