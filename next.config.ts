import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cloudvibe.de",
      },
      {
        protocol: "https",
        hostname: "shelforia.de",
      },
    ],
  },
  async headers() {
    const baseSecurityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    const privateNoStoreHeaders = [
      { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
    ];

    return [
      {
        source: "/(.*)",
        headers: baseSecurityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: privateNoStoreHeaders,
      },
      {
        source: "/setup/:path*",
        headers: privateNoStoreHeaders,
      },
      {
        source: "/api/admin/:path*",
        headers: privateNoStoreHeaders,
      },
      {
        source: "/api/migrate",
        headers: privateNoStoreHeaders,
      },
      {
        source: "/api/setup",
        headers: privateNoStoreHeaders,
      },
      {
        source: "/api/sign-cloudinary-params",
        headers: privateNoStoreHeaders,
      },
    ];
  },
};

export default nextConfig;
