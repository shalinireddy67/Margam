/**
 * Test Suite: Assessment IDOR & Cross-Student Spoofing Protection
 * Validates that authenticated students cannot initiate or submit assessments on behalf of other students.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Neutralize 'server-only' guard for Node test execution
try {
  const serverOnlyPath = require.resolve("server-only");
  require.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  };
} catch {}

const { POST: practiceStart } = await import("../src/app/api/practice/start/route.ts");
const { POST: practiceSubmit } = await import("../src/app/api/practice/submit/route.ts");
const { POST: diagStart } = await import("../src/app/api/diagnostic/start/route.ts");
const { POST: diagSubmit } = await import("../src/app/api/diagnostic/submit/route.ts");
const { POST: testStart } = await import("../src/app/api/test/start/route.ts");
const { POST: testSubmit } = await import("../src/app/api/test/submit/route.ts");
const { signSessionPayload } = await import("../src/lib/server/session-crypto.ts");
const { mockDb } = await import("../src/lib/server/auth-helpers.ts");

console.log("==================================================");
console.log("  MARGAM — ASSESSMENT IDOR & SPOOFING TEST SUITE  ");
console.log("==================================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

// 1. Setup mock profiles
const studentAId = "std_alice_uuid_123456789012";
const studentBId = "std_bob_uuid_987654321098";

mockDb.profiles.set(studentAId, {
  id: studentAId,
  role: "student",
  username: "alice",
  email: "alice@student.internal.margam.local",
  fullName: "Alice Student",
  selectedClass: 6,
  consentConfirmed: true,
  createdAt: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

mockDb.profiles.set(studentBId, {
  id: studentBId,
  role: "student",
  username: "bob",
  email: "bob@student.internal.margam.local",
  fullName: "Bob Student",
  selectedClass: 6,
  consentConfirmed: true,
  createdAt: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Create token for Alice
const aliceToken = signSessionPayload({
  userId: studentAId,
  role: "student",
  expiresAt: Date.now() + 3600000,
});

function createMockRequest(url, body, cookie) {
  return {
    url,
    headers: {
      get: (headerName) => {
        if (headerName === "cookie") return cookie ? `margam_auth_token=${cookie}` : null;
        if (headerName === "content-type") return "application/json";
        if (headerName === "x-forwarded-for") return "127.0.0.1";
        return null;
      },
    },
    json: async () => body,
    cookies: {
      get: (name) => (name === "margam_auth_token" && cookie ? { value: cookie } : undefined),
    },
  };
}

async function runTests() {
  console.log("\n--- TEST: IDOR Prevention in Practice Endpoints ---");
  {
    // Alice tries to start practice with Bob's ID
    const req = createMockRequest("http://localhost:3000/api/practice/start", {
      conceptId: "c6-pat-01",
      studentId: studentBId,
    }, aliceToken);

    const res = await practiceStart(req);
    const data = await res.json();
    assert(res.status === 403, `Alice starting practice as Bob rejected with 403 (got ${res.status})`);
    assert(data.error.includes("student identity mismatch"), "Correct error message returned");
  }

  {
    // Alice starts practice with her own ID
    const req = createMockRequest("http://localhost:3000/api/practice/start", {
      conceptId: "c6-pat-01",
      studentId: studentAId,
    }, aliceToken);

    const res = await practiceStart(req);
    const data = await res.json();
    assert(res.status === 200, "Alice starting practice with own ID succeeds");
    assert(Boolean(data.token), "Received signed session token");

    // Alice tries to submit with Bob's ID
    const submitReq = createMockRequest("http://localhost:3000/api/practice/submit", {
      token: data.token,
      conceptId: "c6-pat-01",
      studentId: studentBId,
      answers: { [data.questions[0].id]: "opt_1" },
    }, aliceToken);

    const submitRes = await practiceSubmit(submitReq);
    assert(submitRes.status === 403, `Alice submitting practice as Bob rejected with 403 (got ${submitRes.status})`);
  }

  console.log("\n--- TEST: IDOR Prevention in Diagnostic Endpoints ---");
  {
    // Alice tries to start diagnostic as Bob
    const req = createMockRequest("http://localhost:3000/api/diagnostic/start", {
      chapterId: "c6-ch01",
      studentId: studentBId,
    }, aliceToken);

    const res = await diagStart(req);
    assert(res.status === 403, `Alice starting diagnostic as Bob rejected with 403 (got ${res.status})`);
  }

  console.log("\n--- TEST: IDOR Prevention in Chapter Test Endpoints ---");
  {
    // Alice tries to start chapter test as Bob
    const req = createMockRequest("http://localhost:3000/api/test/start", {
      chapterId: "c6-ch01",
      studentId: studentBId,
    }, aliceToken);

    const res = await testStart(req);
    assert(res.status === 403, `Alice starting test as Bob rejected with 403 (got ${res.status})`);
  }

  console.log("\n==================================================");
  console.log(`  RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
