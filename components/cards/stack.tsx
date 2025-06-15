"use client";
import React from "react";
import { Card } from "../ui/Card";
import { StackData } from "@/data/stack";
import Image from "next/image";
import { useLocale } from "@/app/context/LocalContext";
// Group by category
const groupedStack = StackData.reduce((acc, tech) => {
  if (!acc[tech.title]) acc[tech.title] = [];
  acc[tech.title].push(tech);
  return acc;
}, {} as Record<string, typeof StackData>);

export default function StackCard() {
  const { t } = useLocale();
  return (
    <Card title={t.myTechStack}>
      <div className="flex flex-col gap-4 mt-4">
        {Object.entries(groupedStack).map(([category, techList]) => (
          <div key={category} className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-base md:text-lg font-semibold text-primary-foreground">
                {category}
              </p>
              {techList.map((tech) => (
                <div
                  key={tech.id}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-muted/10 p-2"
                >
                  <Image
                    src={tech.img}
                    alt={category}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
