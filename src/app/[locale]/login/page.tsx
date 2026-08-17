import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}/login`;
  const title = "Sign In — QRVenues";
  const description = "Sign in to your QRVenues dashboard to manage menus, tables, and AI orders.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us/login",
        "en-GB": "https://qrvenues.com/en-gb/login",
        "en-AU": "https://qrvenues.com/en-au/login",
        "x-default": "https://qrvenues.com/en-us/login",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "QRVenues",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Common Header */}
      <Header />

      {/* Main Authentication Card */}
      <main className="flex-1 flex flex-col items-center justify-center my-12 px-4">
        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
