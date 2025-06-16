// components/ModalHandler.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Modal from "./Modal";

export default function ModalHandler() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  const title = searchParams.get("title");
  const description = searchParams.get("message");

  useEffect(() => {
    if (searchParams.get("show") === "true") {
      setShow(true);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <Modal
      onClose={() => setShow(false)}
      title={title ?? ""}
      description={description ?? ""}
      buttonDescription="Accept"
    />
  );
}
