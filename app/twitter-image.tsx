import { createPortfolioOgImage } from "@/lib/ogImage";

export const alt = "Sami Kazah — Software & Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return createPortfolioOgImage();
}
