"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X } from "lucide-react";

export function Header() {
  const tNav = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#menu-maker", label: tNav("menuMaker") },
    { href: "/#google-reviews", label: tNav("reviews") },
    { href: "/#ordering-system", label: tNav("ordering") },
    { href: "/#qr-studio", label: tNav("studio") },
    { href: "/#how-it-works", label: tNav("howItWorks") },
    { href: "/#faq", label: tNav("faq") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline-soft">
      <div className="navbar max-w-6xl mx-auto px-4 sm:px-8 min-h-16 h-16 justify-between">
        {/* Brand Start */}
        <div className="navbar-start w-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/favicons.svg"
              alt="QRVenues logo"
              className="w-8 h-8 rounded-lg shrink-0"
              width={32}
              height={32}
            />
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-ink group-hover:text-fin-orange transition-colors">
                {tNav("brand")}
              </span>
              <span className="badge badge-sm bg-fin-orange text-on-primary text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border-0 rounded">
                {tNav("badge")}
              </span>
            </div>
          </Link>
        </div>

        {/* Center Links (Desktop) */}
        <nav className="navbar-center hidden lg:flex items-center gap-6 text-xs font-medium text-ink-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* End Actions */}
        <div className="navbar-end w-auto flex items-center gap-2.5 sm:gap-3">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="text-xs font-medium text-ink hover:underline hidden sm:inline-block px-1"
          >
            {tNav("signIn")}
          </Link>

          <Link
            href="/login"
            className="btn btn-primary btn-sm rounded-md text-xs font-medium h-9 min-h-9 px-3.5 shadow-none"
          >
            {tNav("getStarted")}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-square btn-sm lg:hidden text-ink"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-1 border-b border-hairline px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-ink">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-md hover:bg-canvas text-ink-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-hairline-soft flex items-center justify-between">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-ink hover:underline py-1.5 px-2"
              >
                {tNav("signIn")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
