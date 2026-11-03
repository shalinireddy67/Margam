import { isSupabaseConfigured, isAdminConfigured, getSupabaseUrl, getSupabaseAnonKey, getSupabaseServiceKey } from "../src/lib/env.ts";

console.log("==================================================");
console.log("  MARGAM — Supabase Connection & Health Diagnostic");
console.log("==================================================\n");

const url = getSupabaseUrl();
const anonKey = getSupabaseAnonKey();
const serviceKey = getSupabaseServiceKey();

const isConfigured = isSupabaseConfigured();
const isAdmin = isAdminConfigured();

console.log("1. Environment Variables Check:");
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${url ? "Configured (" + url + ")" : "MISSING"}`);
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? "Configured" : "MISSING"}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? "Configured" : "MISSING"}`);
console.log(`  Public Client Ready: ${isConfigured ? "YES" : "NO"}`);
console.log(`  Admin Client Ready: ${isAdmin ? "YES" : "NO"}`);

if (!isConfigured) {
  console.log("\n[STATUS: UNCONFIGURED]");
  console.log("Supabase credentials are not yet configured in .env.local.");
  console.log("To connect to a live Supabase project:");
  console.log("1. In your Supabase Dashboard (https://supabase.com/dashboard):");
  console.log("   - Create or select a project.");
  console.log("   - Go to Project Settings -> API.");
  console.log("   - Copy 'Project URL', 'anon public' key, and 'service_role' key.");
  console.log("2. Create a '.env.local' file in the project root with:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=\"https://your-project-id.supabase.co\"");
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=\"your-anon-key\"");
  console.log("   SUPABASE_SERVICE_ROLE_KEY=\"your-service-role-key\"");
  console.log("   SESSION_SECRET=\"your-high-entropy-random-secret-key\"");
  console.log("3. In Supabase Dashboard -> SQL Editor, run:");
  console.log("   supabase/consolidated_production_setup.sql");
  process.exit(0);
}

console.log("\n2. Testing Connection to Live Supabase Project...");
try {
  const healthRes = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: anonKey }
  });
  console.log(`  Auth Service Ping: HTTP ${healthRes.status} (${healthRes.statusText})`);
  if (healthRes.ok) {
    console.log("  ✅ Supabase Auth service reachable!");
  } else {
    console.warn("  ⚠️ Supabase Auth returned non-200 status.");
  }
} catch (err) {
  console.error("  ❌ Network connection to Supabase URL failed:", err.message);
}
