import { cn } from "@/lib/util";
import React, { FC, useEffect, useRef } from "react";

interface VideoProps {
  video: string;
  active: boolean;
}

export const Video: FC<VideoProps> = ({ video, active }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isYouTube = video.includes("youtube.com");
  const embedUrl = isYouTube
    ? video.replace("watch?v=", "embed/").split("&")[0]
    : video;

  useEffect(() => {
    if (videoRef.current && !isYouTube) {
      videoRef.current.muted = true;
      videoRef.current.playbackRate = 2;

      if (active) {
        videoRef.current
          .play()
          .catch((err) => console.warn("Autoplay failed:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [active, isYouTube]);

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl overflow-hidden">
      {isYouTube ? (
        <iframe
          src={`${embedUrl}?autoplay=${
            active ? 1 : 0
          }&mute=1&controls=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full object-cover rounded-3xl"
        ></iframe>
      ) : (
        <div className="relative w-full h-full">
          <video
            src={video}
            ref={videoRef}
            muted
            loop
            playsInline
            className={cn(
              "h-full w-full object-cover rounded-3xl",
              active ? "" : "grayscale"
            )}
          />
          <button
            onClick={handleFullscreen}
            className="absolute bottom-4 right-4 bg-white/80 text-black text-sm px-3 py-1 rounded-lg shadow hover:bg-white transition"
          >
            Fullscreen
          </button>
        </div>
      )}
    </div>
  );
};
