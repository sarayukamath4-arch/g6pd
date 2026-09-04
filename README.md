# GeneGuide (G6PD Deficiency Reference & Reaction Journal)

A privacy-first web app for people with G6PD deficiency to learn about the condition, search substances against clinically reviewed evidence, scan product labels for ingredients, and log personal reactions to surface observational patterns.

See `app/learn/docs/PRD.md` and `app/learn/docs/UIUX_Spec.md` for the full product spec.

## Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + Row-Level Security)
- Groq API (vision model for label OCR)
- `@react-pdf/renderer` for the doctor report export

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project, then run the migrations in `supabase/migrations/` **in order** (001 → 006) against it — either via the Supabase SQL editor or the Supabase CLI (`supabase db push`).
3. Copy `.env.local.example` to `.env.local` and fill in the values (see below).
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Environment variables

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys |

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel (framework preset: Next.js — auto-detected).
2. Set the three environment variables above in the Vercel project (Production, Preview, and Development as needed) — either manually in Project Settings → Environment Variables, or via the Supabase Vercel integration (which injects `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` automatically once connected). Either way, `GROQ_API_KEY` still needs to be added manually since it has no integration.
3. In Supabase, add your Vercel deployment URL (and any preview URLs you use) to **Authentication → URL Configuration → Redirect URLs**, e.g. `https://your-app.vercel.app/auth/callback`.
4. If you enable Google OAuth, configure it under Supabase **Authentication → Providers → Google** and add the same redirect URL there.
5. Deploy. `vercel.json` already points to `npm run build`.

## Known gaps / not yet implemented

- **Label photo storage**: `journal_entries.label_image_url` exists in the schema, but scanned images are never uploaded to Supabase Storage — only the extracted text/ingredients are saved. Wiring this up would mean creating a storage bucket + RLS policies and uploading the compressed image from `app/scanner/page.tsx` after a successful scan.
- **PIN lock** (Profile → Security) is intentionally disabled with a "coming in a future update" notice.
- **Offline queueing** (IndexedDB) described in the UI/UX spec for journal submissions is not implemented; the app currently requires connectivity to save entries.
- Deleting an account removes the user's `profiles`/`journal_entries`/`user_learning_progress` rows but cannot delete the underlying `auth.users` record from the client (that requires a service-role key on a server route) — the account remains in Supabase Auth after "deletion."
