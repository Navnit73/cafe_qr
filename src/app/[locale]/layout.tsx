import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://qrvenues.com"),
  title: {
    default: "QRVenues — QR Code Menus, Google Review Links & Contactless Ordering",
    template: "%s | QRVenues",
  },
  description: "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues",
  keywords: [
    "cafe",
    "qr ordering",
    "contactless menu",
    "restaurant POS",
    "qr code menu",
    "qrvenues",
    "google review qr code",
    "digital menu maker",
  ],
  authors: [{ name: "QRVenues" }],
  creator: "QRVenues",
  publisher: "QRVenues",
  icons: {
    icon: [
      { url: "/favicons.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicons.svg",
    apple: "/favicons.svg",
  },
  openGraph: {
    type: "website",
    siteName: "QRVenues",
    title: "QRVenues — QR Code Menus, Google Review Links & Contactless Ordering",
    description: "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues",
    url: "https://qrvenues.com",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_AU"],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRVenues — QR Code Menus, Google Review Links & Contactless Ordering",
    description: "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues",
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

  // Global Structured Data: Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QRVenues",
    "url": "https://qrvenues.com",
    "logo": "https://qrvenues.com/favicons.svg",
    "description": "Smart contactless ordering, Google review QR codes & digital menus for hospitality venues",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@qrvenues.com",
      "contactType": "customer service",
      "availableLanguage": ["en"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "QRVenues",
    "url": "https://qrvenues.com",
  };

  return (
    <html
      lang={locale}
      data-theme="airbnb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
      </body>
    </html>
  );
}
