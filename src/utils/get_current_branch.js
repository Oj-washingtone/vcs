import fs from "fs";
import path from "path";

export default function getCurrentBranch() {
  const scDir = path.join(process.cwd(), ".sc");
  const HEAD = path.join(scDir, "HEAD");

  const currentBranchRef = fs.existsSync(HEAD)
    ? fs.readFileSync(HEAD, "utf8").trim()
    : null;

  const currentBranchRefValue =
    currentBranchRef && currentBranchRef.startsWith("ref: ")
      ? currentBranchRef.slice(5).trim()
      : currentBranchRef;

  return path.join(scDir, currentBranchRefValue);
}
