-- =============================================================================
-- Supabase Schema: Schredder
-- =============================================================================
-- Wo ausführen: Supabase Dashboard → SQL Editor → New query → Skript einfügen → Run
--
-- • Neues Projekt: Führe TEIL 1 (Vollständiges Setup) aus.
-- • Bestehendes Projekt (profiles existiert schon): Führe nur TEIL 2 (Erweiterung) aus.
-- =============================================================================

-- =============================================================================
-- TEIL 1 – Vollständiges Setup (nur bei neuem Projekt ausführen)
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

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabelle Nugget-Einträge
create table if not exists public.nugget_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  count integer not null check (count > 0),
  created_at timestamptz not null default now(),
  sauce text,
  location text,
  mood text,
  notes text
);

create index if not exists nugget_entries_user_id_idx on public.nugget_entries(user_id);
create index if not exists nugget_entries_created_at_idx on public.nugget_entries(created_at desc);

alter table public.nugget_entries enable row level security;

create policy "Users can view own entries"
  on public.nugget_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.nugget_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.nugget_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.nugget_entries for delete
  using (auth.uid() = user_id);


-- =============================================================================
-- TEIL 2 – Nur Erweiterung (wenn profiles-Tabelle schon existiert)
-- =============================================================================
-- Führe nur diesen Block aus, wenn du bereits das alte Schema (ohne nugget_entries,
-- ohne nickname/avatar_color, alter handle_new_user) ausgeführt hast.
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
  sauce text,
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
-- TEIL 3 – Leaderboard-View (Top 10 Nugget-Shredder, anonymisiert)
-- =============================================================================
-- Führe nach TEIL 1 oder TEIL 2 aus. Ermöglicht Lesezugriff für alle (anon + authenticated).

create or replace view public.nugget_leaderboard
with (security_invoker = false)
as
select rank, nickname, avatar_color, total_nuggets, avg_per_day, nuggets_last_14_days
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
    coalesce(t.nuggets_last_14_days, 0)::bigint as nuggets_last_14_days
  from public.profiles p
  left join (
    select
      user_id,
      sum(count) as total_nuggets,
      round(sum(count)::numeric / nullif(count(distinct (created_at::date)), 0), 1) as avg_per_day,
      sum(count) filter (where created_at >= now() - interval '14 days') as nuggets_last_14_days
    from public.nugget_entries
    group by user_id
  ) t on t.user_id = p.id
) sub
where rank <= 10
order by rank;

grant select on public.nugget_leaderboard to anon, authenticated;
