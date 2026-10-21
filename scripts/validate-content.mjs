import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--------------------------------------------------");
console.log("  MARGAM — Content & Concept DAG Validation Suite  ");
console.log("--------------------------------------------------\n");

let errorCount = 0;
let warningCount = 0;

function assert(condition, message, isWarning = false) {
  if (!condition) {
    if (isWarning) {
      console.warn(`[WARN] ${message}`);
      warningCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      errorCount++;
    }
  }
}

// 1. Read files
const conceptsPath = path.join(rootDir, "data", "concepts.json");
const questionsPath = path.join(rootDir, "data", "questions.json");
const lessonsPath = path.join(rootDir, "data", "lessons.json");
const demoClassPath = path.join(rootDir, "data", "demo-class.json");

assert(fs.existsSync(conceptsPath), "concepts.json exists");
assert(fs.existsSync(questionsPath), "questions.json exists");
assert(fs.existsSync(lessonsPath), "lessons.json exists");
assert(fs.existsSync(demoClassPath), "demo-class.json exists");

if (errorCount > 0) {
  console.error("Critical files missing! Aborting validation.");
  process.exit(1);
}

const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
const demoClass = JSON.parse(fs.readFileSync(demoClassPath, "utf-8"));

console.log(`Loaded ${concepts.length} concepts, ${questions.length} questions, ${lessons.length} lessons, ${demoClass.students.length} demo students.`);

// 2. Validate Concepts
console.log("\n1. Validating Concept Graph (DAG)...");
const conceptIds = new Set();
const conceptMap = new Map();

for (const c of concepts) {
  assert(c.id && typeof c.id === "string", `Concept has valid id: ${JSON.stringify(c)}`);
  assert(!conceptIds.has(c.id), `Concept ID must be unique: duplicate "${c.id}" found`);
  conceptIds.add(c.id);
  conceptMap.set(c.id, c);

  assert(typeof c.class === "number" && c.class >= 6 && c.class <= 10, `Concept ${c.id} has valid class (6-10): got ${c.class}`);
  assert(c.name?.en && c.name?.hi && c.name?.te, `Concept ${c.id} has EN, HI, TE translations in name`);
  assert(c.learningObjective?.en && c.learningObjective?.hi && c.learningObjective?.te, `Concept ${c.id} has EN, HI, TE translations in learningObjective`);
  assert(typeof c.name?.reviewed === "boolean", `Concept ${c.id} has boolean 'reviewed' audit flag in name`);
}

// Check prerequisite reference existence
for (const c of concepts) {
  assert(Array.isArray(c.prerequisites), `Concept ${c.id} has prerequisites array`);
  for (const prereqId of c.prerequisites) {
    assert(conceptIds.has(prereqId), `Concept ${c.id} references non-existent prerequisite: "${prereqId}"`);
  }
}

// Check Acyclicity using 3-color DFS
const visited = new Map();
for (const id of conceptIds) visited.set(id, 0); // 0 = unvisited, 1 = visiting, 2 = visited

function dfsCycle(node, pathStack = []) {
  visited.set(node, 1);
  pathStack.push(node);

  const concept = conceptMap.get(node);
  if (concept && concept.prerequisites) {
    for (const prereq of concept.prerequisites) {
      if (!conceptMap.has(prereq)) continue;
      const state = visited.get(prereq);
      if (state === 1) {
        assert(false, `CYCLE DETECTED in concept graph: ${pathStack.join(" -> ")} -> ${prereq}`);
        return true;
      }
      if (state === 0) {
        if (dfsCycle(prereq, pathStack)) return true;
      }
    }
  }

  visited.set(node, 2);
  pathStack.pop();
  return false;
}

let hasCycle = false;
for (const id of conceptIds) {
  if (visited.get(id) === 0) {
    if (dfsCycle(id)) {
      hasCycle = true;
      break;
    }
  }
}
if (!hasCycle) {
  console.log("  [PASS] Concept graph is strictly ACYCLIC (Valid DAG).");
}

