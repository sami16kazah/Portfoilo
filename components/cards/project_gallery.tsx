"use client";
import React from "react";

interface GalleryImage {
  id: number;
  img: string;
}

export const ProjectsGallery = ({
  galleryImages,
}: {
  galleryImages: GalleryImage[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {galleryImages.map((image, i) => (
        <div
          key={image.id ?? i}
          className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
        >
          <img
            src={image.img}
            alt={`Project screenshot ${i + 1}`}
            className="object-cover h-full w-full"
          />
        </div>
      ))}
    </div>
  );
};
