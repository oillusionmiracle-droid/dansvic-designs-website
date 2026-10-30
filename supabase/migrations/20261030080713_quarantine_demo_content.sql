-- Preserve the original demo state so this content cleanup can be reviewed/reversed.
create table if not exists app_private.revamp_backups (
 name text primary key, payload jsonb not null, created_at timestamptz not null default now()
);
alter table app_private.revamp_backups enable row level security;
revoke all on app_private.revamp_backups from public,anon,authenticated;
insert into app_private.revamp_backups(name,payload)
select '2026-10-dansvic-demo-content', jsonb_build_object(
 'designs',(select jsonb_agg(to_jsonb(d)) from public.designs d where code between 'DD-0001' and 'DD-0015'),
 'files',(select jsonb_agg(to_jsonb(f)) from public.design_files f),
 'testimonials',(select jsonb_agg(to_jsonb(t)) from public.testimonials t),
 'announcements',(select jsonb_agg(to_jsonb(a)) from public.announcements a),
 'profile_flags',(select jsonb_agg(jsonb_build_object('id',id,'is_disabled',is_disabled)) from public.profiles),
 'site_content',(select jsonb_agg(to_jsonb(c)) from public.site_content c)
) on conflict(name) do nothing;

-- All 40 original attachments were generated sample bytes. Keep their metadata quarantined.
update public.design_files set storage_path='quarantined:'||storage_path
where storage_path not like 'db:%' and storage_path not like 'quarantined:%' and design_id in(select id from public.designs where code between 'DD-0001' and 'DD-0015');
update public.designs set
 preview_image_url=case
 when preview_image_url='/images/designs/asooke.jpg' then '/images/editorial/27992683.webp'
 when preview_image_url='/images/designs/flap.jpg' then '/designs/danshiki.jpg'
 when preview_image_url='/images/designs/print-trouser.jpg' then '/designs/print-tee.jpg'
 else replace(preview_image_url,'/images/designs/','/designs/') end,
 secondary_preview_url=null,
 description='Design study for '||category||'. Explore the visual direction and contact the studio for a custom interpretation. A verified machine or print file has not been attached to this study yet.',
 download_count=0,view_count=0
where code between 'DD-0001' and 'DD-0015' and preview_image_url like '/images/designs/%';
update public.testimonials set is_published=false where name in('Adaeze Okonkwo','Tunde Bakare','Grace Mensah','Marcus Lee');
update public.profiles set is_disabled=true where email in('demo@dansvicdesigns.com','adaeze@example.com','tunde@example.com','grace@example.com');
update public.announcements set is_active=false where message='New this week: 3 fresh Agbada necklines — all free.';
update public.blog_posts set cover_image_url=case when cover_image_url='/images/designs/asooke.jpg' then '/images/editorial/27992683.webp' else replace(cover_image_url,'/images/designs/','/designs/') end;
-- Replace the previous unlimited-download claims with availability-based wording.
insert into public.site_content(key,value) values
 ('hero_eyebrow','Embroidery · Monogramming · Print'),
 ('hero_title','Tradition, in every thread.'),
 ('hero_subtitle','Embroidery, monogramming and print illustration for your next creation. Explore the design library or enquire about a custom design.'),
 ('hero_cta_primary','Explore the library'),('hero_cta_secondary','Create something custom'),
 ('banner_text',''),('banner_link',''),
 ('newsletter_title','A little inspiration, in your inbox.'),
 ('newsletter_subtitle','Join our list for design news and new additions to the library.')
 on conflict(key) do update set value=excluded.value,updated_at=now();
update public.faq_items set answer='Browse the library and open a design to see its details. Only verified attachments appear as downloadable formats. Design studies without files are marked preview only. For a custom file, contact the studio.' where question ilike '%download%' and question not ilike '%expire%';
