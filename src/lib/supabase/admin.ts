import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  isAdminConfigured,
  getSupabaseServiceKey,
  getSupabaseUrl,
} from "@/lib/env";

export { isAdminConfigured, getSupabaseServiceKey };

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class {} as any;
}

let adminClient: SupabaseClient | null = null;

/**
 * Privileged, strictly server-only Supabase admin client for trusted operations.
 * Bypasses RLS to record server-graded progression, scores, and account provisioning.
 *
 * CRITICAL SAFETY:
 * - Marked with "server-only" so any accidental client-side import fails at build time.
 * - Never expose SUPABASE_SERVICE_ROLE_KEY to the browser or prefix with NEXT_PUBLIC_.
 * - Gracefully returns null when credentials are unconfigured or placeholder.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isAdminConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[Margam Admin Error] Supabase Admin credentials are missing or placeholder in production. Checked: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, SUPABASE_SERVICE_KEY."
      );
    }
    return null;
  }

  if (adminClient) return adminClient;

  const url = getSupabaseUrl()!;
  const secretKey = getSupabaseServiceKey()!;

  adminClient = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
