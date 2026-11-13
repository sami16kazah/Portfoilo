import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sami Kazah (سامي قزح) — Software & Full-Stack Engineer",
    short_name: "Sami Kazah",
    description:
      "Multilingual portfolio of Sami Kazah — Software Engineer at cloudvibe GmbH and co-developer of shelforia.de (EN / DE / AR).",
    start_url: "/",
    display: "standalone",
    background_color: "#060911",
    theme_color: "#4F46E5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/assets/projects/shelforia-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

