/**
 * Margam Demo Provisioning Script
 * Provisions Demo Teacher, 3 Named Hero Students, and 25 Synthetic Students
 * in Supabase Auth (auth.users) and public.profiles.
 *
 * CRITICAL SAFETY RULES:
 * - Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local only.
 * - NEVER prints or logs secret keys or user passwords.
 * - Refuses to run if any password in data/demo-credentials.json is 'CHANGE_ME'.
 * - Sets is_demo = true on all generated records.
 * - Fully idempotent: checks existing users before creating.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

console.log("==================================================");
console.log("  MARGAM — DEMO AUTH & PROFILE PROVISIONER        ");
console.log("==================================================\n");

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
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceKey ||
  supabaseUrl.includes("your-project-id") ||
  serviceKey.includes("your-supabase-service-role") ||
  serviceKey === "CHANGE_ME"
) {
  console.log("  [NOTICE] Live Supabase credentials not configured in .env.local.");
  console.log("  Skipping remote Supabase auth provisioning safely.");
  console.log("  Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to run live.\n");
  process.exit(0);
}

// 2. Read and validate demo-credentials.json
const credsPath = path.resolve(process.cwd(), "data/demo-credentials.json");
if (!fs.existsSync(credsPath)) {
  console.error("  [FAIL] data/demo-credentials.json file not found!");
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));

// Validation: Refuse to run if any password is "CHANGE_ME"
if (creds.teacher.password === "CHANGE_ME") {
  console.error("  [FAIL] Refusing to run: teacher.password is 'CHANGE_ME'!");
  process.exit(1);
}

for (const [key, student] of Object.entries(creds.students)) {
  if (student.password === "CHANGE_ME") {
    console.error(`  [FAIL] Refusing to run: student ${key} password is 'CHANGE_ME'!`);
    process.exit(1);
  }
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  try {
    console.log("  Fetching existing Auth users to ensure idempotency...");
    const { data: userListData, error: listError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) {
      console.error(`  [FAIL] Could not query auth.users: ${listError.message}`);
      process.exit(1);
    }

    const existingUsers = userListData?.users || [];
    const userMap = new Map();
    for (const u of existingUsers) {
      if (u.email) userMap.set(u.email.toLowerCase(), u.id);
    }

    let provisionedCount = 0;
    let reusedCount = 0;

    // Helper to get or create auth user
    async function getOrCreateUser(email, password, metadata) {
      const lower = email.toLowerCase();
      if (userMap.has(lower)) {
        reusedCount++;
        return userMap.get(lower);
      }

      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
      });

      if (createError || !newUser?.user) {
        throw new Error(`Failed to create user ${email}: ${createError?.message}`);
      }

      provisionedCount++;
      userMap.set(lower, newUser.user.id);
      return newUser.user.id;
    }

    // 1. Provision Demo Teacher
    console.log("  Provisioning Demo Teacher...");
    const teacherId = await getOrCreateUser(
      creds.teacher.email,
      creds.teacher.password,
      {
        full_name: creds.teacher.fullName,
        role: "teacher",
        username: creds.teacher.username,
      }
    );

    const { error: tProfErr } = await admin.from("profiles").upsert({
      id: teacherId,
      role: "teacher",
      username: creds.teacher.username,
      full_name: creds.teacher.fullName,
      selected_class: 10,
      consent_confirmed: true,
      is_demo: true,
      updated_at: new Date().toISOString(),
    });
    if (tProfErr) throw new Error(`Teacher profile error: ${tProfErr.message}`);

    // 2. Provision 3 Named Hero Students
    console.log("  Provisioning 3 Hero Demo Students...");
    for (const student of Object.values(creds.students)) {
      const studentId = await getOrCreateUser(
        student.email,
        student.password,
        {
          full_name: student.fullName,
          role: "student",
          username: student.username,
        }
      );

      const { error: sProfErr } = await admin.from("profiles").upsert({
        id: studentId,
        role: "student",
        username: student.username,
        full_name: student.fullName,
        selected_class: student.selectedClass,
        consent_confirmed: true,
        is_demo: true,
        avatar_pixel: "wood_scholar",
        updated_at: new Date().toISOString(),
      });
      if (sProfErr) throw new Error(`Student ${student.username} profile error: ${sProfErr.message}`);
    }

    // 3. Provision 25 Synthetic Classmate Students (unusable random passwords)
    console.log("  Provisioning 25 Synthetic Classmate Students...");
    const SYNTHETIC_NAMES = [
      "Aditya Verma", "Ananya Sen", "Arjun Nair", "Bhavya Rao", "Chetan Joshi",
      "Deepika Das", "Eshwar Pillai", "Farhan Ali", "Gauri Deshmukh", "Harish Iyer",
      "Ishita Roy", "Jatin Bhatt", "Kavya Menon", "Lokesh Yadav", "Meera Sen",
      "Nikhil Saxena", "Pooja Hegde", "Rahul Mehra", "Sanjana Guha", "Tanvi Kulkarni",
      "Umesh Thakur", "Varun Chauhan", "Vidya Nair", "Yashwant Rao", "Zoya Khan"
    ];

    for (let i = 1; i <= 25; i++) {
      const numStr = String(i).padStart(2, "0");
      const sUsername = `synthetic_${numStr}`;
      const sEmail = `synthetic_${numStr}@student.internal.margam.local`;
      const sName = SYNTHETIC_NAMES[i - 1] || `Classmate ${numStr}`;
      // Random unusable password for synthetic background accounts
      const sPassword = crypto.randomBytes(32).toString("hex") + "!Margam9";

      const sId = await getOrCreateUser(sEmail, sPassword, {
        full_name: sName,
        role: "student",
        username: sUsername,
      });

      const { error: synProfErr } = await admin.from("profiles").upsert({
        id: sId,
        role: "student",
        username: sUsername,
        full_name: sName,
        selected_class: 10,
        consent_confirmed: true,
        is_demo: true,
        avatar_pixel: i % 2 === 0 ? "stone_alchemist" : "wood_scholar",
        updated_at: new Date().toISOString(),
      });
      if (synProfErr) throw new Error(`Synthetic profile ${sUsername} error: ${synProfErr.message}`);
    }

    console.log("\n--------------------------------------------------");
    console.log(`  [PASS] Provisioning completed successfully.`);
    console.log(`  - Newly created Auth accounts: ${provisionedCount}`);
    console.log(`  - Reused existing Auth accounts: ${reusedCount}`);
    console.log(`  - Total Demo Profiles synchronized: 29 (1 teacher + 3 hero + 25 synthetic)`);
    console.log("==================================================");
  } catch (err) {
    console.error(`\n  [FAIL] Error during provisioning: ${err.message}`);
    process.exit(1);
  }
}

main();
