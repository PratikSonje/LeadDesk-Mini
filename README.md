# Visionary LeadDesk Mini

A full-stack, Next.js-powered digital experience agency landing page and secure admin portal. Built to capture inbound leads and securely manage them.

## The Data Model

The application uses **Prisma ORM** connected to a **Prisma Postgres** cloud database. The core schema revolves around two models:

### 1. `User` (The Admin)
- Stores the administrator's credentials.
- Uses `bcrypt` to encrypt the `password_hash` to ensure high security.
- Contains a `role` field (defaulting to `ADMIN`) which is strictly validated by the server before allowing access to the admin dashboard.

### 2. `Lead` (The Inbound Prospects)
- Captures the incoming data from the public `LeadCaptureForm`.
- **Fields**: `name`, `email`, `budget`, `message`.
- **Status Tracking**: Uses a `Status` enum (`NEW`, `CONTACTED`, `CLOSED`) to track where the prospect is in the pipeline.
- **Soft Deletion**: Instead of permanently deleting records (`DELETE`), we use a `deleted_at` timestamp. This allows for historical auditing while filtering "deleted" leads out of the active admin view.

## The Auth Approach

The application utilizes **NextAuth.js (Auth.js v5)** for robust, enterprise-grade authentication.

1. **Credentials Provider**: The app uses the `Credentials` provider. When a user attempts to log in via `/login`, the server action fetches the user by email from the database and uses `bcrypt.compare` to verify the provided password against the stored `password_hash`.
2. **Rate Limiting**: The login endpoint is protected by an IP-based rate limiter to prevent brute-force and credential stuffing attacks.
3. **Session Management**: Auth.js handles the secure creation and encryption of a JWT session cookie (`strategy: "jwt"`). The user's `role` is baked into this token.
4. **Route Protection**: The `/admin/layout.tsx` file intercepts all requests to the admin area. It calls `await auth()` on the server side; if the session is invalid, missing, or the user is not an `ADMIN`, they are immediately forcefully redirected back to the `/login` page. No sensitive data is ever leaked to the client.

## Tech Stack
- **Framework**: Next.js (App Router, Server Actions)
- **Database**: Prisma Postgres
- **Styling**: Tailwind CSS & Framer Motion
- **Validation**: Zod & React Hook Form
- **Auth**: Auth.js (NextAuth)
