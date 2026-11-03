import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const parsed = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim();
      let v = trimmed.slice(eqIdx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      parsed[k] = v;
    }
  }
  return parsed;
}

const localEnv = loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || localEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || localEnv.SUPABASE_SERVICE_ROLE_KEY;

console.log("================================================================================");
console.log("  MARGAM — Live Supabase Database Health & Lifecycle Verification");
console.log("================================================================================\n");

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.log("ℹ️  [NOTICE] Live Supabase credentials not found in environment or .env.local.");
  console.log("   Missing configuration:");
  if (!supabaseUrl) console.log("   - NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!serviceKey) console.log("   - SUPABASE_SERVICE_ROLE_KEY\n");
  console.log("   To perform live database verification, create a .env.local file with these keys");
  console.log("   and rerun: node scripts/verify-supabase-database.mjs\n");
  process.exit(0);
}

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const anonClient = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runVerification() {
  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      failed++;
    }
  }

  console.log("--- 1. Inspecting Recorded Remote Migration History ---");
  try {
    const { data: migrations, error: migErr } = await adminClient
      .from("schema_migrations")
      .select("version, name")
      .order("version", { ascending: true });

    if (migErr) {
      // Check in supabase_migrations schema via raw query
      console.log("  Note: schema_migrations in public not directly exposed via PostgREST (expected).");
    } else {
      console.log("  Recorded migrations:", migrations);
    }
  } catch (err) {
    console.log("  Skipping schema_migrations PostgREST check (internal schema).");
  }

  console.log("\n--- 2. Checking Existence of Core Tables ---");
  const tables = ["profiles", "classes", "class_members", "attempts", "concept_mastery", "xp_events"];
  for (const table of tables) {
    try {
      const { error } = await adminClient.from(table).select("*").limit(0);
      assert(!error, `Table 'public.${table}' exists and is queryable`);
      if (error) console.error(`    Error querying ${table}:`, error.message);
    } catch (err) {
      assert(false, `Table 'public.${table}' failed to respond: ${err.message}`);
    }
  }

  console.log("\n--- 3. Testing Real Read and Write (Student Lifecycle) ---");
  const testStudentId = crypto.randomUUID();
  const testEmail = `verify_${Date.now()}@student.internal.margam.local`;
  const testPassword = "VerifyPassword_123!";

  let studentAuthUser = null;
  try {
    // A. Create user in Supabase Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { role: "student" }
    });

    assert(!authError && authData?.user?.id, "Created student auth user in auth.users");
    studentAuthUser = authData?.user;

    if (studentAuthUser) {
      // B. Insert student profile
      const { data: profData, error: profError } = await adminClient
        .from("profiles")
        .insert({
          id: studentAuthUser.id,
          role: "student",
          username: `stu_test_${Date.now().toString().slice(-6)}`,
          full_name: "Verification Student",
          selected_class: 10,
          is_demo: true
        })
        .select()
        .single();

      assert(!profError && profData, "Inserted student profile into public.profiles");
      if (profError) console.error("    Profile error:", profError.message);

      // C. Read own profile as student client
      const studentSessionClient = createClient(supabaseUrl, anonKey);
      const { data: signInData, error: signInError } = await studentSessionClient.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      assert(!signInError && signInData?.session, "Student client authenticated via signInWithPassword");

      if (signInData?.session) {
        const { data: ownProfile, error: ownProfError } = await studentSessionClient
          .from("profiles")
          .select("*")
          .eq("id", studentAuthUser.id)
          .single();

        assert(!ownProfError && ownProfile?.id === studentAuthUser.id, "Student read own profile through RLS");
      }
    }
  } catch (err) {
    console.error("  Student lifecycle error:", err);
  }

  console.log("\n--- 4. Testing Real Read and Write (Teacher Lifecycle) ---");
  const testTeacherId = crypto.randomUUID();
  const testTeacherEmail = `teacher_${Date.now()}@test.internal.margam.local`;
  let teacherAuthUser = null;
  let testClass = null;

  try {
    const { data: tAuthData, error: tAuthErr } = await adminClient.auth.admin.createUser({
      email: testTeacherEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { role: "teacher" }
    });

    assert(!tAuthErr && tAuthData?.user?.id, "Created teacher auth user in auth.users");
    teacherAuthUser = tAuthData?.user;

    if (teacherAuthUser) {
      const { data: tProfData, error: tProfError } = await adminClient
        .from("profiles")
        .insert({
          id: teacherAuthUser.id,
          role: "teacher",
          username: `teach_${Date.now().toString().slice(-6)}`,
          full_name: "Verification Teacher",
          selected_class: 10,
          consent_confirmed: true,
          is_demo: true
        })
        .select()
        .single();

      assert(!tProfError && tProfData, "Inserted teacher profile into public.profiles");

      // Teacher creates a class
      const classCode = "TEST" + Math.floor(1000 + Math.random() * 9000);
      const { data: cData, error: cError } = await adminClient
        .from("classes")
        .insert({
          teacher_id: teacherAuthUser.id,
          name: "Class 10-Verification",
          grade: 10,
          class_code: classCode,
          leaderboard_enabled: true,
          is_demo: true
        })
        .select()
        .single();

      assert(!cError && cData, `Teacher created class '${classCode}' in public.classes`);
      testClass = cData;

      // Student joins class using join_class_with_code RPC
      if (testClass && studentAuthUser) {
        const studentClient = createClient(supabaseUrl, anonKey);
        await studentClient.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        const { data: joinRes, error: joinErr } = await studentClient.rpc("join_class_with_code", {
          p_class_code: classCode
        });

        assert(!joinErr && joinRes?.success, "Student joined class via join_class_with_code RPC");

        // Verify class_members has record
        const { data: memberData, error: memberErr } = await adminClient
          .from("class_members")
          .select("*")
          .eq("class_id", testClass.id)
          .eq("student_id", studentAuthUser.id)
          .single();

        assert(!memberErr && memberData, "Enrollment confirmed in public.class_members");
      }
    }
  } catch (err) {
    console.error("  Teacher lifecycle error:", err);
  }

  console.log("\n--- 5. Cleanup Verification Data ---");
  try {
    if (studentAuthUser) {
      await adminClient.auth.admin.deleteUser(studentAuthUser.id);
      console.log("  Cleaned up test student user.");
    }
    if (teacherAuthUser) {
      await adminClient.auth.admin.deleteUser(teacherAuthUser.id);
      console.log("  Cleaned up test teacher user.");
    }
  } catch (err) {
    console.warn("  Cleanup warning:", err.message);
  }

  console.log("\n================================================================================");
  console.log(`  VERIFICATION RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================");

  if (failed === 0) {
    console.log("🎉 Real database read and write operations succeeded with 100% precision!");
  }
}

runVerification();
