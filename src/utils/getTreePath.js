import path from "path";
import fs from "fs";

export default function getTreePath(commitHash) {
  const scDir = path.join(process.cwd(), ".sc");

  if (!commitHash) {
    return null;
  }

  const commitPath = path.join(
    scDir,
    "objects",
    commitHash.slice(0, 2),
    commitHash.slice(2)
  );

  if (!fs.existsSync(commitPath)) {
    console.error(`Commit object for hash ${commitHash} does not exist.`);
    return null;
  }

  const commitContent = fs.readFileSync(commitPath, "utf8").trim();
  const treeLine = commitContent
    .split("\n")
    .find((line) => line.startsWith("tree"));

  if (!treeLine) {
    console.error(`Tree hash not found in commit ${commitHash}.`);
    return null;
  }

  const treeHash = treeLine.split(" ")[1];

  return path.join(scDir, "objects", treeHash.slice(0, 2), treeHash.slice(2));
}
