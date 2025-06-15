"use client";
import BackgroundCard from "@/components/cards/background";
import CertificationsCard from "@/components/cards/Certifications";
import LanguagesCard from "@/components/cards/LanguagesCard";
import MeCard from "@/components/cards/me";
import BooksCard from "@/components/cards/mybooksCard";
import ResumeCard from "@/components/cards/resume";
import StackCard from "@/components/cards/stack";
import { Heading } from "@/components/heading/heading";
import { Card } from "@/components/ui/Card";
import React from "react";
import { useLocale } from "@/app/context/LocalContext";

export default function AboutSection() {
  const { t } = useLocale();
  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="04" title_1={t.about} title_2={t.me}></Heading>
      <div className="space-y-4 py-8 ">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 2xl:grid-cols-3">
          <MeCard></MeCard>
          <ResumeCard></ResumeCard>
          <BackgroundCard></BackgroundCard>
        </div>
        <div className="space-y-4">
          <CertificationsCard></CertificationsCard>
        </div>
        <div className="space-y-4"></div>
        <StackCard></StackCard>

        <BooksCard></BooksCard>
        <LanguagesCard></LanguagesCard>
      </div>
    </div>
  );
}
