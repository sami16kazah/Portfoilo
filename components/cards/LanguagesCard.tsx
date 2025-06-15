"use client";
import React from "react";
import { Card } from "../ui/Card";
import { TimeLine, TimeLineItem } from "../ui/time-line";
import { useLocale } from "@/app/context/LocalContext";
export default function LanguagesCard() {
  const { t } = useLocale();
  return (
    <Card title={t.languages}>
      <TimeLine>
        <TimeLineItem date={"C2"} title={t.arabic} subtitle={""}></TimeLineItem>
      </TimeLine>

      <TimeLine>
        <TimeLine>
          <TimeLineItem
            date={"B2"}
            title={t.english}
            subtitle={""}
          ></TimeLineItem>
        </TimeLine>
      </TimeLine>

      <TimeLine>
        <TimeLine>
          <TimeLineItem
            date={"B1"}
            title={t.german}
            subtitle={""}
          ></TimeLineItem>
        </TimeLine>
      </TimeLine>
    </Card>
  );
}
