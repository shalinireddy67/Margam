import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// External artifact directory outside repo
const externalDir = "C:\\Users\\reddy\\.gemini\\antigravity-ide\\brain\\23cf73e6-37f4-4a19-b3c2-71392b274026\\screenshots";
const localDir = path.join(process.cwd(), "screenshots");

[externalDir, localDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function isServerRunning(port = 3008) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/design-system`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
  });
}

async function run() {
  console.log("==================================================");
  console.log("  MARGAM — Layout Overflow & Visual Check Suite   ");
  console.log("==================================================\n");

  let spawnedServer = null;
  const running = await isServerRunning(3008);
  if (!running) {
    console.log("Starting Next.js dev server on port 3008...");
    spawnedServer = spawn("npx", ["next", "dev", "-p", "3008"], {
      shell: true,
      stdio: "ignore",
      env: { ...process.env, PORT: "3008" },
    });
    // Wait for server
    let ready = false;
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (await isServerRunning(3008)) {
        ready = true;
        break;
      }
    }
    if (!ready) {
      console.error("Failed to start server on port 3008");
      process.exit(1);
    }
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  let hasFailure = false;
  const screenshots = [];

  try {
    const testCases = [
      { width: 360, height: 800, lang: "en", label: "Mobile (360x800) EN" },
      { width: 360, height: 800, lang: "hi", label: "Mobile (360x800) HI" },
      { width: 360, height: 800, lang: "te", label: "Mobile (360x800) TE" },
      { width: 1280, height: 900, lang: "en", label: "Desktop (1280x900) EN" },
      { width: 1280, height: 900, lang: "hi", label: "Desktop (1280x900) HI" },
      { width: 1280, height: 900, lang: "te", label: "Desktop (1280x900) TE" },
    ];

    for (const tc of testCases) {
      const page = await browser.newPage();
      await page.setViewport({ width: tc.width, height: tc.height });

      await page.goto("http://localhost:3008/design-system", {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Switch language if needed
      if (tc.lang !== "en") {
        await page.click(`button[data-l="${tc.lang}"]`);
        await new Promise((r) => setTimeout(r, 600));
      }

      // Check overflow
      const layoutData = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollWidth = root.scrollWidth;
        const clientWidth = root.clientWidth;
        const bodyScrollWidth = body ? body.scrollWidth : 0;
        const overflow = scrollWidth > clientWidth || bodyScrollWidth > clientWidth;

        // Find elements causing overflow if any
        let badElements = [];
        if (overflow) {
          document.querySelectorAll("*").forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientWidth + 1) {
              badElements.push({
                tag: el.tagName,
                className: el.className,
                right: rect.right,
                clientWidth,
              });
            }
          });
        }

        return {
          scrollWidth,
          clientWidth,
          bodyScrollWidth,
          overflow,
          badElements: badElements.slice(0, 3),
        };
      });

      const shotName = `design-system_${tc.lang}_${tc.width}x${tc.height}.png`;
      const extPath = path.join(externalDir, shotName);
      const localPath = path.join(localDir, shotName);

      await page.screenshot({ path: extPath, fullPage: true });
      fs.copyFileSync(extPath, localPath);
      screenshots.push({ tc, extPath, localPath });

      const status = layoutData.overflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)";
      if (layoutData.overflow) {
        hasFailure = true;
        console.error(
          `[${status}] ${tc.label}: scrollWidth=${layoutData.scrollWidth} > clientWidth=${layoutData.clientWidth}`
        );
        if (layoutData.badElements.length > 0) {
          console.error("  Overflow elements:", JSON.stringify(layoutData.badElements));
        }
      } else {
        console.log(
          `[${status}] ${tc.label.padEnd(26)}: scrollWidth=${layoutData.scrollWidth} <= clientWidth=${layoutData.clientWidth}`
        );
      }

      await page.close();
    }
  } finally {
    await browser.close();
    if (spawnedServer) {
      spawnedServer.kill();
      try {
        spawn("taskkill", ["/pid", spawnedServer.pid.toString(), "/f", "/t"]);
      } catch {}
    }
  }

  console.log("\nSaved Screenshots (both external and local in .gitignore):");
  screenshots.forEach(({ tc, extPath }) => {
    console.log(`  - ${tc.label.padEnd(26)}: ${extPath}`);
  });

  if (hasFailure) {
    console.error("\nRESULT: check:layout FAILED — Horizontal overflow detected!");
    process.exit(1);
  } else {
    console.log("\nRESULT: check:layout PASSED — All 6 viewports and languages have 0 horizontal overflow.");
  }
}

run().catch((err) => {
  console.error("check:layout error:", err);
  process.exit(1);
});
