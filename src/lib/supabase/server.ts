import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "@/lib/env";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class {} as any;
}

/**
 * Returns a type-safe Supabase server client that reads and updates session cookies.
 * Safe for use in Next.js Server Components, Server Actions, and Route Handlers.
 * Gracefully returns null when credentials are unconfigured or placeholder.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[Margam Server Error] Supabase Server client requested but public credentials (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in production."
      );
    }
    return null;
  }

  const url = getSupabaseUrl()!;
  const key = getSupabaseAnonKey()!;
  const cookieStore = cookies() as any;

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

/**
 * Creates a Supabase server client specifically bound to a Route Handler's NextRequest and NextResponse,
 * ensuring all session and token refresh cookies are written directly to the outgoing response.
 */
export function createSupabaseRouteClient(
  req: NextRequest,
  res: NextResponse
): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[Margam Route Error] Supabase Route client requested but credentials are missing in production."
      );
    }
    return null;
  }

  const url = getSupabaseUrl()!;
  const key = getSupabaseAnonKey()!;

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });
}
