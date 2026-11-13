import type { Metadata } from "next";
import { Bricolage_Grotesque, Oswald, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/util";
import { LocaleProvider } from "@/app/context/LocalContext";

const MainFont = Bricolage_Grotesque({
  subsets: ["latin"],
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
  title: "Sami Kazah — Software & Full-Stack Engineer",
  description:
    "Portfolio of Sami Kazah — Software Engineer at cloudvibe GmbH & co-developer of shelforia.de.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          MainFont.className,
          OswaldFont.variable,
          PixelFont.variable,
          "bg-[#060911] text-slate-50 antialiased selection:bg-indigo-500 selection:text-white"
        )}
      >
        <LocaleProvider>{children}</LocaleProvider>
        <div className="modal-container" />
      </body>
    </html>
  );
}
