import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{const base=process.env.SITE_URL||'https://dansvic-designs-website-eight.vercel.app';return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/account','/api/','/login','/register','/forgot-password','/reset-password']},sitemap:base+'/sitemap.xml'}}
