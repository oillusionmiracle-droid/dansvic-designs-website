import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">This thread leads nowhere.</h1>
      <p className="mt-3 text-ink-3 text-lg">The page you’re looking for doesn’t exist or has been moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/designs">See My Designs</ButtonLink>
        <ButtonLink href="/" variant="secondary">Home</ButtonLink>
      </div>
    </div>
  );
}
