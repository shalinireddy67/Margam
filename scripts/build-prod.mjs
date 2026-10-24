import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const src = path.join(process.cwd(), "src", "app", "design-system");
const dest = path.join(process.cwd(), "src", "app", "_design-system");

try {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
  }
  execSync("npx next build", { stdio: "inherit" });
} finally {
  if (fs.existsSync(dest)) {
    fs.renameSync(dest, src);
  }
}
