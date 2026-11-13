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
};

export default nextConfig;
