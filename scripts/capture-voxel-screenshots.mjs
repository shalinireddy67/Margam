import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const outDirs = [
  path.join(process.cwd(), "screenshots", "voxel"),
  "C:\\Users\\pbala\\.gemini\\antigravity\\brain\\9c709130-55ac-45c2-be66-97a5f14dcdb5\\screenshots\\voxel",
];

for (const dir of outDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkPort(port)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function saveToAll(screenshotBuffer, filename) {
  for (const dir of outDirs) {
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, screenshotBuffer);
  }
  console.log(`Saved: ${filename} (synced to ${outDirs.length} locations)`);
}

async function run() {
  const port = 3009;
  let serverProcess = null;

  const alreadyRunning = await checkPort(port);
  if (!alreadyRunning) {
    console.log(`Starting production server on port ${port}...`);
    serverProcess = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
      shell: true,
      stdio: "pipe",
    });

    const ready = await waitForServer(port, 25);
    if (!ready) {
      if (serverProcess) serverProcess.kill();
      throw new Error(`Failed to start Next.js server on port ${port}`);
    }
    console.log(`Server started on port ${port}`);
  } else {
    console.log(`Server already running on port ${port}`);
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=max"],
  });

  try {
    const page = await browser.newPage();

    // 1. Landing Page (Desktop: 1280x900)
    console.log("Capturing 1. Landing Page Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 1000));
    const landingDesktop = await page.screenshot({ fullPage: false });
    await saveToAll(landingDesktop, "01_landing_desktop_1280.png");

    const landingFull = await page.screenshot({ fullPage: true });
    await saveToAll(landingFull, "01_landing_full_1280.png");

    // 2. Landing Page (Mobile: 360x800)
    console.log("Capturing 2. Landing Page Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    const landingMobile = await page.screenshot({ fullPage: true });
    await saveToAll(landingMobile, "02_landing_mobile_360.png");

    // Seed student profile in localStorage for student views
    console.log("Seeding student profile for diagnostic assessment view...");
    await page.evaluate(() => {
      const demoProfile = {
        id: "student-demo-voxel",
        name: "Aarav Sharma",
        selectedClass: 10,
        currentDifficulty: 2,
        consecutiveCorrect: 1,
        consecutiveWrong: 0,
        topicProgress: {
          "c10-quad-01": { status: "in_progress", difficulty: 2, attempts: 2 },
          "c10-quad-02": { status: "not_started", difficulty: 1, attempts: 0 },
        },
        mistakeTagCounts: { "sign_slip": 2 },
        activeLearningGap: {
          conceptId: "c7-int-02",
          chapter: "Integers",
          grade: 7,
          mistakeTag: "sign_slip",
          conceptName: { en: "Multiplication and Division of Integers", hi: "पूर्णांकों का गुणन और भाग", te: "పూర్ణ సంఖ్యల గుణకారం మరియు భాగహారం" },
          rationale: "Repeated sign confusion detected when distributing negative signs.",
          prerequisitePath: ["c10-quad-01", "c9-id-02", "c7-int-02"]
        },
        remediationHistory: []
      };
      localStorage.setItem("margam_learner_profile_v1", JSON.stringify(demoProfile));
    });

    // 3. Diagnostic Question Flow (Desktop: 1280x900)
    console.log("Capturing 3. Diagnostic Assessment Flow Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/student/diagnostic/c10-ch04`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 1000));
    const diagDesktop = await page.screenshot({ fullPage: false });
    await saveToAll(diagDesktop, "03_diagnostic_desktop_1280.png");

    // 4. Diagnostic Assessment Flow (Mobile: 360x800)
    console.log("Capturing 4. Diagnostic Assessment Flow Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));
    const diagMobile = await page.screenshot({ fullPage: false });
    await saveToAll(diagMobile, "04_diagnostic_mobile_360.png");

    // 5. Teacher Dashboard (Desktop: 1280x900)
    console.log("Capturing 5. Teacher Dashboard Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/teacher`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 1000));
    const teacherDesktop = await page.screenshot({ fullPage: false });
    await saveToAll(teacherDesktop, "05_teacher_desktop_1280.png");

    const teacherFull = await page.screenshot({ fullPage: true });
    await saveToAll(teacherFull, "05_teacher_full_1280.png");

    // 6. Teacher Dashboard (Mobile: 360x800)
    console.log("Capturing 6. Teacher Dashboard Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));
    const teacherMobile = await page.screenshot({ fullPage: false });
    await saveToAll(teacherMobile, "06_teacher_mobile_360.png");

    console.log("\nALL BLOCKY VOXEL WORLD SCREENSHOTS CAPTURED SUCCESSFULLY!");
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log("Shutting down server...");
      try {
        spawn("taskkill", ["/pid", serverProcess.pid.toString(), "/f", "/t"]);
      } catch (e) {
        serverProcess.kill();
      }
    }
  }
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
