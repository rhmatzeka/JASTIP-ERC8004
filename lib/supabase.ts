import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;

  return createClient(
    process.env.SUPABASE_URL as string,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string,
    {
      auth: {
        persistSession: false
      }
    }
  );
}
