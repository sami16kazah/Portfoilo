"use client";
import { galleryImages } from "@/data/gallery";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import Image from "next/image";
export default function Gallery() {
  return (
    <div className="h-[550px] sm:h-[650px] md:h-full 2xl:h-[750px] w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className=" mySwiper rounded-2xl"
      >
        {galleryImages.map((image, i) => {
          return (
            <SwiperSlide key={i}>
              <Image
                src={image.img}
                alt=""
                className="object-cover h-full w-full object-left-top"
              ></Image>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
