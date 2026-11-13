"use client";
import { galleryImages } from "@/data/gallery";
import React from "react";
import Image from "next/image";

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {galleryImages.map((image, i) => (
        <div key={i} className="rounded-2xl overflow-hidden aspect-square">
          <Image
            src={image.img}
            alt="Portfolio gallery"
            className="object-cover h-full w-full object-left-top"
          />
        </div>
      ))}
    </div>
  );
}
