import "server-only";
import { createHmac } from "node:crypto";
import { pool } from "@/db";

export function signingSecret() {
  const secret=process.env.DOWNLOAD_SIGNING_SECRET;
  if(!secret || secret.length<32) throw new Error("A strong DOWNLOAD_SIGNING_SECRET must be configured.");
  return secret;
}
export function assertSameOrigin(req:Request){
  const origin=req.headers.get('origin');
  if(req.headers.get('sec-fetch-site')==='cross-site' || (origin && origin!==new URL(req.url).origin)) throw Response.json({error:'This request is not allowed.'},{status:403});
}
export async function readJson(req:Request):Promise<Record<string,unknown>>{
  if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw Response.json({error:'Send JSON data.'},{status:415});
  if(Number(req.headers.get('content-length')||0)>16384)throw Response.json({error:'Request is too large.'},{status:413});
  const reader=req.body?.getReader();if(!reader)throw Response.json({error:'Request body required.'},{status:400});
  let bytes=0;const chunks:Uint8Array[]=[];
  while(true){const{done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16384){await reader.cancel();throw Response.json({error:'Request is too large.'},{status:413})}chunks.push(value)}
  try{const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!value||Array.isArray(value)||typeof value!=='object')throw Error();return value}catch{throw Response.json({error:'Invalid JSON.'},{status:400})}
}
export function text(value:unknown,label:string,min=1,max=200){
  if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw Response.json({error:`${label} must be between ${min} and ${max} characters.`},{status:400});
  return value.trim();
}
export function emailAddress(value:unknown){const email=text(value,'Email',3,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Response.json({error:'Enter a valid email address.'},{status:400});return email}
export function uuid(value:unknown){const id=text(value,'ID',36,36);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))throw Response.json({error:'Invalid ID.'},{status:400});return id}
export async function rateLimit(req:Request,scope:string,limit=20,windowSeconds=900,identity?:string){
  const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const key=createHmac('sha256',signingSecret()).update(`${scope}:${identity??ip}`).digest('hex');
  const windowStart=Math.floor(Date.now()/1000/windowSeconds)*windowSeconds;
  const {rows}=await pool.query(`insert into app_private.rate_limits(key,window_start,hits,expires_at) values($1,$2,1,to_timestamp($2+$3)) on conflict(key) do update set hits=case when app_private.rate_limits.window_start=excluded.window_start then least(app_private.rate_limits.hits+1,100000) else 1 end,window_start=excluded.window_start,expires_at=excluded.expires_at returning hits`,[key,windowStart,windowSeconds]);
  if(rows[0].hits===1) await pool.query('delete from app_private.rate_limits where key in (select key from app_private.rate_limits where expires_at<now() limit 100)');
  if(rows[0].hits>limit)throw Response.json({error:'Too many requests. Please try again later.'},{status:429,headers:{'Retry-After':String(windowSeconds-Math.floor(Date.now()/1000-windowStart))}});
}
export function safeImage(value:string|null){if(!value)return null;if(value.startsWith('/')&&!value.startsWith('//')&&!value.includes('\\'))return value;if(value.startsWith('https://')){try{const u=new URL(value);if(['images.pexels.com','images.unsplash.com','res.cloudinary.com'].includes(u.hostname))return value}catch{}}throw new Error('Use an uploaded image, a local path, or an image from Pexels, Unsplash or Cloudinary.')}
export function safeLink(value:string){if(!value)return '';if(value.startsWith('/')&&!value.startsWith('//')&&!value.includes('\\'))return value;try{const u=new URL(value);if(u.protocol==='https:')return value}catch{}throw new Error('Enter a secure HTTPS link or a local page path.')}
