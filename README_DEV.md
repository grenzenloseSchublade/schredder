# Developer Documentation

This document explains the technology stack, architecture, and how all the pieces fit together. It's written for developers who want to understand not just *what* tools we use, but *why* we use them and *how* they work together.

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [Core Concepts](#core-concepts)
3. [The Tech Stack Explained](#the-tech-stack-explained)
4. [How Everything Connects](#how-everything-connects)
5. [Project Architecture](#project-architecture)
6. [Data Flow](#data-flow)
7. [Development Workflow](#development-workflow)
8. [Common Tasks](#common-tasks)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## The Big Picture

Before diving into individual tools, let's understand what we're building and why we need all these pieces.

### What is a Modern Web Application?

A modern web application consists of:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Frontend (React)                        │  │
│  │  - User Interface (what users see and interact with)      │  │
│  │  - State Management (keeping track of data)               │  │
│  │  - Routing (navigating between pages)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Supabase)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Authentication  │  │    Database     │  │     Storage     │  │
│  │  (who you are)  │  │  (your data)    │  │    (files)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Why So Many Tools?

You might wonder: "Why do we need Vite, React, TypeScript, Tailwind, AND all these other things?"

Think of it like building a house:
- **React** is the blueprint and structure
- **TypeScript** is the building inspector (catches mistakes)
- **Vite** is the construction crew (builds everything fast)
- **Tailwind CSS** is the interior designer (makes it look good)
- **Supabase** is the utility company (provides electricity, water = auth, database)
- **TanStack Query** is the delivery service (fetches and caches data efficiently)

Each tool solves a specific problem, and together they create a powerful, maintainable application.

---

## Core Concepts

### What is a Bundler?

**Problem:** Browsers don't understand modern JavaScript features, TypeScript, or JSX (React's syntax). They also can't efficiently load hundreds of small files.

**Solution:** A bundler (like Vite) takes all your source code and:
1. Transforms it into browser-compatible JavaScript
2. Combines files efficiently
3. Optimizes for performance

```
Your Code                          Browser-Ready Code
┌──────────────┐                   ┌──────────────┐
│ App.tsx      │                   │              │
│ Button.tsx   │    ┌───────┐      │  bundle.js   │
│ utils.ts     │───►│ VITE  │─────►│  style.css   │
│ styles.css   │    └───────┘      │  index.html  │
│ ...100 files │                   │              │
└──────────────┘                   └──────────────┘
```

### What is a Component?

A component is a reusable piece of UI. Think of it like LEGO blocks:

```tsx
// A simple Button component
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn-primary">
      {children}
    </button>
  );
}

// Using it multiple times
<Button onClick={save}>Save</Button>
<Button onClick={cancel}>Cancel</Button>
<Button onClick={delete}>Delete</Button>
```

### What is State?

State is data that can change over time and affects what the user sees:

```tsx
function Counter() {
  // useState returns [currentValue, functionToUpdateIt]
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### What is a Hook?

Hooks are functions that let you "hook into" React features. They always start with `use`:

| Hook | Purpose | Example |
|------|---------|---------|
| `useState` | Store and update values | Form inputs, toggles |
| `useEffect` | Run code on mount/update | API calls, subscriptions |
| `useContext` | Share data across components | Auth state, theme |
| `useCallback` | Memoize functions | Event handlers |
| `useMemo` | Memoize computed values | Expensive calculations |

---

## The Tech Stack Explained

### 1. Vite - The Build Tool

**What it does:** Vite is the engine that powers your development experience.

**Why Vite over alternatives (Webpack, Create React App)?**

| Feature | Vite | Webpack/CRA |
|---------|------|-------------|
| Dev server start | ~300ms | 10-30 seconds |
| Hot reload | Instant | 1-5 seconds |
| Config complexity | Minimal | Complex |
| Build speed | Very fast | Slower |

**How it works:**

```
Development Mode:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Your Code   │───►│ Vite Server │───►│  Browser    │
│ (ES Modules)│    │ (on-demand) │    │ (native ESM)│
└─────────────┘    └─────────────┘    └─────────────┘
                         │
                    Only transforms
                    files you request!

Production Mode:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Your Code   │───►│ Rollup      │───►│ Optimized   │
│             │    │ (bundler)   │    │ Bundle      │
└─────────────┘    └─────────────┘    └─────────────┘
                         │
                    Tree-shaking,
                    minification,
                    code-splitting
```

**Key configuration (`vite.config.ts`):**

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],  // Plugins extend Vite's capabilities
  base: "/schredder/",                 // URL base path (for GitHub Pages)
  resolve: {
    alias: { "@": "./src" },           // Import from "@/components" instead of "../../components"
  },
});
```

---

### 2. React - The UI Library

**What it does:** React lets you build UIs from individual pieces called components.

**Core Principles:**

1. **Declarative:** You describe *what* the UI should look like, not *how* to change it
2. **Component-Based:** Build encapsulated components that manage their own state
3. **Unidirectional Data Flow:** Data flows down from parent to child

**The Component Lifecycle:**

```
Component Created         Component Updated         Component Removed
      │                         │                         │
      ▼                         ▼                         ▼
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Mount     │          │   Update    │          │   Unmount   │
│             │          │             │          │             │
│ useEffect   │          │ useEffect   │          │ useEffect   │
│ (no deps)   │          │ (with deps) │          │ cleanup fn  │
└─────────────┘          └─────────────┘          └─────────────┘
```

**Example with lifecycle:**

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Runs when component mounts OR when userId changes
    fetchUser(userId).then(setUser);
    
    // Cleanup function runs before next effect or unmount
    return () => {
      console.log('Cleaning up...');
    };
  }, [userId]); // Dependency array
  
  if (!user) return <Loading />;
  return <div>{user.name}</div>;
}
```

---

### 3. TypeScript - The Type System

**What it does:** TypeScript adds static types to JavaScript, catching errors before runtime.

**Why use TypeScript?**

```typescript
// JavaScript: Error at RUNTIME (in production, with users!)
function greet(name) {
  return "Hello, " + name.toUpperCase();
}
greet(123); // 💥 Crashes: name.toUpperCase is not a function

// TypeScript: Error at COMPILE TIME (before you deploy!)
function greet(name: string) {
  return "Hello, " + name.toUpperCase();
}
greet(123); // ❌ Error: Argument of type 'number' is not assignable
```

**Key TypeScript features we use:**

```typescript
// 1. Interface - Define object shapes
interface User {
  id: string;
  email: string;
  name?: string;  // Optional property
}

// 2. Type inference - TypeScript figures it out
const count = 0;        // TypeScript knows this is number
const users = [user1];  // TypeScript knows this is User[]

// 3. Generics - Reusable type logic
function first<T>(array: T[]): T | undefined {
  return array[0];
}
const num = first([1, 2, 3]);     // num is number | undefined
const str = first(["a", "b"]);    // str is string | undefined

// 4. Union types - Multiple possible types
type Status = "loading" | "success" | "error";

// 5. Type guards - Narrow types at runtime
function processResponse(response: User | Error) {
  if (response instanceof Error) {
    // TypeScript knows response is Error here
    console.error(response.message);
  } else {
    // TypeScript knows response is User here
    console.log(response.email);
  }
}
```

---

### 4. Tailwind CSS - The Styling System

**What it does:** Tailwind provides utility classes to style your HTML directly.

**Traditional CSS vs Tailwind:**

```html
<!-- Traditional CSS -->
<style>
  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
<div class="card">Content</div>

<!-- Tailwind CSS -->
<div class="bg-white p-6 rounded-xl shadow-md">Content</div>
```

**Why Tailwind?**

| Benefit | Explanation |
|---------|-------------|
| No naming | No more `.card-wrapper-inner-content` |
| No switching | Stay in your component file |
| Consistent | Built-in design system (spacing, colors) |
| Small bundle | Only includes classes you use |
| Responsive | Easy breakpoints: `md:flex lg:grid` |

**Tailwind v4 Changes:**

Tailwind v4 uses a CSS-first configuration:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;      /* Define custom colors */
  --font-sans: "Inter", system-ui; /* Define fonts */
}

/* Custom components */
.btn-primary {
  @apply px-4 py-2 bg-primary text-white rounded-lg;
}
```

---

### 5. React Router - Navigation

**What it does:** Enables client-side routing (navigating without page reloads).

**How routing works:**

```
URL: /dashboard
        │
        ▼
┌─────────────────┐
│  BrowserRouter  │  ← Listens to URL changes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Routes      │  ← Matches URL to component
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│  "/"  │ │"/dashboard"│
│ Home  │ │ Dashboard  │ ← Renders matched component
└───────┘ └───────────┘
```

**Our routing structure:**

```tsx
<Routes>
  <Route path="/" element={<Layout />}>     {/* Wraps all pages */}
    <Route index element={<HomePage />} />   {/* / */}
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="dashboard" element={
      <ProtectedRoute>                       {/* Auth guard */}
        <DashboardPage />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
  </Route>
</Routes>
```

---

### 6. Supabase - The Backend

**What it does:** Provides authentication, database, and storage as a service.

**Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│                      SUPABASE                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │     Auth     │  │   Database   │  │   Storage    │   │
│  │              │  │ (PostgreSQL) │  │   (Files)    │   │
│  │ - Sign up    │  │              │  │              │   │
│  │ - Sign in    │  │ - Tables     │  │ - Upload     │   │
│  │ - OAuth      │  │ - Relations  │  │ - Download   │   │
│  │ - Sessions   │  │ - RLS        │  │ - CDN        │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                 │                 │            │
│         └─────────────────┼─────────────────┘            │
│                           │                              │
│                    ┌──────┴──────┐                       │
│                    │   REST API   │                      │
│                    │  + Realtime  │                      │
│                    └──────┬──────┘                       │
└───────────────────────────┼──────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Your React  │
                    │     App      │
                    └──────────────┘
```

**Using Supabase in code:**

```typescript
// Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Database queries
const { data: users } = await supabase
  .from("users")
  .select("*")
  .eq("active", true)
  .order("created_at", { ascending: false });

// Realtime subscriptions
supabase
  .channel("messages")
  .on("INSERT", (payload) => {
    console.log("New message:", payload.new);
  })
  .subscribe();
```

---

### 7. TanStack Query - Data Fetching

**What it does:** Manages server state (data from APIs) with caching, refetching, and synchronization.

**Why not just use `useEffect` + `fetch`?**

```tsx
// ❌ Manual approach - lots of boilerplate, no caching
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  
  // Plus: no caching, no refetch, no retry, no deduplication...
}

// ✅ TanStack Query - handles everything
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then(res => res.json()),
  });
  
  // Automatically: cached, refetched, retried, deduplicated!
}
```

**How caching works:**

```
First Request:                    Second Request (within staleTime):
┌─────────┐    ┌─────────┐       ┌─────────┐    ┌─────────┐
│Component│───►│ Server  │       │Component│───►│  Cache  │ (instant!)
└─────────┘    └─────────┘       └─────────┘    └─────────┘
     │              │                  │
     │   network    │                  │ no network
     │   request    │                  │ request
     ▼              ▼                  ▼
   Data          Response            Cached Data
