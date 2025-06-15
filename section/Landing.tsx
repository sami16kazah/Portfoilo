"use client";
import React from "react";
import Header from "@/components/navigation/header/header";
import { LiveClock } from "@/components/ui/liveClock";
import { useLocale } from "@/app/context/LocalContext";
export default function LandingSection() {
  const { t } = useLocale();
  return (
    <div className="relative h-screen overflow-hidden px-4 sm:px-8 py-4">
      {/* Top Header */}
      <Header />

      {/* Centered Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10 w-full text-center">
        <div className="flex flex-col items-center justify-center text-primary-foreground uppercase font-medium leading-[14vw] lg:leading-[10vw] 2xl:leading-[9rem] tracking-tight">
          <div className="text-[18vw] lg:text-[14vw] 2xl:text-[12rem]">
            {t.slogan[0]}
          </div>
          <div className="text-[18vw] lg:text-[14vw] 2xl:text-[12rem]">
            {t.slogan[1]}
          </div>
        </div>
      </div>

      {/* Clock at bottom-right */}
      <div className="absolute right-4 bottom-2 z-20">
        <LiveClock city="Europe/Berlin" />
      </div>
    </div>
  );
}
