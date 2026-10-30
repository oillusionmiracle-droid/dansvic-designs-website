import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSession,verifyPassword,handle,hashPassword } from "@/lib/auth";
import { assertSameOrigin,readJson,rateLimit,emailAddress,text } from "@/lib/security";
let dummyHash:Promise<string>|undefined;
export const POST=handle(async(req:Request)=>{assertSameOrigin(req);await rateLimit(req,'login-ip',15,900);const body=await readJson(req);const email=emailAddress(body.email),password=text(body.password,'Password',1,128);await rateLimit(req,'login-account',10,900,email);const user=await db.query.profiles.findFirst({where:eq(profiles.email,email)});dummyHash??=hashPassword('a-dummy-value-for-timing-only');const valid=await verifyPassword(password,user?.passwordHash??await dummyHash);if(!user||!valid||user.isDisabled)return Response.json({error:'Incorrect email or password.'},{status:401});await createSession(user.id);return Response.json({ok:true,redirectTo:user.role==='admin'?'/admin':'/designs'})});
