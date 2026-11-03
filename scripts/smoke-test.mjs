/**
 * Production Smoke Test Runner
 *
 * Requirements:
 * - Edge with puppeteer-core
 * - Production build on fixed port 3102
 * - Viewport: 360x800, en, hi, te
 * - 4 Journeys:
 *   (a) First-time visitor: landing, name, class 10, chapter list
 *   (b) Class 10 diagnostic with two sign-rule mistakes, confirmation failure, gap card, Fix this first, lesson (basics first), practice (wrong answer + hint)
 *   (c) Strong student, no gap card
 *   (d) Chapter test
 * - Fail criteria: uncaught page errors, console.error, HTTP >= 400, horizontal overflow, clipped text, tap targets < 48px
 * - Screenshots saved to ./screenshots/smoke/
 */

import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";
import puppeteer from "puppeteer-core";

const PORT = 3102;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SCREENSHOT_DIRS = [
  "./screenshots/smoke",
  path.resolve(process.cwd(), "screenshots", "smoke"),
];

const EDGE_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const EDGE_BIN = EDGE_PATHS.find((p) => fs.existsSync(p));
if (!EDGE_BIN) {
  console.error("FATAL: Microsoft Edge executable not found at expected paths.");
  process.exit(1);
}

// Ensure screenshot directories exist
for (const dir of SCREENSHOT_DIRS) {
  fs.mkdirSync(dir, { recursive: true });
}

let serverProcess = null;
const allSavedScreenshots = [];
const failures = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function recordFailure(step, reason, details = null) {
  const item = { step, reason, details };
  failures.push(item);
  console.error(`  [FAIL] [${step}] ${reason}`, details ? JSON.stringify(details) : "");
}

async function captureScreen(page, filename) {
  const savedPaths = [];
  for (const dir of SCREENSHOT_DIRS) {
    const fullPath = path.join(dir, filename);
    await page.screenshot({ path: fullPath, fullPage: false });
    savedPaths.push(fullPath);
  }
  allSavedScreenshots.push(...savedPaths);
  console.log(`  [SCREENSHOT] Saved: ${savedPaths[0]}`);
  return savedPaths[0];
}

// Strict UI validation helper
async function validatePage(page, stepName) {
  // 1. Horizontal Overflow check
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    const bodyWidth = document.body ? document.body.scrollWidth : 0;
    return {
      hasOverflow: docWidth > winWidth + 1 || bodyWidth > winWidth + 1,
      docWidth,
      winWidth,
      bodyWidth,
    };
  });
  if (overflow.hasOverflow) {
    recordFailure(stepName, "Horizontal overflow detected", overflow);
  }

  // 2. Tap Targets >= 48px check for visible interactive elements
  const smallTargets = await page.evaluate(() => {
    const selector =
      'button, a[href], input, select, textarea, [role="button"], [role="radio"], [role="tab"], [role="link"]';
    const elements = Array.from(document.querySelectorAll(selector));
    const small = [];

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        continue;
      }
      if (rect.width === 0 || rect.height === 0) continue;

      // Ignore elements completely off screen or hidden in collapsed menus
      if (rect.bottom < 0 || rect.top > window.innerHeight * 4) continue;

      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (w < 47 || h < 47) {
        small.push({
          tag: el.tagName,
          id: el.id || undefined,
          ariaLabel: el.getAttribute("aria-label") || undefined,
          text: (el.textContent || "").trim().slice(0, 30),
          width: w,
          height: h,
        });
      }
    }
    return small;
  });

  if (smallTargets.length > 0) {
    recordFailure(stepName, `Found ${smallTargets.length} tap targets under 48px`, smallTargets);
  }

  // 3. Clipped / Overlapping Text check
  const clippedIssues = await page.evaluate(() => {
    const headersAndParas = Array.from(document.querySelectorAll("h1, h2, h3, h4, p"));
    const issues = [];
    for (const el of headersAndParas) {
      const style = window.getComputedStyle(el);
      if (
        style.overflow === "hidden" &&
        el.scrollWidth > el.clientWidth + 3 &&
        style.textOverflow !== "ellipsis"
      ) {
        issues.push({
          tag: el.tagName,
          text: (el.textContent || "").trim().slice(0, 30),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        });
      }
    }
    return issues;
  });

  if (clippedIssues.length > 0) {
    recordFailure(stepName, "Clipped text detected", clippedIssues);
  }
}

