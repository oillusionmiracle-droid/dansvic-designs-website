"use client";
import { useEffect } from "react";

/** Server increments view_count; the client only signals the visit once per session per design. */
export function ViewPing({ designId }: { designId: string }) {
  useEffect(() => {
    const key = `dd-viewed-${designId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/designs/${designId}/view`, { method: "POST", keepalive: true }).catch(() => {});
  }, [designId]);
  return null;
}
