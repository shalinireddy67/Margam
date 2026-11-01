/**
 * Production Bundle Security Test
 * 
 * Verifies that answer keys and mistake tags NEVER reach the browser.
 * Greps all production HTML files and client JS bundles (.next/static)
 * to ensure that neither 'correctAnswer' nor 'mistakeTag' strings exist.
 */

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const nextDir = path.join(rootDir, ".next");
const staticDir = path.join(nextDir, "static");

console.log("--------------------------------------------------");
console.log("  MARGAM — Production Bundle Secret Leak Audit    ");
console.log("--------------------------------------------------");

if (!fs.existsSync(nextDir) || !fs.existsSync(staticDir)) {
  console.error("FATAL: .next/static directory not found. Please run 'npm run build' first.");
  process.exit(1);
}

function walkDir(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// 1. Gather all student-facing and shared client JS files in .next/static
const clientJsFiles = walkDir(staticDir).filter((f) => f.endsWith(".js") && !f.includes("teacher"));

// 2. Gather all student-facing prerendered HTML documents in .next
const htmlFiles = walkDir(nextDir).filter((f) => f.endsWith(".html") && !f.includes("teacher"));

console.log(`Auditing:`);
console.log(`  - ${clientJsFiles.length} client JavaScript chunks in .next/static (excluding role-gated teacher portal)`);
console.log(`  - ${htmlFiles.length} prerendered HTML documents in .next\n`);

const FORBIDDEN_STRINGS = ["correctAnswer", "mistakeTag"];
let violations = [];

for (const filePath of [...clientJsFiles, ...htmlFiles]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);

  for (const forbidden of FORBIDDEN_STRINGS) {
    // Exact word boundary check to avoid false positives on 'mistakeTagHistory'
    const regex = new RegExp(`(?<![a-zA-Z0-9_])${forbidden}(?![a-zA-Z0-9_])`);
    const match = regex.exec(content);
    if (match) {
      // Find approximate context
      const idx = match.index;
      const start = Math.max(0, idx - 40);
      const snippet = content.substring(start, idx + forbidden.length + 40).replace(/\s+/g, " ");
      violations.push({
        file: relPath,
        forbidden,
        snippet,
      });
    }
  }
}

if (violations.length > 0) {
  console.error("❌ FAILED: Production bundles leak answer keys or diagnostic mistake tags!\n");
  for (const v of violations) {
    console.error(`  [LEAK] Found '${v.forbidden}' in ${v.file}`);
    console.error(`         Context: "...${v.snippet}..."\n`);
  }
  console.error(`Total violations: ${violations.length}`);
  process.exit(1);
}

console.log("✅ [PASS] Zero occurrences of 'correctAnswer' and 'mistakeTag' in production bundles!");
console.log("   - Answer keys stripped: verified");
console.log("   - Distractor mistake tags stripped: verified");
console.log("   - Client bundle security audit: CLEAN\n");
