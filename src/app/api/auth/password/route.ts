import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { profiles,sessions } from '@/db/schema';
import { handle,requireUser,verifyPassword,hashPassword,createSession } from '@/lib/auth';
import {assertSameOrigin,rateLimit,readJson,text} from '@/lib/security';
export const POST=handle(async(req:Request)=>{assertSameOrigin(req);await rateLimit(req,'password',5,900);const u=await requireUser();const b=await readJson(req),old=text(b.currentPassword,'Current password',1,128),password=text(b.password,'New password',12,128);const p=await db.query.profiles.findFirst({where:eq(profiles.id,u.id)});if(!p||!await verifyPassword(old,p.passwordHash))return Response.json({error:'Your current password is incorrect.'},{status:400});if(password===old)return Response.json({error:'Choose a different new password.'},{status:400});await db.transaction(async tx=>{await tx.update(profiles).set({passwordHash:await hashPassword(password)}).where(eq(profiles.id,u.id));await tx.delete(sessions).where(eq(sessions.userId,u.id))});await createSession(u.id);return Response.json({ok:true})});
