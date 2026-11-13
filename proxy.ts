import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|.*\\.(?:png|jpg|jpeg|webp|svg|ico|mp4)$).*)",
  ],
};

