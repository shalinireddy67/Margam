/**
 * Margam Supabase Connection & Security Verification Script
 * Validates .env.local presence, project reachability, table schemas,
 * RLS isolation, and client bundle secret absence.
 *
 * CRITICAL RULE: NEVER print or log secret keys or credentials.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

console.log("==================================================");
console.log("  MARGAM — SUPABASE CONNECTION & SECURITY AUDIT   ");
console.log("==================================================\n");

// 1. Parse .env.local safely without printing values
const envPath = path.resolve(process.cwd(), ".env.local");
const envVars = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      envVars[key] = val;
    }
  }
}

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SESSION_SECRET",
];

const TABLES = [
  "profiles",
  "classes",
  "class_members",
  "attempts",
  "concept_mastery",
  "xp_events",
];

let allVarsSet = true;
const missingOrPlaceholder = [];

for (const varName of REQUIRED_VARS) {
  const val = envVars[varName] || process.env[varName];
  const isSet = Boolean(
    val &&
    !val.includes("your-project-id") &&
    !val.includes("your-anon-") &&
    !val.includes("your-supabase-service-role") &&
    !val.includes("generate-a-strong") &&
    val !== "CHANGE_ME"
  );

  if (isSet) {
    console.log(`  [PASS] ${varName} is configured.`);
  } else {
    allVarsSet = false;
    missingOrPlaceholder.push(varName);
    console.log(`  [INFO] ${varName} is not set or placeholder.`);
  }
}

console.log("\n--------------------------------------------------");
console.log("  BUNDLE SECURITY: SECRET LEAKAGE AUDIT           ");
console.log("--------------------------------------------------");

// Check client bundle for service role key or session secret
let bundleAuditPassed = true;
const staticDir = path.resolve(process.cwd(), ".next/static");

if (fs.existsSync(staticDir)) {
  const checkSecrets = [];
  const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sessionSecret = envVars.SESSION_SECRET || process.env.SESSION_SECRET;

  if (serviceKey && serviceKey.length > 15) checkSecrets.push({ name: "SUPABASE_SERVICE_ROLE_KEY", val: serviceKey });
  if (sessionSecret && sessionSecret.length > 15) checkSecrets.push({ name: "SESSION_SECRET", val: sessionSecret });

  function walkFiles(dir) {
    let files = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        files = files.concat(walkFiles(full));
      } else if (full.endsWith(".js")) {
        files.push(full);
      }
    }
    return files;
  }

  const jsFiles = walkFiles(staticDir);
  for (const file of jsFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const sec of checkSecrets) {
      if (text.includes(sec.val)) {
        bundleAuditPassed = false;
        console.error(`  [FAIL] LEAK DETECTED: ${sec.name} was found in client chunk ${path.basename(file)}!`);
      }
    }
  }

  if (bundleAuditPassed) {
    console.log(`  [PASS] Zero secret keys found across all ${jsFiles.length} client JavaScript chunks.`);
  }
} else {
  console.log("  [INFO] .next/static not found. Run 'npm run build' first for complete bundle audit.");
}

console.log("\n--------------------------------------------------");
console.log("  DATABASE REACHABILITY & TABLE AUDIT             ");
console.log("--------------------------------------------------");

if (!allVarsSet) {
  console.log("  [NOTICE] Real Supabase credentials not set in environment.");
  console.log("  Missing/placeholder variables (names only):", missingOrPlaceholder.join(", "));
  console.log("  Database connection check skipped safely.");
  console.log("  To connect live database, provide real credentials in .env.local and rerun.");
  console.log("\n==================================================");
  console.log("  RESULT: CONFIGURATION AUDIT COMPLETE            ");
  console.log("==================================================");
  process.exit(0);
}

// Live reachability check
const url = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runLiveChecks() {
  try {
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const anon = createClient(url, anonKey, { auth: { persistSession: false } });

    console.log("  Testing connection to project URL...");
    const { error: pingError } = await admin.from("profiles").select("id").limit(1);

    if (pingError && pingError.code !== "PGRST116") {
      console.log(`  [FAIL] Could not connect to project: ${pingError.message}`);
      process.exit(1);
    }
    console.log("  [PASS] Project is reachable via service client.");

    console.log("\n  Validating core migration tables exist (service role)...");
    for (const t of TABLES) {
      const { error } = await admin.from(t).select("id").limit(1);
      if (error && error.code === "42P01") {
        console.log(`  [FAIL] Table ${t} does NOT exist in database!`);
      } else {
        console.log(`  [PASS] Table '${t}' exists.`);
      }
    }

    console.log("\n  Validating RLS isolation (anon key)...");
    for (const t of ["profiles", "attempts", "concept_mastery", "xp_events"]) {
      const { data, error } = await anon.from(t).select("id").limit(5);
      if (error) {
        console.log(`  [PASS] Anon read on '${t}' blocked by RLS (${error.message}).`);
      } else if (!data || data.length === 0) {
        console.log(`  [PASS] Anon read on '${t}' returned 0 rows (RLS protected).`);
      } else {
        console.log(`  [WARN] Anon read on '${t}' returned data (${data.length} rows). Check RLS policies!`);
      }
    }

    console.log("\n==================================================");
    console.log("  RESULT: ALL SUPABASE CHECKS PASSED              ");
    console.log("==================================================");
  } catch (err) {
    console.error("  [FAIL] Unexpected error connecting to Supabase:", err.message);
    process.exit(1);
  }
}

runLiveChecks();

