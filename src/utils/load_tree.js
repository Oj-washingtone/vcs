import fs from "fs";
import path from "path";

export default function loadTree(scDir, commitHash) {
  const commitPath = path.join(
    scDir,
    "objects",
    commitHash.slice(0, 2),
    commitHash.slice(2)
  );
  const commitContent = fs.readFileSync(commitPath, "utf8").trim();

  const treeLine = commitContent
    .split("\n")
    .find((line) => line.startsWith("tree"));
  const treeHash = treeLine?.split(" ")[1]?.trim();

  if (!treeHash) {
    return new Map();
  }

  const treePath = path.join(
    scDir,
    "objects",
    treeHash.slice(0, 2),
    treeHash.slice(2)
  );
  const treeContent = fs.readFileSync(treePath, "utf8").trim();

  const tree = new Map();
  treeContent.split("\n").forEach((line) => {
    const [blobHash, filePath] = line.split(" ");
    tree.set(filePath, blobHash);
  });

  return tree;
}
