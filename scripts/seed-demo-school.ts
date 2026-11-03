import { isSupabaseConfigured } from "../src/lib/env";
import { seedSupabaseDatabase, seedMockDatabase, cleanDemoData } from "../src/lib/demo/seeder";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS, getDemoClassMetrics } from "../src/lib/demo/demo-school-data";

async function main() {
  const isClean = process.argv.includes("--clean");

  console.log("================================================================================");
  console.log("  MARGAM — DEMO SCHOOL PROVISIONING ENGINE (VIGNAN SCHOOL CLASS 10-A4)");
  console.log("================================================================================");

  if (isClean) {
    console.log("🧹 [ACTION] Cleaning only demo dataset (@vignan.demo.invalid / VIGNAN-10A4)...");
    const cleanResult = await cleanDemoData();
    console.log(`✅ [CLEAN RESULT]: ${cleanResult.message}`);
    process.exit(0);
  }

  const supabaseActive = isSupabaseConfigured();
  console.log(`📡 Environment: ${supabaseActive ? "Live Supabase Database" : "In-Memory Mock Store (Offline/Dev)"}`);
  console.log(`🏫 Target School: ${DEMO_SCHOOL_CONFIG.schoolName}`);
  console.log(`📚 Target Class:  ${DEMO_SCHOOL_CONFIG.className} (Code: ${DEMO_SCHOOL_CONFIG.classCode})`);
  console.log(`👩‍🏫 Class Teacher: ${DEMO_SCHOOL_CONFIG.teacher.fullName} (${DEMO_SCHOOL_CONFIG.teacher.email})`);
  console.log(`👥 Total Students: ${DEMO_STUDENTS.length}`);
  console.log("--------------------------------------------------------------------------------");

  let result;
  if (supabaseActive) {
    console.log("⏳ Seeding into Supabase PostgreSQL database via service_role...");
    result = await seedSupabaseDatabase();
  } else {
    console.log("⏳ Seeding into in-memory mock database store...");
    result = seedMockDatabase();
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`✅ [SEED STATUS]: ${result.success ? "SUCCESS" : "FAILED"}`);
  console.log(`📊 Mode:             ${result.mode.toUpperCase()}`);
  console.log(`🏫 School:           ${result.school}`);
  console.log(`🏷️ Class:            ${result.className} (${result.classCode})`);
  console.log(`👩‍🏫 Teacher ID:       ${result.teacherId}`);
  console.log(`🎓 Students Seeded:  ${result.studentsSeeded} / 25`);
  console.log(`📝 Attempts Seeded:  ${result.attemptsSeeded}`);
  console.log(`🎯 Mastery Records:  ${result.conceptMasteryRecordsSeeded}`);
  console.log("--------------------------------------------------------------------------------");

  const metrics = getDemoClassMetrics();
  console.log("📈 CLASS METRICS SUMMARY (CALCULATED FROM SEEDED RECORDS):");
  console.log(`   - Average Diagnostic Score: ${metrics.averageDiagnosticScore}%`);
  console.log(`   - Average Class Mastery:    ${metrics.averageMastery}%`);
  console.log(`   - Strong Students:          ${metrics.studentsStrongCount} (${metrics.studentsStrongPercentage}%)`);
  console.log(`   - Needing Attention:        ${metrics.studentsNeedingAttentionCount} (${metrics.studentsNeedingAttentionPercentage}%)`);
  console.log(`   - Top Prerequisite Gap:     ${metrics.topGaps[0]?.conceptName} (${metrics.topGaps[0]?.count} students)`);
  console.log("================================================================================");
  console.log("🔑 DEMO LOGIN CREDENTIALS:");
  console.log(`   - Demo Teacher:  ${DEMO_SCHOOL_CONFIG.teacher.email} / ${DEMO_SCHOOL_CONFIG.demoPassword}`);
  console.log(`   - Demo Student:  student01 (or student01@vignan.demo.invalid) / ${DEMO_SCHOOL_CONFIG.demoPassword}`);
  console.log(`   - Gap Student:   student08 (or student08@vignan.demo.invalid) / ${DEMO_SCHOOL_CONFIG.demoPassword}`);
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("❌ Fatal Seeding Error:", err);
  process.exit(1);
});

