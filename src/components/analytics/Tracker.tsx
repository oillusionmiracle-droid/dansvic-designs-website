"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * First-party page-view beacon feeding the admin analytics dashboard.
 * TODO (later): drop Google Analytics (gtag.js) in here for richer
 * traffic-source and geographic reporting once a GA property exists.
 */
export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let vid = localStorage.getItem("dd-vid");
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("dd-vid", vid);
    }
    const body = JSON.stringify({ path: pathname, referrer: document.referrer, visitorId: vid });
    fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
