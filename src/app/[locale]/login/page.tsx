import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: "Sign In to Venue Dashboard",
    description: "Sign in to your QRVenues dashboard to manage digital menus, table QR codes, and live ordering streams.",
    path: "/login",
    locale,
    noIndex: true,
  });
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