```

---

### 8. React Hook Form + Zod - Form Handling

**What they do:**
- **React Hook Form:** Manages form state with minimal re-renders
- **Zod:** Validates data with TypeScript-first schemas

**How they work together:**

```
User Input          Zod Schema           React Hook Form
    │                   │                      │
    ▼                   ▼                      ▼
┌─────────┐      ┌─────────────┐      ┌─────────────────┐
│  Form   │─────►│  Validate   │─────►│ Submit Handler  │
│  Field  │      │  (zodResolver)     │ (if valid)      │
└─────────┘      └─────────────┘      └─────────────────┘
    │                   │
    │              ┌────┴────┐
    │              ▼         ▼
    │           Valid?    Invalid?
    │              │         │
    │              ▼         ▼
    │           Submit    Show Errors
    │                        │
    └────────────────────────┘
```

**Example:**

```typescript
// 1. Define schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

// 2. Infer TypeScript type from schema (DRY!)
type LoginForm = z.infer<typeof loginSchema>;

// 3. Use in component
function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register("password")} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### 9. Vitest - Testing

**What it does:** Runs unit and integration tests with a Vite-native experience.

**Why Vitest over Jest?**

| Feature | Vitest | Jest |
|---------|--------|------|
| Vite config | Reuses | Separate |
| Speed | Faster | Slower |
| ESM support | Native | Complex |
| Watch mode | Instant | Rebuilds |

