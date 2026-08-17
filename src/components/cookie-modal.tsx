"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Cookie, ShieldCheck, Settings2, Check } from "lucide-react";

export function CookieModal() {
  const t = useTranslations("cookiesModal");
  const [isOpen, setIsOpen] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
    }, 800);
  };

  const handleAcceptAll = () => {
    setFunctionalEnabled(true);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
    }, 800);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hover:text-ink hover:underline transition-colors text-left"
      >
        Cookie Preferences
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in">
          <div className="card bg-surface-1 border border-hairline rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-fin-orange">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink">{t("title")}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{t("subtitle")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Strictly Necessary */}
              <div className="card bg-canvas border border-hairline rounded-xl p-4 shadow-none">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-semantic-success" />
                    <span className="text-xs font-semibold text-ink">{t("necessaryTitle")}</span>
                  </div>
                  <span className="badge badge-sm bg-surface-1 border border-hairline text-ink text-[10px] font-medium">
                    Always On
                  </span>
                </div>
                <p className="text-[11px] text-ink-subtle leading-relaxed">
                  {t("necessaryDesc")}
                </p>
              </div>

              {/* Functional & Preferences */}
              <div className="card bg-canvas border border-hairline rounded-xl p-4 shadow-none">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-fin-orange" />
                    <span className="text-xs font-semibold text-ink">{t("functionalTitle")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={functionalEnabled}
                    onChange={(e) => setFunctionalEnabled(e.target.checked)}
                    className="toggle toggle-sm border-hairline bg-surface-1 checked:bg-fin-orange"
                  />
                </div>
                <p className="text-[11px] text-ink-subtle leading-relaxed">
                  {t("functionalDesc")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 w-full sm:w-auto text-ink-muted hover:text-ink"
              >
                {t("closeBtn")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn bg-surface-1 border border-hairline hover:bg-canvas text-ink btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 w-full sm:w-auto shadow-none"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : t("saveBtn")}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 w-full sm:w-auto shadow-none"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : t("acceptAllBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
