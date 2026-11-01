import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(rootDir, "translations-review.csv");

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Translation CSV not found at: ${inputPath}`);
  process.exit(1);
}

// RFC 4180 compliant CSV parser
function parseCsv(content) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < content.length && content[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = "";
        i++;
        continue;
      } else if (char === '\r') {
        if (i + 1 < content.length && content[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentField);
        currentField = "";
        if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField);
        currentField = "";
        if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase());
  const result = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] !== undefined ? row[c] : "";
    }
    result.push(obj);
  }
  return result;
}

// Load dataset files
const chaptersPath = path.join(rootDir, "data", "chapters.json");
const conceptsPath = path.join(rootDir, "data", "concepts.json");
const questionsPath = path.join(rootDir, "data", "questions.json");
const lessonsPath = path.join(rootDir, "data", "lessons.json");

const chapters = JSON.parse(fs.readFileSync(chaptersPath, "utf-8"));
const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));

const chaptersMap = new Map(chapters.map(c => [c.id, c]));
const conceptsMap = new Map(concepts.map(c => [c.id, c]));
const questionsMap = new Map(questions.map(q => [q.id, q]));
const lessonsMap = new Map(lessons.map(l => [l.conceptId, l]));

function resolveLoc(idStr, rowLang) {
  let parts = idStr.split(":");
  let lang = rowLang;
  if (parts[parts.length - 1] === "hi" || parts[parts.length - 1] === "te") {
    lang = parts.pop();
  }
  const category = parts[0];
  const entityId = parts[1];
  const fieldPath = parts.slice(2).join(":");

  let entity;
  if (category === "chapters") entity = chaptersMap.get(entityId);
  else if (category === "concepts") entity = conceptsMap.get(entityId);
  else if (category === "questions") entity = questionsMap.get(entityId);
  else if (category === "lessons") entity = lessonsMap.get(entityId);

  if (!entity) return null;

  if (category === "chapters" || category === "concepts") {
    return { target: entity[fieldPath], lang, entity, category };
  }

  if (category === "questions") {
    if (fieldPath.startsWith("options:")) {
      const sub = fieldPath.split(":");
      const optId = sub[1];
      const opt = entity.options?.find(o => o.id === optId);
      return opt ? { target: opt.text, lang, entity, category } : null;
    }
    return { target: entity[fieldPath], lang, entity, category };
  }

  if (category === "lessons") {
    const p = fieldPath.split(":");
    const variant = p[0];
    const v = entity[variant];
    if (!v) return null;
    if (p[1] === "workedExample") {
      if (p[2] === "steps") {
        const idx = parseInt(p[3], 10);
        return v.workedExample?.steps?.[idx]
          ? { target: v.workedExample.steps[idx], lang, entity, category }
          : null;
      }
      return v.workedExample?.[p[2]]
        ? { target: v.workedExample[p[2]], lang, entity, category }
        : null;
    }
    return v[p[1]] ? { target: v[p[1]], lang, entity, category } : null;
  }
  return null;
}

function isApproved(row) {
  const reviewer = String(row.reviewer || "").trim().toLowerCase();
  const status = String(row.status || "").trim().toLowerCase();
  const reviewed = String(row.reviewed || "").trim().toLowerCase();

  const approvalTerms = ["approved", "approve", "yes", "true", "ok", "pass", "verified"];
  
  if (approvalTerms.some(term => status === term || status.includes("approve"))) {
    return true;
  }
  if (approvalTerms.some(term => reviewer === term || reviewer.includes("approve"))) {
    return true;
  }
  if (reviewed === "true") {
    return true;
  }
  return false;
}

const fileContent = fs.readFileSync(inputPath, "utf-8");
const parsedRows = parseCsv(fileContent);

let approvedCount = 0;
let correctedCount = 0;
let touchedChapters = false;
let touchedConcepts = false;
let touchedQuestions = false;
let touchedLessons = false;
const modifiedQuestionIds = new Set();

for (const row of parsedRows) {
  const id = row.id;
  if (!id) continue;

  const lang = row.lang || (id.endsWith(":te") ? "te" : "hi");
  const res = resolveLoc(id, lang);
  if (!res || !res.target) {
    console.warn(`[WARN] Could not resolve ID: ${id}`);
    continue;
  }

  const { target, entity, category } = res;
  const targetLang = res.lang;

  // 1. Check for corrected translation
  const correction = (row.correctedtranslation || row.corrected_translation || "").trim();
  const csvTranslation = (row.translation || "").trim();

  if (correction && correction !== target[targetLang]) {
    target[targetLang] = correction;
    correctedCount++;
    if (category === "chapters") touchedChapters = true;
    if (category === "concepts") touchedConcepts = true;
    if (category === "questions") {
      touchedQuestions = true;
      modifiedQuestionIds.add(entity.id);
    }
    if (category === "lessons") touchedLessons = true;
  } else if (!correction && csvTranslation && csvTranslation !== target[targetLang]) {
    target[targetLang] = csvTranslation;
    correctedCount++;
    if (category === "chapters") touchedChapters = true;
    if (category === "concepts") touchedConcepts = true;
    if (category === "questions") {
      touchedQuestions = true;
      modifiedQuestionIds.add(entity.id);
    }
    if (category === "lessons") touchedLessons = true;
  }

  // 2. Check for reviewer approval
  if (isApproved(row)) {
    if (target.reviewed !== true) {
      target.reviewed = true;
      approvedCount++;
      if (category === "chapters") touchedChapters = true;
      if (category === "concepts") touchedConcepts = true;
      if (category === "questions") {
        touchedQuestions = true;
        modifiedQuestionIds.add(entity.id);
      }
      if (category === "lessons") touchedLessons = true;
    }
  }
}

// Save modified datasets
if (touchedChapters) {
  fs.writeFileSync(chaptersPath, JSON.stringify(chapters, null, 2) + "\n", "utf-8");
  console.log(`Saved updated: ${chaptersPath}`);
}

if (touchedConcepts) {
  fs.writeFileSync(conceptsPath, JSON.stringify(concepts, null, 2) + "\n", "utf-8");
  console.log(`Saved updated: ${conceptsPath}`);
}

if (touchedQuestions) {
  fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2) + "\n", "utf-8");
  console.log(`Saved updated: ${questionsPath}`);

  // Also update affected data/questions/*.json per-chapter files
  const chapterMap = {
    "c6-ch01": "c6-ch01.json",
    "c6-ch02": "c6-ch02.json",
    "c6-ch10": "c6-ch10.json",
    "c7-ch01": "c7-ch01.json",
    "c7-ch02": "c7-ch02.json",
    "c7-ch10": "c7-ch10.json",
    "c8-ch01": "c8-ch01.json",
    "c8-ch02": "c8-ch02.json",
    "c8-ch06": "c8-ch06.json",
    "c9-ch01": "c9-ch01.json",
    "c9-ch02": "c9-ch02.json",
    "c9-ch04": "c9-ch04.json",
    "c10-ch01": "c10-ch01.json",
    "c10-ch02": "c10-ch02.json",
    "c10-ch04": "c10-ch04.json"
  };

  const conceptToChapter = new Map(concepts.map(c => [c.id, c.chapterId]));

  const chaptersToRewrite = new Set();
  for (const qId of modifiedQuestionIds) {
    const q = questionsMap.get(qId);
    if (q && conceptToChapter.has(q.conceptId)) {
      chaptersToRewrite.add(conceptToChapter.get(q.conceptId));
    }
  }

  for (const chapterId of chaptersToRewrite) {
    const fileName = chapterMap[chapterId];
    if (fileName) {
      const chapterQuestions = questions.filter(q => conceptToChapter.get(q.conceptId) === chapterId);
      const filePath = path.join(rootDir, "data", "questions", fileName);
      fs.writeFileSync(filePath, JSON.stringify(chapterQuestions, null, 2) + "\n", "utf-8");
      console.log(`Saved synced chapter file: ${filePath}`);
    }
  }
}

if (touchedLessons) {
  fs.writeFileSync(lessonsPath, JSON.stringify(lessons, null, 2) + "\n", "utf-8");
  console.log(`Saved updated: ${lessonsPath}`);
}

console.log("\n--------------------------------------------------");
console.log("  Translations Import Summary                     ");
console.log("--------------------------------------------------");
console.log(`  Rows processed        : ${parsedRows.length}`);
console.log(`  Items approved        : ${approvedCount}`);
console.log(`  Translations updated  : ${correctedCount}`);
console.log("--------------------------------------------------\n");
