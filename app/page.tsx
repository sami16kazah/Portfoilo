import type { Metadata } from "next";
import {
  generatePortfolioMetadata,
  PortfolioPageContent,
} from "@/components/portfolio/PortfolioPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generatePortfolioMetadata("en", "/");
}

export default async function Home() {
  return <PortfolioPageContent locale="en" canonicalPath="/" />;
}
