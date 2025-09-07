import type { Metadata } from "next";
import {
  Inter,
  Bricolage_Grotesque,
  Oswald,
  Pixelify_Sans,
} from "next/font/google";
import "./globals.css";
import { cn } from "../lib/util";
import GrainEFfect from "@/components/visualEffects/GrainEffects";
import { Cursor } from "@/components/cursor/Curosr";
import { LocaleProvider } from "@/app/context/LocalContext";

const inter = Inter({ subsets: ["latin"] });
const MainFont = Bricolage_Grotesque({ subsets: ["latin"] });
const OswaldFont = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const PixelFont = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel)",
});

export const metadata: Metadata = {
  title: "Sami Kazah",
  description: "Sami Kazah Official Portfoilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          MainFont.className,
          OswaldFont.variable,
          PixelFont.variable
        )}
      >
        <GrainEFfect></GrainEFfect>
        {/*  <Cursor color="white"></Cursor>  */}
        <LocaleProvider> {children}</LocaleProvider>
        <div className="modal-container"></div>
      </body>
    </html>
  );
}
