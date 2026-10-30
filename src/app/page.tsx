import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Scissors, Layers, Download, Check } from "lucide-react";
import { browseDesigns, getCategoryCounts } from "@/lib/catalog";
import { getSiteContent } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { DesignGrid } from "@/components/designs/DesignGrid";
import { Container } from "@/components/ui/Section";

export const dynamic = "force-dynamic";
const collections = [
  { n:"01", title:"The embroidery edit", text:"Necklines, pocket details and motifs. A little detail makes all the difference.", image:"/designs/agbada.jpg", href:"/embroidery", tag:"THE SIGNATURE COLLECTION" },
  { n:"02", title:"Wear your imagination", text:"Graphic artwork and expressive patterns for tees, caps and everyday pieces.", image:"/designs/print-tee.jpg", href:"/print", tag:"PRINT & PATTERN" },
];
export default async function HomePage() {
  const [content, categories, designs] = await Promise.all([getSiteContent(),getCategoryCounts(),browseDesigns({limit:6,sort:"newest"})]);
  return <>
    <Hero content={content} categories={categories} previews={[]}/>
    <div className="craft-strip"><span>EMBROIDERY</span><span className="craft-star">✳</span><span>MONOGRAMMING</span><span className="craft-star">✳</span><span>PRINT DESIGN</span><span className="craft-star">✳</span><span>MADE TO BE WORN</span></div>
    <Container className="editorial-section">
      <div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT IDEA</p><h2>Good things start<br/>with <em>a little detail.</em></h2></div><p className="section-intro">For the tailor, the maker, the one with a vision. Explore artwork by craft and find a starting point that feels like you.</p></div>
      <div className="grid md:grid-cols-2 gap-6 mt-10">{collections.map(c=><Link key={c.n} href={c.href} className="collection-card group"><div className="collection-image"><Image src={c.image} alt={c.title} fill sizes="(max-width:768px) 100vw,50vw" className="object-cover transition-transform duration-700 group-hover:scale-105"/><span className="collection-number">{c.n}</span><span className="collection-arrow"><ArrowUpRight size={24}/></span></div><div className="pt-6"><p className="eyebrow">{c.tag}</p><h3>{c.title}</h3><p className="mt-2 text-ink-3 max-w-md">{c.text}</p></div></Link>)}</div>
    </Container>
    <div className="bg-surface-2 border-y border-line"><Container className="editorial-section"><div className="section-heading"><div><p className="eyebrow">FROM THE LIBRARY</p><h2>The latest <em>details.</em></h2></div><Link href="/designs" className="text-link">Browse all designs <ArrowUpRight size={18}/></Link></div><div className="mt-10"><DesignGrid designs={designs} masonry={false}/></div><p className="text-xs text-ink-3 mt-6">Explore the design previews. Download formats appear when a verified file is available.</p></Container></div>
    <Container className="editorial-section"><div className="story-grid"><div className="story-image"><Image src="/images/editorial/31485635.webp" alt="Traditional Nigerian agbada with intricate fabric details" fill sizes="(max-width:768px) 100vw,45vw" className="object-cover"/><span className="story-image-label">A STUDY IN CRAFT</span></div><div className="story-copy"><p className="eyebrow">MORE THAN A PATTERN</p><h2>Clothes speak.<br/><em>Make yours<br/>say something.</em></h2><p>Agbada. Danshiki. Aso-Oke. A favourite cap. The pieces we wear carry culture, confidence and a little of who we are.</p><p>Dansvic brings that love of detail to embroidery, monogramming and print illustration—so your next piece can feel distinctly yours.</p><Link href="/about" className="text-link mt-7">Meet Dansvic <ArrowUpRight size={18}/></Link><span className="text-[10px] text-ink-3 mt-8 block">Style inspiration photography by Muhammad-Taha Ibrahim / Pexels.</span></div></div></Container>
    <Container className="pb-24"><div className="how-grid">{[{icon:Layers,n:"01",title:"Find your direction",text:"Browse by garment, craft or design. Save the ideas you want to return to."},{icon:Scissors,n:"02",title:"Know the details",text:"Check dimensions, stitch counts and software compatibility before choosing a file."},{icon:Download,n:"03",title:"Make it your own",text:"Download available files, or talk to us about a custom design for your next piece."}].map(x=><div key={x.n} className="how-item"><div className="flex justify-between items-center mb-8"><x.icon size={26} strokeWidth={1.25}/><span className="eyebrow">{x.n}</span></div><h3>{x.title}</h3><p>{x.text}</p></div>)}</div></Container>
    <Container><div className="custom-banner"><div><p className="eyebrow text-white/60">SOMETHING ONLY YOU COULD WEAR</p><h2>Your idea.<br/><em>Our next canvas.</em></h2><p>Have a neckline, monogram or print in mind? Let’s bring it to life.</p></div><Link href="/contact" className="editorial-button light">Let’s make something <ArrowUpRight size={18}/></Link></div></Container>
    <Container className="py-20"><Newsletter title="A little inspiration, in your inbox." subtitle="Join our list for design news and new additions to the library."/></Container>
  </>;
}
