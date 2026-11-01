import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const outputPath = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(rootDir, "translations-review.csv");

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const rows = [
  ["id", "lang", "english", "translation", "reviewed", "reviewer", "status", "correctedTranslation"]
];

function addEntry(idPrefix, locObj) {
  if (!locObj || typeof locObj !== "object") return;
  if (typeof locObj.en !== "string") return;

  const reviewed = Boolean(locObj.reviewed);

  // Hindi row
  if (typeof locObj.hi === "string") {
    rows.push([
      `${idPrefix}:hi`,
      "hi",
      locObj.en,
      locObj.hi,
      reviewed ? "true" : "false",
      "", // reviewer
      "", // status
      ""  // correctedTranslation
    ]);
  }

  // Telugu row
  if (typeof locObj.te === "string") {
    rows.push([
      `${idPrefix}:te`,
      "te",
      locObj.en,
      locObj.te,
      reviewed ? "true" : "false",
      "", // reviewer
      "", // status
      ""  // correctedTranslation
    ]);
  }
}

// 1. Chapters
const chaptersPath = path.join(rootDir, "data", "chapters.json");
if (fs.existsSync(chaptersPath)) {
  const chapters = JSON.parse(fs.readFileSync(chaptersPath, "utf-8"));
  for (const ch of chapters) {
    if (ch.name) {
      addEntry(`chapters:${ch.id}:name`, ch.name);
    }
  }
}

// 2. Concepts
const conceptsPath = path.join(rootDir, "data", "concepts.json");
if (fs.existsSync(conceptsPath)) {
  const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));
  for (const c of concepts) {
    if (c.name) {
      addEntry(`concepts:${c.id}:name`, c.name);
    }
    if (c.learningObjective) {
      addEntry(`concepts:${c.id}:learningObjective`, c.learningObjective);
    }
  }
}

// 3. Questions
const questionsPath = path.join(rootDir, "data", "questions.json");
if (fs.existsSync(questionsPath)) {
  const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
  for (const q of questions) {
    if (q.prompt) {
      addEntry(`questions:${q.id}:prompt`, q.prompt);
    }
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        if (opt.text) {
          addEntry(`questions:${q.id}:options:${opt.id}:text`, opt.text);
        }
      }
    }
    if (q.explanation) {
      addEntry(`questions:${q.id}:explanation`, q.explanation);
    }
    if (q.hint) {
      addEntry(`questions:${q.id}:hint`, q.hint);
    }
  }
}

// 4. Lessons
const lessonsPath = path.join(rootDir, "data", "lessons.json");
if (fs.existsSync(lessonsPath)) {
  const lessons = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
  const variants = ["basics_first", "standard", "fast_track"];

  for (const l of lessons) {
    for (const vKey of variants) {
      const v = l[vKey];
      if (!v) continue;

      if (v.headline) {
        addEntry(`lessons:${l.conceptId}:${vKey}:headline`, v.headline);
      }
      if (v.explanation) {
        addEntry(`lessons:${l.conceptId}:${vKey}:explanation`, v.explanation);
      }
      if (v.visualAnalogy) {
        addEntry(`lessons:${l.conceptId}:${vKey}:visualAnalogy`, v.visualAnalogy);
      }
      if (v.workedExample) {
        if (v.workedExample.problem) {
          addEntry(`lessons:${l.conceptId}:${vKey}:workedExample:problem`, v.workedExample.problem);
        }
        if (Array.isArray(v.workedExample.steps)) {
          v.workedExample.steps.forEach((step, idx) => {
            addEntry(`lessons:${l.conceptId}:${vKey}:workedExample:steps:${idx}`, step);
          });
        }
        if (v.workedExample.solution) {
          addEntry(`lessons:${l.conceptId}:${vKey}:workedExample:solution`, v.workedExample.solution);
        }
      }
      if (v.keyTakeaway) {
        addEntry(`lessons:${l.conceptId}:${vKey}:keyTakeaway`, v.keyTakeaway);
      }
    }
  }
}

const csvContent = rows.map(row => row.map(escapeCsv).join(",")).join("\n") + "\n";
fs.writeFileSync(outputPath, csvContent, "utf-8");

console.log(`Successfully exported ${rows.length - 1} translation strings (Hindi & Telugu) to:`);
console.log(`  ${outputPath}`);
