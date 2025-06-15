"use client";
import React, { FC, ReactNode, useState } from "react";
import { Header } from "./featured/Header";
import { Video } from "./featured/Video";

interface FeaturedCardProps {
  logo?: ReactNode;
  title: string;
  tag: string;
  video: string;
  active: boolean; // you can remove this if no longer needed globally
}

export const FeaturedCard: FC<FeaturedCardProps> = ({
  logo,
  title,
  tag,
  video,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="link w-full h-full bg-secondary-background border border-border shadow-lg rounded-3xl cursor-pointer flex flex-col gap-2 flex-nowrap p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Header title={title} tag={tag}></Header>
      <div className="relative flex flex-none flex-nowrap p-6 w-full items-center justify-between h-[550px] border border-border rounded-3xl">
        <Video video={video} active={isHovered} />
      </div>
    </div>
  );
};
