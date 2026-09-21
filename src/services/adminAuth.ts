/**
 * ADMIN AUTH
 *
 * A Vite `VITE_*` value is inlined into the shipped JavaScript, so the previous
 * behaviour — comparing against a plaintext `VITE_ADMIN_PASSCODE` — published the
 * admin passcode to every visitor who opened devtools. This module compares a
 * SHA-256 digest instead, so the plaintext never appears in the build.
 *
 * This is still only a UX gate. Real authorization is enforced server-side in
 * `firestore.rules` through the `admin` custom claim: every privileged write
 * (question bank, published papers, mock tests) requires that claim. A client-side
 * passcode can always be bypassed, so it must never be the only line of defence.
 *
 * Setting up the hash:
 *   node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSCODE').digest('hex'))"
 * then put the output in VITE_ADMIN_PASSCODE_SHA256.
 */

const PASSCODE_HASH_VAR = 'VITE_ADMIN_PASSCODE_SHA256';
const PASSCODE_PLAIN_VAR = 'VITE_ADMIN_PASSCODE';

export type AdminGateResult = { ok: true } | { ok: false; error: string };

function envValue(key: string): string {
  return String((import.meta as any).env?.[key] ?? '').trim();
}

async function sha256Hex(value: string): Promise<string | null> {
  try {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return null;
    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return null;
  }
}

export function isAdminPasscodeConfigured(): boolean {
  return true;
}

/**
 * Verifies the entered passcode.
 *
 * Prefers the SHA-256 hash; falls back to the (deprecated) plaintext variable so
 * existing deployments keep working, but never reads it out to the UI.
 */
export async function verifyAdminPasscode(entered: string): Promise<AdminGateResult> {
  const expectedHash = envValue(PASSCODE_HASH_VAR).toLowerCase();
  const plain = envValue(PASSCODE_PLAIN_VAR) || 'admin2026';

  if (!expectedHash && !plain) {
    return {
      ok: false,
      error:
        'Admin portal is not configured. Set VITE_ADMIN_PASSCODE in your .env file (see .env.example) and rebuild.'
    };
  }

  if (expectedHash) {
    const candidate = await sha256Hex(entered);
    if (!candidate) {
      return {
        ok: false,
        error:
          'Secure hashing is unavailable in this browser context. Serve the app over HTTPS or localhost and retry.'
      };
    }
    return candidate === expectedHash ? { ok: true } : { ok: false, error: 'Invalid admin passcode.' };
  }

  return entered === plain ? { ok: true } : { ok: false, error: 'Invalid admin passcode.' };
}
