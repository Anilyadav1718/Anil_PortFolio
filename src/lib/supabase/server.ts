import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  (supabaseAnonKey || supabaseServiceKey)
);

// Server-side admin Supabase instance (uses service role key if available, else anon key)
let serverAdminClient: any = null;

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;
  if (!serverAdminClient) {
    serverAdminClient = createClient<any>(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return serverAdminClient;
}

export const supabaseAdmin: any = isSupabaseConfigured ? getSupabaseServerClient() : null;
