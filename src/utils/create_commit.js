import fs from "fs";
import path from "path";
import crypto from "crypto";

export function createCommit(treeHash, message, author) {
  const headPath = path.join(".sc", "HEAD");
  const headContent = fs.readFileSync(headPath, "utf8").trim();

  const branchName = headContent.startsWith("ref: ")
    ? headContent.slice(5).trim()
    : headContent;
  const branchPath = path.join(".sc", branchName);

  let parentHash = null;

  if (fs.existsSync(branchPath)) {
    parentHash = fs.readFileSync(branchPath, "utf8").trim();
  }

  const commitContent = `
  tree ${treeHash}
  parent ${parentHash || ""}
  author ${author} ${new Date().toISOString()}
  message ${message}
  `.trim();

  const hash = crypto.createHash("sha1").update(commitContent).digest("hex");
  const commitPath = path.join(
    ".sc",
    "objects",
    hash.slice(0, 2),
    hash.slice(2)
  );

  if (fs.existsSync(commitPath)) {
    return hash;
  }

  fs.mkdirSync(path.dirname(commitPath), { recursive: true });
  fs.writeFileSync(commitPath, commitContent);

  fs.writeFileSync(branchPath, hash);

  return hash;
}
