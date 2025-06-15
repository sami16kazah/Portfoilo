"use client";
import React, { FC } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import Image from "next/image";

interface ProjectsGalleryProps {
  galleryImages: { id: number; img: string }[];
}

export const ProjectsGallery: FC<ProjectsGalleryProps> = ({
  galleryImages,
}) => {
  return (
    <div className="h-[550px] sm:h-[650px] md:h-full 2xl:h-[750px] w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="mySwiper rounded-2xl h-full"
      >
        {galleryImages.map((image, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">
            <Image
              src={image.img}
              alt="no"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain h-full w-full object-center bg-black"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