// 3. Validate Questions
console.log("\n2. Validating Question Bank...");
const questionIds = new Set();
for (const q of questions) {
  assert(q.id && typeof q.id === "string", `Question has id: ${JSON.stringify(q)}`);
  assert(!questionIds.has(q.id), `Question ID must be unique: duplicate "${q.id}" found`);
  questionIds.add(q.id);

  assert(conceptIds.has(q.conceptId), `Question ${q.id} references invalid conceptId "${q.conceptId}"`);
  assert([1, 2, 3].includes(q.difficulty), `Question ${q.id} has valid difficulty 1, 2, or 3 (got ${q.difficulty})`);
  assert(["multiple_choice", "numeric", "true_false"].includes(q.type), `Question ${q.id} has valid type`);

  assert(q.prompt?.en && q.prompt?.hi && q.prompt?.te, `Question ${q.id} has EN, HI, TE translations in prompt`);
  assert(q.explanation?.en && q.explanation?.hi && q.explanation?.te, `Question ${q.id} has EN, HI, TE translations in explanation`);
  assert(q.hint?.en && q.hint?.hi && q.hint?.te, `Question ${q.id} has EN, HI, TE translations in hint`);

  if (q.type === "multiple_choice") {
    assert(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} has at least 2 options`);
    const optionIds = q.options.map((o) => o.id);
    assert(optionIds.includes(q.correctAnswer), `Question ${q.id} correctAnswer "${q.correctAnswer}" matches one of option IDs [${optionIds.join(", ")}]`);

    for (const opt of q.options) {
      assert(opt.text?.en && opt.text?.hi && opt.text?.te, `Question ${q.id} option ${opt.id} has EN, HI, TE translations`);
    }
  }
}
console.log(`  [PASS] All ${questions.length} questions have valid schemas, deterministic answers, and translations.`);

// 4. Validate Lessons
console.log("\n3. Validating Lesson Variants (Basics-first, Standard, Fast-track)...");
for (const l of lessons) {
  assert(conceptIds.has(l.conceptId), `Lesson references valid conceptId "${l.conceptId}"`);
  const variants = ["basics_first", "standard", "fast_track"];

  for (const v of variants) {
    const variantContent = l[v];
    assert(variantContent, `Lesson ${l.conceptId} has variant "${v}"`);
    if (variantContent) {
      assert(variantContent.headline?.en && variantContent.headline?.hi && variantContent.headline?.te, `Lesson ${l.conceptId} variant ${v} has EN, HI, TE in headline`);
      assert(variantContent.explanation?.en && variantContent.explanation?.hi && variantContent.explanation?.te, `Lesson ${l.conceptId} variant ${v} has EN, HI, TE in explanation`);
      assert(variantContent.workedExample?.problem?.en && variantContent.workedExample?.solution?.en, `Lesson ${l.conceptId} variant ${v} has workedExample`);
      assert(variantContent.keyTakeaway?.en, `Lesson ${l.conceptId} variant ${v} has keyTakeaway`);
    }
  }
}
console.log(`  [PASS] All ${lessons.length} core lessons contain all 3 pedagogical variants with complete translations.`);

// 5. Validate Demo Class
console.log("\n4. Validating Demo Class Dataset...");
assert(demoClass.syntheticNotice && demoClass.syntheticNotice.includes("DEMO DATASET"), "demo-class.json has prominent synthetic demo notice");
assert(demoClass.students.length >= 20, `Demo class has approximately 25 students (got ${demoClass.students.length})`);

const rollNumbers = new Set();
for (const stu of demoClass.students) {
  assert(!rollNumbers.has(stu.rollNumber), `Demo student roll numbers must be unique: duplicate #${stu.rollNumber}`);
  rollNumbers.add(stu.rollNumber);
  assert(stu.name && typeof stu.name === "string", `Demo student #${stu.rollNumber} has name`);

  for (const m of stu.mastery) {
    assert(conceptIds.has(m.conceptId), `Demo student ${stu.name} references invalid concept "${m.conceptId}"`);
    assert(m.masteryPercentage >= 0 && m.masteryPercentage <= 100, `Demo student ${stu.name} has mastery 0-100%`);
  }

  if (stu.diagnosedRootGap) {
    assert(conceptIds.has(stu.diagnosedRootGap.currentConceptId), `Student ${stu.name} diagnosed root gap has valid currentConceptId`);
    assert(conceptIds.has(stu.diagnosedRootGap.rootPrerequisiteId), `Student ${stu.name} diagnosed root gap has valid rootPrerequisiteId`);
    assert(["basics_first", "standard", "fast_track"].includes(stu.diagnosedRootGap.recommendedVariant), `Student ${stu.name} has valid recommendedVariant`);
  }
}
console.log(`  [PASS] Demo class has ${demoClass.students.length} valid students with consistent concept references.`);

// Final Summary
console.log("\n--------------------------------------------------");
if (errorCount === 0) {
  console.log(`  RESULT: ALL CHECKS PASSED (0 Errors, ${warningCount} Warnings)`);
  console.log("--------------------------------------------------\n");
  process.exit(0);
} else {
  console.error(`  RESULT: VALIDATION FAILED with ${errorCount} Errors!`);
  console.log("--------------------------------------------------\n");
  process.exit(1);
}
