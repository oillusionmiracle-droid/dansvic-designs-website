import "server-only";
import { cookies } from "next/headers";
import { randomBytes,scrypt,timingSafeEqual,createHash } from "node:crypto";
import { promisify } from "node:util";
import { and,eq,gt } from "drizzle-orm";
import { db } from "@/db";
import { profiles,sessions } from "@/db/schema";
import { cache } from "react";
const derive=promisify(scrypt);
const COOKIE='dd_session';
export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const hash=await derive(password,salt,64) as Buffer;return salt+':'+hash.toString('hex')}
export async function verifyPassword(password:string,stored:string){const[salt,hash]=stored.split(':');if(!/^[0-9a-f]{32}$/.test(salt||'')||!/^[0-9a-f]{128}$/.test(hash||''))return false;const candidate=await derive(password,salt,64) as Buffer;return timingSafeEqual(candidate,Buffer.from(hash,'hex'))}
export async function createSession(userId:string){const token=randomBytes(32).toString('hex');const expiresAt=new Date(Date.now()+7*86400000);await db.insert(sessions).values({userId,token:tokenHash(token),expiresAt});(await cookies()).set(COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',expires:expiresAt})}
export async function destroySession(){const jar=await cookies();const token=jar.get(COOKIE)?.value;if(token)await db.delete(sessions).where(eq(sessions.token,tokenHash(token)));jar.delete(COOKIE)}
export type CurrentUser={id:string;name:string;email:string;role:string;isDisabled:boolean;createdAt:Date};
export const getCurrentUser=cache(async():Promise<CurrentUser|null>=>{
 const token=(await cookies()).get(COOKIE)?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 try{const rows=await db.select({id:profiles.id,name:profiles.name,email:profiles.email,role:profiles.role,isDisabled:profiles.isDisabled,createdAt:profiles.createdAt}).from(sessions).innerJoin(profiles,eq(sessions.userId,profiles.id)).where(and(eq(sessions.token,tokenHash(token)),gt(sessions.expiresAt,new Date()))).limit(1);return rows[0]&&!rows[0].isDisabled?rows[0]:null}catch(err){console.error('Session lookup failed');return null}
});
export async function requireUser(){const u=await getCurrentUser();if(!u)throw Response.json({error:'Please sign in to continue.'},{status:401});return u}
export async function requireAdmin(){const u=await requireUser();if(u.role!=='admin')throw Response.json({error:'Admin access required.'},{status:403});return u}
export function handle<T extends unknown[]>(fn:(...args:T)=>Promise<Response>){return async(...args:T)=>{try{return await fn(...args)}catch(e){if(e instanceof Response)return e;console.error('Request failed',e instanceof Error?e.message:'Unexpected error');return Response.json({error:'We could not complete that request. Please try again.'},{status:500})}}}
