import { redirect } from "@/i18n/routing";

interface ScannerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ScannerPage({ params }: ScannerPageProps) {
  const { locale } = await params;
  redirect({ href: "/online-qr-scanner", locale });
}
