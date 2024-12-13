import fs from "fs";
import path from "path";

export function getTreeFiles() {
  const scDir = path.join(process.cwd(), ".sc");
  const HEAD = path.join(scDir, "HEAD");

  if (!fs.existsSync(HEAD) || !fs.statSync(HEAD).isFile()) return [];

  const headContent = fs.readFileSync(HEAD, "utf8").trim();
  const branchName = headContent.startsWith("ref: ")
    ? headContent.slice(5).trim()
    : headContent;

  const branchPath = path.join(scDir, branchName);
  if (!fs.existsSync(branchPath) || !fs.statSync(branchPath).isFile())
    return [];

  const commitHash = fs.readFileSync(branchPath, "utf8").trim();

  const files = new Map();

  let currentCommitHash = commitHash;
  while (currentCommitHash) {
    const commitPath = path.join(
      scDir,
      "objects",
      currentCommitHash.slice(0, 2),
      currentCommitHash.slice(2)
    );
    if (!fs.existsSync(commitPath) || !fs.statSync(commitPath).isFile()) break;

    const commitContent = fs.readFileSync(commitPath, "utf8").trim();

    const treeLine = commitContent
      .split("\n")
      .find((line) => line.startsWith("tree"));

    const treeHash = treeLine?.split(" ")[1]?.trim();
    if (!treeHash) break;

    const treePath = path.join(
      scDir,
      "objects",
      treeHash.slice(0, 2),
      treeHash.slice(2)
    );
    if (!fs.existsSync(treePath) || !fs.statSync(treePath).isFile()) break;

    const treeContent = fs.readFileSync(treePath, "utf8").trim();

    treeContent.split("\n").forEach((line) => {
      const [blobHash, filePath] = line.split(" ");
      const absolutePath = path.join(process.cwd(), filePath);

      if (!files.has(`${filePath}@${blobHash}`)) {
        files.set(`${filePath}@${blobHash}`, {
          path: filePath,
          hash: blobHash,
          commitHash: currentCommitHash,
        });
      }
    });

    const parentCommitLine = commitContent
      .split("\n")
      .find((line) => line.startsWith("parent"));
    if (parentCommitLine) {
      currentCommitHash = parentCommitLine.split(" ")[1].trim();
    } else {
      break;
    }
  }

  return Array.from(files.values());
}

// A---B---C  (main)
//      \
//       D---E (feature)
