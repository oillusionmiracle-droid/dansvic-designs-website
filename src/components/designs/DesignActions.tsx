"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { REPORT_REASONS } from "@/lib/constants";
import { snappy, spring } from "@/components/motion/Reveal";
import { Sheet } from "@/components/ui/Sheet";

type FileInfo = { id: string; format: string; size: number };
type Props = {
  design: { id: string; code: string; name: string; isFree: boolean };
  files: FileInfo[];
  signedIn: boolean;
  initiallySaved: boolean;
  myReview: { rating: number; body: string } | null;
};

function fmtSize(n: number) {
  if (!n) return "";
  return n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`;
}

export function DesignActions({ design, files, signedIn, initiallySaved, myReview }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [sheet, setSheet] = useState<null | "download" | "review" | "report" | "auth">(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [rating, setRating] = useState(myReview?.rating ?? 5);
  const [hoverStar, setHoverStar] = useState(0);
  const [body, setBody] = useState(myReview?.body ?? "");
  const [reason, setReason] = useState(REPORT_REASONS[0].value as string);
  const [details, setDetails] = useState("");

  const gate = (next: "download" | "review" | "report") => (signedIn ? setSheet(next) : setSheet("auth"));

  async function download(fileId: string | "all") {
    setBusy(fileId);
    setStatus(null);
    try {
      const targets = fileId === "all" ? files : files.filter((f) => f.id === fileId);
      for (const f of targets) {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: f.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Download failed");
        const a = document.createElement("a");
        a.href = data.url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        await new Promise((r) => setTimeout(r, 350));
      }
      setStatus(`Started ${targets.length} download${targets.length === 1 ? "" : "s"}. Find them any time in your Download History.`);
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(null);
    }
  }

  async function toggleSave() {
    if (!signedIn) return setSheet("auth");
    setSaved((s) => !s);
    const res = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ designId: design.id }) });
    if (!res.ok) setSaved((s) => !s);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setBusy("review");
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ designId: design.id, rating, body }) });
    setBusy(null);
    if (res.ok) {
      setSheet(null);
      router.refresh();
    }
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setBusy("report");
    const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ designId: design.id, reason, details }) });
    setBusy(null);
    if (res.ok) {
      setSheet(null);
      setStatus("Thanks — your report is with our team.");
    }
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15 }}
      className="glass rounded-xl3 border border-line shadow-lift p-6 space-y-5"
      aria-label="Download and actions"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Price</p>
          <p className="text-3xl font-bold">{design.isFree ? "Free" : "—"}</p>
        </div>
        <motion.button
          type="button"
          onClick={toggleSave}
          whileTap={{ scale: 0.85 }}
          transition={snappy}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save design"}
          className={`grid h-12 w-12 place-items-center rounded-full border text-xl ${saved ? "bg-accent text-accent-fg border-accent" : "border-line bg-surface-2 hover:bg-surface-3"}`}
        >
          <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={snappy} aria-hidden>
            {saved ? "♥" : "♡"}
          </motion.span>
        </motion.button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink-3">Available formats</p>
        <div className="flex flex-wrap gap-2">
          {files.map((f) => (
            <span key={f.id} className="rounded-lg border border-line bg-surface px-2.5 py-1 text-sm font-bold">
              {f.format} <span className="font-normal text-ink-3">{fmtSize(f.size)}</span>
            </span>
          ))}
          {files.length === 0 && <span className="text-sm text-ink-3">Files coming soon.</span>}
        </div>
      </div>

      <Button size="lg" className="w-full" disabled={!files.length} onClick={() => gate("download")}>
        ↓ Download all formats
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => gate("review")}>{myReview ? "Edit review" : "Rate & review"}</Button>
        <Button variant="secondary" onClick={() => gate("report")}>Report issue</Button>
      </div>
      <p className="text-xs text-ink-3 leading-relaxed">
        For use on fabric & garments only. No resale or redistribution of files. See{" "}
        <a href="/copyright" className="underline">Copyright Policy</a>.
      </p>
      <AnimatePresence>
        {status && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-accent/10 text-accent px-4 py-3 text-sm font-medium" role="status">
            {status}
          </motion.p>
        )}
      </AnimatePresence>

      <Sheet open={sheet === "auth"} onClose={() => setSheet(null)} title="Create a free account to download">
        <p className="text-ink-3">Downloads are free and unlimited — an account keeps your download history so you can re-download any time.</p>
        <div className="mt-6 grid gap-2">
          <ButtonLink href={`/register?next=/design/${design.code}`} size="lg">Create account</ButtonLink>
          <ButtonLink href={`/login?next=/design/${design.code}`} size="lg" variant="secondary">Log in</ButtonLink>
        </div>
      </Sheet>

      <Sheet open={sheet === "download"} onClose={() => setSheet(null)} title={`Download ${design.code}`}>
        <p className="text-ink-3">Choose a format or grab everything. Links are signed and expire in 10 minutes.</p>
        <ul className="mt-5 space-y-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="font-bold">{f.format} <span className="text-sm font-normal text-ink-3">{fmtSize(f.size)}</span></span>
              <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => download(f.id)}>
                {busy === f.id ? "…" : "Download"}
              </Button>
            </li>
          ))}
        </ul>
        <Button size="lg" className="w-full mt-4" disabled={!!busy} onClick={() => download("all")}>
          {busy === "all" ? "Preparing…" : `Download all (${files.length})`}
        </Button>
      </Sheet>

      <Sheet open={sheet === "review"} onClose={() => setSheet(null)} title="Rate this design">
        <form onSubmit={submitReview} className="space-y-5">
          <div role="radiogroup" aria-label="Rating" className="flex gap-1 text-3xl" onMouseLeave={() => setHoverStar(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.button
                key={i}
                type="button"
                role="radio"
                aria-checked={rating === i}
                aria-label={`${i} star${i > 1 ? "s" : ""}`}
                whileTap={{ scale: 0.8 }}
                transition={snappy}
                onMouseEnter={() => setHoverStar(i)}
                onClick={() => setRating(i)}
                className={(hoverStar || rating) >= i ? "text-amber-500" : "text-ink-3/30"}
              >
                ★
              </motion.button>
            ))}
          </div>
          <div>
            <label htmlFor="review-body" className="text-sm font-semibold">Your review (optional)</label>
            <textarea id="review-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1.5 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base" placeholder="How did it stitch out? Any tips for others?" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy === "review"}>Submit review</Button>
        </form>
      </Sheet>

      <Sheet open={sheet === "report"} onClose={() => setSheet(null)} title="Report a problem">
        <form onSubmit={submitReport} className="space-y-4">
          <div>
            <label htmlFor="reason" className="text-sm font-semibold">What went wrong?</label>
            <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl border border-line bg-surface px-4">
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="details" className="text-sm font-semibold">Details</label>
            <textarea id="details" required value={details} onChange={(e) => setDetails(e.target.value)} rows={4} className="mt-1.5 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base" placeholder="Which format, which software, what happened…" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy === "report"}>Send report</Button>
        </form>
      </Sheet>
    </motion.aside>
  );
}
