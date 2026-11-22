"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Menu,
  X,
  ArrowRight,
  Scan,
  ChevronDown,
  Utensils,
  Coffee,
  Hotel,
  Beer,
  Calendar,
  Home,
  BookOpen,
  TrendingUp,
  Star,
  Wifi,
  MessageCircle,
  Layers,
  QrCode,
} from "lucide-react";

export function Header() {
  const tNav = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const freeTools = [
    { href: "/qr-code-menu-generator", label: "QR Menu Generator", icon: Utensils, desc: "Restaurant & cafe digital menus" },
    { href: "/google-review-qr-code-generator", label: "Google Review QR", icon: Star, desc: "Direct 5-star Google review links" },
    { href: "/wifi-qr-code-generator", label: "Wi-Fi QR Generator", icon: Wifi, desc: "1-tap WPA2 / WPA3 guest login" },
    { href: "/whatsapp-qr-code-generator", label: "WhatsApp QR Generator", icon: MessageCircle, desc: "Click-to-chat with pre-filled text" },
    { href: "/bulk-qr-code-generator", label: "Bulk QR Generator", icon: Layers, desc: "Sequential tables, rooms & CSV" },
    { href: "/online-qr-scanner", label: "Online QR & Barcode Scanner", icon: Scan, desc: "Camera & image decoder" },
  ];

  const solutions = [
    { href: "/qr-code-for-restaurants", label: "Restaurants", icon: Utensils, desc: "Menus, table ordering & POS" },
    { href: "/qr-code-for-cafes", label: "Cafes & Roasteries", icon: Coffee, desc: "Countertop speed & modifiers" },
    { href: "/qr-code-for-hotels", label: "Hotels & Resorts", icon: Hotel, desc: "In-room dining & concierge" },
    { href: "/qr-code-for-bars", label: "Bars & Breweries", icon: Beer, desc: "Live draft lists & fast tabs" },
    { href: "/qr-code-for-events", label: "Events & Summits", icon: Calendar, desc: "Badges, agendas & leads" },
    { href: "/qr-code-for-real-estate", label: "Real Estate", icon: Home, desc: "Yard sign riders & 3D tours" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline-soft">
      <div className="navbar max-w-6xl mx-auto px-4 sm:px-8 min-h-16 h-16 justify-between gap-2">
        {/* Brand Start */}
        <div className="navbar-start w-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <Image
              src="/favicons.svg"
              alt="QRVenues logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0"
              width={32}
              height={32}
            />
            <span className="text-sm sm:text-base font-semibold tracking-tight text-ink group-hover:text-fin-orange transition-colors">
              {tNav("brand")}
            </span>
          </Link>
        </div>

        {/* Center Links (Desktop) */}
        <nav aria-label="Main navigation" className="navbar-center hidden lg:flex items-center gap-6 text-xs font-medium text-ink-muted">
          {/* Free QR Tools Dropdown */}
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              className="flex items-center gap-1.5 hover:text-ink text-ink font-semibold transition-colors cursor-pointer py-2"
            >
              <QrCode className="w-3.5 h-3.5 text-fin-orange" />
              <span>Free Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-subtle" />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-50 menu p-3 shadow-lg bg-surface-1 rounded-xl border border-hairline w-80 space-y-1"
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">
                Free Online QR Generators & Scanner
              </div>
              <div className="grid grid-cols-1 gap-1">
                {freeTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-canvas text-ink transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-canvas border border-hairline flex items-center justify-center text-fin-orange shrink-0 mt-0.5 group-hover:border-ink">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors">
                          {tool.label}
                        </div>
                        <div className="text-[11px] text-ink-muted leading-tight">
                          {tool.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer py-2"
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-subtle" />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-50 menu p-3 shadow-lg bg-surface-1 rounded-xl border border-hairline w-80 space-y-1"
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">
                Industry Solutions
              </div>
              <div className="grid grid-cols-1 gap-1">
                {solutions.map((sol) => {
                  const Icon = sol.icon;
                  return (
                    <Link
                      key={sol.href}
                      href={sol.href}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-canvas text-ink transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-canvas border border-hairline flex items-center justify-center text-fin-orange shrink-0 mt-0.5 group-hover:border-ink">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors">
                          {sol.label}
                        </div>
                        <div className="text-[11px] text-ink-muted leading-tight">
                          {sol.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Direct Scanner Link */}
          <Link
            href="/online-qr-scanner"
            className="hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <Scan className="w-3.5 h-3.5 text-fin-orange" />
            <span>{tNav("scanner")}</span>
          </Link>

          {/* Guides Link */}
          <Link
            href="/guides"
            className="hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-ink-subtle" />
            <span>Guides</span>
          </Link>

          {/* Case Studies Link */}
          <Link
            href="/case-studies"
            className="hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-ink-subtle" />
            <span>ROI & Stories</span>
          </Link>
        </nav>

        {/* End Actions */}
        <div className="navbar-end w-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="text-xs font-medium text-ink hover:underline hidden md:inline-block px-1"
          >
            {tNav("signIn")}
          </Link>

          <Link
            href="/login"
            className="btn btn-primary btn-sm rounded-md text-xs font-medium h-9 min-h-9 px-3.5 shadow-none hidden sm:inline-flex"
          >
            {tNav("getStarted")}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-square btn-sm lg:hidden text-ink h-8 w-8 min-h-8"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-1 border-b border-hairline px-4 py-4 space-y-4 animate-in slide-in-from-top-2 shadow-lg">
          <div className="pb-2 border-b border-hairline-soft flex items-center justify-between">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Navigation
            </span>
            <span className="text-[10px] text-ink-subtle">QRVenues Menu</span>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1 text-sm font-medium text-ink">
            <Link
              href="/online-qr-scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2.5 rounded-md bg-fin-orange/5 text-ink font-semibold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-fin-orange" />
                <span>Online QR & Barcode Scanner</span>
              </div>
              <span className="badge badge-xs bg-fin-orange text-white border-0 text-[10px] font-medium px-2">
                Free Tool
              </span>
            </Link>

            {/* Free Tools Accordion */}
            <button
              type="button"
              aria-expanded={toolsOpen}
              onClick={() => setToolsOpen(!toolsOpen)}
              className="py-2 px-2.5 rounded-md hover:bg-canvas text-ink-muted hover:text-ink transition-colors text-xs font-medium flex items-center justify-between w-full text-left"
            >
              <span>Free QR Code Generators</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-subtle transition-transform ${
                  toolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {toolsOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-primary/20 my-1">
                {freeTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 px-2 text-xs text-ink-muted hover:text-fin-orange transition-colors"
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Industry Solutions Accordion */}
            <button
              type="button"
              aria-expanded={solutionsOpen}
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className="py-2 px-2.5 rounded-md hover:bg-canvas text-ink-muted hover:text-ink transition-colors text-xs font-medium flex items-center justify-between w-full text-left"
            >
              <span>Industry Solutions</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-subtle transition-transform ${
                  solutionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {solutionsOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-fin-orange/20 my-1">
                {solutions.map((sol) => (
                  <Link
                    key={sol.href}
                    href={sol.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 px-2 text-xs text-ink-muted hover:text-fin-orange transition-colors"
                  >
                    {sol.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2.5 rounded-md hover:bg-canvas text-ink-muted hover:text-ink transition-colors text-xs font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-ink-subtle" />
              <span>Guides & Tutorials</span>
            </Link>

            <Link
              href="/case-studies"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2.5 rounded-md hover:bg-canvas text-ink-muted hover:text-ink transition-colors text-xs font-medium flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-ink-subtle" />
              <span>Case Studies & ROI</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-hairline-soft space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary btn-md w-full rounded-lg text-xs font-medium h-10 min-h-10 shadow-none flex items-center justify-center gap-2"
            >
              <span>{tNav("getStarted")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ghost btn-sm w-full rounded-lg text-xs font-medium h-9 min-h-9 text-ink hover:bg-canvas flex items-center justify-center"
            >
              {tNav("signIn")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
