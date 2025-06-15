"use client";
import featured_data from "@/data/featured_data";
import React, { useState } from "react";
import { FeaturedCard } from "../cards/FeaturedCard";
import { cn } from "@/lib/util";

export default function ExpandableFeature() {
  const [hoverIndex, setHoverdIndex] = useState<number | null>(null);
  const handelMouseEnter = (index: number) => {
    setHoverdIndex(index);
  };
  const handelMouseLeave = () => {
    setHoverdIndex(null);
  };
  return (
    <div className="w-full grid lg:flex lg:justify-between gap-x-4">
      {featured_data.slice(1).map((featured, i) => {
        return (
          <div
            key={i}
            className={cn(
              "relative h-[640px] lg:w-1/3 mb-16 transition-all origin-center duration-300 ease-in-out",
              i === hoverIndex ? "lg:w-[40%]" : "lg:w-[33.33%]"
            )}
            onMouseEnter={() => handelMouseEnter(i)}
            onMouseLeave={() => handelMouseLeave()}
          >
            {" "}
            <FeaturedCard
              active={i === hoverIndex}
              title={featured!.title}
              tag={featured!.tag}
              video={featured!.video}
            ></FeaturedCard>{" "}
          </div>
        );
      })}
    </div>
  );
}
