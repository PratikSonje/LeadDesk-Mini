# Architecture & Tech Stack

## Tech Stack Decisions
- **Framework**: Next.js (App Router) for SSR, Routing, and integrated API logic.
- **Language**: TypeScript (Strict Mode) for type safety.
- **Styling**: Tailwind CSS + shadcn/ui for accessible, consistent, token-driven design.
- **Database**: PostgreSQL (e.g., Supabase, Neon) for relational data integrity.
- **ORM**: Prisma (or Drizzle) for typed queries and schema migrations.
- **Authentication**: Auth.js (NextAuth) for secure session management and RBAC.
- **Validation**: Zod (Shared between client forms and server actions).
- **Hosting**: Vercel (Frontend & Serverless logic).

## System Components

1. **Client Layer (Browser)**
   - Renders React server components and client components.
   - Handles optimistic UI updates, form state, and client-side Zod validation.

2. **Server Layer (Next.js Node/Edge)**
   - **Middleware**: Intercepts requests to enforce Auth and RBAC on `/admin` routes.
   - **Server Actions**: Processes form submissions, validates payloads (Zod), and executes DB queries securely.
   - **Authentication**: Manages session cookies and credentials via Auth.js.

3. **Data Layer (PostgreSQL)**
   - Enforces relational constraints and timestamps.

## Data Model (ERD Concept)

### `User` (Admin)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password_hash`: String
- `role`: Enum ('ADMIN')
- `created_at`: DateTime
- `updated_at`: DateTime

### `Lead`
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String
- `budget`: String
- `message`: Text
- `status`: Enum ('NEW', 'CONTACTED', 'CLOSED') (Default: 'NEW')
- `created_at`: DateTime
- `updated_at`: DateTime

## Authorization Flow
1. User attempts to access `/admin`.
2. Next.js Middleware checks for valid `httpOnly` session cookie.
3. If valid and role == 'ADMIN', allow access. Otherwise, redirect to `/login`.
4. API mutations (e.g., updating lead status) re-verify session token inside the server action before executing DB queries.
