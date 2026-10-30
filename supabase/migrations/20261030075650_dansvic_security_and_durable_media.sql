-- Internal tables are reachable only through authenticated application code.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;
create table if not exists app_private.media (
 id uuid primary key default gen_random_uuid(),
 body bytea not null check (octet_length(body) between 1 and 3145728),
 mime_type text not null,
 is_public boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists app_private.rate_limits (
 key text primary key,
 window_start bigint not null,
 hits integer not null default 1,
 expires_at timestamptz not null
);
create index if not exists rate_limits_expiry_idx on app_private.rate_limits(expires_at);
create table if not exists app_private.password_resets (
 token_hash text primary key,
 user_id uuid not null references public.profiles(id) on delete cascade,
 expires_at timestamptz not null,
 used_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists password_resets_expiry_idx on app_private.password_resets(expires_at);
alter table app_private.media enable row level security;
alter table app_private.rate_limits enable row level security;
alter table app_private.password_resets enable row level security;
revoke all on all tables in schema app_private from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
-- This app uses server-side SQL and its own sessions, not the public Data API.
revoke all on public.profiles,public.sessions from anon,authenticated;
