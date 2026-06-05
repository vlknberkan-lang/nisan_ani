-- ═══════════════════════════════════════════════════════════════
--  NİŞAN ANI DEFTERİ — Veritabanı Kurulumu
--  Supabase Dashboard > SQL Editor > New query → tümünü yapıştır → RUN
-- ═══════════════════════════════════════════════════════════════

-- 1) Anılar tablosu ───────────────────────────────────────────
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  guest_name  text,                       -- misafirin adı (opsiyonel)
  message     text,                       -- yazılı not / dilek
  media_url   text,                       -- foto/ses/video dosyasının public adresi
  media_type  text not null default 'none'
              check (media_type in ('photo', 'audio', 'video', 'none')),
  approved    boolean not null default true  -- istenmeyen içerik için moderasyon
);

create index if not exists memories_created_at_idx
  on public.memories (created_at desc);

-- 2) Row Level Security ───────────────────────────────────────
alter table public.memories enable row level security;

-- Herkes (anonim misafir) yeni anı ekleyebilir
drop policy if exists "Herkes ani ekleyebilir" on public.memories;
create policy "Herkes ani ekleyebilir"
  on public.memories for insert
  to anon, authenticated
  with check (true);

-- Herkes onaylı anıları görebilir
drop policy if exists "Onayli anilar herkese acik" on public.memories;
create policy "Onayli anilar herkese acik"
  on public.memories for select
  to anon, authenticated
  using (approved = true);

-- 3) Depolama (Storage) bucket'ı ──────────────────────────────
-- 'anilar' adında public bir bucket oluştur (foto/ses/video dosyaları için)
insert into storage.buckets (id, name, public)
values ('anilar', 'anilar', true)
on conflict (id) do nothing;

-- Herkes dosya yükleyebilir
drop policy if exists "Herkes dosya yukleyebilir" on storage.objects;
create policy "Herkes dosya yukleyebilir"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'anilar');

-- Herkes dosyaları görüntüleyebilir
drop policy if exists "Dosyalar herkese acik" on storage.objects;
create policy "Dosyalar herkese acik"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'anilar');

-- ═══════════════════════════════════════════════════════════════
--  Bitti! Artık site anıları kaydedip gösterebilir.
-- ═══════════════════════════════════════════════════════════════
