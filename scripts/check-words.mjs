import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--------------------------------------------------");
console.log("  MARGAM — Plain Language & Banned Words Scanner  ");
console.log("--------------------------------------------------\n");

// Banned words in student-facing UI copy per Phase 1 specification
const BANNED_WORDS = [
  "journey",
  "realm",
  "portal",
  "empower",
  "seamless",
  "leverage",
  "tailored",
  "pinpoint",
  "real-time",
  "minecraft",
];

// Folders and files to scan (student-facing screens & components)
const TARGET_DIRS = [
  path.join(rootDir, "src", "app"),
  path.join(rootDir, "src", "components"),
];

const EXTRA_FILES = [
  path.join(rootDir, "src", "lib", "greetings.ts"),
];

// Ignored paths (APIs, server infrastructure, teacher-only pages, tests, styles)
const IGNORE_PATTERNS = [
  path.join(rootDir, "src", "app", "api"),
  path.join(rootDir, "src", "app", "teacher"),
  path.join(rootDir, "src", "app", "terms"),
  path.join(rootDir, "src", "app", "privacy"),
  path.join(rootDir, "src", "app", "cookies"),
  ".test.",
  ".spec.",
];

function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern));
}

function collectFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && !shouldIgnore(fullPath)) {
        results = results.concat(collectFiles(fullPath));
      }
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      if (!shouldIgnore(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

let allFiles = [];
for (const d of TARGET_DIRS) {
  allFiles = allFiles.concat(collectFiles(d));
}
for (const f of EXTRA_FILES) {
  if (fs.existsSync(f)) allFiles.push(f);
}

let bannedCount = 0;
let longSentenceCount = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1;
    const trimmed = line.trim();

    // Skip import statements, code comments, and SVG path data
    if (
      trimmed.startsWith("import ") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*") ||
      trimmed.includes("<path") ||
      trimmed.includes("d=\"M")
    ) {
      return;
    }

    // 1. Check for banned words in user-visible lines
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(line)) {
        // Exclude internal code symbols if harmless
        if (line.includes(`"${word}"`) || line.includes(`'${word}'`) || line.includes(`>${word}<`) || line.includes(word)) {
          console.warn(`[BANNED WORD] ${relPath}:${lineNum} - contains "${word}":`);
          console.warn(`  --> ${trimmed.slice(0, 90)}`);
          bannedCount++;
        }
      }
    }

    // 2. Check for overly long English sentences (> 15 words) in user-facing JSX text or string literals
    // Look for text between JSX tags or string quotes
    const textMatches = line.match(/>([^<>{}]*)</g);
    if (textMatches) {
      for (const m of textMatches) {
        const text = m.replace(/[><]/g, "").trim();
        if (text && !text.includes("className") && !text.includes("http")) {
          const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
          for (const s of sentences) {
            const words = s.split(/\s+/).filter(Boolean);
            if (words.length > 15) {
              console.warn(`[LONG SENTENCE (>15 words)] ${relPath}:${lineNum} (${words.length} words):`);
              console.warn(`  --> "${s.slice(0, 90)}..."`);
              longSentenceCount++;
            }
          }
        }
      }
    }
  });
}

console.log("\n--------------------------------------------------");
console.log(`Scan finished: ${allFiles.length} files audited.`);
console.log(`Banned words found: ${bannedCount}`);
console.log(`Sentences > 15 words found: ${longSentenceCount}`);
console.log("--------------------------------------------------\n");

if (bannedCount > 0) {
  process.exit(1);
} else {
  console.log("  [PASS] No banned words found in student-facing UI.");
  process.exit(0);
}

