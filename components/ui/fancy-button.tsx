"use client";
import React, { FC, ReactNode } from "react";

interface FancyButtonProps {
  text: string;
  icon: ReactNode;
}

export const FancyButton: FC<FancyButtonProps> = ({ text, icon }) => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <button onClick={scrollToBottom} className="fancy-btn block">
      <div className="group bg-black hover:bg-transparent text-primary-foreground hover:text-black rounded-full py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 flex items-center gap-2 font-semibold text-base sm:text-lg md:text-xl lg:text-2xl cursor-pointer transition-all duration-150">
        <span>{text}</span>
        <span className="group-hover:translate-x-2 transition-transform duration-150">
          {icon}
        </span>
      </div>
    </button>
  );
};
