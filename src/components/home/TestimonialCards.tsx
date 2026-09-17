import type { Testimonial } from "@/db/schema";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stars } from "@/components/ui/Section";

export function TestimonialCards({ items }: { items: Testimonial[] }) {
  return (
    <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((t) => (
        <StaggerItem key={t.id}>
          <figure className="h-full rounded-xl3 bg-surface-2 border border-line p-7 shadow-soft flex flex-col">
            <Stars value={t.rating} />
            <blockquote className="mt-4 font-serif text-lg leading-relaxed text-ink-2 flex-1">“{t.body}”</blockquote>
            <figcaption className="mt-5">
              <p className="font-semibold">{t.name}</p>
              {t.title && <p className="text-sm text-ink-3">{t.title}</p>}
            </figcaption>
          </figure>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
