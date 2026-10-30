import { imageFor } from "@/lib/site-images";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

type Props = { content: Record<string, string>; categories: { category: string; type: string; count: number }[]; previews: string[] };
export function Hero({ content }: Props) {
  return <section className="editorial-hero">
    <div className="hero-copy">
      <div className="eyebrow"><span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> THE DANSVIC DESIGN LIBRARY</div>
      <h1>Tradition,<br /><em className="hero-together">in every</em><br />thread<span className="text-accent">.</span></h1>
      <p className="hero-description">Embroidery, monograms and print artwork for clothes with a story to tell. Explore a world of detail, made for your next creation.</p>
      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/designs" className="editorial-button">Explore the library <ArrowUpRight size={18}/></Link>
        <Link href="/contact" className="editorial-button secondary">Create something custom</Link>
      </div>
      <div className="hero-footnote"><ArrowDown size={15}/> From the first sketch to the final stitch.</div>
    </div>
    <div className="hero-photograph">
      <Image src={imageFor(content,"image_hero")} alt="Detail-rich Nigerian traditional attire in warm brown and gold" fill priority sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" />
      <div className="hero-image-shade"/>
      <span className="hero-image-index">01 / THE ART OF DETAIL</span>
      <div className="hero-image-caption"><span>Nigerian heritage.<br/><em>A modern point of view.</em></span><ArrowUpRight size={30}/></div>
      {imageFor(content,"image_hero") === "/images/editorial/31485660.webp" && <span className="photo-credit">Style inspiration · Muhammad-Taha Ibrahim / Pexels</span>}
    </div>
    <div className="hero-side-label" aria-hidden>MADE OF CULTURE. MADE FOR YOU.</div>
  </section>;
}
