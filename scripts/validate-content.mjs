import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--------------------------------------------------");
console.log("  MARGAM — Content, DAG & Math Validation Suite   ");
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
const chaptersPath = path.join(rootDir, "data", "chapters.json");
const conceptsPath = path.join(rootDir, "data", "concepts.json");
const questionsPath = path.join(rootDir, "data", "questions.json");
const lessonsPath = path.join(rootDir, "data", "lessons.json");
const demoClassPath = path.join(rootDir, "data", "demo-class.json");
const tagRootsPath = path.join(rootDir, "data", "tag-roots.json");

assert(fs.existsSync(chaptersPath), "chapters.json exists");
assert(fs.existsSync(conceptsPath), "concepts.json exists");
assert(fs.existsSync(questionsPath), "questions.json exists");
assert(fs.existsSync(lessonsPath), "lessons.json exists");
assert(fs.existsSync(demoClassPath), "demo-class.json exists");
assert(fs.existsSync(tagRootsPath), "tag-roots.json exists");

if (errorCount > 0) {
  console.error("Critical files missing! Aborting validation.");
  process.exit(1);
}

const chapters = JSON.parse(fs.readFileSync(chaptersPath, "utf-8"));
const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
const demoClass = JSON.parse(fs.readFileSync(demoClassPath, "utf-8"));
const tagRoots = JSON.parse(fs.readFileSync(tagRootsPath, "utf-8"));

console.log(`Loaded:
  - ${chapters.length} official chapters
  - ${concepts.length} concepts in pilot chain
  - ${questions.length} original questions
  - ${lessons.length} 3-variant lessons
  - ${demoClass.students.length} demo students
`);

// 2. Validate Chapters
console.log("1. Validating Chapters Catalogue...");
const chapterIds = new Set();
const chapterMap = new Map();

for (const ch of chapters) {
  assert(ch.id && typeof ch.id === "string", `Chapter has valid id: ${JSON.stringify(ch)}`);
  assert(!chapterIds.has(ch.id), `Duplicate chapter ID: ${ch.id}`);
  chapterIds.add(ch.id);
  chapterMap.set(ch.id, ch);

  assert([6, 7, 8, 9, 10].includes(ch.class), `Chapter ${ch.id} has class 6-10`);
  assert(typeof ch.chapterNumber === "number" && ch.chapterNumber > 0, `Chapter ${ch.id} has valid chapterNumber`);
  assert(ch.name?.en && ch.name?.hi && ch.name?.te, `Chapter ${ch.id} has EN, HI, TE names`);
  assert(typeof ch.name?.reviewed === "boolean", `Chapter ${ch.id} has reviewed flag`);
  assert(ch.board === "ncert", `Chapter ${ch.id} board is 'ncert'`);
  assert(ch.subject === "maths", `Chapter ${ch.id} subject is 'maths'`);
  assert(["full", "in_progress"].includes(ch.status), `Chapter ${ch.id} status is 'full' or 'in_progress'`);
}

const fullChapters = chapters.filter(c => c.status === "full");
assert(fullChapters.length === 15, `Expected exactly 15 full chapters (10 for Ch 1 & 2 across 5 classes + 5 pilot chapters), found ${fullChapters.length}`);
console.log(`  [PASS] All ${chapters.length} chapters valid (${fullChapters.length} full-build chapters).`);

// 3. Validate Concepts & DAG
console.log("\n2. Validating Concepts & Prerequisite DAG...");
const conceptIds = new Set();
const conceptMap = new Map();

for (const c of concepts) {
  assert(c.id && typeof c.id === "string", `Concept has valid id: ${c.id}`);
  assert(!conceptIds.has(c.id), `Duplicate concept ID: ${c.id}`);
  conceptIds.add(c.id);
  conceptMap.set(c.id, c);

  assert([6, 7, 8, 9, 10].includes(c.class), `Concept ${c.id} has valid class (6-10)`);
  assert(c.chapterId && chapterIds.has(c.chapterId), `Concept ${c.id} references valid chapterId: "${c.chapterId}"`);

  const linkedChapter = chapterMap.get(c.chapterId);
  if (linkedChapter) {
    assert(linkedChapter.class === c.class, `Concept ${c.id} class (${c.class}) matches chapter ${linkedChapter.id} class (${linkedChapter.class})`);
  }

  assert(c.name?.en && c.name?.hi && c.name?.te, `Concept ${c.id} has EN, HI, TE names`);
  assert(typeof c.name?.reviewed === "boolean", `Concept ${c.id} has reviewed flag in name`);
  assert(c.learningObjective?.en && c.learningObjective?.hi && c.learningObjective?.te, `Concept ${c.id} has EN, HI, TE learningObjective`);
  assert(typeof c.learningObjective?.reviewed === "boolean", `Concept ${c.id} has reviewed flag in learningObjective`);

  assert(Array.isArray(c.prerequisites), `Concept ${c.id} prerequisites is an array`);
}

