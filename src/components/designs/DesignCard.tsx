"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { DesignCard as Card } from "@/lib/catalog";
export function DesignCard({design,index=0,masonry=true}:{design:Card;index?:number;masonry?:boolean}){
 const[failed,setFailed]=useState(false);
 return <article className="design-editorial-card"><Link href={'/design/'+design.code} className="group block"><div className="design-editorial-image"><Image src={failed?'/designs/agbada.jpg':design.previewImageUrl} alt={design.name} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 50vw,33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" onError={()=>setFailed(true)}/><span className="design-code">{design.code}</span><span className="design-open"><ArrowUpRight size={18}/></span><span className="design-formats">{design.formats.length?design.formats.join(' / '):'DESIGN PREVIEW'}</span></div><div className="design-card-caption"><p>{design.type} <span> / </span> {design.category}</p><h3>{design.name}</h3><span className="text-xs text-ink-3">{design.formats.length?(design.isFree?'Free download available':'Explore design'):'Explore the details'}</span></div></Link></article>
}
