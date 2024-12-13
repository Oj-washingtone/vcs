import fs from "fs";
import getTreePath from "./getTreePath.js";

export default function readTree(commitHash) {
  const treePath = getTreePath(commitHash);
  if (!treePath) return new Map();

  const treeContent = fs.readFileSync(treePath, "utf8").trim();
  const tree = new Map();

  treeContent.split("\n").forEach((line) => {
    const [blobHash, filePath] = line.split(" ");
    tree.set(filePath, blobHash);
  });
  return tree;
}
