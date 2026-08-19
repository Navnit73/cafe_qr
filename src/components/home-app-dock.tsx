"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import {
  QrCode,
  Scan,
  Barcode,
  Utensils,
  Star,
  Wifi,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { triggerHaptic } from "./scanner/scanner.utils";

interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  shadowColor: string;
  badge?: string;
  badgeColor?: string;
  isExternalPage?: boolean;
}

const APP_ITEMS: AppItem[] = [
  {
    id: "make-qr",
    title: "Make QR Code",
    subtitle: "Custom Studio App",
    href: "/#qr-studio",
    icon: QrCode,
    gradient: "from-[#5645d4] via-[#7c3aed] to-[#c026d3]",
    shadowColor: "shadow-indigo-500/25",
    badge: "Create",
    badgeColor: "bg-[#5645d4]",
  },
  {
    id: "qr-scanner",
    title: "QR Scanner",
    subtitle: "Camera & Image App",
    href: "/online-qr-scanner",
    icon: Scan,
    gradient: "from-[#ff5600] via-[#ff7a00] to-[#ffb703]",
    shadowColor: "shadow-orange-500/30",
    badge: "Scanner",
    badgeColor: "bg-fin-orange",
    isExternalPage: true,
  },
  {
    id: "barcode-scanner",
    title: "Barcode Scanner",
    subtitle: "EAN · UPC · 128 App",
    href: "/online-qr-scanner",
    icon: Barcode,
    gradient: "from-[#059669] via-[#10b981] to-[#34d399]",
    shadowColor: "shadow-emerald-500/25",
    badge: "1D / 2D",
    badgeColor: "bg-semantic-success",
    isExternalPage: true,
  },
  {
    id: "qr-menu",
    title: "QR Menu Maker",
    subtitle: "Digital Menus App",
    href: "/#menu-maker",
    icon: Utensils,
    gradient: "from-[#0052cc] via-[#0065ff] to-[#38bdf8]",
    shadowColor: "shadow-blue-500/25",
    badge: "Menu",
    badgeColor: "bg-[#0052cc]",
  },
  {
    id: "google-reviews",
    title: "Google Reviews",
    subtitle: "5-Star Rating Tool",
    href: "/#google-reviews",
    icon: Star,
    gradient: "from-[#d97706] via-[#f59e0b] to-[#fbbf24]",
    shadowColor: "shadow-amber-500/25",
    badge: "5.0 ★",
    badgeColor: "bg-amber-600",
  },
  {
    id: "wifi-qr",
    title: "Guest Wi-Fi QR",
    subtitle: "Instant Login Tool",
    href: "/#qr-studio",
    icon: Wifi,
    gradient: "from-[#0284c7] via-[#06b6d4] to-[#22d3ee]",
    shadowColor: "shadow-cyan-500/25",
  },
];

export function HomeAppDock() {
  const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    triggerHaptic(40);
    if (href.startsWith("/#") && typeof window !== "undefined") {
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash without reload
        window.history.pushState(null, "", href.replace("/", ""));
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 sm:my-12 px-2">
      {/* App Dock Container */}
      <div className="bg-surface-1  rounded-3xl p-5 sm:p-7 ">
      

        {/* 6 App Icons Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
          {APP_ITEMS.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.id}
                href={app.href}
                onClick={(e) => handleAppClick(e, app.href)}
                className="group flex flex-col items-center text-center w-full max-w-[115px] p-2 sm:p-2.5 rounded-2xl hover:bg-canvas/90 transition-all duration-200 active:scale-95"
              >
                {/* Phone App Squircle Icon */}
                <div className="relative mb-2.5">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] bg-gradient-to-br ${app.gradient} ${app.shadowColor} shadow-md group-hover:shadow-xl group-hover:scale-105 group-active:scale-90 transition-all duration-200 flex items-center justify-center text-white border border-white/30 relative overflow-hidden`}
                  >
                    {/* Top Gloss Highlight Effect */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-[18px]" />

                    {/* Icon */}
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow transition-transform group-hover:scale-110 duration-200" />
                  </div>

                  {/* Corner Badge */}
                  {app.badge && (
                    <span
                      className={`absolute -top-1 -right-1 text-[9px] font-bold text-white ${
                        app.badgeColor || "bg-ink"
                      } px-1.5 py-0.5 rounded-full shadow-xs border border-white/40 leading-none`}
                    >
                      {app.badge}
                    </span>
                  )}
                </div>

                {/* App Label */}
                <span className="text-xs font-bold text-ink leading-tight group-hover:text-fin-orange transition-colors">
                  {app.title}
                </span>

                {/* App Subtitle */}
                <span className="text-[10px] text-ink-subtle leading-normal mt-0.5 line-clamp-1">
                  {app.subtitle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
