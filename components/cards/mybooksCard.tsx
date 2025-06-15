"use client";
import React from "react";
import { Card } from "../ui/Card";
import { TimeLine, TimeLineItem } from "../ui/time-line";
import { useLocale } from "@/app/context/LocalContext";
export default function BooksCard() {
  const { t } = useLocale();
  return (
    <Card title={t.myPublishedBooks}>
      <TimeLine>
        <TimeLineItem
          date={"2024"}
          title={"Design patterns in arabic"}
          subtitle={"link"}
          tag="7k-downloads"
          link={"https://www.kotobati.com/book/design-patterns-arabic"}
        ></TimeLineItem>

        <TimeLineItem
          date={"2022"}
          title={"Compliers using antlr in arabic"}
          subtitle={"link"}
          tag="6k-downloads"
          link={
            "https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A7%D8%AA-%D8%A8%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A7%D9%84-antlr"
          }
        ></TimeLineItem>

        <TimeLineItem
          date={"2022"}
          title={"Islam and terrorism in arabic"}
          subtitle={"link"}
          tag="5k-downloads"
          link={
            "https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A5%D8%B1%D9%87%D8%A7%D8%A8"
          }
        ></TimeLineItem>
      </TimeLine>
    </Card>
  );
}