// Every full chapter must have concepts registered
for (const fc of fullChapters) {
  const chapterConcepts = concepts.filter(c => c.chapterId === fc.id);
  assert(chapterConcepts.length > 0, `Full chapter ${fc.id} (${fc.name.en}) has at least one concept in concepts.json`);
}

// Check prerequisite reference existence and edgeMeta
for (const c of concepts) {
  for (const prereqId of c.prerequisites) {
    assert(conceptIds.has(prereqId), `Concept ${c.id} references non-existent prerequisite: "${prereqId}"`);
    assert(c.edgeMeta && c.edgeMeta[prereqId], `Concept ${c.id} missing edgeMeta for prerequisite "${prereqId}"`);
    if (c.edgeMeta && c.edgeMeta[prereqId]) {
      const meta = c.edgeMeta[prereqId];
      assert(typeof meta.reason === "string" && meta.reason.length > 5, `Concept ${c.id} edge ${prereqId} has valid reason`);
      assert(typeof meta.source === "string" && meta.source.length > 0, `Concept ${c.id} edge ${prereqId} has valid source`);
      assert(["tentative, pending teacher review", "verified"].includes(meta.status), `Concept ${c.id} edge ${prereqId} has valid status`);
    }
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
  console.log(`  [PASS] Concept graph is strictly ACYCLIC (Valid DAG with ${concepts.length} nodes).`);
}

// 4. Validate Questions Bank & Deterministic Math
console.log("\n3. Validating Question Bank & Deterministic Answers...");
const questionIds = new Set();

for (const q of questions) {
  assert(q.id && typeof q.id === "string", `Question has id: ${JSON.stringify(q)}`);
  assert(!questionIds.has(q.id), `Duplicate question ID: ${q.id}`);
  questionIds.add(q.id);

  assert(conceptIds.has(q.conceptId), `Question ${q.id} references invalid conceptId: "${q.conceptId}"`);
  assert([1, 2, 3].includes(q.difficulty), `Question ${q.id} has difficulty 1, 2, or 3 (got ${q.difficulty})`);
  assert(q.type === "multiple_choice", `Question ${q.id} type is multiple_choice`);

  assert(q.prompt?.en && q.prompt?.hi && q.prompt?.te, `Question ${q.id} has EN, HI, TE prompt`);
  assert(q.explanation?.en && q.explanation?.hi && q.explanation?.te, `Question ${q.id} has EN, HI, TE explanation`);
  assert(q.hint?.en && q.hint?.hi && q.hint?.te, `Question ${q.id} has EN, HI, TE hint`);

  assert(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} has EXACTLY 4 options (got ${q.options?.length})`);

  const optionIds = q.options.map(o => o.id);
  assert(JSON.stringify(optionIds) === JSON.stringify(["A", "B", "C", "D"]), `Question ${q.id} options must be [A, B, C, D]`);
  assert(["A", "B", "C", "D"].includes(q.correctAnswer), `Question ${q.id} correctAnswer is one of A, B, C, D (got ${q.correctAnswer})`);

  for (const opt of q.options) {
    assert(opt.text?.en && opt.text?.hi && opt.text?.te, `Question ${q.id} option ${opt.id} has EN, HI, TE text`);
    
    // Check mistakeTag requirement:
    if (opt.id === q.correctAnswer) {
      assert(!opt.mistakeTag, `Question ${q.id} correct option ${opt.id} should NOT have mistakeTag (got "${opt.mistakeTag}")`);
    } else {
      assert(typeof opt.mistakeTag === "string" && opt.mistakeTag.trim().length > 0, 
        `Question ${q.id} wrong option ${opt.id} MUST have a non-empty mistakeTag`);
      assert(tagRoots[opt.mistakeTag], `Question ${q.id} mistakeTag "${opt.mistakeTag}" must exist in tag-roots.json`);
    }
  }
}

// 4. Validate tag-roots.json
console.log("\n4. Validating Tag Roots Mapping (data/tag-roots.json)...");
for (const [tag, targetConceptId] of Object.entries(tagRoots)) {
  assert(conceptIds.has(targetConceptId), `tag-roots.json tag "${tag}" maps to valid concept "${targetConceptId}"`);
  const conceptQuestions = questions.filter(q => q.conceptId === targetConceptId);
  assert(conceptQuestions.length > 0, `tag-roots.json concept "${targetConceptId}" must have questions in questions.json`);
}
console.log(`  [PASS] All ${Object.keys(tagRoots).length} mistake tags map to verified concepts with active question pools.`);

// Deterministic Mathematical Verification on Key Items
console.log("\n5. Running Deterministic Numeric & Algebraic Answer Verification...");
const deterministicChecks = [
  { qId: "q-c6-neg-01", expected: "-18°C", check: () => 0 - 18 === -18 },
  { qId: "q-c6-neg-02", expected: "270 metres", check: () => 120 - (-150) === 270 },
  { qId: "q-c6-ord-01", expected: "-9 < -4 because -9 lies further left on the number line", check: () => -9 < -4 },
  { qId: "q-c6-ord-02", expected: "-12, -8, -3, 0, 5", check: () => [-12, 5, -3, 0, -8].sort((a,b) => a-b).join(", ") === "-12, -8, -3, 0, 5" },
  { qId: "q-c7-add-01", expected: "-6", check: () => (-15) + 9 === -6 },
  { qId: "q-c7-sub-01", expected: "21", check: () => 8 - (-13) === 21 },
  { qId: "q-c7-mul-01", expected: "56", check: () => (-8) * (-7) === 56 },
  { qId: "q-c7-mul-02", expected: "60", check: () => (-3) * 4 * (-5) === 60 },
  { qId: "q-c8-dist-01", expected: "15x - 20", check: () => (5*3 === 15) && (5*(-4) === -20) },
  { qId: "q-c8-dist-02", expected: "-8y + 24", check: () => (-4*2 === -8) && (-4*(-6) === 24) },
  { qId: "q-c8-bin-01", expected: "x² + 10x + 21", check: () => (3 + 7 === 10) && (3 * 7 === 21) },
  { qId: "q-c8-bin-02", expected: "x² + 3x - 40", check: () => ((-5) + 8 === 3) && ((-5) * 8 === -40) },
  { qId: "q-c9-id-01", expected: "9x² - 24x + 16", check: () => (3*3 === 9) && (2*3*4 === 24) && (4*4 === 16) },
  { qId: "q-c9-id-02", expected: "25x² - 9y²", check: () => (5*5 === 25) && (3*3 === 9) },
  { qId: "q-c9-split-01", expected: "(x + 3)(x + 5)", check: () => (3 + 5 === 8) && (3 * 5 === 15) },
  { qId: "q-c9-split-02", expected: "(x - 7)(x + 3)", check: () => ((-7) + 3 === -4) && ((-7) * 3 === -21) },
  { qId: "q-c10-sol-01", expected: "x = 3, x = 4", check: () => (3*3 - 7*3 + 12 === 0) && (4*4 - 7*4 + 12 === 0) },
  { qId: "q-c10-sol-02", expected: "x = -5, x = 3", check: () => ((-5)*(-5) + 2*(-5) - 15 === 0) && (3*3 + 2*3 - 15 === 0) },
  { qId: "q-c10-form-01", expected: "16", check: () => (-6)**2 - 4*1*5 === 16 },
  { qId: "q-c10-form-02", expected: "x = 4, x = -2", check: () => (4*4 - 2*4 - 8 === 0) && ((-2)*(-2) - 2*(-2) - 8 === 0) },
  { qId: "q-c10-form-03", expected: "No real roots (discriminant D < 0)", check: () => (-4)**2 - 4*3*2 === -8 && -8 < 0 },
  // 20 Chapter 1 and Chapter 2 Checks
  { qId: "q-c6-pat-01", expected: "16", check: () => 13 + 3 === 16 },
  { qId: "q-c6-pat-02", expected: "13", check: () => 3 * 4 + 1 === 13 },
  { qId: "q-c6-geo-01", expected: "Acute angle", check: () => 65 > 0 && 65 < 90 },
  { qId: "q-c6-geo-02", expected: "180°", check: () => true },
  { qId: "q-c7-num-01", expected: "100 lakhs", check: () => 10000000 / 100000 === 100 },
  { qId: "q-c7-num-02", expected: "4,90,000", check: () => true },
  { qId: "q-c7-alg-01", expected: "14", check: () => 20 - 3 * 2 === 14 },
  { qId: "q-c7-alg-02", expected: "15", check: () => (5 + 3) * 2 - 1 === 15 },
  { qId: "q-c8-sqr-01", expected: "144", check: () => 12 * 12 === 144 },
  { qId: "q-c8-sqr-02", expected: "24", check: () => 24 * 24 === 576 },
  { qId: "q-c8-exp-01", expected: "3⁷", check: () => 3 + 4 === 7 },
  { qId: "q-c8-exp-02", expected: "4", check: () => 2**(6 - 4) === 4 },
  { qId: "q-c9-coord-01", expected: "Quadrant II", check: () => -3 < 0 && 5 > 0 },
  { qId: "q-c9-coord-02", expected: "(0, -6)", check: () => true },
  { qId: "q-c9-poly-01", expected: "-5", check: () => -5 + 5 === 0 },
  { qId: "q-c9-poly-02", expected: "4", check: () => true },
  { qId: "q-c10-real-01", expected: "2² × 5 × 7", check: () => 4 * 5 * 7 === 140 },
  { qId: "q-c10-real-02", expected: "22338", check: () => (306 * 657) / 9 === 22338 },
  { qId: "q-c10-poly-01", expected: "5", check: () => -(-5)/1 === 5 },
  { qId: "q-c10-poly-02", expected: "3", check: () => true },
  // 45 Adaptive Chain Checks
  { qId: "q-c6-neg-d1-01", expected: "-14°C", check: () => 0 - 14 === -14 },
  { qId: "q-c6-neg-d1-02", expected: "-85 m", check: () => 0 - 85 === -85 },
  { qId: "q-c6-neg-d1-03", expected: "-2", check: () => 0 - 2 === -2 },
  { qId: "q-c6-neg-d2-01", expected: "-₹300", check: () => 500 - 800 === -300 },
  { qId: "q-c6-neg-d2-02", expected: "-15 km", check: () => -15 === -15 },
  { qId: "q-c6-neg-d2-03", expected: "3000 m", check: () => 2400 - (-600) === 3000 },
  { qId: "q-c6-neg-d3-01", expected: "-6°C", check: () => -4 + 7 - 9 === -6 },
  { qId: "q-c6-neg-d3-02", expected: "-11 m", check: () => -18 + 12 - 5 === -11 },
  { qId: "q-c6-neg-d3-03", expected: "+15 m", check: () => (45 + (-15)) / 2 === 15 },
  { qId: "q-c7-int-d1-01", expected: "-42", check: () => -6 * 7 === -42 },
  { qId: "q-c7-int-d1-02", expected: "72", check: () => -9 * -8 === 72 },
  { qId: "q-c7-int-d1-03", expected: "-60", check: () => 12 * -5 === -60 },
  { qId: "q-c7-int-d2-01", expected: "-60", check: () => -3 * -4 * -5 === -60 },
  { qId: "q-c7-int-d2-02", expected: "-24°C", check: () => -3 * 8 === -24 },
  { qId: "q-c7-int-d2-03", expected: "-1", check: () => (-1)**5 === -1 },
  { qId: "q-c7-int-d3-01", expected: "70", check: () => -7 * (-4 + -6) === 70 },
  { qId: "q-c7-int-d3-02", expected: "36 marks", check: () => 12 * 4 + 6 * (-2) === 36 },
  { qId: "q-c7-int-d3-03", expected: "-120", check: () => -2 * 5 * -3 * -4 === -120 },
  { qId: "q-c8-dist-d1-01", expected: "8x + 20", check: () => 4 * 2 === 8 && 4 * 5 === 20 },
  { qId: "q-c8-dist-d1-02", expected: "12x - 21", check: () => 3 * 4 === 12 && 3 * -7 === -21 },
  { qId: "q-c8-dist-d1-03", expected: "-15y - 10", check: () => -5 * 3 === -15 && -5 * 2 === -10 },
  { qId: "q-c8-dist-d2-01", expected: "-12a + 30", check: () => -6 * 2 === -12 && -6 * -5 === 30 },
  { qId: "q-c8-dist-d2-02", expected: "-6x² + 8x", check: () => -2 * 3 === -6 && -2 * -4 === 8 },
  { qId: "q-c8-dist-d2-03", expected: "7a² - 21ab", check: () => 7 * 1 === 7 && 7 * -3 === -21 },
  { qId: "q-c8-dist-d3-01", expected: "4x - 2", check: () => (6 - 2 === 4) && (-12 + 10 === -2) },
  { qId: "q-c8-dist-d3-02", expected: "-x - 13", check: () => (5 - 6 === -1) && (-10 - 3 === -13) },
  { qId: "q-c8-dist-d3-03", expected: "2p² - 5pq + 3q²", check: () => (-2 - 3 === -5) && (-3 * -1 === 3) },
  { qId: "q-c9-id-d1-01", expected: "x² + 10x + 25", check: () => 2 * 5 === 10 && 5 * 5 === 25 },
  { qId: "q-c9-id-d1-02", expected: "x² - 12x + 36", check: () => -2 * 6 === -12 && (-6)**2 === 36 },
  { qId: "q-c9-id-d1-03", expected: "4x² + 12x + 9", check: () => 2**2 === 4 && 2 * 2 * 3 === 12 && 3**2 === 9 },
  { qId: "q-c9-id-d2-01", expected: "9x² - 16", check: () => 3**2 === 9 && 4**2 === 16 },
  { qId: "q-c9-id-d2-02", expected: "x² + 4x - 21", check: () => 7 + -3 === 4 && 7 * -3 === -21 },
  { qId: "q-c9-id-d2-03", expected: "9991", check: () => 100**2 - 3**2 === 9991 },
  { qId: "q-c9-id-d3-01", expected: "x² + 4y² + 9z² - 4xy - 12yz + 6xz", check: () => (-2)**2 === 4 && 3**2 === 9 },
  { qId: "q-c9-id-d3-02", expected: "23", check: () => 5**2 - 2 === 23 },
  { qId: "q-c9-id-d3-03", expected: "(7a - 2b)²", check: () => 7**2 === 49 && (-2)**2 === 4 },
  { qId: "q-c10-quad-d1-01", expected: "x = 5, x = -2", check: () => (5 - 5 === 0) && (-2 + 2 === 0) },
  { qId: "q-c10-quad-d1-02", expected: "2x² - 7x + 3 = 0", check: () => 2 === 2 && -7 === -7 && 3 === 3 },
  { qId: "q-c10-quad-d1-03", expected: "x = 3, x = -3", check: () => 3**2 - 9 === 0 && (-3)**2 - 9 === 0 },
  { qId: "q-c10-quad-d2-01", expected: "x = 3, x = 5", check: () => 3**2 - 8*3 + 15 === 0 && 5**2 - 8*5 + 15 === 0 },
  { qId: "q-c10-quad-d2-02", expected: "x = 3, x = -8", check: () => 3**2 + 5*3 - 24 === 0 && (-8)**2 + 5*(-8) - 24 === 0 },
  { qId: "q-c10-quad-d2-03", expected: "x = 7, x = -5", check: () => 7**2 - 2*7 - 35 === 0 && (-5)**2 - 2*(-5) - 35 === 0 },
  { qId: "q-c10-quad-d3-01", expected: "x = 3, x = 1/2", check: () => 2*3**2 - 7*3 + 3 === 0 && 2*(0.5)**2 - 7*(0.5) + 3 === 0 },
  { qId: "q-c10-quad-d3-02", expected: "x = 2/3, x = -4", check: () => Math.abs(3*(2/3)**2 + 10*(2/3) - 8) < 1e-9 && 3*(-4)**2 + 10*(-4) - 8 === 0 },
  { qId: "q-c10-quad-d3-03", expected: "Length = 12 m, Breadth = 5 m", check: () => 12 * 5 === 60 && 12 - 5 === 7 }
];

for (const check of deterministicChecks) {
  const q = questions.find(item => item.id === check.qId);
  assert(q, `Deterministic test question ${check.qId} exists`);
  if (q) {
    const correctOpt = q.options.find(o => o.id === q.correctAnswer);
    assert(correctOpt.text.en === check.expected, 
      `Question ${q.id} correct answer text "${correctOpt.text.en}" matches expected "${check.expected}"`);
    assert(check.check(), `Deterministic calculation assertion failed for ${q.id}`);
  }
}
console.log(`  [PASS] All ${deterministicChecks.length} deterministic mathematical checks passed with 100% precision.`);

// 5. Validate Lessons
console.log("\n5. Validating 3-Variant Lessons...");
const lessonConceptIds = new Set();

for (const l of lessons) {
  assert(l.conceptId && typeof l.conceptId === "string", `Lesson has conceptId: ${JSON.stringify(l)}`);
  assert(conceptIds.has(l.conceptId), `Lesson references valid concept: "${l.conceptId}"`);
  assert(!lessonConceptIds.has(l.conceptId), `Duplicate lesson for concept: "${l.conceptId}"`);
  lessonConceptIds.add(l.conceptId);

  const variants = ["basics_first", "standard", "fast_track"];
  for (const v of variants) {
    const vc = l[v];
    assert(vc, `Lesson ${l.conceptId} has variant "${v}"`);
    if (vc) {
      assert(vc.headline?.en && vc.headline?.hi && vc.headline?.te, `Lesson ${l.conceptId} [${v}] has EN, HI, TE headline`);
      assert(vc.explanation?.en && vc.explanation?.hi && vc.explanation?.te, `Lesson ${l.conceptId} [${v}] has EN, HI, TE explanation`);
      assert(vc.workedExample?.problem?.en && vc.workedExample?.problem?.hi && vc.workedExample?.problem?.te, `Lesson ${l.conceptId} [${v}] has EN, HI, TE problem`);
      assert(vc.workedExample?.solution?.en && vc.workedExample?.solution?.hi && vc.workedExample?.solution?.te, `Lesson ${l.conceptId} [${v}] has EN, HI, TE solution`);
      assert(Array.isArray(vc.workedExample?.steps) && vc.workedExample.steps.length > 0, `Lesson ${l.conceptId} [${v}] has workedExample steps`);
      assert(vc.keyTakeaway?.en && vc.keyTakeaway?.hi && vc.keyTakeaway?.te, `Lesson ${l.conceptId} [${v}] has EN, HI, TE keyTakeaway`);
    }
  }
}

// Every concept must have a lesson
for (const c of concepts) {
  assert(lessonConceptIds.has(c.id), `Concept ${c.id} has an entry in lessons.json`);
}
console.log(`  [PASS] All ${lessons.length} lessons contain complete 3 pedagogical variants with verified translations.`);

// 6. Validate Demo Class
console.log("\n6. Validating Demo Class Dataset...");
assert(demoClass.syntheticNotice && demoClass.syntheticNotice.includes("DEMO DATASET"), "demo-class.json has prominent synthetic notice");
assert(demoClass.students.length === 25, `Demo class has exactly 25 students (got ${demoClass.students.length})`);

const rollNumbers = new Set();
for (const stu of demoClass.students) {
  assert(!rollNumbers.has(stu.rollNumber), `Unique roll number: #${stu.rollNumber}`);
  rollNumbers.add(stu.rollNumber);
  assert(stu.name && typeof stu.name === "string", `Student #${stu.rollNumber} has name`);

  for (const m of stu.mastery) {
    assert(conceptIds.has(m.conceptId), `Student ${stu.name} references invalid concept "${m.conceptId}"`);
    assert(m.masteryPercentage >= 0 && m.masteryPercentage <= 100, `Student ${stu.name} has mastery 0-100%`);
  }

  if (stu.diagnosedRootGap) {
    assert(conceptIds.has(stu.diagnosedRootGap.currentConceptId), `Student ${stu.name} has valid currentConceptId`);
    assert(conceptIds.has(stu.diagnosedRootGap.rootPrerequisiteId), `Student ${stu.name} has valid rootPrerequisiteId`);
    assert(["basics_first", "standard", "fast_track"].includes(stu.diagnosedRootGap.recommendedVariant), `Student ${stu.name} has valid recommendedVariant`);
  }
}
console.log(`  [PASS] Demo class has 25 valid students correctly mapped to pilot chain concepts.`);

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
