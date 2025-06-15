// src/app/ClientHome.tsx
"use client";
import LandingSection from "@/section/Landing";
import { FeaturedCard } from "@/components/cards/FeaturedCard";
import ExpandableFeature from "@/components/Expandabel/ExpandabelFeature";
import { Heading } from "@/components/heading/heading";
import { Card } from "@/components/ui/Card";
import { FaGlobe } from "react-icons/fa";
import Modal from "@/components/Modal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/context/LocalContext";

export default function ClientHome() {
  const { locale, toggleLocale, t } = useLocale();
  const searchParams = useSearchParams();
  const [showModel, setShowModel] = useState(false);

  const show = searchParams.get("show");
  const title = searchParams.get("title");
  const description = searchParams.get("message");

  useEffect(() => {
    if (show !== null) {
      setShowModel(show === "true");
    }
  }, [show]);

  const handleClose = () => setShowModel(false);

  return (
    <div>
      {showModel && (
        <Modal
          onClose={handleClose}
          title={title!}
          description={description!}
          buttonDescription={"Accept"}
        />
      )}

      <div className="w-full flex justify-end p-4">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          <FaGlobe />
          {locale === "en" ? "Deutsch" : "English"}
        </button>
      </div>
      <LandingSection />
      <Heading number="01" title_1={t.heading1} title_2={t.project} />

      <FeaturedCard
        title={t.cardTitle}
        tag="Jan 2025"
        video="https://res.cloudinary.com/depeo6txz/video/upload/v1749979613/full_project_-_Made_with_Clipchamp_i4ffvs.mp4"
        active={true}
      />
      <ExpandableFeature />
      <Card>
        <div className="p-6 leading-relaxed text-lg space-y-3">
          {t.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Card>

      <Heading number="02" title_1="Graduation" title_2={t.project} />

      <FeaturedCard
        title={t.tcp_card_title}
        tag="Sep 2022"
        video="https://res.cloudinary.com/depeo6txz/video/upload/v1750012684/Untitled_video_-_Made_with_Clipchamp_hi6ty0.mp4"
        active={true}
      />
      <Card>
        <div className="p-6 leading-relaxed text-lg space-y-3">
          {t.tcp.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}
