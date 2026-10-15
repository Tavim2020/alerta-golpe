-- Rode no SQL Editor do Supabase
create table videos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  video_url text not null,
  created_at timestamptz default now()
);
alter table videos enable row level security;
create policy "leitura publica" on videos for select using (true);
insert into storage.buckets (id, name, public) values ('videos', 'videos', true);
