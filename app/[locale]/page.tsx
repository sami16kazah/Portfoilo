import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generatePortfolioMetadata,
  PortfolioPageContent,
} from "@/components/portfolio/PortfolioPage";
import { isSupportedLocale } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LocalizedPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return generatePortfolioMetadata(locale, `/${locale}`);
}

export default async function LocalizedHomePage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <PortfolioPageContent locale={locale} canonicalPath={`/${locale}`} />;
}
