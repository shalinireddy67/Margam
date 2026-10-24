import puppeteer from "puppeteer-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  try {
    for (const lang of ["en", "hi", "te"]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 360, height: 800 });

      const fontResponses = [];
      page.on("response", async (res) => {
        const url = res.url();
        if (
          url.includes(".woff2") ||
          url.includes(".woff") ||
          url.includes(".ttf") ||
          res.request().resourceType() === "font"
        ) {
          let sizeBytes = 0;
          try {
            const buffer = await res.buffer();
            sizeBytes = buffer.length;
          } catch {
            const headers = res.headers();
            sizeBytes = parseInt(headers["content-length"] || "0", 10);
          }
          fontResponses.push({ url, sizeBytes });
        }
      });

      await page.goto("http://localhost:3008/", {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // If lang is hi or te, click the toggle
      if (lang !== "en") {
        await page.click(`button[data-l="${lang}"]`);
        await new Promise((r) => setTimeout(r, 800));
      }

      console.log(`\n==================================================`);
      console.log(`FONT REQUESTS FOR LANGUAGE: ${lang.toUpperCase()}`);
      console.log(`==================================================`);
      let totalKb = 0;
      fontResponses.forEach(({ url, sizeBytes }) => {
        const filename = url.split("/").pop().split("?")[0];
        const kb = sizeBytes / 1024;
        totalKb += kb;
        console.log(`  - ${filename.padEnd(50)}: ${kb.toFixed(1).padStart(5)} KB`);
      });
      console.log(`TOTAL DOWNLOADED: ${totalKb.toFixed(1)} KB`);

      if (lang === "en") {
        const indicFonts = fontResponses.filter(
          (r) =>
            r.url.toLowerCase().includes("devanagari") ||
            r.url.toLowerCase().includes("telugu")
        );
        if (indicFonts.length > 0) {
          console.error(`FAIL: English session downloaded ${indicFonts.length} Indic font files!`);
          indicFonts.forEach((f) => console.error("  Unexpected:", f.url));
          process.exitCode = 1;
        } else {
          console.log(`PROVEN: English-only session downloaded 0 Devanagari and 0 Telugu font files.`);
        }
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
