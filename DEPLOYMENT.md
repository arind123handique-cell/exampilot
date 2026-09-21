# ExamPilot — Deployment & Domain Architecture Guide

ExamPilot is partitioned into two independent applications for optimal security, fast load times, and clean boundary separation:
1. **Student Portal** — Lightweight, high-performance CBT exam engine and review portal (served on the primary domain e.g. `exampilot.ai`).
2. **Admin Studio** — Dedicated directory (`admin/`) and separate domain (e.g. `admin.exampilot.ai`) for OCR ingestion, AI question generation, paper publishing, and student telemetry.

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
   - Add all Firebase keys from `.env` (listed below)
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
   - `VITE_ADMIN_PASSCODE`: `ExamPilot@Admin2026!`
   - Add all Firebase keys from `.env`
5. Save and Deploy.
6. Under **Custom domains**, connect your subdomain: `admin.exampilot.ai`.

---

## 3. Environment Variables Reference

| Variable | Required For | Description |
|---|---|---|
| `VITE_ADMIN_URL` | Student App | URL to separate admin domain (e.g. `https://admin.exampilot.ai`) |
| `VITE_STUDENT_URL` | Admin App | URL to student portal domain (e.g. `https://exampilot.ai`) |
| `VITE_ADMIN_PASSCODE` | Admin App | Passcode for Admin access gate |
| `VITE_FIREBASE_API_KEY` | Both | `AIzaSyCzyyUIqIYcIcApKe2813aCPRW2RdXF6u4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Both | `exampilot-6836c.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Both | `exampilot-6836c` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Both | `exampilot-6836c.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Both | `818400419174` |
| `VITE_FIREBASE_APP_ID` | Both | `1:818400419174:web:7efac6e633785d26cfbca7` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Both | `G-TF4YQG85N6` |
| `VITE_GEMINI_API_KEY` | Admin (Optional) | Can also be configured dynamically in the Admin UI |

---

## 4. Local Development

```bash
# Run student app (Port 3000)
npm run dev

# Run admin studio concurrently (Port 3001)
npm run dev:admin

# Build both applications
npm run build:all
```

## 5. Firebase Auth Authorized Domains

In **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**, add:
- `localhost`
- `exampilot.ai` (student domain)
- `admin.exampilot.ai` (admin domain)
- `*.pages.dev` (Cloudflare Pages preview deployments)
