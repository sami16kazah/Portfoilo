"use client";
import React, { FC } from "react";
import SvgCurve from "../visualEffects/SvgCurvEffect";
import { HeadingAnimatedSvg } from "./heading-animated-svg";
interface HeadingProps {
  number: string;
  title_1: string;
  title_2: string;
}
export const Heading: FC<HeadingProps> = ({ number, title_1, title_2 }) => {
  return (
    <div className="relative my-10 px-auto z-20">
      <div className="font-pixel outline-none flex flex-col justify-start shrink-0 opacity-5 transform -top-32 2xl:-top-24 w-[71px] flex-none h-auto left-4 lg:left-12 absolute whitespace-pre-wrap ">
        <h2 className="font-pixel text-[180px] text-center text-primary-foreground relative">
          <span className=" bottom_fade  bg-clip-text  text-transparent p-4 font-pixel">{number}</span>
        </h2>
      </div>
      <div className="flex items-center flex-nowrap min-h-min text-[8vw]  overflow-hidden p-0 w-full font-oswald">
        <p className=" leading-[100%] text-primary-foreground mr-3">{title_1}</p>
        <HeadingAnimatedSvg text="Learn More About My Projects"></HeadingAnimatedSvg>
        <p className=" leading-[100%] text-primary-foreground italic">{title_2}</p>
      </div>
      <SvgCurve></SvgCurve>
    </div>
  );
};
