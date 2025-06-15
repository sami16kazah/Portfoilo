import React from "react";
import { Card } from "../ui/Card";
import { useLocale } from "@/app/context/LocalContext";
import { Button } from "../ui/button";
import { FaDownload } from "react-icons/fa";
export default function BackgroundCard() {
  const { t } = useLocale();

  return (
    <Card className="md:h-full" title={t.about + " " + t.me}>
      <div>
        <p className="leading-[160%] font-normal text-white/[0.4] text-xl">
          {t.background}
        </p>
        <div className="mx-auto p-2 w-full h-full">
          <Button>
            <FaDownload></FaDownload>
            {t.resume}
          </Button>
        </div>
      </div>
    </Card>
  );
}
