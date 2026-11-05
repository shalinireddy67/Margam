#!/usr/bin/env node
/**
 * Margam Username Authentication End-to-End Test Suite
 * Validates all 12 scenarios from Part 7 against live Next.js HTTP endpoints.
 */

const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message, details = "") {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message} ${details ? "- " + details : ""}`);
    failed++;
  }
}

async function runTests() {
  console.log("================================================================================");
  console.log("  MARGAM — PART 7: USERNAME AUTHENTICATION VERIFICATION (12 SCENARIOS)           ");
  console.log("================================================================================\n");

  const timestamp = Date.now().toString().slice(-6);
  const studentUser = `student_test_${timestamp}`;
  const studentPass = "StudentPass@2026";
  const teacherUser = `teacher_test_${timestamp}`;
  const teacherPass = "TeacherPass@2026";

  // SCENARIO 1: Fresh student signup with username & password
  console.log("--- Scenario 1: Fresh Student Signup with Username & Password ---");
  const s1Res = await fetch(`${BASE_URL}/api/auth/student-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: studentUser,
      password: studentPass,
      fullName: "Test Student",
      selectedClass: 10,
    }),
  });
  const s1Data = await s1Res.json();
  assert(s1Res.status === 200, "Scenario 1: Signup returns HTTP 200", JSON.stringify(s1Data));
  assert(s1Data.success === true, "Scenario 1: Returns success: true");
  assert(s1Data.user?.role === "student", "Scenario 1: Server assigns 'student' role");
  assert(Boolean(s1Data.recoveryCode), "Scenario 1: Generates recovery code");

  // SCENARIO 2: Student login with username & password
  console.log("\n--- Scenario 2: Student Login with Username & Password ---");
  const s2Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: studentUser,
      password: studentPass,
      expectedRole: "student",
    }),
  });
  const s2Data = await s2Res.json();
  const s2Cookie = s2Res.headers.get("set-cookie") || "";
  assert(s2Res.status === 200, "Scenario 2: Login returns HTTP 200", JSON.stringify(s2Data));
  assert(s2Data.user?.role === "student", "Scenario 2: Returns student profile");
  assert(s2Data.redirectUrl === "/student", "Scenario 2: Redirects to /student");
  assert(s2Cookie.includes("margam_auth_token"), "Scenario 2: Sets margam_auth_token cookie");

  // SCENARIO 3: Duplicate student username rejection (409)
  console.log("\n--- Scenario 3: Duplicate Student Username Rejection ---");
  const s3Res = await fetch(`${BASE_URL}/api/auth/student-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: studentUser,
      password: studentPass,
      selectedClass: 10,
    }),
  });
  const s3Data = await s3Res.json();
  assert(s3Res.status === 409, "Scenario 3: Returns HTTP 409 Conflict for duplicate username", JSON.stringify(s3Data));

  // SCENARIO 4: Invalid username format rejection (400)
  console.log("\n--- Scenario 4: Invalid Username Format Rejection ---");
  const s4Res = await fetch(`${BASE_URL}/api/auth/student-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "bad username!@#",
      password: studentPass,
      selectedClass: 10,
    }),
  });
  const s4Data = await s4Res.json();
  assert(s4Res.status === 400, "Scenario 4: Returns HTTP 400 for invalid username characters", JSON.stringify(s4Data));

  // SCENARIO 5: Short password rejection (400)
  console.log("\n--- Scenario 5: Short Password Rejection ---");
  const s5Res = await fetch(`${BASE_URL}/api/auth/student-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: `short_pwd_${timestamp}`,
      password: "123",
      selectedClass: 10,
    }),
  });
  const s5Data = await s5Res.json();
  assert(s5Res.status === 400, "Scenario 5: Returns HTTP 400 for password < 6 chars", JSON.stringify(s5Data));

  // SCENARIO 6: Case-insensitivity verification
  console.log("\n--- Scenario 6: Case-Insensitivity Verification ---");
  const caseUser = `Aarav_Case_${timestamp}`;
  const s6Signup = await fetch(`${BASE_URL}/api/auth/student-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: caseUser,
      password: studentPass,
      selectedClass: 10,
    }),
  });
  assert(s6Signup.status === 200, "Scenario 6: Mixed-case username signup succeeded");

  const s6Login = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: caseUser.toLowerCase(),
      password: studentPass,
      expectedRole: "student",
    }),
  });
  const s6LoginData = await s6Login.json();
  assert(s6Login.status === 200, "Scenario 6: Lowercase login succeeds for mixed-case registration", JSON.stringify(s6LoginData));

  // SCENARIO 7: Fresh teacher signup with username & password
  console.log("\n--- Scenario 7: Fresh Teacher Signup with Username & Password ---");
  const s7Res = await fetch(`${BASE_URL}/api/auth/teacher-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: teacherUser,
      password: teacherPass,
      fullName: "Shalini Teacher",
      className: "Class 10-A",
      grade: 10,
      consentConfirmed: true,
    }),
  });
  const s7Data = await s7Res.json();
  assert(s7Res.status === 200, "Scenario 7: Teacher signup returns HTTP 200", JSON.stringify(s7Data));
  assert(s7Data.user?.role === "teacher", "Scenario 7: Server assigns 'teacher' role");
  assert(Boolean(s7Data.classCode), `Scenario 7: Automatically creates class code (${s7Data.classCode})`);

  // SCENARIO 8: Teacher login with username & password
  console.log("\n--- Scenario 8: Teacher Login with Username & Password ---");
  const s8Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: teacherUser,
      password: teacherPass,
      expectedRole: "teacher",
    }),
  });
  const s8Data = await s8Res.json();
  const s8Cookie = s8Res.headers.get("set-cookie") || "";
  assert(s8Res.status === 200, "Scenario 8: Teacher login returns HTTP 200", JSON.stringify(s8Data));
  assert(s8Data.user?.role === "teacher", "Scenario 8: Returns teacher profile");
  assert(s8Data.redirectUrl === "/teacher", "Scenario 8: Redirects to /teacher");
  assert(s8Cookie.includes("margam_auth_token"), "Scenario 8: Sets margam_auth_token cookie");

  // SCENARIO 9: Cross-portal isolation
  console.log("\n--- Scenario 9: Cross-Portal Isolation ---");
  const s9StudentAsTeacher = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: studentUser,
      password: studentPass,
      expectedRole: "teacher",
    }),
  });
  assert(s9StudentAsTeacher.status === 403, "Scenario 9: Student logging in via Teacher portal returns HTTP 403");

  const s9TeacherAsStudent = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: teacherUser,
      password: teacherPass,
      expectedRole: "student",
    }),
  });
  assert(s9TeacherAsStudent.status === 403, "Scenario 9: Teacher logging in via Student portal returns HTTP 403");

  // SCENARIO 10: Demo login for student
  console.log("\n--- Scenario 10: Demo Login for Student ---");
  const s10Res = await fetch(`${BASE_URL}/api/auth/demo-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "student",
      studentIndex: 0,
    }),
  });
  const s10Data = await s10Res.json();
  const s10Cookie = s10Res.headers.get("set-cookie") || "";
  assert(s10Res.status === 200, "Scenario 10: Demo student login returns HTTP 200 (never 500)", JSON.stringify(s10Data));
  assert(s10Data.role === "student", "Scenario 10: Demo student role is student");
  assert(s10Cookie.includes("margam_auth_token"), "Scenario 10: Sets demo session cookie");

  // SCENARIO 11: Demo login for teacher
  console.log("\n--- Scenario 11: Demo Login for Teacher ---");
  const s11Res = await fetch(`${BASE_URL}/api/auth/demo-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "teacher",
    }),
  });
  const s11Data = await s11Res.json();
  const s11Cookie = s11Res.headers.get("set-cookie") || "";
  assert(s11Res.status === 200, "Scenario 11: Demo teacher login returns HTTP 200 (never 500)", JSON.stringify(s11Data));
  assert(s11Data.role === "teacher", "Scenario 11: Demo teacher role is teacher");
  assert(s11Cookie.includes("margam_auth_token"), "Scenario 11: Sets demo session cookie");

  // SCENARIO 12: Account lockout after 5 consecutive failed attempts
  console.log("\n--- Scenario 12: Account Lockout after 5 Consecutive Failed Attempts ---");
  const lockoutUser = `lockout_user_${timestamp}`;
  let lastStatus = 0;
  let lastBody = {};

  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: lockoutUser,
        password: "WrongPassword123!",
      }),
    });
    lastStatus = res.status;
    lastBody = await res.json();
  }

  assert(lastStatus === 429, `Scenario 12: 6th attempt returns HTTP 429 (got ${lastStatus})`, JSON.stringify(lastBody));
  assert(lastBody.locked === true, "Scenario 12: Account is locked");
  assert(lastBody.remainingMinutes === 15, "Scenario 12: Lockout duration is 15 minutes");

  console.log("\n================================================================================");
  console.log(`  RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});

