# Portfolio (Next.js + Postgres)

One-page portfolio whose content lives in Postgres and is edited from a private
`/admin` page. Only the current content is stored: saving overwrites, deleting
removes the row. No drafts, history or trash.

- Next.js 16 App Router, TypeScript, server components, Cache Components
- Postgres (Neon / Vercel Postgres) via plain parameterized SQL (`postgres`)
- Zod-validated server actions, `updateTag("portfolio")` after every save
- Single-owner login (email + scrypt password hash), JWT in an httpOnly cookie, DB-backed rate limit (5 tries / 15 min per IP)
- Photo uploads validated by type, magic bytes and size (4 MB) and stored in Vercel Blob; only the URL is saved
- Plain CSS, strictly black/white/grey, light/dark via `prefers-color-scheme` + toggle

## Database

`db/schema.sql` creates:

| table | purpose |
| --- | --- |
| `profile` | exactly one row (`CHECK (id = 1)`): name, role, headline, bio, email, photo_url, social_links (jsonb) |
| `projects` | id, title, description, tech `text[]`, link, image_url, position (unique), visible |
| `skills` | id, group_name, name, position (unique) |
| `login_attempts` | rate-limit counters for `/admin/login` (one row per hashed IP) |

## Environment variables

| name | required | value |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string (Neon pooled URL is fine) |
| `ADMIN_EMAIL` | yes | the email you log in with |
| `ADMIN_PASSWORD_HASH` | yes | output of `npm run hash-password -- "your password"` |
| `SESSION_SECRET` | yes | random string, 32+ chars: `openssl rand -base64 48` |
| `BLOB_READ_WRITE_TOKEN` | prod | added automatically when you connect a Vercel Blob store |
| `NEXT_PUBLIC_SITE_URL` | recommended | e.g. `https://your-domain.com` (used for metadata, sitemap, robots) |

Copy `.env.example` to `.env.local` for local development. Never commit it.

## Local setup

Requires Node 20.9+ and a Postgres database.

```bash
cd site
npm install
cp .env.example .env.local   # fill in the values
npm run hash-password -- "a long password"   # paste into ADMIN_PASSWORD_HASH
npm run db:migrate           # creates tables (safe to re-run)
npm run db:seed              # inserts content once (safe to re-run, never overwrites)
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin. Without
`BLOB_READ_WRITE_TOKEN`, uploads go to `public/uploads/` in development only.

Edit the content at the top of `scripts/seed.mjs` before the first seed;
afterwards edit everything from `/admin`.

## Deploying to Vercel

1. Import this repository in Vercel and set **Root Directory** to `site`.
2. Storage tab: add a **Neon** (Postgres) database and a **Blob** store and connect both to the project. This sets `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`.
3. Settings → Environment Variables: add `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`.
4. Create the tables and seed once from your machine (`vercel env pull .env.local` then `npm run db:migrate && npm run db:seed`).
5. Deploy. The build reads the database, so migrate before the first deploy.

The home page is prerendered and cached; every admin save calls
`updateTag("portfolio")` so the next request shows the new content.

## Scripts

| script | |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run db:migrate` | apply `db/schema.sql` |
| `npm run db:seed` | insert initial content once |
| `npm run hash-password -- "pw"` | create `ADMIN_PASSWORD_HASH` |
