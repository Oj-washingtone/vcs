import fs from "fs";
import path from "path";

export default function isRepo() {
  const scDir = path.join(process.cwd(), ".sc");
  const headFile = path.join(scDir, "HEAD");

  if (fs.existsSync(scDir) && fs.existsSync(headFile)) {
    return true;
  }

  console.error("Repository not initialized. Run `sc init` to initialize.");
  return false;
}
