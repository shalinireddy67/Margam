import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const chaptersPath = path.join(rootDir, "data", "chapters.json");
const questionsDir = path.join(rootDir, "data", "questions");

if (!fs.existsSync(chaptersPath)) {
  console.error("Missing data/chapters.json");
  process.exit(1);
}

const chapters = JSON.parse(fs.readFileSync(chaptersPath, "utf-8"));

console.log("=========================================================================================");
console.log("                       MARGAM — CHAPTER QUESTION COVERAGE REPORT                         ");
console.log("=========================================================================================\n");

let totalReady = 0;
let totalNotReady = 0;
let totalVerifiedQuestions = 0;

// Group by Class (6 to 10)
const classes = [6, 7, 8, 9, 10];

for (const grade of classes) {
  const gradeChapters = chapters.filter((c) => c.class === grade);
  console.log(`-----------------------------------------------------------------------------------------`);
  console.log(`  CLASS ${grade} (${gradeChapters.length} Chapters)`);
  console.log(`-----------------------------------------------------------------------------------------`);
  console.log(
    `  ${"ID".padEnd(10)} | ${"Ch#".padEnd(4)} | ${"Chapter Name".padEnd(30)} | ${"Diff 1".padEnd(6)} | ${"Diff 2".padEnd(6)} | ${"Diff 3".padEnd(6)} | ${"Total".padEnd(5)} | ${"Status"}`
  );
  console.log(`  ${"-".repeat(10)}-+-${"-".repeat(4)}-+-${"-".repeat(30)}-+-${"-".repeat(6)}-+-${"-".repeat(6)}-+-${"-".repeat(6)}-+-${"-".repeat(5)}-+-${"-".repeat(10)}`);

  for (const ch of gradeChapters) {
    const qFile = path.join(questionsDir, `${ch.id}.json`);
    let questions = [];

    if (fs.existsSync(qFile)) {
      try {
        questions = JSON.parse(fs.readFileSync(qFile, "utf-8"));
      } catch (err) {
        console.error(`Error reading ${qFile}:`, err.message);
      }
    }

    // A question is verified if verified !== false
    const verifiedQuestions = questions.filter((q) => q.verified !== false);

    const d1 = verifiedQuestions.filter((q) => q.difficulty === 1).length;
    const d2 = verifiedQuestions.filter((q) => q.difficulty === 2).length;
    const d3 = verifiedQuestions.filter((q) => q.difficulty === 3).length;
    const total = verifiedQuestions.length;

    totalVerifiedQuestions += total;

    const isReady = total >= 6;
    if (isReady) {
      totalReady++;
    } else {
      totalNotReady++;
    }

    const statusLabel = isReady ? "\x1b[32mREADY\x1b[0m" : "\x1b[31mNOT READY\x1b[0m";
    const chName = ch.name?.en || ch.name || ch.id;
    const truncatedName = chName.length > 30 ? chName.slice(0, 27) + "..." : chName;

    console.log(
      `  ${ch.id.padEnd(10)} | ${String(ch.chapterNumber).padStart(2).padEnd(4)} | ${truncatedName.padEnd(30)} | ${String(d1).padStart(3).padEnd(6)} | ${String(d2).padStart(3).padEnd(6)} | ${String(d3).padStart(3).padEnd(6)} | ${String(total).padStart(3).padEnd(5)} | ${statusLabel}`
    );
  }
  console.log("\n");
}

console.log("=========================================================================================");
console.log(`SUMMARY:`);
console.log(`  Total Chapters:           ${chapters.length}`);
console.log(`  READY (>= 6 questions):   \x1b[32m${totalReady}\x1b[0m`);
console.log(`  NOT READY (< 6 questions): \x1b[31${totalNotReady > 0 ? "m" : "2m"}${totalNotReady}\x1b[0m`);
console.log(`  Total Verified Questions: ${totalVerifiedQuestions}`);
console.log("=========================================================================================");

