# Margin

Margin is a source-first research workspace for students, researchers, labs, and universities. It helps people move from scattered papers to traceable evidence, visual research maps, and structured briefs without hiding where claims came from.

The repository contains both the public SaaS website and the authenticated research workspace.

## Features

### Research workspace

- Clerk authentication and protected workspace access
- User-scoped projects and onboarding
- PDF importing and browser-persistent PDF storage
- In-app PDF reading
- Passage capture from uploaded PDFs
- Evidence, research gap, theory, and method classification
- Source-specific annotations and provenance
- Searchable source library
- Reading status and source metadata management
- Interactive research map
- Evidence-linked brief generation
- Markdown export and print-ready briefs
- Keyboard command menu with `Cmd/Ctrl + K`
- Responsive desktop and mobile layouts

### Public website

- Product and feature pages
- Student, researcher, team, and university solutions
- Pricing
- Company thesis
- Authentication-aware navigation
- Privacy, security, and terms pages

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [Clerk](https://clerk.com/) for authentication and account management
- [Lucide](https://lucide.dev/) for interface icons
- PostgreSQL schema prepared for Neon
- IndexedDB and local storage for the current browser-persistent workspace
- Turbopack for development and production builds

## Requirements

- Node.js 20.9 or newer
- npm
- A Clerk application

For production persistence and collaboration, a PostgreSQL database such as Neon is also required.

## Getting started

Install dependencies:

```bash
npm install
```

Create `.env.local` or `.env` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/workspace
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/workspace
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Always use `npm run dev` rather than calling `next dev` directly. The script isolates development output in `.next-dev`, preventing development and production manifests from overwriting one another.

## Available commands

```bash
npm run dev
```

Starts the Turbopack development server using `.next-dev`.

```bash
npm run build
```

Removes stale production output and creates an optimized production build.

```bash
npm run start
```

Runs the previously generated production build.

```bash
npm run clean
npm run clean:dev
```

Remove generated production or development output.

## Authentication

Clerk is configured in:

- [`app/layout.jsx`](./app/layout.jsx)
- [`proxy.js`](./proxy.js)
- [`app/login/[[...login]]/page.jsx`](./app/login/[[...login]]/page.jsx)
- [`app/signup/[[...signup]]/page.jsx`](./app/signup/[[...signup]]/page.jsx)
- [`app/workspace/page.jsx`](./app/workspace/page.jsx)

`proxy.js` attaches Clerk authentication state to workspace and API requests. Authorization is enforced directly in protected server resources. The workspace page retrieves the current Clerk user and redirects unauthenticated visitors to `/login`.

Never expose `CLERK_SECRET_KEY` to client-side code or commit environment files.

## Current persistence model

The application currently provides a complete single-browser research workflow:

- Project, source, evidence, and brief metadata are stored in local storage.
- Uploaded PDF files are stored in IndexedDB.
- Storage keys are namespaced by Clerk user ID.

This makes the application useful locally and keeps different accounts isolated in the same browser. It does not provide cross-device synchronization or real multi-user collaboration.

## Production database

The PostgreSQL model is defined in:

```text
database/schema.sql
```

It includes:

- Workspaces and memberships
- Projects and project roles
- Sources and tags
- Evidence notes
- Research-map relationships
- Research briefs
- Usage events
- Expiring project invitations
- Hashed share tokens
- Permission-aware shared links
- Revocation timestamps

Recommended production configuration:

```env
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
```

Use a pooled Neon connection for application traffic and the direct connection for migrations.

Project sharing should remain unavailable until this server-backed persistence layer is connected. A browser-local `/workspace` link is not a secure collaboration mechanism.

## PDF workflow

1. Open a project.
2. Go to **Library**.
3. Select **Add source**.
4. Choose or drop a PDF and complete its metadata.
5. Open the saved source.
6. Select and copy a passage in the embedded PDF reader.
7. Choose **Capture copied text**.
8. Classify the passage as Evidence, Gap, Theory, or Method.
9. Save it to the project evidence board.

PDF files remain within the browser until production object storage is connected.

## Project structure

```text
app/
├── [slug]/                    Marketing and legal routes
├── _components/              Shared authentication components
├── login/                    Clerk sign-in route
├── signup/                   Clerk sign-up route
├── workspace/
│   ├── page.jsx              Protected server entry point
│   └── workspace-client.jsx  Research workspace application
├── globals.css               Public site and workspace styling
├── layout.jsx                Root layout and Clerk provider
└── page.jsx                  Public landing page

database/
└── schema.sql                PostgreSQL production schema

public/
└── favicon.svg

proxy.js                      Clerk request integration
next.config.mjs               Next.js and build-output configuration
```

## Security

- Authentication uses Clerk sessions.
- Protected resources perform server-side user checks.
- Private research content is scoped by Clerk user ID in the current client store.
- Production sharing is designed around hashed tokens, expiration, permission levels, and revocation.
- Environment files are excluded from Git.
- The dependency tree currently reports zero known npm vulnerabilities.

Run a fresh audit with:

```bash
npm audit
```

Avoid `npm audit fix --force`; major-version changes should be reviewed and tested explicitly.

## Production roadmap

Before accepting paying customers:

1. Connect Neon and replace browser-local metadata persistence.
2. Add object storage for PDFs.
3. Add server-side PDF text extraction and indexing.
4. Implement database-backed sharing and invitations.
5. Add billing webhooks and usage enforcement.
6. Add transactional email.
7. Add observability, error reporting, backups, and retention controls.
8. Add automated unit, integration, and end-to-end tests.

## License

Proprietary. All rights reserved.
