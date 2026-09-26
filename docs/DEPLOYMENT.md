# Deployment & admin access

Auth and persistence now run on **Supabase** (Auth + Postgres). Firebase has been removed
from the codebase. Three things must be done **outside this repository** for the model to
hold — they require dashboard access the codebase does not contain.

## 1. Apply the SQL migrations

Open Supabase → SQL Editor (project `beahwfkpgplnccrszjvl`) and run, in order:

1. `supabase/migrations/20260921_init_questions.sql`
2. `supabase/migrations/20260921_init_papers.sql`
3. `supabase/migrations/20260926_auth_and_docs.sql` ← **required for sign-in**

Step 3 creates:

- `public.profiles` — one row per student (created automatically on first sign-in), with
  owner-only write policies;
- `public.app_docs` — the document store behind test drafts, test submissions, syllabi,
  learned modules and custom questions.

Until it is applied, sign-in fails with a PostgREST error and the app falls back to its
LocalStorage cache.

## 2. Configure Auth providers & redirects

Supabase → Authentication:

- **Sign-in method → Email**: enabled (default). With *Confirm email* on, new sign-ups
  receive a confirmation link and the UI tells the candidate to check their inbox; disable
  it if you want instant sign-up.
- **Sign-in method → Google**: enable and paste an OAuth client ID + secret from Google
  Cloud Console (Credentials → OAuth 2.0 Client IDs → Web application). Add the Supabase
  callback URL shown in the provider dialog to the Google client's *Authorised redirect
  URIs*.
- **URL Configuration**:
  - *Site URL* → your production origin (e.g. `https://exampilot.pages.dev`) or
    `http://localhost:3000` for local dev.
  - *Redirect URLs* → add every origin the app runs on (`http://localhost:3000`,
    the Cloudflare domain, any custom domain). Google OAuth returns and password-reset
    links land here; a URL that is not allow-listed fails silently after Google.

## 3. Verify sign-in & publishing end to end

1. Open the student portal → sign up with email + password (or Google).
2. Supabase → Table Editor → `profiles`: a row for the new user should exist.
3. Open `/admin`, unlock with the passcode, publish a paper.
4. Table Editor → `published_papers`, `custom_mock_tests`, `questions`: rows should exist.
   If they do not, RLS rejected the write — check the browser console for a
   `[ExamPilot] Supabase … sync notice`.
5. Sign in from a second browser/profile and confirm the published paper is listed.
   (Cross-tab sync uses `BroadcastChannel`; cross-device needs the Supabase read.)

## Cloudflare — build-time environment variables

Cloudflare Workers is the only deployment target. `wrangler.jsonc` serves the built
`dist/` as static assets with SPA fallback, so `npm run build` is the whole build
step.

`.env` is git-ignored, so the build never sees your keys — and Vite inlines `VITE_*` at
**build** time, so they must be present when the build runs.

Cloudflare Dashboard → Workers & Pages → your project → Settings → Variables and
Secrets, set for **Production** (and **Preview** if you use branch builds):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |

Then **redeploy**. Adding a variable does not change an existing build.

These are the two `VITE_*` values only. `VITE_ADMIN_PASSCODE_SHA256` belongs to the
separate admin build, not this one.

(Sandbox/local dev: set the same two keys in the workspace *Keys/API keys* tab. The
client also ships a hardcoded fallback for the `exampilot` project so local demos work
without env vars, but production builds should always set them explicitly.)

### Symptom → cause

| Symptom | Cause |
|---|---|
| Success toast, but still on the login screen | "Confirm email" is on and the link was not confirmed (UI shows a "Check your inbox" hint) |
| `Invalid login credentials` | Wrong credentials, or the account predates the migration (see below) |
| Login screen shows "Supabase configuration is missing" | `VITE_SUPABASE_*` env vars missing from the build |
| Google button returns to a blank/failed page | Redirect URL not in Supabase → URL Configuration, or OAuth callback not added in Google Cloud |
| Sign-in error `provider not enabled` | Provider disabled in Supabase → Authentication → Sign-in method |
| PostgrestError `relation "public.profiles" does not exist` | Migration `20260926_auth_and_docs.sql` not applied yet |

### Accounts created before the migration

Firebase Auth accounts do **not** carry over: passwords are hashed differently and cannot
be exported. Existing students must sign up again with the same email (Supabase will treat
it as a new account). Their old profile/progress rows remain in Firestore and can be
ignored or exported separately.

## What is still NOT secured

- The Admin Studio passcode is a **local UX gate only** (SHA-256 digest, but a determined
  user can still set `sessionStorage['exampilot_admin_session'] = 'true'`). Content tables
  (`questions`, `published_papers`, `custom_mock_tests`) and the `app_docs` read path keep
  the pre-existing open RLS posture — the anon key ships in the bundle, so anyone can read
  (and, for content tables, write) data. The `20260926` migration at least makes
  `profiles` and user-owned documents **owner-writable only**. Tightening reads needs a
  server-side component (service-role key never shipped to the browser) — flagged as a
  critical finding in the September 2026 audit.
- Admin-side "delete student" only removes the student locally: `profiles` delete is
  owner-only under RLS, so the cloud row survives until the student deletes it themselves.
- AI provider calls (`geminiService`, `ollamaService`) run from the browser with a
  user-supplied or env key. Move these behind a server proxy before any paid launch.
