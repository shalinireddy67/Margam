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

console.log("====================================================================================================================");
console.log("                                     MARGAM — CHAPTER QUESTION COVERAGE REPORT                                      ");
console.log("====================================================================================================================\n");

let totalReady = 0;
let totalNotReady = 0;
let totalVerifiedQuestions = 0;
const notReadyList = [];

// Group by Class (6 to 10)
const classes = [6, 7, 8, 9, 10];

console.log(
  `Class | ${"Chapter ID".padEnd(10)} | ${"Chapter Title".padEnd(34)} | ${"Verified Questions".padEnd(18)} | ${"D1 / D2 / D3 Counts".padEnd(20)} | Status`
);
console.log(
  `------+------------+------------------------------------+--------------------+----------------------+-----------`
);

for (const grade of classes) {
  const gradeChapters = chapters.filter((c) => c.class === grade);

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

    // Exact verification rule: question is verified if q.verified !== false
    const verifiedQuestions = questions.filter((q) => q.verified !== false);

    const d1 = verifiedQuestions.filter((q) => q.difficulty === 1).length;
    const d2 = verifiedQuestions.filter((q) => q.difficulty === 2).length;
    const d3 = verifiedQuestions.filter((q) => q.difficulty === 3).length;
    const total = verifiedQuestions.length;

    totalVerifiedQuestions += total;

    // Exact eligibility rule: total verified questions >= 6
    const isReady = total >= 6;
    if (isReady) {
      totalReady++;
    } else {
      totalNotReady++;
      const neededTotal = Math.max(0, 6 - total);
      const neededD1 = Math.max(0, 2 - d1);
      const neededD2 = Math.max(0, 2 - d2);
      const neededD3 = Math.max(0, 2 - d3);
      notReadyList.push({
        class: grade,
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        title: ch.name?.en || ch.name || ch.id,
        current: total,
        d1,
        d2,
        d3,
        neededTotal,
        neededD1,
        neededD2,
        neededD3,
      });
    }

    const statusLabel = isReady ? "READY" : "NOT READY";
    const chName = ch.name?.en || ch.name || ch.id;
    const truncatedName = chName.length > 34 ? chName.slice(0, 31) + "..." : chName;
    const dCounts = `D1: ${d1} | D2: ${d2} | D3: ${d3}`;

    console.log(
      `  ${String(grade).padEnd(3)} | ${ch.id.padEnd(10)} | ${truncatedName.padEnd(34)} | ${String(total).padStart(10).padEnd(18)} | ${dCounts.padEnd(20)} | ${statusLabel}`
    );
  }
}

console.log("\n====================================================================================================================");
console.log("TOTALS & SUMMARY");
console.log("====================================================================================================================");
console.log(`Total Chapters Analyzed:           ${chapters.length}`);
console.log(`READY (>= 6 verified questions):    ${totalReady}`);
console.log(`NOT READY (< 6 verified questions): ${totalNotReady}`);
console.log(`Total Verified Questions in Bank:  ${totalVerifiedQuestions}`);

console.log("\n====================================================================================================================");
console.log(`NOT READY CHAPTERS DEFICIT BREAKDOWN (${notReadyList.length} Chapters)`);
console.log("Questions needed to reach threshold of 6 (and balanced 2 per difficulty tier [D1, D2, D3]):");
console.log("====================================================================================================================");
console.log(
  `Class | ${"Chapter ID".padEnd(10)} | ${"Chapter Title".padEnd(34)} | Current | Needed to 6 | Balanced Deficit (D1 / D2 / D3)`
);
console.log(
  `------+------------+------------------------------------+---------+-------------+----------------------------------`
);

for (const item of notReadyList) {
  const truncatedName = item.title.length > 34 ? item.title.slice(0, 31) + "..." : item.title;
  const balancedDeficit = `+${item.neededD1} D1 | +${item.neededD2} D2 | +${item.neededD3} D3`;
  console.log(
    `  ${String(item.class).padEnd(3)} | ${item.id.padEnd(10)} | ${truncatedName.padEnd(34)} | ${String(item.current).padStart(4).padEnd(7)} | ${("+" + item.neededTotal + " needed").padEnd(11)} | ${balancedDeficit}`
  );
}
console.log("====================================================================================================================\n");
