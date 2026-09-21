# Deployment & admin access

Two things must be done **outside this repository** for the security model to hold. They
require credentials the codebase does not (and must not) contain, so they cannot be run by
the coding agent — run them yourself with the Firebase CLI logged in.

Prerequisite: `firebase login` and `firebase use --add` (select the `exampilot-*` project).

## 1. Deploy the Firestore rules

`firebase.json` points at `firestore.rules`.

```bash
firebase deploy --only firestore:rules
```

Why it matters: before this, `questions`, `published_papers` and `custom_mock_tests` were
writable by **any** signed-in user. Because the app auto-creates an anonymous session, that
was effectively open write access to every answer key. The rules now require the `admin`
custom claim for those writes.

## 2. Grant the admin custom claim

Publishing content is now gated server-side. Identify the UID that should be allowed to
publish (visible in the Admin Studio roster, or Firebase Console → Authentication), then set
the claim. With the Admin SDK, in a trusted server context:

```js
// one-off script, run with a service account — never in the browser
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
await admin.auth().setCustomUserClaims('<UID>', { admin: true });
```

The user must then **sign out and back in** (or force-refresh their ID token) for the claim to
appear. The Admin Studio shows a banner while the claim is missing, so you can tell whether it
took effect.

## 3. Verify publishing end to end

1. Sign in to the student portal, then open `/admin`.
2. Confirm the amber "no `admin` claim" banner is **gone**. If it is still there, the claim was
   not applied to this token.
3. Publish a paper (PDF OCR → publish, or AI Studio).
4. Check Firestore Console → `published_papers`, `custom_mock_tests`, `questions`. The
   documents should exist. If they do not, the rules rejected the write — check the browser
   console for a `permission-denied` from the `[ExamPilot] Firestore … sync notice` log.
5. Open the student portal in a second browser/profile and confirm the published paper is
   listed. (Cross-tab sync uses `BroadcastChannel`; cross-device needs the Firestore read,
   which the new rules allow for any signed-in user.)

## Static hosting (optional)

`firebase.json` also configures Hosting with an SPA rewrite to `dist/index.html`:

```bash
npm run build
firebase deploy --only hosting
```

## What is still NOT secured

- The Admin Studio passcode is a **local UX gate only**. It is compared as a SHA-256 digest so
  the plaintext no longer ships in the bundle, but a determined user can still set
  `sessionStorage['exampilot_admin_session'] = 'true'`. That is acceptable *because* the real
  boundary is the Firestore rules above — the passcode must never be the only defence.
- AI provider calls (`geminiService`, `ollamaService`) run from the browser with a
  user-supplied or env key. Move these behind a server proxy before any paid launch.
