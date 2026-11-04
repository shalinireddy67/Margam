import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(process.cwd(), "src");

// Patterns that identify prohibited white values in UI code
const PROHIBITED_PATTERNS = [
  { name: "#FFF / #FFFFFF hex code", regex: /#(?:fff|ffffff)\b/i },
  { name: "rgb(255, 255, 255)", regex: /rgb\s*\(\s*255\s*,\s*255\s*,\s*255/i },
  { name: "rgba(255, 255, 255, ...)", regex: /rgba\s*\(\s*255\s*,\s*255\s*,\s*255/i },
  { name: "Tailwind white class", regex: /\b(?:bg|text|border|ring|divide)-white(?:\/\d+)?\b/ },
  { name: "Tailwind gray-50..100 class", regex: /\b(?:bg|text|border)-(?:gray|slate|zinc|neutral)-(?:50|100)\b/ },
];

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walk(SRC_DIR);
let violations = [];

for (const file of allFiles) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const lines = fs.readFileSync(file, "utf8").split("\n");

  lines.forEach((line, idx) => {
    // Skip comments and SVG raw paths if any
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return;

    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.regex.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          rule: pattern.name,
          text: trimmed.substring(0, 100),
        });
        break;
      }
    }
  });
}

console.log("--------------------------------------------------");
console.log("  MARGAM — 'NO WHITE' Audit Scanner (Phase 2)     ");
console.log("--------------------------------------------------");
console.log(`Audited ${allFiles.length} files in src/`);

if (violations.length === 0) {
  console.log("--------------------------------------------------");
  console.log("  [PASS] 0 prohibited white values found in src/!");
  console.log("--------------------------------------------------");
  process.exit(0);
} else {
  console.log(`Found ${violations.length} violations:`);
  violations.slice(0, 30).forEach((v) => {
    console.log(`  ${v.file}:${v.line} - [${v.rule}]`);
    console.log(`    ${v.text}`);
  });
  if (violations.length > 30) {
    console.log(`  ... and ${violations.length - 30} more violations.`);
  }
  console.log("--------------------------------------------------");
  console.log("  [FAIL] Remove prohibited white values from src/.");
  console.log("--------------------------------------------------");
  process.exit(1);
}

