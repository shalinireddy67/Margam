import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

/**
 * Returns a type-safe Supabase server client that reads and updates session cookies.
 * Safe for use in Next.js Server Components, Server Actions, and Route Handlers.
 * Gracefully returns null when credentials are unconfigured or placeholder.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const cookieStore = cookies();

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Can be safely ignored if called from a Server Component
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Can be safely ignored if called from a Server Component
        }
      },
    },
  });
}
