import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans_Arabic,
  Oswald,
  Pixelify_Sans,
} from "next/font/google";
import "./globals.css";
import { cn } from "../lib/util";
import { Locale, LocaleProvider } from "@/app/context/LocalContext";
import { getEnvBaseUrl, isSupportedLocale } from "@/lib/seo";

const MainFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});
const ArabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
const OswaldFont = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});
const PixelFont = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getEnvBaseUrl()),
  title: "Sami Kazah (سامي قزح) — Software & Full-Stack Engineer",
  description:
    "Official portfolio of Sami Kazah (سامي قزح) — Software Engineer at cloudvibe GmbH in Germany & co-developer of shelforia.de.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-portfolio-locale") || "en";
  const initialLocale: Locale = isSupportedLocale(headerLocale) ? headerLocale : "en";

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      className="scroll-smooth"
    >
      <body
        className={cn(
          MainFont.className,
          MainFont.variable,
          ArabicFont.variable,
          OswaldFont.variable,
          PixelFont.variable,
          "bg-[#060911] text-slate-50 antialiased selection:bg-indigo-500 selection:text-white"
        )}
      >
        <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
        <div className="modal-container" />
      </body>
    </html>
  );
}
