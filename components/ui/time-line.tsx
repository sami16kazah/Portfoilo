import Link from "next/link";
import React, { FC, ReactNode } from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface TimeLineProps {
  children: ReactNode;
}

export const TimeLine: FC<TimeLineProps> = ({ children }) => {
  return <div className="flex flex-col gap-y-6">{children}</div>;
};

interface TimeLineItemsProps {
  date: string;
  title: string;
  subtitle: string;
  link?: string;
  tag?: string;
  isCourse?: boolean;
}

export const TimeLineItem: FC<TimeLineItemsProps> = ({
  date,
  title,
  subtitle,
  link,
  tag,
  isCourse,
}) => {
  return (
    <div className="flex flex-wrap gap-12 min-h justify-start relative">
      <div
        className="h-auto flex-none break-words whitespace-pre"
        style={{ width: `${isCourse ? "0" : ""}` }}
      >
        <p className="text-secondary-foreground">{date}</p>
      </div>
      <div
        className="flex gap-x-2"
        style={{ transform: `${isCourse ? "translateX(-45px)" : ""}` }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="text-primary-foreground break-words whitespace-pre">
            <p className="leading-6 font-medium text-sm ">{title}</p>
          </div>
          <div className="flex items-center gap-2 w-min cursor-pointer min-w-fit">
            {link ? (
              <Link href={link}>
                <Body subtitle={subtitle} tag={tag || ""} link={link}></Body>
              </Link>
            ) : (
              subtitle
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BodyProps {
  subtitle: string;
  tag: string;
  link: string;
}

const Body: FC<BodyProps> = ({ subtitle, tag, link }) => {
  return (
    <div className="text-secondary-foreground flex items-center">
      <p className="text-sm font-normal leading-6 mt-1 cursor-pointer">
        {subtitle}
      </p>
      {link ? <FiArrowUpRight></FiArrowUpRight> : null}
      {tag ? (
        <div className="ms-2 rounded-[20px] bg-white/5 py-0.5 px-1.5 min-w-fit max-w-full ">
          <p className="text-xs font-normal text-secondary-foreground">{tag}</p>
        </div>
      ) : null}
    </div>
  );
};
