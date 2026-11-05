#!/usr/bin/env node
/**
 * Margam Login Diagnostic & Reproduction Script (scripts/debug-login.mjs)
 *
 * Verifies the 5 stages of the authentication pipeline:
 *  1. identifier conversion (username -> canonical email or direct email)
 *  2. signInWithPassword (Supabase Auth)
 *  3. profile read (role & profile verification)
 *  4. POST /api/auth/login (HTTP status & response)
 *  5. session cookie received (margam_auth_token cookie)
 *
 * CRITICAL SAFETY RULES:
 * - Reads password from hidden prompt (no echo, not stored, not logged) or DEBUG_PASSWORD env.
 * - Prints ONLY pass/fail, email used, and non-sensitive status codes.
 * - NEVER prints or logs passwords, session tokens, service-role keys, or session payloads.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Read .env.local safely
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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const localPort = process.env.PORT || 3000;
const targetBaseUrl = process.env.TARGET_URL || process.env.VERCEL_URL || `http://localhost:${localPort}`;

async function getPasswordHidden() {
  if (process.env.DEBUG_PASSWORD) {
    return process.env.DEBUG_PASSWORD;
  }

  return new Promise((resolve) => {
    process.stdout.write("Enter password (input hidden): ");
    let input = "";
    const wasRaw = process.stdin.isRaw;
    if (process.stdin.setRawMode) process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const onData = (chunk) => {
      const str = chunk.toString("utf8");
      for (const ch of str) {
        if (ch === "\n" || ch === "\r" || ch === "\u0004") {
          if (process.stdin.setRawMode) process.stdin.setRawMode(wasRaw);
          process.stdin.pause();
          process.stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input);
          return;
        } else if (ch === "\u0003") {
          process.exit(1);
        } else if (ch === "\b" || ch === "\x7f") {
          if (input.length > 0) {
            input = input.slice(0, -1);
          }
        } else {
          input += ch;
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

export async function debugLogin(identifier, password) {
  console.log(`\n==================================================`);
  console.log(`  DEBUGGING LOGIN FOR: ${identifier}`);
  console.log(`==================================================`);

  const cleanId = identifier.trim().toLowerCase();
  const isEmail = cleanId.includes("@");
  const expectedRole = cleanId.includes("teacher") ? "teacher" : "student";

  // Step 1: identifier conversion
  let canonicalEmail = "";
  if (isEmail) {
    canonicalEmail = cleanId;
    console.log(`[PASS] Step 1 (identifier conversion): Email used: ${canonicalEmail}`);
  } else {
    canonicalEmail = `${cleanId}@student.margam.local`;
    console.log(`[PASS] Step 1 (identifier conversion): Converted username "${identifier}" -> "${canonicalEmail}"`);
  }

  // Step 2 & 3: signInWithPassword & profile read (Supabase direct)
  let authUser = null;
  let authClient = null;

  if (!supabaseUrl || !anonKey || supabaseUrl.includes("your-project") || anonKey.includes("your-anon")) {
    console.log(`[FAIL] Step 2 (signInWithPassword): Supabase URL/Anon Key not configured`);
    console.log(`[FAIL] Step 3 (profile read): Skipped (no Supabase connection)`);
  } else {
    try {
      authClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const res = await authClient.auth.signInWithPassword({
        email: canonicalEmail,
        password,
      });

      if (res.error || !res.data?.user) {
        console.log(`[FAIL] Step 2 (signInWithPassword): ${res.error?.message || "Sign-in failed"} (status: ${res.error?.status || 400})`);
      } else {
        authUser = res.data.user;
        console.log(`[PASS] Step 2 (signInWithPassword): Authenticated successfully via "${canonicalEmail}"`);
      }
    } catch (err) {
      console.log(`[FAIL] Step 2 (signInWithPassword): Exception: ${err.message}`);
    }

    if (authUser && authClient) {
      try {
        const { data: profile, error: profileErr } = await authClient
          .from("profiles")
          .select("role, username, is_demo")
          .eq("id", authUser.id)
          .single();

        if (profileErr || !profile) {
          console.log(`[FAIL] Step 3 (profile read): Profile query failed (status: ${profileErr?.code || 500})`);
        } else {
          const roleMatch = profile.role === expectedRole;
          if (roleMatch) {
            console.log(`[PASS] Step 3 (profile read): Profile verified (role="${profile.role}", is_demo=${profile.is_demo})`);
          } else {
            console.log(`[FAIL] Step 3 (profile read): Role mismatch (profile role="${profile.role}", expected "${expectedRole}")`);
          }
        }
      } catch (err) {
        console.log(`[FAIL] Step 3 (profile read): Exception: ${err.message}`);
      }
    } else {
      console.log(`[FAIL] Step 3 (profile read): Skipped due to failed sign-in in Step 2`);
    }
  }

  // Step 4: POST /api/auth/login
  let routeResponse = null;
  let responseCookies = [];
  try {
    const postBody = {
      identifier: identifier.trim(),
      password,
      expectedRole,
    };

    const res = await fetch(`${targetBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    });

    const status = res.status;
    let json = {};
    try {
      json = await res.json();
    } catch {
      json = { error: "Non-JSON response" };
    }

    if (res.headers.getSetCookie) {
      responseCookies = res.headers.getSetCookie();
    } else {
      const singleCookie = res.headers.get("set-cookie");
      if (singleCookie) responseCookies = [singleCookie];
    }

    if (res.ok) {
      console.log(`[PASS] Step 4 (POST /api/auth/login): HTTP ${status} OK`);
      routeResponse = json;
    } else {
      console.log(`[FAIL] Step 4 (POST /api/auth/login): HTTP ${status} — Error: "${json.error || "Unknown error"}"`);
    }
  } catch (err) {
    console.log(`[FAIL] Step 4 (POST /api/auth/login): Connection error to ${targetBaseUrl}: ${err.message}`);
  }

  // Step 5: session cookie received
  if (routeResponse) {
    const hasAuthToken = responseCookies.some((c) => c.includes("margam_auth_token="));
    if (hasAuthToken) {
      console.log(`[PASS] Step 5 (session cookie received): margam_auth_token cookie received successfully`);
    } else {
      console.log(`[FAIL] Step 5 (session cookie received): margam_auth_token cookie missing in response`);
    }
  } else {
    console.log(`[FAIL] Step 5 (session cookie received): Skipped due to failed Step 4`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const identifierArg = args[0];

  console.log("==================================================");
  console.log("  MARGAM — LOGIN PIPELINE DIAGNOSTIC UTILITY       ");
  console.log("==================================================");

  let identifiers = [];
  if (identifierArg) {
    identifiers = [identifierArg];
  } else {
    identifiers = [
      "demo_riya",
      "demo_riya@student.margam.local",
      "demo.teacher@margam.example",
    ];
  }

  const password = await getPasswordHidden();
  if (!password) {
    console.error("Password cannot be empty.");
    process.exit(1);
  }

  for (const id of identifiers) {
    await debugLogin(id, password);
  }
}

if (process.argv[1] && process.argv[1].endsWith("debug-login.mjs")) {
  main().catch((err) => {
    console.error("Diagnostic execution error:", err);
    process.exit(1);
  });
}
