# ExamPilot — Deployment Guide

## Current Behavior: Offline-First with Firebase Enhancement

The app **works fully without any Firebase configuration**. When `VITE_FIREBASE_*` env vars are not set (e.g., on Vercel without dashboard config), `isFirebaseConfigured` returns `false` and the app automatically switches to **Offline Mode**:

- Email/password sign-in creates a local session (saved to `localStorage`)
- Google sign-in falls back to guest mode
- Guest sign-in works as always
- Progress, scores, and study history are all persisted locally

To enable Firebase Auth (cloud sync, multi-device, admin features), add env vars as described below.

## Vercel Environment Variables (OPTIONAL — for Firebase Auth)

The deployed site works without these, but adding them enables cloud sync. Add these in the Vercel dashboard:

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

> **Security note**: These secrets are in `.env` locally but should NOT be in git. They're stored as Vercel project env vars. Note: Vite inlines `VITE_*` variables at **build time**, so they must be added to Vercel env vars BEFORE the build runs — they cannot be added to `vercel.json`'s `env` field.

## Why `vercel.json` `env` Field Doesn't Work

Vite replaces `import.meta.env.VITE_*` at **build time** during `npm run build`. Vercel's `vercel.json` `env` field only provides runtime env vars (after build). So setting Firebase keys in `vercel.json` has no effect — the build output already has `isFirebaseConfigured = false` baked in.

**Solution**: Add env vars in Vercel dashboard → Settings → Environment Variables, or use `CONFIG_FIREBASE_*` private env vars.

## After Adding Env Vars

1. **Redeploy**: `git push` triggers a new Vercel build automatically
2. **Verify**: Check `https://exampilot-eight.vercel.app` — Firebase Auth enabled
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
