"use client";
import React from "react";
import Image from "next/image";
import SamiKazah from "../../public/assets/images/sami.jpg";

export default function Profile() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 text-primary-foreground transition-colors duration-75">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center bg-gradient-to-r from-blue-joust to-green-benzol">
        <Image
          src={SamiKazah}
          alt="Sami Kazah Photo"
          className="w-full h-full border-2 border-blue-cosmos rounded-full object-cover object-top"
        />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-benzol border border-blue-cosmos absolute right-1 bottom-2 sm:right-0 sm:bottom-5"></div>
      </div>
      <div className="text-xl sm:text-2xl md:text-3xl font-medium">
        Sami Kazah
      </div>
    </div>
  );
}
