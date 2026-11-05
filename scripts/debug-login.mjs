#!/usr/bin/env node
/**
 * Margam Login Diagnostic & Reproduction Script (scripts/debug-login.mjs)
 *
 * Verifies the 5 stages of the authentication pipeline:
 *  a. Username-to-email conversion result
 *  b. Supabase Auth signInWithPassword (with anon key)
 *  c. Profiles table read (role, username, consent_confirmed)
 *  d. POST /api/auth/login (HTTP status & error message only)
 *  e. Session cookie & signed margam_auth_token headers
 *
 * CRITICAL SAFETY RULES:
 * - Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local
 * - Reads password from hidden prompt (no echo, not stored, not logged) or DEBUG_PASSWORD env
 * - NEVER prints or logs passwords, session tokens, service-role keys, or session payloads
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";

// 1. Read .env.local safely
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
const localBaseUrl = `http://localhost:${localPort}`;

// Canonical username to email conversion from src/lib/server/auth-helpers.ts
const INTERNAL_STUDENT_DOMAIN = "student.internal.margam.local";
function generateStudentEmail(username) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${clean}@${INTERNAL_STUDENT_DOMAIN}`;
}

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
          // Ctrl+C
          process.exit(1);
        } else if (ch === "\b" || ch === "\x7f") {
          // Backspace
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

  const isEmail = identifier.includes("@");
  const expectedRole = isEmail ? "teacher" : "student";

  // Stage a: Username-to-email conversion result
  let targetEmail = "";
  if (isEmail) {
    targetEmail = identifier.trim().toLowerCase();
    console.log(`[PASS] Stage a (email conversion): Direct email identifier used: ${targetEmail}`);
  } else {
    targetEmail = generateStudentEmail(identifier);
    console.log(`[PASS] Stage a (email conversion): Converted "${identifier}" -> "${targetEmail}"`);
  }

  // Check Supabase credentials
  if (!supabaseUrl || !anonKey || supabaseUrl.includes("your-project") || anonKey.includes("your-anon")) {
    console.log(`[FAIL] Stage b (supabase auth): NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set or placeholder in .env.local`);
    console.log(`[FAIL] Stage c (profile read): Skipped (no Supabase connection)`);
  } else {
    // Stage b: Supabase Auth signInWithPassword with anon key
    let authUser = null;
    let authClient = null;
    try {
      authClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const candidateEmails = isEmail
        ? [targetEmail]
        : [targetEmail, `${identifier.trim().toLowerCase()}@student.margam.local`];

      let signInData = null;
      let signInErr = null;
      let resolvedEmail = targetEmail;

      for (const email of candidateEmails) {
        const res = await authClient.auth.signInWithPassword({
          email,
          password,
        });
        if (res.data?.user && !res.error) {
          signInData = res.data;
          signInErr = null;
          resolvedEmail = email;
          break;
        }
        signInErr = res.error;
      }

      if (signInErr || !signInData?.user) {
        console.log(`[FAIL] Stage b (supabase auth): ${signInErr?.message || "User sign-in failed"} (status: ${signInErr?.status || 400})`);
      } else {
        authUser = signInData.user;
        console.log(`[PASS] Stage b (supabase auth): Supabase Auth authenticated successfully via "${resolvedEmail}" (User ID: ${authUser.id})`);
      }
    } catch (err) {
      console.log(`[FAIL] Stage b (supabase auth): Network or client exception: ${err.message}`);
    }

    // Stage c: Profiles read using returned session
    if (authUser && authClient) {
      try {
        const { data: profile, error: profileErr } = await authClient
          .from("profiles")
          .select("role, username, consent_confirmed")
          .eq("id", authUser.id)
          .single();

        if (profileErr || !profile) {
          console.log(`[FAIL] Stage c (profile read): Profile query failed: ${profileErr?.message || "Profile row not found"}`);
        } else {
          const roleMatch = profile.role === expectedRole;
          const userMatch = isEmail || profile.username?.toLowerCase() === identifier.trim().toLowerCase();
          if (roleMatch && userMatch) {
            console.log(`[PASS] Stage c (profile read): Profile verified. role="${profile.role}", username="${profile.username}", consent_confirmed=${profile.consent_confirmed}`);
          } else {
            console.log(`[FAIL] Stage c (profile read): Role or username mismatch. Profile role="${profile.role}" (expected "${expectedRole}"), username="${profile.username}"`);
          }
        }
      } catch (err) {
        console.log(`[FAIL] Stage c (profile read): Exception reading profile: ${err.message}`);
      }
    } else {
      console.log(`[FAIL] Stage c (profile read): Skipped due to failed auth in Stage b`);
    }
  }

  // Stage d: POST /api/auth/login
  let routeResponse = null;
  let responseCookies = [];
  try {
    const postBody = {
      identifier: identifier.trim(),
      password,
      expectedRole,
    };

    const res = await fetch(`${localBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    });

    const status = res.status;
    let json = {};
    try {
      json = await res.json();
    } catch {
      json = { error: "Non-JSON response received" };
    }

    // Read set-cookie headers
    if (res.headers.getSetCookie) {
      responseCookies = res.headers.getSetCookie();
    } else {
      const singleCookie = res.headers.get("set-cookie");
      if (singleCookie) responseCookies = [singleCookie];
    }

    if (res.ok) {
      console.log(`[PASS] Stage d (POST /api/auth/login): HTTP ${status} OK (success=true, role=${json.role || expectedRole})`);
      routeResponse = json;
    } else {
      console.log(`[FAIL] Stage d (POST /api/auth/login): HTTP ${status} — Error: "${json.error || "Unknown error"}"`);
    }
  } catch (err) {
    console.log(`[FAIL] Stage d (POST /api/auth/login): Could not connect to local server at ${localBaseUrl}. Is "npm run dev" running? (${err.message})`);
  }

  // Stage e: Cookies set check
  if (routeResponse) {
    const hasAuthToken = responseCookies.some((c) => c.includes("margam_auth_token="));
    const hasSbCookie = responseCookies.some((c) => c.includes("-auth-token="));
    if (hasAuthToken && hasSbCookie) {
      console.log(`[PASS] Stage e (cookie verification): Both signed margam_auth_token and Supabase SSR session cookie set`);
    } else if (hasAuthToken) {
      console.log(`[PASS] Stage e (cookie verification): Signed margam_auth_token set (Mock/Offline mode)`);
    } else {
      console.log(`[FAIL] Stage e (cookie verification): Required auth session cookies were not present in response headers`);
    }
  } else {
    console.log(`[FAIL] Stage e (cookie verification): Skipped due to failed route response in Stage d`);
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
    identifiers = ["demo_riya", "demo.teacher@margam.example"];
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
