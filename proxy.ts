import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth?.user);
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnLogin = pathname.startsWith("/admin/login");

  if (isOnAdmin) {
    if (isOnLogin && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (!isOnLogin && !isLoggedIn) {
      const signInUrl = req.nextUrl.clone();
      signInUrl.pathname = "/admin/login";
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
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

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt|manifest\\.webmanifest|opengraph-image|twitter-image|.*\\.(?:png|jpg|jpeg|webp|svg|ico|mp4)$).*)",
  ],
};
