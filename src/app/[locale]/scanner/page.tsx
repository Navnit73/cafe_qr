import { permanentRedirect } from "@/i18n/routing";

interface ScannerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ScannerPage({ params }: ScannerPageProps) {
  const { locale } = await params;
  permanentRedirect({ href: "/online-qr-scanner", locale });
}