**Test structure:**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
  
  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();  // Mock function
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## How Everything Connects

### The Complete Request Flow

Here's what happens when a user logs in:

```
1. User clicks "Login"
         │
         ▼
2. React Hook Form validates input with Zod
         │
         ├── Invalid? Show error messages
         │
         └── Valid? Continue...
                  │
                  ▼
3. Call useAuth().signIn(email, password)
         │
         ▼
4. Supabase client sends request to Supabase Auth
         │
         ▼
5. Supabase validates credentials
         │
         ├── Invalid? Return error
         │
         └── Valid? Return session + user
                  │
                  ▼
6. AuthContext updates state (user, session)
         │
         ▼
7. React re-renders components using useAuth()
         │
         ▼
8. React Router redirects to /dashboard
         │
         ▼
9. Sonner shows "Successfully logged in" toast
```

### The Component Tree

```
<App>
├── <QueryClientProvider>          # TanStack Query context
│   ├── <BrowserRouter>            # React Router context
│   │   └── <AuthProvider>         # Our auth context
│   │       └── <Routes>
│   │           └── <Layout>       # Header, footer, demo banner
│   │               ├── <HomePage />
│   │               ├── <LoginPage />
│   │               ├── <RegisterPage />
│   │               ├── <ProtectedRoute>
│   │               │   └── <DashboardPage />
│   │               └── <NotFoundPage />
│   ├── <Toaster />                # Sonner toast container
│   └── <ReactQueryDevtools />     # Dev tools (dev only)
```

