import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Checks whether Supabase is configured with active, non-placeholder credentials.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  if (url.includes("your-project") || key.includes("your-publishable-key")) return false;
  return true;
}

/**
 * Returns a type-safe browser client instance for anonymous authentication and read operations.
 * Gracefully returns null if credentials are unconfigured or placeholder, ensuring zero build breaks.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
