import { cn } from "@/lib/utils";

export const input = "mt-1 h-11 w-full rounded-xl border border-line bg-surface-2 px-3.5 text-[15px]";
export const textarea = "mt-1 w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-[15px]";
export const btn = "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors";
export const btnPrimary = cn(btn, "bg-accent text-accent-fg hover:brightness-110");
export const btnSecondary = cn(btn, "border border-line bg-surface-2 hover:bg-surface-3");
export const btnDanger = cn(btn, "text-red-600 hover:bg-red-500/10");

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-sm font-semibold", className)}>
      {label}
      {children}
    </label>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl3 border border-line bg-surface-2 p-6", className)}>{children}</div>;
}

export function AdminHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}
