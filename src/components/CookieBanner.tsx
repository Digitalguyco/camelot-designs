"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "camelot-cookie-notice-acknowledged";

/**
 * Today this site sets no non-essential cookies, so there's nothing to ask
 * consent FOR yet — this is an honest notice, not a real accept/reject
 * gate (a fake "reject" button with nothing to reject would be a dark
 * pattern). When analytics or marketing scripts are added, wire their
 * loading behind an actual accepted/declined choice stored here instead of
 * just an acknowledgement.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage unavailable (private browsing, etc.) — skip the banner
      // rather than show it on every single page load.
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to persist to — the banner will just reappear next visit.
    }
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t hairline bg-card px-6 py-4"
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-ink/75 leading-relaxed flex-1">
          This site only uses essential cookies needed to run it — nothing for tracking or
          advertising.{" "}
          <a href="/cookies" className="text-gold hover:underline">
            Learn more
          </a>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="btn-primary px-5 py-2 text-sm tracking-wide whitespace-nowrap"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