### State Management Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVER STATE (TanStack Query)    CLIENT STATE (React)      │
│  ┌─────────────────────────┐     ┌─────────────────────┐   │
│  │ • Database data         │     │ • Form inputs       │   │
│  │ • User profile          │     │ • UI toggles        │   │
│  │ • API responses         │     │ • Modal open/close  │   │
│  │                         │     │ • Local filters     │   │
│  │ Cached, refetched,      │     │                     │   │
│  │ synchronized            │     │ useState, useReducer│   │
│  └─────────────────────────┘     └─────────────────────┘   │
│                                                             │
│  GLOBAL STATE (React Context)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Auth state (user, session) - useAuth()            │   │
│  │ • Theme (if needed)                                  │   │
│  │ • Feature flags                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Architecture

### Folder Structure Explained

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Generic UI (Button, Input, Card)
│   │   └── Input.tsx    # Styled input with error handling
│   ├── Layout.tsx       # App shell (header, footer, outlet)
│   └── ProtectedRoute.tsx # Auth guard component
│
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication context & hook
│   └── useProfiles.ts   # TanStack Query hooks for profiles
│
├── lib/                 # Utilities and configurations
│   ├── supabase.ts      # Supabase client initialization
│   ├── queryClient.ts   # TanStack Query configuration
│   └── validations.ts   # Zod schemas for forms
│
├── pages/               # Route components (one per route)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
│
├── types/               # TypeScript type definitions
│   └── database.types.ts # Supabase-generated types
│
├── test/                # Test utilities
│   └── setup.ts         # Test environment setup
│
├── App.tsx              # Route definitions
├── main.tsx             # Application entry point
├── index.css            # Global styles + Tailwind
└── vite-env.d.ts        # Vite type declarations
```

### Why This Structure?

| Folder | Purpose | When to use |
|--------|---------|-------------|
| `components/` | Reusable across pages | Used in 2+ places |
| `pages/` | One component per route | Entry point for a URL |
| `hooks/` | Reusable stateful logic | Shared state/effects |
| `lib/` | Configuration, utilities | Non-React code |
| `types/` | TypeScript definitions | Shared types |

---

## Data Flow

### Authentication Flow

```
                    ┌─────────────────────┐
                    │   App Initializes   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ AuthProvider mounts │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ Demo Mode? │  │ Check      │  │ Subscribe  │
       │ No Supabase│  │ Session    │  │ to Auth    │
       │ credentials│  │ on mount   │  │ Changes    │
       └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
             │               │               │
             ▼               ▼               ▼
       ┌────────────────────────────────────────────┐
       │         AuthContext provides:              │
       │  • user (User | null)                      │
       │  • session (Session | null)                │
       │  • loading (boolean)                       │
       │  • isDemoMode (boolean)                    │
       │  • signIn, signUp, signOut functions       │
       └────────────────────────────────────────────┘
                               │
                               ▼
       ┌────────────────────────────────────────────┐
       │    Components use useAuth() hook           │
       │    to access auth state and actions        │
       └────────────────────────────────────────────┘
```

### Data Fetching Flow (with TanStack Query)

```
Component calls useQuery()
         │
         ▼
┌─────────────────────┐
│ Check cache         │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌────────────────┐
│ Fresh  │   │ Stale or Empty │
│ data   │   │                │
└────┬───┘   └───────┬────────┘
     │               │
     │               ▼
     │      ┌────────────────┐
     │      │ Return cached  │──► Show cached data
     │      │ + fetch new    │    immediately
     │      └───────┬────────┘
     │              │
     │              ▼
     │      ┌────────────────┐
     │      │ Fetch from     │
     │      │ Supabase       │
     │      └───────┬────────┘
     │              │
     │       ┌──────┴──────┐
     │       │             │
     │       ▼             ▼
     │   ┌────────┐   ┌────────┐
     │   │Success │   │ Error  │
     │   └───┬────┘   └───┬────┘
     │       │            │
     │       ▼            ▼
     │   Update        Retry or
     │   cache         show error
     │       │
     └───────┴────────────────┐
                              │
                              ▼
                    ┌─────────────────┐
                    │ Re-render with  │
                    │ latest data     │
                    └─────────────────┘
```

---

## Development Workflow

### Starting Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173/schredder/
```

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code for issues |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |

