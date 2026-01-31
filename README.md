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

### Datenbank-Typen generieren

Die Typen werden aus deinem Supabase-Projekt automatisch generiert. Dafür musst du zuerst bei der Supabase CLI eingeloggt sein:

```bash
npx supabase login
```

Dann kannst du die Typen generieren:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```

Dann kannst du die Typen in deinem Projekt verwenden.

## DevContainer

Das Projekt enthält eine DevContainer-Konfiguration für VS Code. Um den DevContainer zu nutzen:

1. Installiere die [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Extension
2. Öffne das Projekt in VS Code
3. Klicke auf "Reopen in Container"

## Deployment

### GitHub Pages

Das Projekt ist für automatisches Deployment auf GitHub Pages konfiguriert.

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
