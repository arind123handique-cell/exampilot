# ExamPilot — Deployment & Domain Architecture Guide

ExamPilot is partitioned into two independent applications for optimal security, fast load times, and clean boundary separation:
1. **Student Portal** — Lightweight, high-performance CBT exam engine and review portal (served on the primary domain e.g. `exampilot.ai`).
2. **Admin Studio** — Dedicated directory (`admin/`) and separate domain (e.g. `admin.exampilot.ai`) for OCR ingestion, AI question generation, paper publishing, and student telemetry.

**Cloudflare is the only deployment target.** Vercel, Netlify and Firebase configuration has been
removed; `wrangler.jsonc` and the Cloudflare Pages steps below are what remain.

For SQL migrations, Auth provider setup and the known security gaps, see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 1. Domain Configuration

| Portal | Local Dev | Cloudflare Pages Project | Build Command | Output Dir | Production Domain |
|---|---|---|---|---|---|
| **Student Portal** | `http://localhost:3000` | `exampilot` | `npm run build` | `dist` | `exampilot.ai` |
| **Admin Studio** | `http://localhost:3001` | `exampilot-admin` | `npm run build:admin` | `dist-admin` | `admin.exampilot.ai` |

Cross-domain linking and routing are managed via `src/config/domainConfig.ts`:
- Visiting `/admin` on the student domain redirects automatically to `getAdminDomainUrl()`.
- Header & login "Admin Portal" buttons point to `getAdminDomainUrl()`.
- Returning from Admin Studio links to `getStudentDomainUrl()`.

---

## 2. Cloudflare Pages Deployment (Step-by-Step)

### A. Deploy Student Portal (`exampilot.ai`)
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository: `EXAMPILOT`.
3. Set build settings:
   - **Framework preset**: `None` / `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
4. Add Environment Variables:
   - `VITE_ADMIN_URL`: `https://admin.exampilot.ai`
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see section 3)
5. Save and Deploy.
6. Under **Custom domains**, connect your primary domain: `exampilot.ai`.

### B. Deploy Admin Studio (`admin.exampilot.ai`)
1. In **Cloudflare Dashboard**, create a second Pages application connected to the same repository `EXAMPILOT`.
2. Name it: `exampilot-admin`.
3. Set build settings:
   - **Framework preset**: `None` / `Vite`
   - **Build command**: `npm run build:admin`
   - **Build output directory**: `dist-admin`
   - **Root directory**: `/` (or `admin`)
4. Add Environment Variables:
   - `VITE_STUDENT_URL`: `https://exampilot.ai`
   - `VITE_ADMIN_PASSCODE_SHA256`: the digest described in section 3
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Save and Deploy.
6. Under **Custom domains**, connect your subdomain: `admin.exampilot.ai`.

Vite inlines `VITE_*` at **build** time, so adding a variable does not change an existing
build. Redeploy after any change.

---

## 3. Environment Variables Reference

| Variable | Required For | Description |
|---|---|---|
| `VITE_ADMIN_URL` | Student App | URL to separate admin domain (e.g. `https://admin.exampilot.ai`) |
| `VITE_STUDENT_URL` | Admin App | URL to student portal domain (e.g. `https://exampilot.ai`) |
| `VITE_SUPABASE_URL` | Both | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Both | Supabase → Project Settings → API → anon public key |
| `VITE_ADMIN_PASSCODE_SHA256` | Admin App | SHA-256 digest of the admin passcode (see below) |
| `VITE_GEMINI_API_KEY` | Optional | Fallback AI key; students can also supply their own from Profile → AI Settings |

**Never commit a passcode.** `VITE_ADMIN_PASSCODE` (plaintext) is inlined into the shipped
bundle, which is how a previous version leaked one. Use the hash:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSCODE').digest('hex'))"
```

If `VITE_ADMIN_PASSCODE_SHA256` is unset the admin portal stays locked and says so — there is
no default passcode.

---

## 4. Local Development

```bash
# Run student app (Port 3000)
npm run dev

# Run admin studio concurrently (Port 3001)
npm run dev:admin

# Build both applications
npm run build:all

# Run the test suites
npm test
```

---

## 5. Authorized origins

Supabase → **Authentication → URL Configuration**:

- **Site URL** → the production origin, or `http://localhost:3000` for local dev.
- **Redirect URLs** → every origin the app runs on: `http://localhost:3000`, the Cloudflare
  domain, and any custom domain. Google OAuth returns and password-reset links land here, and a
  URL that is not allow-listed **fails silently** after Google.
