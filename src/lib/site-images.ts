import { CATEGORY_IMAGES, slugifyCategory } from './constants';
export const SITE_IMAGES = [
 {key:'image_hero',label:'Homepage hero',src:'/images/editorial/31485660.webp'},
 {key:'image_home_story',label:'Homepage story section',src:'/images/editorial/31485635.webp'},
 {key:'image_collection_embroidery',label:'Homepage embroidery collection',src:'/designs/agbada.jpg'},
 {key:'image_collection_print',label:'Homepage print collection',src:'/designs/print-tee.jpg'},
 {key:'image_about',label:'About page photograph',src:'/images/editorial/7998342.webp'},
 {key:'image_reference_default',label:'Design page: traditional wear reference',src:'/images/editorial/31485635.webp'},
 {key:'image_reference_aso_oke',label:'Design page: Aso-Oke reference',src:'/images/editorial/27992683.webp'},
 {key:'image_reference_caps',label:'Design page: caps reference',src:'/images/editorial/34174668.webp'},
 ...Object.entries(CATEGORY_IMAGES).map(([name,src])=>({key:'image_category_'+slugifyCategory(name),label:'Category: '+name,src})),
] as const;
export function imageFor(content:Record<string,string>,key:string){return content[key]||SITE_IMAGES.find(x=>x.key===key)?.src||'/images/hero.jpg'}
