import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getIndustryBySlug } from "@/lib/industries";
import { constructMetadata } from "@/lib/seo";
import { IndustryPageTemplate } from "@/components/industry-page-template";
import { activeLocales } from "@/i18n/routing";

const SLUG = "qr-code-for-hotels";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = getIndustryBySlug(SLUG);
  if (!data) return {};

  return constructMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/${SLUG}`,
    locale,
    keywords: [
      "hotel qr code room service",
      "digital hotel directory qr",
      "hotel concierge qr code",
      "amenities booking qr code",
      "resort digital menu",
    ],
  });
}

export default async function HotelQrPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getIndustryBySlug(SLUG);
  if (!data) notFound();

  return <IndustryPageTemplate data={data} locale={locale} />;
}
