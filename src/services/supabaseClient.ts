import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables safely for both Vite frontend and SSR/Node tooling
const resolveEnv = (key: string, fallback: string = ''): string => {
  try {
    return String((import.meta as any).env?.[key] ?? fallback).trim();
  } catch {
    return fallback;
  }
};

export const SUPABASE_URL = resolveEnv(
  'VITE_SUPABASE_URL',
  'https://beahwfkpgplnccrszjvl.supabase.co'
);
export const SUPABASE_ANON_KEY = resolveEnv(
  'VITE_SUPABASE_ANON_KEY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYWh3ZmtwZ3BsbmNjcnN6anZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzA5MTIsImV4cCI6MjA5NDEwNjkxMn0.LPgaJ86nTuDxPEV4nmD6-9ElnNTlpoQCmyAtq8_v_YM'
);

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
