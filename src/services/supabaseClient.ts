import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables safely for both Vite frontend and SSR/Node tooling
const resolveEnv = (key: string, fallback: string = ''): string => {
  try {
    return String((import.meta as any).env?.[key] ?? fallback).trim();
  } catch {
    return fallback;
  }
};

export const SUPABASE_URL = resolveEnv('VITE_SUPABASE_URL', '');
export const SUPABASE_ANON_KEY = resolveEnv('VITE_SUPABASE_ANON_KEY', '');

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon-key')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('[ExamPilot] Supabase client initialization warning:', err);
  }
}

export const supabase = client;
