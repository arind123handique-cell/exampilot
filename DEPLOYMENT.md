# ExamPilot — Deployment Guide

## Vercel Environment Variables (REQUIRED)

The deployed site needs Firebase credentials to enable login. Add these in the Vercel dashboard:

**Dashboard URL**: `https://vercel.com/dashboard` → Select `exampilot-eight` → **Settings** → **Environment Variables**

Add all variables from `.env` in the **Production** environment:

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCzyyUIqIYcIcApKe2813aCPRW2RdXF6u4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `exampilot-6836c.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `exampilot-6836c` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `exampilot-6836c.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `818400419174` |
| `VITE_FIREBASE_APP_ID` | `1:818400419174:web:7efac6e633785d26cfbca7` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-TF4YQG85N6` |
| `VITE_AI_PROVIDER` | `auto` |
| `VITE_OLLAMA_BASE_URL` | `http://127.0.0.1:11434` |
| `VITE_OLLAMA_MODEL` | `qwen2.5-coder:7b` |
| `VITE_GEMINI_API_KEY` | *(leave empty)* |
| `VITE_ADMIN_PASSCODE` | `ExamPilot@Admin2026!` |

> **Security note**: These secrets are in `.env` locally but should NOT be in git. They're stored as Vercel project env vars.

## Alternative: Vercel CLI

```bash
npx vercel env add VITE_FIREBASE_API_KEY production
npx vercel env add VITE_FIREBASE_AUTH_DOMAIN production
# ... repeat for all vars
```

## Quick Fix (if dashboard is inaccessible)

Add env vars directly in `vercel.json` as values (NOT recommended — exposes secrets in git):
```json
"env": { "VITE_FIREBASE_API_KEY": "AIzaSy...", ... }
```

Then commit & push `vercel.json`.

## After Adding Env Vars

1. **Redeploy**: `git push` triggers a new Vercel build automatically
2. **Verify**: Check `https://exampilot-eight.vercel.app` — login should work
3. **Check**: Firebase Auth domain must be whitelisted in Firebase Console → Authentication → Sign-in method → enable Email/Password and Anonymous

## Local Development

```bash
cp .env.example .env
# Fill in .env with your Firebase credentials
npm run dev
```

## Firebase Auth Checklist

- [ ] Firebase Console → Authentication → Sign-in method → Email/Password: **Enabled**
- [ ] Firebase Console → Authentication → Sign-in method → Anonymous: **Enabled**
- [ ] Firebase Console → Authentication → Settings → Authorized domains: `exampilot-eight.vercel.app` added
