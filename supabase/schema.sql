-- =============================================================================
-- Supabase Schema: Schredder
-- =============================================================================
--
-- WO AUSFÜHREN:
--   Supabase Dashboard → SQL Editor → New query → gewünschten Block markieren → Run
--
-- WELCHEN TEIL WANN AUSFÜHREN:
--
--   TEIL 1 – Vollständiges Setup
--     Wann:  Brandneues Supabase-Projekt, noch keine profiles- oder nugget_entries-Tabelle
--     Was:   Legt profiles, nugget_entries, RLS-Policies und den Registrierungs-Trigger an
--     Hinweis: Kann mehrfach ausgeführt werden (idempotent)
--
--   TEIL 2 – Nur Erweiterung
--     Wann:  Du hast früher eine ältere Version ausgeführt (profiles ohne nickname/avatar_color,
--            ohne nugget_entries, oder mit alter handle_new_user-Funktion)
--     Was:   Ergänzt nickname/avatar_color in profiles, aktualisiert handle_new_user,
--            legt nugget_entries an falls noch nicht vorhanden
--     Hinweis: Überspringen, wenn du TEIL 1 bereits ausgeführt hast
--
--   TEIL 3 – Leaderboard-View
--     Wann:  Immer – erforderlich für das Ranking auf der Startseite (Top 10 Nugget-Shredder)
--     Was:   Erstellt die View nugget_leaderboard mit aggregierten Statistiken,
--            Lesezugriff für alle (auch nicht eingeloggte Besucher)
--     Hinweis: Nach TEIL 1 oder TEIL 2 ausführen
--
--   TEIL 4 – Migration sauce → sauces
--     Wann:  Nur wenn nugget_entries noch die alte Spalte "sauce" (einzelne Sauce) hat
--     Was:   Wandelt sauce (text) in sauces (text[]) um, migriert bestehende Daten
--     Hinweis: Bei neuem Setup (TEIL 1) überflüssig; schadet nicht bei erneutem Ausführen
--
-- =============================================================================

-- =============================================================================
-- TEIL 1 – Vollständiges Setup
-- =============================================================================
-- Für brandneue Supabase-Projekte. Legt profiles, nugget_entries, RLS und Trigger an.
-- Idempotent: Kann bei Bedarf erneut ausgeführt werden.
-- =============================================================================

create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  nickname text,
  avatar_color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  colors text[] := array['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan'];
begin
  insert into public.profiles (id, email, avatar_color, nickname)
  values (
    new.id,
    new.email,
    colors[floor(random() * array_length(colors, 1) + 1)],
    new.raw_user_meta_data->>'nickname'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabelle Nugget-Einträge
create table if not exists public.nugget_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  count integer not null check (count > 0),
  created_at timestamptz not null default now(),
  sauces text[] default '{}',
  location text,
  mood text,
  notes text
);

create index if not exists nugget_entries_user_id_idx on public.nugget_entries(user_id);
create index if not exists nugget_entries_created_at_idx on public.nugget_entries(created_at desc);

alter table public.nugget_entries enable row level security;

drop policy if exists "Users can view own entries" on public.nugget_entries;
create policy "Users can view own entries"
  on public.nugget_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own entries" on public.nugget_entries;
create policy "Users can insert own entries"
  on public.nugget_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own entries" on public.nugget_entries;
create policy "Users can update own entries"
  on public.nugget_entries for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own entries" on public.nugget_entries;
create policy "Users can delete own entries"
  on public.nugget_entries for delete
  using (auth.uid() = user_id);


-- =============================================================================
-- TEIL 2 – Nur Erweiterung
-- =============================================================================
-- Für bestehende Projekte mit älterem Schema (profiles ohne nickname/avatar_color,
-- ohne nugget_entries oder mit veralteter handle_new_user-Funktion).
-- Überspringen, wenn TEIL 1 bereits vollständig ausgeführt wurde.
-- =============================================================================

