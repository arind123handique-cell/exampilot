/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase project connection (Auth + Postgres) — read by src/services/supabaseClient.ts
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
