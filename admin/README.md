# ExamPilot Admin Content Studio

Standalone Admin Portal for ExamPilot, decoupled from the student application for high security, zero bloat, and independent domain hosting.

## Architecture

- **Entry Point**: `admin/index.html` & `admin/src/main.tsx`
- **Application**: `admin/src/App.tsx`
- **Vite Config**: `admin/vite.config.ts`
- **Cloudflare Config**: `admin/wrangler.jsonc`
- **Build Output**: `dist-admin/`
- **Dev Port**: `3001` (`http://localhost:3001`)

## Capabilities

1. **PDF OCR & Paper Creator**: Extract 100-question exam papers from official scanned PDFs using Gemini Flash Vision.
2. **AI Topic Ingestion Studio**: Deep-dive syllabus topic parsing, numerical recipe synthesis, and question authoring.
3. **Question Bank Database Manager**: Search, filter, inspect provenance, and curate live MCQ repository.
4. **Published Papers & CBT Mock Tests**: Real-time Firestore & LocalStorage mock test publisher.
5. **Sub-heads & MCQs Section Editor**: Customize sections, scoring matrices, and question allocations.
6. **Telemetry & Scores Ledger**: Comprehensive student enrollment, exam attempts, score inspection, and cohort performance.

## Commands

```bash
# Run Admin Portal locally on port 3001
npm run dev:admin

# Build Admin Portal to dist-admin/
npm run build:admin

# Preview built Admin Portal
npm run preview:admin
```

## Cloudflare Pages Setup

- **Project Name**: `exampilot-admin`
- **Build Command**: `npm run build:admin`
- **Build Output Directory**: `dist-admin`
- **Custom Domain**: `admin.exampilot.ai` (or your chosen admin subdomain)
- **Environment Variables**:
  - `VITE_STUDENT_URL`: `https://exampilot.ai`
  - `VITE_ADMIN_PASSCODE`: `ExamPilot@Admin2026!`
  - Plus `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from `.env`
