"use client";
import Link from "next/link";
import React, { FC, ReactNode } from "react";
import { cn } from "@/lib/util";

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  link?: string;
  isIcon?: boolean;
  className?: string;
  type?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  link,
  isIcon,
  className,
  ...rest
}) => {
  return (
    <>
      {link ? (
        <Link href={link} target="_blank" className="w-10 h-10 cursor-pointer">
          <ButtonBody {...rest} className={className} isIcon={isIcon}>
            {children}
          </ButtonBody>
        </Link>
      ) : (
        <ButtonBody {...rest} className={className} isIcon={isIcon}>
          {children}
        </ButtonBody>
      )}
    </>
  );
};

interface ButtonBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isIcon?: boolean;
  className?: string;
}

const ButtonBody: FC<ButtonBodyProps> = ({
  children,
  isIcon,
  className,
  ...rest
}) => {
  return (
    <div className="cursor-pointer flex-none w-auto h-full ">
      <div
        {...rest}
        className={cn(
          "flex items-center justify-center gap-2 bg-primary-background rounded-full select-none  whitespace-nowrap text-primary-foreground text-sm font-medium hover:bg-white/[0.1]",
          "transition-colors duration-100",
          className,
          isIcon ? "h-10 w-10" : "h-full w-max px-3 py-2"
        )}
      >
        {children}
      </div>
    </div>
  );
};
