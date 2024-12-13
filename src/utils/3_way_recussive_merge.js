import fs from "fs";
import { createCommit } from "./create_commit.js";
import mergeTrees from "./mergeTrees.js";

export default function threeWayMerge(
  currentBranchPath,
  currentCommitHash,
  incomingCommitHash,
  commonAncestorHash
) {
  try {
    const mergedTreeHash = mergeTrees(
      currentCommitHash,
      incomingCommitHash,
      commonAncestorHash
    );

    const mergeCommitHash = createCommit(
      mergedTreeHash,
      "Merge commit",
      "Author Name <author@example.com>",
      [currentCommitHash, incomingCommitHash]
    );

    fs.writeFileSync(currentBranchPath, mergeCommitHash);

    return mergeCommitHash;
  } catch (e) {
    console.error(e.message);
  }
}
