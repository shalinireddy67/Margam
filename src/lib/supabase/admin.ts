import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/**
 * Checks whether Supabase admin credentials are configured with active, non-placeholder secrets.
 */
export function isAdminConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return false;
  if (url.includes("your-project") || secretKey.includes("your-server-secret-key")) return false;
  return true;
}

/**
 * Privileged, strictly server-only Supabase admin client for trusted operations.
 * Bypasses RLS to record server-graded progression, scores, and unlock states.
 *
 * CRITICAL SAFETY:
 * - Marked with "server-only" so any accidental client-side import fails at build time.
 * - Never expose SUPABASE_SECRET_KEY to the browser or prefix with NEXT_PUBLIC_.
 * - Gracefully returns null when credentials are unconfigured or placeholder.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isAdminConfigured()) {
    return null;
  }

  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const secretKey = process.env.SUPABASE_SECRET_KEY!;

  adminClient = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
