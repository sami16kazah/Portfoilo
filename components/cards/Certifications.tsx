import React from "react";
import { Card } from "../ui/Card";
import { TimeLine, TimeLineItem } from "../ui/time-line";
import { useLocale } from "@/app/context/LocalContext";
export default function CertificationsCard() {
  const { t } = useLocale();
  return (
    <Card title={t.education}>
      <TimeLine>
        <TimeLineItem
          date={"2017-2024"}
          title={t.university}
          subtitle={"Damascus University"}
          link=""
          tag="grade 70"
        ></TimeLineItem>
      </TimeLine>

      <TimeLine>
        <TimeLineItem
          date={"2017-2018"}
          title={t.hr}
          subtitle={"Alarabi institute "}
          link=""
          tag=""
        ></TimeLineItem>
      </TimeLine>
    </Card>
  );
}
