import Image from "next/image";
import Link from "next/link";
import { CATEGORY_IMAGES, slugifyCategory } from "@/lib/constants";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export function CategoryGrid({ categories }: { categories: { category: string; type: string; count: number }[] }) {
  return (
    <Stagger className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {categories.map((c) => (
        <StaggerItem key={`${c.type}-${c.category}`}>
          <Link
            href={`/categories/${slugifyCategory(c.category)}?type=${c.type}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-xl3 bg-surface-3 shadow-soft"
          >
            <Image
              src={CATEGORY_IMAGES[c.category] ?? "/images/hero.jpg"}
              alt={c.category}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 capitalize">{c.type}</p>
              <h3 className="text-xl font-bold">{c.category}</h3>
              <p className="text-sm text-white/80">{c.count} design{c.count === 1 ? "" : "s"}</p>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
