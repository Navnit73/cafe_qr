import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_LOGO_PNG,
  buildOgImageUrl,
  getBcp47Locale,
} from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const defaultOgImage = buildOgImageUrl({
  title: "QR Code Menus, Google Review Links & Free QR Studio",
  subtitle:
    "Smart contactless ordering, Google review QR codes, Wi-Fi QR codes & digital menus for hospitality venues.",
  badge: "QRVenues Studio",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QRVenues — QR Code Menus, Google Review Links & Free QR Studio",
    template: "%s | QRVenues",
  },
  description:
    "Smart contactless ordering, Google review QR codes, Wi-Fi & WhatsApp QR generators, and digital menus for hospitality venues.",
  keywords: [
    "qr code menu",
    "free qr code generator",
    "contactless menu",
    "restaurant POS",
    "qrvenues",
    "google review qr code",
    "wifi qr code generator",
    "digital menu maker",
  ],
  authors: [{ name: SITE_NAME }],
  verification: {
    other: { "msvalidate.01": "6BFE4F80CD650E2E0CA99EA3C6C7664F" },
  },
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [{ url: "/favicons.svg", type: "image/svg+xml" }],
    shortcut: "/favicons.svg",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "QRVenues — QR Code Menus, Google Review Links & Free QR Studio",
    description:
      "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues.",
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["en_GB", "en_AU"],
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "QRVenues — QR Code Studio for Hospitality & Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRVenues — QR Code Menus, Google Review Links & Free QR Studio",
    description:
      "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues.",
    images: [defaultOgImage],
    creator: "@qrvenues",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();
  const bcp47Locale = getBcp47Locale(locale);

  // Global Structured Data: Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_LOGO_PNG,
      width: 180,
      height: 180,
    },
    description:
      "Smart contactless ordering, Google review QR codes, Wi-Fi QR generators & digital menus for hospitality venues.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@qrvenues.com",
      contactType: "customer service",
      availableLanguage: ["en-US", "en-GB", "en-AU"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    inLanguage: bcp47Locale,
    description:
      "Free online QR code generator studio, barcode scanner, digital menu maker, and Google review QR tools.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <html
      lang={bcp47Locale}
      data-theme="airbnb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "zhqf5jdn62");
          `}
        </Script>
      </body>
    </html>
  );
}
