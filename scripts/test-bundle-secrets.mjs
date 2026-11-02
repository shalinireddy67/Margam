/**
 * Production Bundle Security Test
 * 
 * Verifies that:
 * 1. Answer keys and mistake tags NEVER reach student-facing browser bundles.
 * 2. Privileged server secrets (SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY,
 *    SUPABASE_SERVICE_KEY, SESSION_SECRET) NEVER appear in ANY client JavaScript bundle.
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

// 1. Gather all client JavaScript files in .next/static (all chunks, runtime, pages, app)
const allClientJsFiles = walkDir(staticDir).filter((f) => f.endsWith(".js"));

// Student-facing subset
const studentClientJsFiles = allClientJsFiles.filter((f) => !f.includes("teacher"));

// 2. Gather student-facing prerendered HTML documents in .next
const htmlFiles = walkDir(nextDir).filter((f) => f.endsWith(".html") && !f.includes("teacher"));

console.log(`Auditing:`);
console.log(`  - ${allClientJsFiles.length} total client JavaScript chunks across .next/static`);
console.log(`  - ${studentClientJsFiles.length} student-facing client JavaScript chunks`);
console.log(`  - ${htmlFiles.length} prerendered HTML documents in .next\n`);

let violations = [];

// AUDIT 1: Pedagogy Secrets in Student Bundles
const FORBIDDEN_PEDAGOGY = ["correctAnswer", "mistakeTag"];
for (const filePath of [...studentClientJsFiles, ...htmlFiles]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);

  for (const forbidden of FORBIDDEN_PEDAGOGY) {
    const regex = new RegExp(`(?<![a-zA-Z0-9_])${forbidden}(?![a-zA-Z0-9_])`);
    const match = regex.exec(content);
    if (match) {
      const idx = match.index;
      const start = Math.max(0, idx - 40);
      const snippet = content.substring(start, idx + forbidden.length + 40).replace(/\s+/g, " ");
      violations.push({
        type: "PEDAGOGY LEAK",
        file: relPath,
        forbidden,
        snippet,
      });
    }
  }
}

// AUDIT 2: Server Secrets in ALL Client JavaScript Bundles
const FORBIDDEN_SERVER_SECRETS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_KEY",
  "SESSION_SECRET",
];

for (const filePath of allClientJsFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);

  for (const secretKey of FORBIDDEN_SERVER_SECRETS) {
    const regex = new RegExp(`(?<![a-zA-Z0-9_])${secretKey}(?![a-zA-Z0-9_])`);
    const match = regex.exec(content);
    if (match) {
      const idx = match.index;
      const start = Math.max(0, idx - 40);
      const snippet = content.substring(start, idx + secretKey.length + 40).replace(/\s+/g, " ");
      violations.push({
        type: "SERVER SECRET LEAK",
        file: relPath,
        forbidden: secretKey,
        snippet,
      });
    }
  }
}

if (violations.length > 0) {
  console.error("❌ FAILED: Production bundle security violations detected!\n");
  for (const v of violations) {
    console.error(`  [${v.type}] Found '${v.forbidden}' in ${v.file}`);
    console.error(`         Context: "...${v.snippet}..."\n`);
  }
  console.error(`Total violations: ${violations.length}`);
  process.exit(1);
}

console.log("✅ [PASS] Production bundle security verification complete!");
console.log("   - Pedagogy answer keys stripped from student bundles: verified");
console.log("   - Cognitive distractor mistake tags stripped: verified");
console.log("   - Zero server-only secret keys in ALL client JavaScript chunks: verified");
console.log("   - Client bundle security audit: 100% CLEAN\n");
