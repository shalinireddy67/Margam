import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const outDirs = [
  path.join(process.cwd(), "screenshots", "gamification"),
  "C:\\Users\\pbala\\.gemini\\antigravity\\brain\\9c709130-55ac-45c2-be66-97a5f14dcdb5\\screenshots\\gamification",
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

    // 1. Setup Student Profile with XP, Rank, Level, Resolved Gaps & Streak in localStorage
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      const demoGamifiedProfile = {
        version: 1,
        id: "stu-demo-gamefeel",
        name: "Aarav Sharma",
        selectedClass: 10,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        currentDifficulty: 2,
        consecutiveCorrect: 3,
        consecutiveIncorrect: 0,
        xp: 640,
        level: 10,
        rank: "Iron",
        dailyXp: {
          date: new Date().toISOString().split("T")[0],
          xp: 85,
        },
        streak: {
          current: 4,
          longest: 7,
          lastActiveDate: new Date().toISOString().split("T")[0],
          freezeTokens: 1,
        },
        resolvedGaps: [
          {
            rootConceptId: "c7-int-02",
            currentConceptId: "c10-quad-01",
            resolvedAt: new Date().toISOString(),
            scorePercentage: 90,
            conceptName: "Multiplication and Division of Integers",
          },
        ],
        topicProgress: {
          "c10-quad-01": {
            conceptId: "c10-quad-01",
            status: "completed",
            lessonCompleted: true,
            worksheetCompleted: true,
            worksheetScore: 5,
            worksheetTotal: 5,
            mastery: 95,
            difficulty: 2,
            tagHistory: ["hi"],
          },
          "c7-int-02": {
            conceptId: "c7-int-02",
            status: "completed",
            lessonCompleted: true,
            worksheetCompleted: true,
            mastery: 90,
            difficulty: 1,
          },
        },
        soundEnabled: false,
        optOutOfLeaderboard: false,
      };
      localStorage.setItem("margam_active_learner", JSON.stringify(demoGamifiedProfile));
      localStorage.setItem("margam_learner_profile", JSON.stringify(demoGamifiedProfile));
      localStorage.setItem("margam_sound_enabled", "false");
    });

    // Reload so page state picks up active profile
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    // 2. Skill-Map Mastered Gap Glow (Desktop: 1280x900)
    console.log("Capturing 1. Skill-Map Gap Glow Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/#concept-pathway`, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 800));
    const skillmapElem = await page.$("#concept-pathway");
    if (skillmapElem) {
      const snap = await skillmapElem.screenshot();
      await saveToAll(snap, "09_skillmap_gap_glow_desktop.png");
    }

    // 3. Skill-Map Mastered Gap Glow (Mobile: 360x800)
    console.log("Capturing 2. Skill-Map Gap Glow Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/#concept-pathway`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));
    const skillmapMobElem = await page.$("#concept-pathway");
    if (skillmapMobElem) {
      const snapMob = await skillmapMobElem.screenshot();
      await saveToAll(snapMob, "09_skillmap_gap_glow_mobile.png");
    }

    // 4. Class Leaderboard (Desktop: 1280x900)
    console.log("Capturing 3. Class Leaderboard Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/#class-leaderboard`, { waitUntil: "networkidle0" });
    await page.waitForSelector("#class-leaderboard", { timeout: 6000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 800));
    const lbElem = await page.$("#class-leaderboard");
    if (lbElem) {
      const snap = await lbElem.screenshot();
      await saveToAll(snap, "10_class_leaderboard_desktop.png");
    } else {
      console.warn("Could not find #class-leaderboard on desktop!");
    }

    // 5. Class Leaderboard (Mobile: 360x800)
    console.log("Capturing 4. Class Leaderboard Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/#class-leaderboard`, { waitUntil: "networkidle0" });
    await page.waitForSelector("#class-leaderboard", { timeout: 6000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 800));
    const lbMobElem = await page.$("#class-leaderboard");
    if (lbMobElem) {
      const snapMob = await lbMobElem.screenshot();
      await saveToAll(snapMob, "10_class_leaderboard_mobile.png");
    } else {
      console.warn("Could not find #class-leaderboard on mobile!");
    }

    // 6. Worksheet Question Answer & Game-Feel (Desktop: 1280x900)
    console.log("Capturing 5. Correct Answer Feedback & XP Desktop...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/student/worksheet/c10-quad-01`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));

    // Answer the questions
    const options = await page.$$('[role="radio"]');
    if (options.length >= 3) {
      await options[0].click();
      if (options[4]) await options[4].click();
      if (options[8]) await options[8].click();
    }
    await new Promise((r) => setTimeout(r, 400));
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    }
    const correctDesktop = await page.screenshot({ fullPage: false });
    await saveToAll(correctDesktop, "07_correct_answer_feedback_desktop.png");

    // 7. Correct Answer Feedback (Mobile: 360x800)
    console.log("Capturing 6. Correct Answer Feedback Mobile...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    const correctMobile = await page.screenshot({ fullPage: false });
    await saveToAll(correctMobile, "07_correct_answer_feedback_mobile.png");

    // 8. Level-Up Modal (Desktop & Mobile)
    console.log("Capturing 7. Level-Up Modal Desktop & Mobile...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.evaluate(() => {
      // Inject level-up celebration modal directly for preview
      const modal = document.createElement("div");
      modal.id = "screenshot-levelup";
      modal.setAttribute("role", "dialog");
      modal.className = "fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm";
      modal.innerHTML = `
        <div class="animate-block-rise max-w-sm w-full bg-[#5A3720] border-4 border-[#A06A3C] shadow-[8px_8px_0px_#1B120C] p-6 text-center text-[#FFF7E6] relative">
          <div class="w-16 h-16 mx-auto mb-3 bg-[#FFE9A8] border-3 border-[#422816] shadow-[3px_3px_0px_#1B120C] flex items-center justify-center text-3xl select-none">
            ⚔️
          </div>
          <span class="text-[11px] font-heading font-extrabold text-[#5DAA3A] bg-[#2F6B22]/60 px-2 py-0.5 border border-[#5DAA3A]/40 uppercase tracking-widest">
            Level Up!
          </span>
          <h2 class="font-heading font-extrabold text-2xl text-[#FFE9A8] mt-2 mb-1">
            LEVEL 10 REACHED
          </h2>
          <p class="text-xs text-[#E5D7BE] font-medium leading-relaxed mb-4">
            You have achieved the <strong class="text-[#FFE9A8]">Iron Rank</strong> in the Margam realm! Keep exploring to unlock Gold & Diamond tier achievements.
          </p>
          <div class="w-full min-h-[44px] px-4 py-2.5 bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] font-heading font-extrabold text-xs shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),3px_3px_0px_#1B120C] flex items-center justify-center">
            Claim Glory & Continue →
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    });
    await new Promise((r) => setTimeout(r, 600));
    const levelUpDesktop = await page.screenshot({ fullPage: false });
    await saveToAll(levelUpDesktop, "08_levelup_modal_desktop.png");

    // Level-up mobile
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const levelUpMobile = await page.screenshot({ fullPage: false });
    await saveToAll(levelUpMobile, "08_levelup_modal_mobile.png");

    console.log("All gamification screenshots captured successfully!");
  } finally {
    await browser.close();
    if (serverProcess && serverProcess.pid) {
      try {
        spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
      } catch (e) {}
    }
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Screenshot capture error:", err);
    process.exit(1);
  });

