"use client";

import React from "react";
import { CldUploadButton } from "next-cloudinary";

interface CloudinaryUploadButtonProps {
  signatureEndpoint: string;
  onSuccess: (result: unknown) => void;
  className?: string;
  children: React.JSX.Element | string | Array<React.JSX.Element | string>;
}

export default function CloudinaryUploadButton({
  signatureEndpoint,
  onSuccess,
  className,
  children,
}: CloudinaryUploadButtonProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return (
      <button
        type="button"
        disabled
        title="Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to enable uploads"
        className={`${className || ""} opacity-60 cursor-not-allowed`}
      >
        {children}
      </button>
    );
  }

  return (
    <CldUploadButton
      signatureEndpoint={signatureEndpoint}
      onSuccess={onSuccess}
      className={className}
    >
      {children}
    </CldUploadButton>
  );
}
