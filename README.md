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

> **Wichtig:** Du benötigst ein [Supabase](https://supabase.com) Projekt. Siehe Kapitel „Supabase" für die vollständige Einrichtung.

## TODO

- [ ] User testen lassen -> UI anpassen, UX >
- [ ] About Seite -> Warum gibt es die Seite überhaupt?, Herstellungsverfahren, etc.
- [x] Kuule und verstörende Infos über Nuggets (Gewicht pro Kücken, etc)
- [x] Rangliste für mehrere User (wie viel Nugget haben sie geschredded?)
- [ ] FunFacts: Infos über Kücken (Gewicht) und Umrechnung in Nuggets, und Herstellungsverfahren hinzufügen 

- [ ] Domain + auf Server hosen & Seite über Suchmaschinen (Google) auffindbar machen (?)
- [ ] Grafiken / Animationen erstellen lassen & hinzufügen 
- [ ] Funktionalität erweitern auf Tenders, Wings, etc. 


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

   Bearbeite `.env.local` und füge deine Supabase-Credentials ein (siehe Kapitel „Supabase"):

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

---

## Supabase

Dieses Projekt nutzt [Supabase](https://supabase.com) als Backend (Auth & Database). Folgende Schritte sind für die vollständige Einrichtung erforderlich.

### 1. Projekt anlegen

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Warte, bis das Projekt bereit ist (kann 1–2 Minuten dauern)

### 2. Credentials abrufen

**Pfad:** Project Settings → API

- **Project URL** (z.B. `https://xyzabc.supabase.co`)
- **anon public** Key (öffentlicher API-Schlüssel)

Diese Werte in `.env.local` eintragen:

```env
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key

# Optional, für Production: Basis-URL für E-Mail-Bestätigung (z.B. https://dein-user.github.io)
# Ohne Angabe wird window.location.origin genutzt – funktioniert lokal und bei korrekter Supabase URL-Konfiguration
# VITE_APP_URL=https://dein-user.github.io
```

### 3. Schema in Supabase anlegen (profiles + nugget_entries)

Supabase speichert Nutzer in `auth.users`, aber diese Tabelle ist nicht direkt per API zugreifbar. Für Profildaten (Name, Avatar, Nickname etc.) und Nugget-Einträge braucht die App die Tabellen `public.profiles` und `public.nugget_entries`.

**Warum?** Die Datei `src/types/database.types.ts` enthält TypeScript-Typen, die aus dem Schema deiner Supabase-Datenbank generiert werden. Ohne die Tabellen sind die generierten Typen unvollständig, und der Build kann fehlschlagen.

**So fügst du die Befehle konkret in Supabase ein:**

1. Im **Supabase-Dashboard** deines Projekts: links **SQL Editor** öffnen.
2. **New query** wählen (neue Abfrage).
3. Die passende SQL-Datei öffnen: **`supabase/schema.sql`** im Projekt.
4. **Entweder:**
   - **Neues Projekt (noch keine profiles-Tabelle):** Im SQL-Editor nur **TEIL 1 – Vollständiges Setup** markieren und ausführen (Run).
   - **Bestehendes Projekt (profiles existiert schon, alte SQL-Befehle waren schon ausgeführt):** Nur **TEIL 2 – Nur Erweiterung** markieren und ausführen (Run).
   - **Projekt mit alter `sauce`-Spalte (einzelne Sauce):** **TEIL 4 – Migration** ausführen (wandelt `sauce` in `sauces` Array um).
5. Mit **Run** (oder Strg+Enter) die Abfrage ausführen.

Damit wird u. a.:
- Die Tabelle `profiles` mit `nickname` und `avatar_color` angelegt bzw. ergänzt
- Die Tabelle `nugget_entries` (Count, Saucen als Array, Location, Mood, Notes) angelegt
- Row Level Security (RLS) aktiviert und Policies gesetzt (Nutzer sehen nur eigene Einträge)
- Der Trigger `handle_new_user` eingerichtet bzw. angepasst: bei Registrierung wird ein Profil mit zufälliger Avatar-Farbe erzeugt

### 4. URL-Konfiguration (Auth Redirects)

**Kritisch für E-Mail-Bestätigung und Production-Deployment.**

Bei der Registrierung sendet Supabase eine Bestätigungsmail mit einem Link. Wohin dieser Link führt, hängt von der **Site URL** und den **Redirect URLs** ab.

**Pfad:** Authentication → URL Configuration

#### Site URL

Die **Site URL** ist der Standard-Redirect, wenn im Code kein `emailRedirectTo` angegeben wird oder die angegebene URL nicht erlaubt ist.

- **Standard:** `http://localhost:3000` (muss geändert werden!)
- **Production:** `https://<dein-github-user>.github.io/schredder/`

#### Redirect URLs (Allowlist)

Hier müssen alle erlaubten Redirect-Ziele eingetragen werden. Nur URLs in dieser Liste werden von Supabase akzeptiert.

| URL | Zweck |
|-----|-------|
| `https://<user>.github.io/schredder/**` | Production (GitHub Pages) |
| `http://localhost:5173/schredder/**` | Lokale Entwicklung (Vite) |

> **Wildcard `**`:** Erlaubt alle Pfade unterhalb der Basis-URL, z.B. `.../schredder/#access_token=...`.

#### Funktionsweise

```
signUp() mit emailRedirectTo
        ↓
URL in Allowlist? ──Ja──→ Redirect zu dieser URL
        │
       Nein
        ↓
Fallback: Site URL (z.B. localhost:3000)
```

**Ohne korrekte Konfiguration zeigen Bestätigungslinks auf localhost!**

**Tipp:** Mit `VITE_APP_URL` (z.B. `https://dein-user.github.io`) kann die Redirect-URL explizit für Production gesetzt werden. In GitHub Actions sollte dieses Secret übergeben werden. Ohne `VITE_APP_URL` nutzt die App `window.location.origin` – das reicht, wenn Supabase korrekt konfiguriert ist.

### 5. Datenbank-Typen generieren

Die TypeScript-Typen werden aus dem Schema deiner Supabase-Datenbank generiert.

**Schritt 1:** Bei der Supabase CLI einloggen:

```bash
npx supabase login
```

> **DevContainer / Headless:** Der Browser öffnet sich ggf. nicht automatisch. Öffne den angezeigten Login-Link manuell und gib den Verifikationscode im Terminal ein.

**Schritt 2:** Typen generieren (ersetze `<project-id>` durch den Teil vor `.supabase.co` in deiner URL):

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```

**Wann neu generieren?**
- Nach Änderungen am Datenbankschema (neue Tabellen, Spalten etc.)
- Wenn Build-Fehler wie `Type 'string' does not satisfy the constraint` auftreten

### 6. Troubleshooting

#### Bestätigungslink zeigt auf localhost:3000

**Problem:** Nach der Registrierung enthält die Bestätigungsmail einen Link zu `http://localhost:3000/#access_token=...` statt zur produktiven App.

**Ursache:** Supabase ignoriert die im Code übergebene `emailRedirectTo`-URL, wenn sie nicht in der Allowlist steht, und fällt auf die **Site URL** zurück. Der Standardwert der Site URL ist `http://localhost:3000`.

**Lösung:**
1. Im Supabase-Dashboard → Authentication → URL Configuration
2. **Site URL** auf die Production-URL setzen (z.B. `https://<user>.github.io/schredder/`)
3. **Redirect URLs** hinzufügen:
   - `https://<user>.github.io/schredder/**`
   - `http://localhost:5173/schredder/**`
4. Änderungen speichern
5. Neuen Nutzer registrieren und Bestätigungsmail prüfen

#### Build-Fehler: „Type 'string' does not satisfy the constraint"

**Problem:** TypeScript-Fehler wie `Type 'string' does not satisfy the constraint '{ schema: "public"; }'`.

**Ursache:** Die generierten Typen in `database.types.ts` enthalten keine Tabellen (leeres Schema).

**Lösung:**
1. Schema (profiles + nugget_entries) in Supabase anlegen (siehe oben)
2. Typen neu generieren: `npx supabase gen types typescript --project-id <id> > src/types/database.types.ts`
3. Build erneut ausführen

---

## DevContainer

Das Projekt enthält eine DevContainer-Konfiguration für VS Code. Um den DevContainer zu nutzen:

1. Installiere die [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Extension
2. Öffne das Projekt in VS Code
3. Klicke auf "Reopen in Container"

## Deployment

### GitHub Pages

Das Projekt ist für automatisches Deployment auf GitHub Pages konfiguriert.

> **Wichtig:** Für funktionierende E-Mail-Bestätigung muss die Supabase URL-Konfiguration auf die Production-URL gesetzt sein. Siehe Kapitel „Supabase" → „URL-Konfiguration".

1. **Repository Settings**
   - Gehe zu Settings → Pages
   - Wähle "GitHub Actions" als Source

2. **Secrets hinzufügen**
   - Gehe zu Settings → Secrets and variables → Actions
   - Wähle **Repository secrets** (Environment secrets funktionieren ebenfalls, wenn für `github-pages` konfiguriert)
   - Klicke auf **New repository secret**
   - Füge hinzu:
     - **Name:** `VITE_SUPABASE_URL` → **Value:** deine Supabase Project URL (z.B. `https://xyz.supabase.co`)
     - **Name:** `VITE_SUPABASE_ANON_KEY` → **Value:** dein Supabase Anon Key (Project Settings → API)
     - **Name:** `VITE_APP_URL` (empfohlen) → **Value:** `https://<dein-user>.github.io` – sorgt für stabile Redirects bei E-Mail-Bestätigung

3. **Deployment**
   - Push auf den `main` Branch triggert automatisch ein Deployment

## Lizenz

MIT
