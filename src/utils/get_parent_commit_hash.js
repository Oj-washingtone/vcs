import fs from "fs";
import path from "path";

export function getParentCommitHash(currentCommitHash) {
  const scDir = path.join(".sc");

  if (!currentCommitHash) return null;

  const commitPath = path.join(
    scDir,
    "objects",
    currentCommitHash.slice(0, 2),
    currentCommitHash.slice(2)
  );

  if (!fs.existsSync(commitPath)) {
    throw new Error(`Commit file does not exist: ${commitPath}`);
  }

  const commitContent = fs.readFileSync(commitPath, "utf8").trim();
  const commitLines = commitContent.split("\n");
  const parentCommit = commitLines
    .find((line) => line.trimStart().startsWith("parent"))
    .trim()
    .split(" ")[1];

  if (!parentCommit) return null;

  return parentCommit;
}
