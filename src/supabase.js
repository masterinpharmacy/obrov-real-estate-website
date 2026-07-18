import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes("placeholder") &&
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.endsWith(".supabase.co");

// Exporteer null als Supabase niet geconfigureerd is
// zodat componenten geen netwerk-requests proberen
export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: (...args) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        return fetch(args[0], { ...args[1], signal: controller.signal });
      }}
    })
  : null;

export const supabaseConfigured = isConfigured;
