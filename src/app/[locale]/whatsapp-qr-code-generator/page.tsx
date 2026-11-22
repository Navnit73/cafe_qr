import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { activeLocales } from "@/i18n/routing";
import { getToolBySlug } from "@/lib/tools";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

const SLUG = "whatsapp-qr-code-generator";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = getToolBySlug(SLUG);
  if (!data) return {};

  return constructMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/${SLUG}`,
    locale,
    keywords: data.keywords,
    ogBadge: data.heroBadge,
  });
}

export default async function WhatsappQrCodeGeneratorPage({
  params,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getToolBySlug(SLUG);
  if (!data) notFound();

  return <ToolPageTemplate data={data} locale={locale} />;
}
