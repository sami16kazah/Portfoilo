"use client";
import React from "react";
import { Card } from "../ui/Card";
import Image from "next/image";
import MyImage from "@/public/assets/gallery/Img0.jpg";
import { Button } from "../ui/button";
import { FaDownload } from "react-icons/fa";
import Socials from "../ui/socials";
import { useLocale } from "@/app/context/LocalContext";
export default function ResumeCard() {
  const { t } = useLocale();
  return (
    <Card className="md:h-full 2xl:h-fit ">
      <p className="text-lg xl:text-2xl font-medium text-primary-foreground">
        {t.short_resume}
      </p>
      <div className="w-auto h-auto ">
        <Image src={MyImage} alt="signature"></Image>
      </div>
      <div className="flex items-center justify-between md:absolute md:bottom-6 md:left-6 md:w-[calc(100%-48px)]">
        <Socials></Socials>
        <Button>
          <FaDownload></FaDownload>
          {t.resume}
        </Button>
      </div>
    </Card>
  );
}