### Hot Module Replacement (HMR)

When you save a file, Vite updates only what changed:

```
Save Button.tsx
       │
       ▼
Vite detects change
       │
       ▼
Only Button component
is replaced in browser
       │
       ▼
App state preserved!
(no full page reload)
```

---

## Common Tasks

### Adding a New Page

1. Create the page component:

```tsx
// src/pages/AboutPage.tsx
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4 text-gray-600">...</p>
    </div>
  );
}
```

2. Add the route in `App.tsx`:

```tsx
import AboutPage from "@/pages/AboutPage";

// In the Routes...
<Route path="about" element={<AboutPage />} />
```

3. Add navigation link in `Layout.tsx` if needed.

### Adding a New API Hook

1. Create the hook file:

```tsx
// src/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => [...postKeys.all, id] as const,
};

export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: { title: string; content: string }) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
```

2. Use in a component:

```tsx
function PostList() {
  const { data: posts, isLoading, error } = usePosts();
  const createPost = useCreatePost();
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {posts?.map(post => <PostCard key={post.id} post={post} />)}
      <button onClick={() => createPost.mutate({ title: "New", content: "..." })}>
        Add Post
      </button>
    </div>
  );
}
```

### Adding Form Validation

1. Define schema in `lib/validations.ts`:

```typescript
export const postSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  content: z.string().min(10, "Min 10 characters"),
  published: z.boolean().default(false),
});

export type PostFormData = z.infer<typeof postSchema>;
```

2. Use in form component:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormData } from "@/lib/validations";

function PostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });
  
  const onSubmit = (data: PostFormData) => {
    console.log(data); // Fully typed and validated!
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Title" error={errors.title?.message} {...register("title")} />
      <textarea {...register("content")} />
      {errors.content && <span>{errors.content.message}</span>}
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Best Practices

### Code Organization

```
✅ DO                              ❌ DON'T
─────────────────────────────────────────────────────
Small, focused components         Giant 500+ line components
One component per file            Multiple exports per file
Colocate related code             Scatter across folders
Use absolute imports (@/)         Deep relative imports (../../..)
```

### TypeScript

```typescript
// ✅ DO: Use strict types
interface User {
  id: string;
  email: string;
}

// ❌ DON'T: Use `any`
const user: any = fetchUser();

// ✅ DO: Infer when possible
const count = useState(0);  // TypeScript infers number

// ❌ DON'T: Over-annotate
const count: number = useState<number>(0);  // Redundant
```

### React Patterns

```tsx
// ✅ DO: Extract custom hooks
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => { /* ... */ }, []);
  return size;
}

// ❌ DON'T: Duplicate logic in components

// ✅ DO: Use early returns
function UserCard({ user }) {
  if (!user) return null;
  return <div>{user.name}</div>;
}

// ❌ DON'T: Nested conditionals
function UserCard({ user }) {
  return (
    <div>
      {user ? <span>{user.name}</span> : null}
    </div>
  );
}
```

### Styling

```tsx
// ✅ DO: Use Tailwind utilities
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">

// ❌ DON'T: Inline styles
<button style={{ padding: "8px 16px", backgroundColor: "blue" }}>

// ✅ DO: Extract repeated patterns
// In index.css:
.btn-primary { @apply px-4 py-2 bg-blue-600 text-white rounded-lg; }

// In component:
<button className="btn-primary">
```

---

## Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Check if the file exists and path is correct
# Use @/ alias for src/ imports
import { useAuth } from "@/hooks/useAuth";  # ✅
import { useAuth } from "../../hooks/useAuth";  # Works but messy
```

#### TypeScript errors with Supabase

```typescript
// Generate types from your database
npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
```

#### Tailwind classes not working

```css
/* Make sure index.css has: */
@import "tailwindcss";

/* For custom classes, define outside @layer in Tailwind v4 */
.my-class {
  @apply px-4 py-2;  /* ✅ */
}
```

#### "Cannot read property of null" with Supabase

```typescript
// Check if in demo mode
if (isDemoMode) {
  // Handle demo case
  return mockData;
}

// Otherwise use supabase
const { data } = await supabase!.from("table").select();
```

### Debugging Tips

1. **React DevTools**: Install browser extension to inspect component tree and state
2. **TanStack Query DevTools**: Already included, click the flower icon in bottom-right
3. **Network tab**: Check API requests in browser DevTools
4. **Console logs**: Use `console.log` or debugger statements

```typescript
// Quick debugging
console.log({ user, loading, error });

// Better: Use debugger
debugger; // Execution pauses here in DevTools
```

---

## Further Reading

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
