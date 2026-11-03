import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const outDirs = [
  path.join(process.cwd(), "screenshots", "login"),
  "C:\\Users\\pbala\\.gemini\\antigravity\\brain\\9c709130-55ac-45c2-be66-97a5f14dcdb5\\screenshots\\login",
];

for (const dir of outDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/login`, (res) => {
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
  console.log(`Saved screenshot: ${filename}`);
}

async function run() {
  const port = 3012;
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

    // 1. Mobile 360x800
    console.log("\nCapturing 360x800 mobile viewports...");
    await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/login`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 500));

    // Mobile Panel Closed (full page)
    const mobileClosedBuf = await page.screenshot({ fullPage: true });
    await saveToAll(mobileClosedBuf, "login_360x800_panel_closed.png");

    // Open details element
    await page.evaluate(() => {
      const details = document.querySelector("details");
      if (details) details.open = true;
    });
    await new Promise((r) => setTimeout(r, 500));

    // Mobile Panel Open (full page)
    const mobileOpenBuf = await page.screenshot({ fullPage: true });
    await saveToAll(mobileOpenBuf, "login_360x800_panel_open.png");

    // 2. Desktop 1440x900
    console.log("\nCapturing 1440x900 desktop viewports...");
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${port}/login`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 500));

    // Desktop Panel Closed (full page)
    const desktopClosedBuf = await page.screenshot({ fullPage: true });
    await saveToAll(desktopClosedBuf, "login_1440x900_panel_closed.png");

    // Open details element
    await page.evaluate(() => {
      const details = document.querySelector("details");
      if (details) details.open = true;
    });
    await new Promise((r) => setTimeout(r, 500));

    // Desktop Panel Open (full page)
    const desktopOpenBuf = await page.screenshot({ fullPage: true });
    await saveToAll(desktopOpenBuf, "login_1440x900_panel_open.png");

    console.log("\nAll 4 login screenshots captured successfully!");
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

