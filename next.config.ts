import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 i18n: {
    locales: ["en", "de"], // English and German, or any languages you want
    defaultLocale: "en",
  },
   images: {
    domains: ["media.licdn.com"], // Add LinkedIn domain here
  },
};

export default nextConfig;
