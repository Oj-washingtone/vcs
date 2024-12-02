import fs from "fs";
import path from "path";

export default function init() {
  const scDir = path.join(process.cwd(), ".sc");

  if (fs.existsSync(scDir)) {
    console.log("Repository already initialized.");
  }

  fs.mkdirSync(scDir, { recursive: true });
  console.log(".sc directory created");

  const branchFile = path.join(scDir, "branch");
  fs.writeFileSync(branchFile, "main");

  console.log("Repository initialized.");
}
