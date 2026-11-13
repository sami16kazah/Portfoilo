import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 30, // refresh token every 30 minutes of activity
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "admin";
        token.sessionVersion = user.sessionVersion ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub || "";
        session.user.role = token.role || "admin";
        session.user.sessionVersion = token.sessionVersion ?? 0;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = Boolean(auth?.user && auth.user.role === "admin");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/admin/login");

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isAdmin) return Response.redirect(new URL("/admin/dashboard", nextUrl));
          return true;
        }
        return isAdmin;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
