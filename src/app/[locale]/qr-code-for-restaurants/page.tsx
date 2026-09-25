import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getIndustryBySlug } from "@/lib/industries";
import { constructMetadata } from "@/lib/seo";
import { IndustryPageTemplate } from "@/components/industry-page-template";
import { activeLocales } from "@/i18n/routing";

const SLUG = "qr-code-for-restaurants";

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
      "restaurant qr code menu",
      "contactless menu restaurant",
      "qr code table ordering",
      "digital menu for restaurants",
      "google review qr code restaurant",
    ],
  });
}

export default async function RestaurantQrPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getIndustryBySlug(SLUG);
  if (!data) notFound();

  return <IndustryPageTemplate data={data} locale={locale} />;
}
