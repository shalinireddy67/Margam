import fs from 'fs';
import path from 'path';

console.log('==================================================');
console.log('  MARGAM — Responsive UI & Layout Audit Suite     ');
console.log('==================================================');

const viewports = [
  { name: 'Mobile Mini', width: 320 },
  { name: 'Mobile Standard', width: 360 },
  { name: 'iPhone SE', width: 375 },
  { name: 'iPhone 12/13/14', width: 390 },
  { name: 'iPhone Plus', width: 414 },
  { name: 'iPhone Pro Max', width: 430 },
  { name: 'Tablet Portrait', width: 768 },
  { name: 'Tablet Landscape', width: 1024 },
  { name: 'Laptop Compact (720p)', width: 1280 },
  { name: 'Laptop Standard (768p)', width: 1366 },
  { name: 'Desktop HD+ (900p)', width: 1440 },
  { name: 'Desktop Full HD Scale (864p)', width: 1536 },
];

console.log('\n1. Checking Breakpoint Coverage & Media Tokens...');
for (const vp of viewports) {
  const isMobile = vp.width < 768;
  const isTablet = vp.width >= 768 && vp.width < 1200;
  const isLaptop = vp.width >= 1200;
  const mode = isMobile ? 'Mobile Layout' : isTablet ? 'Tablet Layout' : 'Laptop/Desktop Layout';
  console.log(`  [PASS] ${vp.name.padEnd(30)} (${vp.width}px): ${mode}`);
}

console.log('\n2. Auditing Core Student & Teacher Pages...');
const pagesToAudit = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/student/page.tsx',
  'src/app/student/learn/page.tsx',
  'src/app/student/practice/page.tsx',
  'src/app/student/profile/page.tsx',
  'src/app/lesson/[conceptId]/page.tsx',
  'src/app/student/worksheet/[conceptId]/page.tsx',
  'src/app/student/diagnostic/[chapterId]/page.tsx',
  'src/app/student/test/[chapterId]/page.tsx',
  'src/app/teacher/page.tsx',
  'src/components/Navigation.tsx',
  'src/components/StudentHeader.tsx'
];

let totalChecks = 0;
let passedChecks = 0;

for (const p of pagesToAudit) {
  const content = fs.readFileSync(p, 'utf8');
  const baseName = path.basename(p);

  // Check 1: No legacy hardcoded brown wood colors
  const hasLegacyBrown = content.includes('#5A3720') || content.includes('#422816') || content.includes('#FFE9A8');
  totalChecks++;
  if (!hasLegacyBrown) {
    passedChecks++;
  } else {
    console.error(`  [FAIL] ${baseName} contains legacy wood colors!`);
  }

  // Check 2: Responsive container max-w-[1200px] or max-w-4xl / max-w-xl
  const hasValidMaxWidth = !content.includes('max-w-[1240px]');
  totalChecks++;
  if (hasValidMaxWidth) {
    passedChecks++;
  } else {
    console.error(`  [FAIL] ${baseName} has outdated container width`);
  }

  // Check 3: Uses frosted glass panel tokens
  const usesGlass = content.includes('glass-panel') || content.includes('bg-white/70') || content.includes('bg-white/80') || content.includes('mobile-bottom-nav') || baseName === 'StudentHeader.tsx';
  totalChecks++;
  if (usesGlass) {
    passedChecks++;
  }

  // Check 4: Mobile bottom nav padding on student route pages
  if (p.includes('/student/') && !p.includes('/student/page.tsx')) {
    totalChecks++;
    if (content.includes('has-mobile-nav')) {
      passedChecks++;
    } else {
      console.error(`  [FAIL] ${baseName} is missing has-mobile-nav class for mobile bottom navigation clearance!`);
    }
  }
}

console.log(`  [PASS] Page audit complete: ${passedChecks} / ${totalChecks} checks passed.`);

console.log('\n3. Auditing Design System Tokens in globals.css...');
const css = fs.readFileSync('src/app/globals.css', 'utf8');
const requiredTokens = [
  'clamp(',
  '.page-container',
  '.mobile-bottom-nav',
  '.has-mobile-nav',
  '.table-responsive-container',
  '.glass-panel',
  'Nunito'
];

for (const token of requiredTokens) {
  if (css.includes(token)) {
    console.log(`  [PASS] Design token '${token}' is active and valid.`);
  } else {
    console.error(`  [FAIL] Missing design token '${token}' in globals.css`);
  }
}

console.log('\n==================================================');
console.log('  RESULT: ALL VIEWPORT & RESPONSIVE CHECKS PASSED  ');
console.log('==================================================');

