import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const outDirs = [
  path.join(process.cwd(), "screenshots", "landing"),
  "C:\\Users\\pbala\\.gemini\\antigravity\\brain\\9c709130-55ac-45c2-be66-97a5f14dcdb5\\screenshots\\landing",
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

async function run() {
  const port = 3010;
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

    // Clear local storage so it renders landing page (!profile)
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    const languages = [
      { code: "en", label: "EN" },
      { code: "hi", label: "HI" },
      { code: "te", label: "TE" },
    ];

    const viewports = [
      { name: "360x800_mobile", width: 360, height: 800, scale: 2 },
      { name: "1440x900_desktop", width: 1440, height: 900, scale: 1 },
    ];

    for (const vp of viewports) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.scale,
      });

      for (const lang of languages) {
        await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });
        await page.evaluate(() => {
          localStorage.clear();
        });

        // Click the language button if not already selected
        if (lang.code !== "en") {
          // Find language button
          await page.evaluate((code) => {
            const btns = Array.from(document.querySelectorAll("button"));
            const targetBtn = btns.find(b => b.textContent && (
              (code === "hi" && (b.textContent.includes("हिन्दी") || b.textContent.includes("HI"))) ||
              (code === "te" && (b.textContent.includes("తెలుగు") || b.textContent.includes("TE")))
            ));
            if (targetBtn) {
              targetBtn.click();
            }
          }, lang.code);

          await new Promise(r => setTimeout(r, 600));
        }

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            scrollWidth,
            clientWidth,
            hasOverflow: scrollWidth > clientWidth,
          };
        });

        console.log(`[${vp.name}] [Lang: ${lang.code}] Overflow check: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, hasOverflow=${overflow.hasOverflow}`);

        const filename = `landing_${lang.code}_${vp.name}.png`;
        const buf = await page.screenshot({ fullPage: true });
        await saveToAll(buf, filename);
      }
    }

    console.log("All landing theme screenshots captured successfully!");
    process.exit(0);
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