-- Neue Spalten in profiles (ignoriert Fehler, falls Spalten schon existieren)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'nickname'
  ) then
    alter table public.profiles add column nickname text;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'avatar_color'
  ) then
    alter table public.profiles add column avatar_color text;
  end if;
end
$$;

-- Trigger-Funktion auf neue Version umstellen (setzt Avatar-Farbe für neue User)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  colors text[] := array['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan'];
begin
  insert into public.profiles (id, email, avatar_color, nickname)
  values (
    new.id,
    new.email,
    colors[floor(random() * array_length(colors, 1) + 1)],
    new.raw_user_meta_data->>'nickname'
  );
  return new;
end;
$$;

-- nugget_entries (überspringt Fehler, wenn Tabelle/Policies schon existieren)
create table if not exists public.nugget_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  count integer not null check (count > 0),
  created_at timestamptz not null default now(),
  sauces text[] default '{}',
  location text,
  mood text,
  notes text
);

create index if not exists nugget_entries_user_id_idx on public.nugget_entries(user_id);
create index if not exists nugget_entries_created_at_idx on public.nugget_entries(created_at desc);

alter table public.nugget_entries enable row level security;

drop policy if exists "Users can view own entries" on public.nugget_entries;
create policy "Users can view own entries"
  on public.nugget_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own entries" on public.nugget_entries;
create policy "Users can insert own entries"
  on public.nugget_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own entries" on public.nugget_entries;
create policy "Users can update own entries"
  on public.nugget_entries for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own entries" on public.nugget_entries;
create policy "Users can delete own entries"
  on public.nugget_entries for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- TEIL 3 – Leaderboard-View
-- =============================================================================
-- Erforderlich für das Ranking auf der Startseite. Erstellt die View nugget_leaderboard
-- mit Top 10, Durchschnitt pro Tag, Nuggets der letzten 14 Tage und Gesamtgewicht.
-- Lesezugriff für alle (auch Gäste). Nach TEIL 1 oder TEIL 2 ausführen.
-- =============================================================================

create or replace view public.nugget_leaderboard
with (security_invoker = false)
as
select rank, nickname, avatar_color, total_nuggets, avg_per_day, nuggets_last_14_days, total_weight_grams
from (
  select
    rank() over (
      order by coalesce(t.total_nuggets, 0) desc,
               coalesce(t.nuggets_last_14_days, 0) desc
    )::integer as rank,
    coalesce(nullif(trim(p.nickname), ''), 'Anonym') as nickname,
    p.avatar_color,
    coalesce(t.total_nuggets, 0)::bigint as total_nuggets,
    coalesce(t.avg_per_day, 0)::numeric(10,1) as avg_per_day,
    coalesce(t.nuggets_last_14_days, 0)::bigint as nuggets_last_14_days,
    coalesce(t.total_nuggets, 0)::bigint * 17 as total_weight_grams
  from public.profiles p
  left join (
    select
      user_id,
      sum(count) as total_nuggets,
      round(
        sum(count)::numeric / greatest(1, (current_date - min(created_at)::date)::int),
        1
      ) as avg_per_day,
      sum(count) filter (where created_at >= now() - interval '14 days') as nuggets_last_14_days
    from public.nugget_entries
    group by user_id
  ) t on t.user_id = p.id
) sub
where rank <= 10
order by rank;

grant select on public.nugget_leaderboard to anon, authenticated;

-- =============================================================================
-- TEIL 4 – Migration sauce → sauces
-- =============================================================================
-- Nur für bestehende Projekte mit der alten Spalte "sauce" (einzelne Sauce).
-- Migriert zu sauces (text[]). Bei neuem Setup überflüssig; bei erneutem
-- Ausführen wird geprüft, ob sauce existiert – falls nicht, passiert nichts.
-- =============================================================================

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'nugget_entries' and column_name = 'sauce'
  ) then
    alter table public.nugget_entries add column if not exists sauces text[] default '{}';
    update public.nugget_entries
    set sauces = case
      when sauce is not null and trim(sauce) != '' then array[trim(sauce)]
      else '{}'
    end;
    alter table public.nugget_entries drop column sauce;
  end if;
end
$$;
