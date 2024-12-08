import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createBlob } from "./create_blob.js";

export function createTree(stagedFiles) {
  const scDir = path.join(process.cwd(), ".sc");
  const headPath = path.join(scDir, "HEAD");
  const headContent = fs.existsSync(headPath)
    ? fs.readFileSync(headPath, "utf8").trim()
    : null;

  const branchName =
    headContent && headContent.startsWith("ref: ")
      ? headContent.slice(5).trim()
      : headContent;
  const branchPath = branchName ? path.join(scDir, branchName) : null;

  let parentTree = new Map();
  if (branchPath && fs.existsSync(branchPath)) {
    const parentCommitHash = fs.readFileSync(branchPath, "utf8").trim();
    const commitPath = path.join(
      scDir,
      "objects",
      parentCommitHash.slice(0, 2),
      parentCommitHash.slice(2)
    );
    if (fs.existsSync(commitPath)) {
      const commitContent = fs.readFileSync(commitPath, "utf8").trim();
      const treeLine = commitContent
        .split("\n")
        .find((line) => line.startsWith("tree"));
      const treeHash = treeLine?.split(" ")[1]?.trim();

      if (treeHash) {
        const treePath = path.join(
          scDir,
          "objects",
          treeHash.slice(0, 2),
          treeHash.slice(2)
        );
        if (fs.existsSync(treePath)) {
          const treeContent = fs.readFileSync(treePath, "utf8").trim();
          treeContent.split("\n").forEach((line) => {
            const [blobHash, filePath] = line.split(" ");
            parentTree.set(filePath, blobHash);
          });
        }
      }
    }
  }

  stagedFiles.forEach(({ path, status }) => {
    if (status === "deleted") {
      parentTree.delete(path);
    } else {
      const blobHash = createBlob(path);
      parentTree.set(path, blobHash);
    }
  });

  const treeEntries = Array.from(parentTree.entries()).map(
    ([filePath, blobHash]) => `${blobHash} ${filePath}`
  );
  const treeContent = treeEntries.join("\n");

  const hash = crypto.createHash("sha1").update(treeContent).digest("hex");
  const treePath = path.join(".sc", "objects", hash.slice(0, 2), hash.slice(2));

  if (!fs.existsSync(treePath)) {
    fs.mkdirSync(path.dirname(treePath), { recursive: true });
    fs.writeFileSync(treePath, treeContent);
  }

  return hash;
}