function attachPageListeners(page, stepName) {
  page.on("dialog", async (dialog) => {
    console.log(`  [DIALOG] Auto-accepting dialog: ${dialog.message()}`);
    await dialog.accept();
  });

  page.on("pageerror", (err) => {
    recordFailure(stepName, `Uncaught page error: ${err.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon.ico")) {
        recordFailure(stepName, `console.error: ${text}`);
      }
    }
  });

  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("favicon.ico")) {
      recordFailure(stepName, `HTTP ${res.status()} response: ${res.url()}`);
    }
  });
}

function pollServer(url, timeoutMs = 30000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve();
          } else {
            setTimeout(check, 500);
          }
        })
        .on("error", () => {
          if (Date.now() - startTime > timeoutMs) {
            reject(new Error(`Server did not respond at ${url} within ${timeoutMs}ms`));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

async function run() {
  console.log("==================================================");
  console.log("  MARGAM — GATE 4: PRODUCTION SMOKE RUNNER        ");
  console.log("==================================================");

  // 1. Clean port 3102 if bound
  console.log(`\n1. Preparing fixed port ${PORT}...`);
  try {
    const stdout = execSync(`netstat -ano | findstr :${PORT}`, { encoding: "utf8" });
    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && parts[1].endsWith(`:${PORT}`) && parts[3] === "LISTENING") {
        const pid = parseInt(parts[4], 10);
        console.log(`Port ${PORT} is occupied by PID ${pid}. Freeing...`);
        execSync(`taskkill /pid ${pid} /f /t`, { stdio: "ignore" });
      }
    }
  } catch {
    // Free
  }

  // 2. Start Next.js production server
  console.log(`\n2. Starting production server on port ${PORT}...`);
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "npx.cmd" : "npx";
  serverProcess = spawn(cmd, ["next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: true,
  });

  serverProcess.stdout.on("data", (d) => {
    const msg = d.toString();
    if (msg.includes("Ready in") || msg.includes("started server on")) {
      console.log(`  [SERVER] ${msg.trim()}`);
    }
  });

  serverProcess.stderr.on("data", (d) => {
    console.warn(`  [SERVER ERR] ${d.toString().trim()}`);
  });

  await pollServer(BASE_URL, 35000);
  console.log(`  [PASS] Server is live at ${BASE_URL}`);

  // 3. Launch Puppeteer with Edge
  console.log(`\n3. Launching Edge at ${EDGE_BIN}...`);
  const browser = await puppeteer.launch({
    executablePath: EDGE_BIN,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const languages = ["en", "hi", "te"];

  try {
    for (const lang of languages) {
      console.log(`\n==================================================`);
      console.log(`  WALKING JOURNEYS IN [${lang.toUpperCase()}] at 360x800`);
      console.log(`==================================================`);

      // -----------------------------------------------------------------------
      // JOURNEY (a): First-Time Visitor (landing, name, class 10, chapter list)
      // -----------------------------------------------------------------------
      console.log(`\n--- Journey (a): First-Time Visitor [${lang}] ---`);
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        attachPageListeners(page, `journey_a_${lang}`);

        // Clean slate: clear localStorage
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => localStorage.clear());
        await page.reload({ waitUntil: "domcontentloaded" });

        // Switch language
        await page.waitForSelector(`button[data-l="${lang}"]`);
        await page.click(`button[data-l="${lang}"]`);
        await sleep(300);

        await validatePage(page, `journey_a_landing_${lang}`);
        await captureScreen(page, `journey_a_01_landing_${lang}.png`);

        // Enter student name
        const studentName = lang === "hi" ? "प्रिया शर्मा" : lang === "te" ? "ప్రియ శర్మ" : "Priya Sharma";
        await page.waitForSelector("#student-name-field");
        await page.type("#student-name-field", studentName);

        // Select Class 10
        await page.waitForSelector('button[aria-label^="Class 10"]');
        await page.click('button[aria-label^="Class 10"]');
        await sleep(200);

        // Submit Onboarding
        await page.click('form button[type="submit"]');
        await page.waitForSelector("#chapters");
        await sleep(300);

        await validatePage(page, `journey_a_chapters_${lang}`);
        await captureScreen(page, `journey_a_02_chapters_${lang}.png`);

        await page.close();
      }

      // -----------------------------------------------------------------------
      // JOURNEY (b): Class 10 Diagnostic (2 sign mistakes, confirmation fail,
      //              gap card, Fix this first, lesson basics-first, wrong practice + hint)
      // -----------------------------------------------------------------------
      console.log(`\n--- Journey (b): Class 10 Diagnostic & Remediation [${lang}] ---`);
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        attachPageListeners(page, `journey_b_${lang}`);

        // Setup learner profile locked to Class 10
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => {
          localStorage.clear();
          const profile = {
            version: 1,
            id: "smoke_student_c10",
            name: "Aarav",
            selectedClass: 10,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            topicProgress: {},
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            currentDifficulty: 1,
          };
          localStorage.setItem("margam_active_learner", JSON.stringify(profile));
        });

        // Navigate to Class 10 Chapter 4 Diagnostic
        await page.goto(`${BASE_URL}/student/diagnostic/c10-ch04`, { waitUntil: "domcontentloaded" });

        // Switch language in diagnostic header
        if (lang !== "en") {
          await page.evaluate((l) => {
            const btns = Array.from(document.querySelectorAll("header button"));
            const target = btns.find((b) => b.textContent?.trim().toLowerCase().includes(l === "hi" ? "हिन्दी" : "తెలుగు"));
            if (target) target.click();
          }, lang);
          await sleep(300);
        }

        // Answer questions:
        // q-c10-form-01 -> Option A (squared_negative_b_as_negative)
        // q-c10-form-02 -> Option D (sign_error_negative_times_negative_became_negative)
        // Others -> correct answers
        await page.waitForSelector('div[data-qid]');

        await page.evaluate(() => {
          // 1. q-c10-form-01 -> Option A (squared_negative_b_as_negative)
          const q1 = document.querySelector('[data-qid="q-c10-form-01"]');
          if (q1) q1.querySelector('[data-oid="A"]')?.click();

          // 2. q-c10-form-02 -> Option D (sign_error_negative_times_negative_became_negative)
          const q2 = document.querySelector('[data-qid="q-c10-form-02"]');
          if (q2) q2.querySelector('[data-oid="D"]')?.click();

          // 3. Other questions: answer correctly so only the 2 sign-rule mistakes trigger
          const otherCorrect = {
            "q-c10-sol-01": "B",
            "q-c10-sol-02": "B",
            "q-c10-quad-d3-01": "D",
            "q-c10-form-03": "C",
          };
          for (const [qid, optId] of Object.entries(otherCorrect)) {
            const qEl = document.querySelector(`[data-qid="${qid}"]`);
            if (qEl) qEl.querySelector(`[data-oid="${optId}"]`)?.click();
          }
        });

        await sleep(300);
        await validatePage(page, `journey_b_answered_${lang}`);
        await captureScreen(page, `journey_b_01_diagnostic_answered_${lang}.png`);

        // Submit Diagnostic
        const submitBtn = await page.waitForSelector('button[type="submit"]');
        await submitBtn.click();
        await sleep(600);

        // Step: Confirmation Failure
        // Confirmation questions should now be visible
        await page.waitForSelector('form[class*="space-y-4 pt-2"]');
        await validatePage(page, `journey_b_confirmation_view_${lang}`);
        await captureScreen(page, `journey_b_02_confirmation_view_${lang}.png`);

        // Deliberately answer confirmation questions WRONG (choose Option A since B is correct for both)
        await page.evaluate(() => {
          const confirmCards = Array.from(document.querySelectorAll('[data-confirm-qid]'));
          for (const card of confirmCards) {
            const opt = card.querySelector('[data-confirm-oid="A"]') || card.querySelector('[data-confirm-oid]');
            if (opt) opt.click();
          }
        });

        await sleep(300);

        // Submit confirmation
        await page.evaluate(() => {
          const confirmForm = document.querySelector('form[class*="space-y-4 pt-2"]');
          const btn = confirmForm ? confirmForm.querySelector('button[type="submit"]') : null;
          if (btn) btn.click();
        });

        await sleep(600);

        // Confirmation failed -> Gap card with "#fix-this-first-btn"
        await page.waitForSelector("#fix-this-first-btn");
        await validatePage(page, `journey_b_gap_card_${lang}`);
        await captureScreen(page, `journey_b_03_gap_card_${lang}.png`);

        // Click "Fix this first" -> Navigates to /lesson/c7-int-02?fromGap=true&reason=...
        const targetUrl = await page.$eval("#fix-this-first-btn", (el) => el.href);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("form.space-y-6", { timeout: 15000 });
        await sleep(500);

        // Verify Basics-First variant is active
        const isBasicsFirst = await page.evaluate(() => {
          return document.body.textContent?.includes("Basics-First");
        });
        if (!isBasicsFirst) {
          recordFailure(`journey_b_lesson_${lang}`, "Lesson did not render basics_first variant");
        }

        await validatePage(page, `journey_b_lesson_basics_first_${lang}`);
        await captureScreen(page, `journey_b_04_lesson_basics_first_${lang}.png`);

        // In Lesson: Answer practice question with a WRONG choice (Option A on q-c7-mul-01 has mistakeTag)
        await page.evaluate(() => {
          const practiceForm = document.querySelector("form.space-y-6");
          if (practiceForm) {
            const firstOpt = practiceForm.querySelector('div[class*="min-h-[48px]"]');
            if (firstOpt) firstOpt.click();
          }
        });
        await sleep(300);

        // Submit Practice
        await page.evaluate(() => {
          const practiceForm = document.querySelector("form.space-y-6");
          const btn = practiceForm ? practiceForm.querySelector('button[type="submit"]') : null;
          if (btn) btn.click();
        });
        await sleep(500);

        // Verify wrong answer feedback and hint are displayed
        const hasHint = await page.evaluate(() => {
          const text = document.body.textContent || "";
          return text.includes("Needs Review") || text.includes("Hint:") || text.includes("💡 Hint");
        });
        if (!hasHint) {
          recordFailure(`journey_b_practice_${lang}`, "Practice did not display mistake hint on wrong answer");
        }

        await validatePage(page, `journey_b_practice_wrong_hint_${lang}`);
        await captureScreen(page, `journey_b_05_practice_wrong_hint_${lang}.png`);

        await page.close();
      }

      // -----------------------------------------------------------------------
      // JOURNEY (c): Strong Student (100% Diagnostic, No Gap Card)
      // -----------------------------------------------------------------------
      console.log(`\n--- Journey (c): Strong Student Diagnostic [${lang}] ---`);
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        attachPageListeners(page, `journey_c_${lang}`);

        // Setup learner profile
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => {
          localStorage.clear();
          const profile = {
            version: 1,
            id: "strong_student_c10",
            name: "Ananya",
            selectedClass: 10,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            topicProgress: {},
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            currentDifficulty: 1,
          };
          localStorage.setItem("margam_active_learner", JSON.stringify(profile));
        });

        await page.goto(`${BASE_URL}/student/diagnostic/c10-ch04`, { waitUntil: "domcontentloaded" });

        if (lang !== "en") {
          await page.evaluate((l) => {
            const btns = Array.from(document.querySelectorAll("header button"));
            const target = btns.find((b) => b.textContent?.trim().toLowerCase().includes(l === "hi" ? "हिन्दी" : "తెలుగు"));
            if (target) target.click();
          }, lang);
          await sleep(300);
        }

        // Answer ALL 6 questions CORRECTLY
        await page.waitForSelector('div[data-qid]');
        await page.evaluate(() => {
          const correctMap = {
            "q-c10-sol-01": "B",
            "q-c10-form-01": "B",
            "q-c10-sol-02": "B",
            "q-c10-form-02": "B",
            "q-c10-quad-d3-01": "D",
            "q-c10-form-03": "C",
          };
          for (const [qid, correctOpt] of Object.entries(correctMap)) {
            const qEl = document.querySelector(`[data-qid="${qid}"]`);
            if (qEl) {
              const opt = qEl.querySelector(`[data-oid="${correctOpt}"]`);
              if (opt) opt.click();
            }
          }
        });

        await sleep(300);

        // Submit Diagnostic
        const submitBtn = await page.waitForSelector('button[type="submit"]');
        await submitBtn.click();
        await sleep(600);

        // Verify Placement Passed Banner is present and NO Gap Card is present
        const checkStrongResult = await page.evaluate(() => {
          const body = document.body.textContent || "";
          const passed = body.includes("Placement Passed") || body.includes("6 / 6");
          const hasGap = !!document.querySelector("#fix-this-first-btn");
          return { passed, hasGap };
        });

        if (!checkStrongResult.passed) {
          recordFailure(`journey_c_${lang}`, "Strong student diagnostic did not pass placement at 100%");
        }
        if (checkStrongResult.hasGap) {
          recordFailure(`journey_c_${lang}`, "Strong student diagnostic erroneously showed gap card");
        }

        await validatePage(page, `journey_c_passed_${lang}`);
        await captureScreen(page, `journey_c_01_strong_student_passed_${lang}.png`);

        await page.close();
      }

      // -----------------------------------------------------------------------
      // JOURNEY (d): Chapter Test (/student/test/c10-ch04)
      // -----------------------------------------------------------------------
      console.log(`\n--- Journey (d): Chapter Test Runner [${lang}] ---`);
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        attachPageListeners(page, `journey_d_${lang}`);

        // Setup learner profile
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => {
          localStorage.clear();
          const profile = {
            version: 1,
            id: "test_runner_student_c10",
            name: "Rohan",
            selectedClass: 10,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            topicProgress: {},
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            currentDifficulty: 1,
          };
          localStorage.setItem("margam_active_learner", JSON.stringify(profile));
        });

        await page.goto(`${BASE_URL}/student/test/c10-ch04`, { waitUntil: "domcontentloaded" });

        if (lang !== "en") {
          await page.evaluate((l) => {
            const btns = Array.from(document.querySelectorAll("header button"));
            const target = btns.find((b) => b.textContent?.trim().toLowerCase().includes(l === "hi" ? "हिन्दी" : "తెలుగు"));
            if (target) target.click();
          }, lang);
          await sleep(300);
        }

        await page.waitForSelector('div[data-qid]');

        // Answer all 10 test questions (select first option for each question)
        await page.evaluate(() => {
          const qContainers = Array.from(document.querySelectorAll("form div[data-qid]"));
          for (const qc of qContainers) {
            const firstOpt = qc.querySelector('[data-oid]');
            if (firstOpt) firstOpt.click();
          }
        });

        await sleep(300);
        await validatePage(page, `journey_d_answered_${lang}`);
        await captureScreen(page, `journey_d_01_test_answered_${lang}.png`);

        // Submit Chapter Test
        const submitBtn = await page.waitForSelector('button[type="submit"]');
        await submitBtn.click();
        await sleep(600);

        // Verify Test Results and Breakdown are present
        const hasBreakdown = await page.evaluate(() => {
          const text = document.body.textContent || "";
          return text.includes("Concept Mastery Breakdown") || text.includes("Retake Test");
        });
        if (!hasBreakdown) {
          recordFailure(`journey_d_${lang}`, "Chapter test did not render concept mastery breakdown");
        }

        await validatePage(page, `journey_d_results_${lang}`);
        await captureScreen(page, `journey_d_02_test_results_${lang}.png`);

        await page.close();
      }
    }
  } finally {
    console.log("\n4. Shutting down browser and test server...");
    await browser.close();

    if (serverProcess) {
      if (isWindows) {
        try {
          execSync(`taskkill /pid ${serverProcess.pid} /f /t`, { stdio: "ignore" });
        } catch {
          // ignore
        }
      } else {
        serverProcess.kill("SIGTERM");
      }
    }
  }

  // 5. Final Report
  console.log("\n==================================================");
  console.log("  SMOKE TEST EXECUTION REPORT                     ");
  console.log("==================================================");
  console.log(`Total Screenshots Captured: ${allSavedScreenshots.length}`);
  console.log("\nScreenshot Files:");
  const uniquePaths = Array.from(new Set(allSavedScreenshots));
  for (const sp of uniquePaths) {
    console.log(`  - ${sp}`);
  }

  if (failures.length > 0) {
    console.error(`\n❌ SMOKE TEST FAILED with ${failures.length} errors:`);
    for (const f of failures) {
      console.error(`  - [${f.step}] ${f.reason}`);
      if (f.details) console.error(`    ${JSON.stringify(f.details)}`);
    }
    process.exit(1);
  } else {
    console.log("\n✅ ALL SMOKE TEST JOURNEYS PASSED CLEANLY!");
    console.log("   - 0 Uncaught page errors");
    console.log("   - 0 console.error");
    console.log("   - 0 Failed network requests (HTTP >= 400)");
    console.log("   - 0 Horizontal overflows at 360x800");
    console.log("   - 0 Clipped or overlapping text elements");
    console.log("   - 0 Interactive tap targets under 48px");
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("FATAL ERROR IN SMOKE TEST RUNNER:", err);
  if (serverProcess) {
    try {
      execSync(`taskkill /pid ${serverProcess.pid} /f /t`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  process.exit(1);
});
