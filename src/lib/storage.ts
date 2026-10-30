import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import { createHmac,timingSafeEqual,randomUUID } from "node:crypto";
import sharp from 'sharp';
import { pool } from '@/db';
import { signingSecret } from './security';
export const STORAGE_ROOT=path.join(process.cwd(),'storage');
const MAX_FILE=3*1024*1024;
export function resolveStoragePath(relative:string){const full=path.resolve(STORAGE_ROOT,relative);if(!full.startsWith(STORAGE_ROOT+path.sep))throw Error('Invalid storage path');return full}
export function isSample(data:Buffer){return data.subarray(0,100).toString().startsWith('DANSVIC-')&&data.subarray(0,100).includes(Buffer.from('-SAMPLE'))}
async function store(data:Buffer,mime:string,isPublic:boolean){if(!data.length||data.length>MAX_FILE)throw Error('Uploads must be smaller than 3 MB.');const id=randomUUID();await pool.query('insert into app_private.media(id,body,mime_type,is_public) values($1,$2,$3,$4)',[id,data,mime,isPublic]);return id}
export async function saveDesignFile(designId:string,format:string,data:Buffer){if(!['EMB','DST','DSB','CDR','PDF'].includes(format.toUpperCase()))throw Error('Unsupported file format.');if(isSample(data))throw Error('Sample files cannot be published as downloads.');if(format==='PDF'&&!data.subarray(0,5).equals(Buffer.from('%PDF-')))throw Error('Upload a valid PDF file.');return 'db:'+await store(data,'application/octet-stream',false)}
export async function savePublicUpload(name:string,data:Buffer){if(!/\.(png|jpe?g|webp|avif)$/i.test(name))throw Error('Upload a JPG, PNG, WebP or AVIF image.');if(data.length>MAX_FILE)throw Error('Images must be smaller than 3 MB.');const image=await sharp(data,{limitInputPixels:24000000}).rotate().resize({width:1600,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();return '/api/media/'+await store(image,'image/webp',true)}
export async function readDesignFile(storagePath:string){if(storagePath.startsWith('db:')){const id=storagePath.slice(3);if(!/^[a-f0-9-]{36}$/.test(id))throw Error('Invalid file');const {rows}=await pool.query('select body from app_private.media where id=$1 and is_public=false',[id]);if(!rows[0])throw Error('File not found');return rows[0].body as Buffer}const data=await fs.readFile(resolveStoragePath(storagePath));if(isSample(data))throw Error('A verified file is not available yet.');return data}
type Payload={f:string;u:string;n:string;exp:number};
export function signDownload(fileId:string,userId:string,fileName:string){const payload:Payload={f:fileId,u:userId,n:fileName,exp:Math.floor(Date.now()/1000)+600};const body=Buffer.from(JSON.stringify(payload)).toString('base64url');return body+'.'+createHmac('sha256',signingSecret()).update(body).digest('base64url')}
export function verifyDownloadToken(token:string):Payload|null{if(token.length>2048)return null;const parts=token.split('.');if(parts.length!==2)return null;const[body,sig]=parts;const expected=createHmac('sha256',signingSecret()).update(body).digest('base64url');const a=Buffer.from(sig),b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;try{const p=JSON.parse(Buffer.from(body,'base64url').toString());if(typeof p.f!=='string'||typeof p.u!=='string'||typeof p.n!=='string'||!Number.isFinite(p.exp)||p.exp<=Date.now()/1000||p.exp>Date.now()/1000+610)return null;return p}catch{return null}}
