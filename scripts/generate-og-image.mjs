import fs from "fs";
import path from "path";
import sharp from "sharp";

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Cream Background -->
  <rect width="1200" height="630" fill="#FFF7E6" />
  
  <!-- Outer 12px Ink Border -->
  <rect x="12" y="12" width="1176" height="606" fill="none" stroke="#2B1B0F" stroke-width="12" />

  <!-- Top Grass Ground Edge -->
  <rect x="24" y="24" width="1152" height="18" fill="#5DAA3A" />
  <rect x="24" y="42" width="1152" height="6" fill="#2F6B22" />

  <!-- Pixel Compass Logo Frame -->
  <rect x="80" y="90" width="84" height="84" fill="#5DAA3A" stroke="#2B1B0F" stroke-width="5" />
  <rect x="94" y="104" width="56" height="56" fill="#FFFFFF" stroke="#2B1B0F" stroke-width="3" />
  <rect x="110" y="120" width="24" height="24" fill="#F4C542" />

  <!-- Brand Title -->
  <text x="188" y="152" font-family="'Courier New', monospace" font-size="52" font-weight="900" fill="#2B1B0F" letter-spacing="4">MARGAM</text>
  <text x="190" y="180" font-family="'Nunito', sans-serif" font-size="20" font-weight="800" fill="#7A4B2A" letter-spacing="1">ADAPTIVE MATHEMATICS · CLASSES 6–10</text>

  <!-- Main Headline -->
  <text x="80" y="270" font-family="'Nunito', sans-serif" font-size="44" font-weight="900" fill="#2B1B0F">
    Stuck in Class 10 maths?
  </text>
  <text x="80" y="325" font-family="'Nunito', sans-serif" font-size="36" font-weight="800" fill="#5DAA3A">
    It probably started in Class 7.
  </text>

  <!-- Tagline / Subtitle -->
  <text x="80" y="390" font-family="'Nunito', sans-serif" font-size="24" font-weight="600" fill="#2B1B0F" opacity="0.9">
    Diagnose foundational prerequisite gaps, not just repetitive drills.
  </text>
  <text x="80" y="425" font-family="'Nunito', sans-serif" font-size="22" font-weight="600" fill="#7A4B2A">
    Every learner has a path. Find yours.
  </text>

  <!-- Badge Chips -->
  <g transform="translate(80, 480)">
    <!-- Grass Chip -->
    <rect x="0" y="0" width="250" height="48" fill="#5DAA3A" stroke="#2B1B0F" stroke-width="4" />
    <text x="24" y="31" font-family="'Nunito', sans-serif" font-size="19" font-weight="800" fill="#2B1B0F">NCERT Curriculum</text>

    <!-- White Chip -->
    <rect x="274" y="0" width="310" height="48" fill="#FFFFFF" stroke="#2B1B0F" stroke-width="4" />
    <text x="296" y="31" font-family="'Nunito', sans-serif" font-size="19" font-weight="800" fill="#2B1B0F">English · हिन्दी · తెలుగు</text>

    <!-- Gold Chip -->
    <rect x="608" y="0" width="220" height="48" fill="#F4C542" stroke="#2B1B0F" stroke-width="4" />
    <text x="632" y="31" font-family="'Nunito', sans-serif" font-size="19" font-weight="800" fill="#2B1B0F">Zero Trackers</text>
  </g>

  <!-- Bottom Dirt Strip -->
  <rect x="24" y="560" width="1152" height="44" fill="#5A3720" />
  <rect x="24" y="556" width="1152" height="4" fill="#422816" />
  <text x="60" y="588" font-family="'Nunito', sans-serif" font-size="16" font-weight="700" fill="#FFE9A8">
    Code Kernel '26 Prototype · margam-learningspace.vercel.app
  </text>
</svg>
`.trim();

async function generate() {
  const outputPath = path.resolve("public/og-image.png");
  await sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Successfully generated public/og-image.png (${(stats.size / 1024).toFixed(1)} KB)`);
}

generate().catch(console.error);
