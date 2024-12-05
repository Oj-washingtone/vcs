import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createBlob } from "./create_blob.js";

export function createTree(stagedFiles) {
  const treeEntries = stagedFiles
    .filter(({ status }) => status !== "deleted")
    .map(({ path }) => {
      const blobHash = createBlob(path);
      return `${blobHash} ${path}`;
    });

  const treeContent = treeEntries.join("\n");
  const hash = crypto.createHash("sha1").update(treeContent).digest("hex");
  const treePath = path.join(".sc", "objects", hash.slice(0, 2), hash.slice(2));

  if (!fs.existsSync(treePath)) {
    fs.mkdirSync(path.dirname(treePath), { recursive: true });
    fs.writeFileSync(treePath, treeContent);
  }

  return hash;
}
