import fs from "fs";
import path from "path";

function findPages(dir) {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "api") {
        pages.push(...findPages(full));
      }
    } else if (entry.name === "page.tsx") {
      pages.push(full);
    }
  }
  return pages;
}

const pages = findPages("src/app");
console.log(`Checking ${pages.length} pages for <h1> count...`);

let issues = 0;
for (const p of pages) {
  const code = fs.readFileSync(p, "utf8");
  const h1Matches = code.match(/<h1[\s>]/g) || [];
  if (h1Matches.length > 1) {
    console.warn(`WARNING: ${p} has ${h1Matches.length} <h1> tags!`);
    issues++;
  } else {
    // console.log(`OK: ${p} has ${h1Matches.length} <h1> tag(s)`);
  }
}

if (issues === 0) {
  console.log("All pages have <= 1 <h1> tag. Clean!");
}

