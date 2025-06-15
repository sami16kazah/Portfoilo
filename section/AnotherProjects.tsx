"use client";
import { Heading } from "@/components/heading/heading";
import { projectsImages } from "@/data/Projects";
import React from "react";
import { useLocale } from "@/app/context/LocalContext";
import { ProjectsGallery } from "@/components/cards/project_gallery";

export default function AnotherProjectsSection() {
  const { t } = useLocale();
  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="03" title_1={t.another} title_2={t.project} />
      <div className="space-y-4 py-8 ">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 2xl:grid-cols-2">
          <ProjectsGallery
            galleryImages={projectsImages.clone}
          ></ProjectsGallery>
          <ProjectsGallery
            galleryImages={projectsImages.realtime}
          ></ProjectsGallery>
          <ProjectsGallery
            galleryImages={projectsImages.quizz}
          ></ProjectsGallery>
          <ProjectsGallery
            galleryImages={projectsImages.world}
          ></ProjectsGallery>
        </div>
      </div>
    </div>
  );
}
