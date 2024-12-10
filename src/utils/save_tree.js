import crypto from "crypto";
import path from "path";
import fs from "fs";

export default function saveTree(scDir, tree) {
  const treeEntries = Array.from(tree.entries()).map(
    ([filePath, blobHash]) => `${blobHash} ${filePath}`
  );
  const treeContent = treeEntries.join("\n");

  const hash = crypto.createHash("sha1").update(treeContent).digest("hex");
  const treePath = path.join(scDir, "objects", hash.slice(0, 2), hash.slice(2));

  if (!fs.existsSync(treePath)) {
    fs.mkdirSync(path.dirname(treePath), { recursive: true });
    fs.writeFileSync(treePath, treeContent);
  }

  return hash;
}
