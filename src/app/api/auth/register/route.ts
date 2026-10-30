import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSession,hashPassword,handle } from "@/lib/auth";
import { assertSameOrigin,readJson,rateLimit,emailAddress,text } from "@/lib/security";
export const POST=handle(async(req:Request)=>{assertSameOrigin(req);await rateLimit(req,'register',5,3600);const b=await readJson(req);const name=text(b.name,'Name',2,100),email=emailAddress(b.email),password=text(b.password,'Password',12,128);const [user]=await db.insert(profiles).values({name,email,passwordHash:await hashPassword(password),role:'customer'}).onConflictDoNothing({target:profiles.email}).returning({id:profiles.id});if(!user)return Response.json({error:'Unable to create this account. If you already registered, try signing in.'},{status:409});await createSession(user.id);return Response.json({ok:true})});
