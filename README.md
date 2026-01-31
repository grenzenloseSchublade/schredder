# Schredder

Eine moderne React-Anwendung mit Vite, TypeScript, Tailwind CSS und Supabase.

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Supabase konfigurieren
cp .env.example .env.local
# Dann .env.local bearbeiten und Supabase-Credentials eintragen

# 3. Entwicklungsserver starten
npm run dev
```

Die App läuft unter: [http://localhost:5173/schredder/](http://localhost:5173/schredder/)

> **Wichtig:** Du benötigst ein [Supabase](https://supabase.com) Projekt. Die Credentials findest du unter Project Settings → API.

## Tech Stack

- **React 19** - UI Library
- **Vite 7** - Build Tool & Dev Server
- **TypeScript 5.9** - Type Safety
- **Tailwind CSS 4** - Utility-first CSS
- **React Router 7** - Client-Side Routing
- **TanStack Query** - Server State Management
- **React Hook Form + Zod** - Formular-Validierung
- **Sonner** - Toast Notifications
- **Supabase** - Backend-as-a-Service (Auth & Database)
- **Vitest** - Unit Testing
- **ESLint & Prettier** - Code Quality

## Voraussetzungen

- Node.js 22 LTS
- npm oder pnpm
- Ein [Supabase](https://supabase.com) Projekt

## Installation

1. **Repository klonen**

   ```bash
   git clone https://github.com/dein-username/schredder.git
   cd schredder
   ```

2. **Abhängigkeiten installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   Kopiere die Beispiel-Datei und fülle die Werte aus:

   ```bash
   cp .env.example .env.local
   ```

   Bearbeite `.env.local` und füge deine Supabase-Credentials ein:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Entwicklungsserver starten**

   ```bash
   npm run dev
   ```

   Die App ist unter [http://localhost:5173/schredder/](http://localhost:5173/schredder/) erreichbar.

## Scripts

| Befehl              | Beschreibung                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Startet den Entwicklungsserver        |
| `npm run build`     | Erstellt einen Production Build       |
| `npm run preview`   | Vorschau des Production Builds        |
| `npm run lint`      | Führt ESLint aus                      |
| `npm run test`      | Startet Vitest im Watch-Modus         |
| `npm run test:ui`   | Startet Vitest mit UI                 |
| `npm run test:coverage` | Generiert Coverage Report         |

## Projektstruktur

```
src/
├── components/     # Wiederverwendbare UI-Komponenten
├── hooks/          # Custom React Hooks
├── lib/            # Utilities & Supabase Client
├── pages/          # Seitenkomponenten
├── test/           # Test Setup
└── types/          # TypeScript Typen
```

## Supabase Setup

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Kopiere die Project URL und den Anon Key aus den Project Settings
3. Füge sie in deine `.env.local` Datei ein

### Warum die profiles-Tabelle und Typen-Generierung?

Supabase speichert Nutzer in `auth.users`, aber diese Tabelle ist nicht direkt per API zugreifbar. Für zusätzliche Profildaten (Name, Avatar etc.) braucht die App deshalb eine eigene Tabelle `public.profiles`. Sie wird per Trigger automatisch befüllt, sobald sich ein Nutzer registriert.

Die Datei `src/types/database.types.ts` enthält die TypeScript-Typen für alle Tabellen. Sie wird **aus dem Schema deiner Supabase-Datenbank** erzeugt – nicht manuell geschrieben. Ohne die `profiles`-Tabelle findet die Typsgenerierung keine passenden Tabellen, die generierten Typen sind leer, und der Build schlägt fehl. Deshalb müssen erst die Tabelle angelegt und anschließend die Typen neu generiert werden.

### profiles-Tabelle anlegen

Im Supabase-Dashboard: **SQL Editor** → **New query** → folgendes SQL ausführen:

```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
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
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Damit wird die Tabelle angelegt, RLS aktiviert, Zugriffsregeln gesetzt und ein Trigger eingerichtet, der bei jeder Registrierung automatisch ein Profil erzeugt.

### URL-Konfiguration (Auth Redirects)

Für E-Mail-Bestätigung und Deployment auf GitHub Pages müssen **Site URL** und **Redirect URLs** im Supabase-Dashboard gesetzt werden:

**Pfad:** Authentication → URL Configuration

- **Site URL:** `https://<dein-github-user>.github.io/schredder/` (Production-URL deiner App)
- **Redirect URLs** (Allow list):
  - `https://<user>.github.io/schredder/**` (Production, inkl. Hash für Auth-Token)
  - `http://localhost:5173/schredder/**` (Lokale Entwicklung)

Ohne diese Einstellung führen Bestätigungslinks in E-Mails fälschlich zu localhost statt zur produktiven App.

### Datenbank-Typen generieren

Die Typen werden aus deinem Supabase-Projekt automatisch generiert. Zuerst bei der Supabase CLI einloggen:

```bash
npx supabase login
```

> **DevContainer / Headless:** Öffne den angezeigten Login-Link manuell und gib den Verifikationscode im Terminal ein.

Anschließend Typen generieren (ersetze `<your-project-id>` durch den Teil vor `.supabase.co` in deiner Supabase-URL):

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```

## DevContainer

Das Projekt enthält eine DevContainer-Konfiguration für VS Code. Um den DevContainer zu nutzen:

1. Installiere die [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Extension
2. Öffne das Projekt in VS Code
3. Klicke auf "Reopen in Container"

## Deployment

### GitHub Pages

Das Projekt ist für automatisches Deployment auf GitHub Pages konfiguriert.

> **Supabase Auth:** Für funktionierende E-Mail-Bestätigung nach der Registrierung muss die URL-Konfiguration in Supabase (siehe oben unter „URL-Konfiguration“) auf die Production-URL gesetzt sein.

1. **Repository Settings**
   - Gehe zu Settings → Pages
   - Wähle "GitHub Actions" als Source

2. **Secrets hinzufügen**
   - Gehe zu Settings → Secrets and variables → Actions
   - Wähle **Repository secrets** (Environment secrets funktionieren ebenfalls, wenn für `github-pages` konfiguriert)
   - Klicke auf **New repository secret**
   - Füge beide Secrets hinzu:
     - **Name:** `VITE_SUPABASE_URL` → **Value:** deine Supabase Project URL (z.B. `https://xyz.supabase.co`)
     - **Name:** `VITE_SUPABASE_ANON_KEY` → **Value:** dein Supabase Anon Key (Project Settings → API)

3. **Deployment**
   - Push auf den `main` Branch triggert automatisch ein Deployment

## Lizenz

MIT
