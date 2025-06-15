import React from "react";
import { Card } from "../ui/Card";
import { TimeLine, TimeLineItem } from "../ui/time-line";

export default function ExperianceCard() {
  return (
    <Card title="My Experience">
      <TimeLine>
        <TimeLineItem
          date={"2025-2024"}
          title={"Full stack web engineer"}
          subtitle={"link"}
          tag="Project"
          link={"www.google.com"}
        ></TimeLineItem>
      </TimeLine>
    </Card>
  );
}
