import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const outDirs = [
  path.join(process.cwd(), "screenshots", "responsive"),
  "C:\\Users\\pbala\\.gemini\\antigravity\\brain\\9c709130-55ac-45c2-be66-97a5f14dcdb5\\screenshots\\responsive",
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
  console.log(`Saved: ${filename}`);
}

const VIEWPORTS = [
  { name: "360x800_mobile_sm", width: 360, height: 800, scale: 2 },
  { name: "390x844_mobile_std", width: 390, height: 844, scale: 2 },
  { name: "768x1024_tablet", width: 768, height: 1024, scale: 2 },
  { name: "1280x800_desktop", width: 1280, height: 800, scale: 1.5 },
  { name: "1920x1080_desktop_wide", width: 1920, height: 1080, scale: 1 },
];

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

    const ready = await waitForServer(port, 30);
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

    // Setup learner profile with gamification and active state
    const demoProfile = {
      id: "student-demo-responsive",
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
      remediationHistory: [],
      // Gamification state
      totalXp: 480,
      currentLevel: 8,
      rank: "Stone Rank",
      currentStreak: 5,
      streakFreezes: 2,
      earnedBadges: ["first_step", "concept_pioneer", "adaptive_climber", "streak_3"],
      soundEnabled: true,
    };

    // 1. Capture landing page across all 5 viewports
    for (const vp of VIEWPORTS) {
      console.log(`Capturing Landing Page on ${vp.name}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      // Seed profile
      await page.evaluate((prof) => {
        localStorage.setItem("margam_learner_profile_v1", JSON.stringify(prof));
      }, demoProfile);
      await page.reload({ waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 600));

      const buf = await page.screenshot({ fullPage: false });
      await saveToAll(buf, `01_landing_${vp.name}.png`);
    }

    // 2. Capture Diagnostic Assessment screen across viewports
    for (const vp of VIEWPORTS) {
      console.log(`Capturing Diagnostic Assessment on ${vp.name}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.goto(`http://localhost:${port}/student/diagnostic/c10-ch04`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      await new Promise((r) => setTimeout(r, 600));

      const buf = await page.screenshot({ fullPage: false });
      await saveToAll(buf, `02_diagnostic_${vp.name}.png`);
    }

    // 3. Capture Diagnostic Not Available (Coming Soon) screen on Mobile and Desktop
    for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
      console.log(`Capturing Coming Soon screen on ${vp.name}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.goto(`http://localhost:${port}/student/diagnostic/c6-ch02`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      await new Promise((r) => setTimeout(r, 600));

      const buf = await page.screenshot({ fullPage: false });
      await saveToAll(buf, `03_coming_soon_${vp.name}.png`);
    }

    // 4. Capture Badges / Stickers screen across mobile, tablet, and desktop
    for (const vp of [VIEWPORTS[0], VIEWPORTS[2], VIEWPORTS[3]]) {
      console.log(`Capturing Badges Showcase on ${vp.name}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.goto(`http://localhost:${port}/student/stickers`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      await new Promise((r) => setTimeout(r, 600));

      const buf = await page.screenshot({ fullPage: false });
      await saveToAll(buf, `04_stickers_${vp.name}.png`);
    }

    // 5. Capture Teacher Dashboard across mobile, tablet, and desktop
    for (const vp of [VIEWPORTS[0], VIEWPORTS[2], VIEWPORTS[3]]) {
      console.log(`Capturing Teacher Dashboard on ${vp.name}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.goto(`http://localhost:${port}/teacher`, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      await new Promise((r) => setTimeout(r, 600));

      const buf = await page.screenshot({ fullPage: false });
      await saveToAll(buf, `05_teacher_${vp.name}.png`);
    }

    // 6. Navigation details & verification
    // Mobile Bottom Bar Close-up (360x800)
    console.log("Capturing Mobile Navigation Bottom Bar close-up (360x800)...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    const mobileBottomBar = await page.$("nav[aria-label='Mobile bottom navigation']");
    if (mobileBottomBar) {
      const barBuf = await mobileBottomBar.screenshot();
      await saveToAll(barBuf, `nav_mobile_bottom_bar_360.png`);
    }

    // Tablet Left Rail Close-up (768x1024)
    console.log("Capturing Tablet Navigation Left Rail close-up (768x1024)...");
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    const tabletRail = await page.$("aside[aria-label='Tablet navigation rail']");
    if (tabletRail) {
      const railBuf = await tabletRail.screenshot();
      await saveToAll(railBuf, `nav_tablet_left_rail_768.png`);
    }

    // Desktop Top Navbar Close-up (1280x800)
    console.log("Capturing Desktop Top Navbar close-up (1280x800)...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    const desktopHeader = await page.$("header[aria-label='Desktop top navigation']");
    if (desktopHeader) {
      const headerBuf = await desktopHeader.screenshot();
      await saveToAll(headerBuf, `nav_desktop_top_header_1280.png`);
    }

    console.log("\nALL RESPONSIVE VIEWPORT SCREENSHOTS CAPTURED SUCCESSFULLY!");
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
  console.error("Responsive screenshot capture failed:", err);
  process.exit(1);
});

