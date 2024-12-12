import fs from "fs";
import path from "path";
import crypto from "crypto";

export default function writeTree(treeMap) {
  const treeContent = Array.from(treeMap.entries())
    .map(([filePath, blobHash]) => `${blobHash} ${filePath}`)
    .join("\n");

  const treeHash = crypto.createHash("sha1").update(treeContent).digest("hex");
  const treePath = path.join(
    ".sc",
    "objects",
    treeHash.slice(0, 2),
    treeHash.slice(2)
  );

  if (!fs.existsSync(treePath)) {
    fs.mkdirSync(path.dirname(treePath), { recursive: true });
    fs.writeFileSync(treePath, treeContent);
  }

  return treeHash;
}
