"use client";
import React from "react";
import Profile from "../../ui/Profile";
import { MagniticEffect } from "../../visualEffects/magniticEffect";
import { FancyButton } from "../../ui/fancy-button";
import { FaArrowRight } from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";

export default function Header() {
  const { t } = useLocale(); //
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-4">
      <Profile />
      <div className="w-full  md:w-auto flex justify-center md:justify-end">
        <MagniticEffect>
          <FancyButton text={t.talk} icon={<FaArrowRight />} />
        </MagniticEffect>
      </div>
    </div>
  );
}
