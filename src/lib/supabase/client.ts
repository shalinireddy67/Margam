import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "@/lib/env";

export { isSupabaseConfigured, getSupabaseAnonKey };

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class {} as any;
}

let browserClient: SupabaseClient | null = null;

/**
 * Returns a type-safe browser client instance for authentication and read operations.
 * Gracefully returns null if credentials are unconfigured or placeholder.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      console.error(
        "[Margam Client] Supabase is not configured. Public credentials (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing or placeholder."
      );
    }
    return null;
  }

  if (browserClient) return browserClient;

  const url = getSupabaseUrl()!;
  const key = getSupabaseAnonKey()!;

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
