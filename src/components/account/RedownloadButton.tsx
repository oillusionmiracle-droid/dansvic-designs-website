"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function RedownloadButton({ fileId, label = "Re-download" }: { fileId: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    const res = await fetch("/api/download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId }) });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      const a = document.createElement("a");
      a.href = data.url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
  return (
    <Button size="sm" variant="secondary" onClick={go} disabled={busy}>
      {busy ? "…" : label}
    </Button>
  );
}
