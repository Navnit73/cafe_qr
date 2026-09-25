import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getIndustryBySlug } from "@/lib/industries";
import { constructMetadata } from "@/lib/seo";
import { IndustryPageTemplate } from "@/components/industry-page-template";
import { activeLocales } from "@/i18n/routing";

const SLUG = "qr-code-for-bars";

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
      "bar qr code drink menu",
      "brewery tap list qr code",
      "contactless cocktail menu",
      "bar coaster qr code",
      "pub qr code ordering",
    ],
  });
}

export default async function BarQrPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getIndustryBySlug(SLUG);
  if (!data) notFound();

  return <IndustryPageTemplate data={data} locale={locale} />;
}
