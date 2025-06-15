"use client";
import moment from "moment-timezone";
import React, { FC, useEffect, useState } from "react";
interface LiveClockProps {
  city: string;
}
export const LiveClock: FC<LiveClockProps> = ({ city }) => {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const updateClock = () => {
      const currentTime = moment().tz(city).format("HH:mm");
      setTime(currentTime);
    };
    const intervalId = setInterval(updateClock, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [city]);
  return (
    <div className=" text-3xl text-secondary-foreground font-semibold">
     <div className="flex items-center justify-center gap-[0.5vw] "> 
      <span>{city}</span> <span>{time}</span></div>
      
    </div>
  );
};
