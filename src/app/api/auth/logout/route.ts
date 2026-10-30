import {destroySession,handle} from '@/lib/auth';
import {assertSameOrigin} from '@/lib/security';
export const POST=handle(async(req:Request)=>{assertSameOrigin(req);await destroySession();return Response.json({ok:true})});
