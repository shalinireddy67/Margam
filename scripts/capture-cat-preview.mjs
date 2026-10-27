import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Save screenshots to user folder, local repo screenshots, and active conversation artifact folder
const outDirs = [
  "C:\\Users\\reddy\\kernel\\screenshots\\cat",
  path.join(process.cwd(), "screenshots", "cat"),
  "C:\\Users\\reddy\\.gemini\\antigravity-ide\\brain\\0fc55b6e-5ede-4b1d-b182-129a3f53b15f\\screenshots\\cat",
];

for (const dir of outDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/cat-preview`, (res) => {
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
  let activePort = null;
  let devProcess = null;

  for (const port of [3000, 3008, 3001, 3002]) {
    if (await checkPort(port)) {
      activePort = port;
      break;
    }
  }

  if (!activePort) {
    console.log("No running dev server found. Launching Next.js on port 3008...");
    devProcess = spawn("npx", ["next", "dev", "-p", "3008"], {
      shell: true,
      stdio: "pipe",
    });

    const ready = await waitForServer(3008, 30);
    if (!ready) {
      if (devProcess) devProcess.kill();
      throw new Error("Failed to start dev server on port 3008.");
    }
    activePort = 3008;
    console.log("Dev server successfully started on port 3008.");
  } else {
    console.log(`Connecting to existing dev server on port ${activePort}...`);
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=max"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

    const url = `http://localhost:${activePort}/cat-preview`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 35000 });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Full page overview
    const fullBuffer = await page.screenshot({ fullPage: true });
    await saveToAll(fullBuffer, "witch_cat_preview_all_poses.png");

    // 2. Contrast Rule 1 Verification section
    const contrastSection = await page.$("#section-contrast-rule");
    if (contrastSection) {
      const contrastBuffer = await contrastSection.screenshot();
      await saveToAll(contrastBuffer, "contrast_rule_verification.png");
    }

    // 3. 64px comparison section
    const compSection = await page.$("#section-64px-comparison");
    if (compSection) {
      const compBuffer = await compSection.screenshot();
      await saveToAll(compBuffer, "cat_64px_comparison.png");
    }

    // 4. Individual pose element screenshots
    const poses = ["greet", "read", "think", "cheer", "oops"];
    for (const pose of poses) {
      const section = await page.$(`#pose-${pose}`);
      if (section) {
        const poseBuffer = await section.screenshot();
        await saveToAll(poseBuffer, `pose_${pose}.png`);
      }
    }

    // 5. Hero showcase screenshot
    const heroSection = await page.$("#section-hero-showcase");
    if (heroSection) {
      const heroBuffer = await heroSection.screenshot();
      await saveToAll(heroBuffer, "hero_detail_showcase.png");
    }

    // 6. Mobile viewport capture (360px)
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 1000));

    const mobileBuffer = await page.screenshot({ fullPage: true });
    await saveToAll(mobileBuffer, "witch_cat_preview_mobile_360.png");

    console.log("\nAll preview screenshots rendered and saved successfully!");
  } finally {
    await browser.close();
    if (devProcess) {
      console.log("Shutting down spawned dev server...");
      // On Windows kill process tree
      try {
        spawn("taskkill", ["/pid", devProcess.pid.toString(), "/f", "/t"]);
      } catch (e) {
        devProcess.kill();
      }
    }
  }
}

run().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
