import fs from "fs";
import path from "path";

export default function fastForwardMerge(
  currentBranchPath,
  incomingBranchCommitHash
) {
  fs.writeFileSync(currentBranchPath, incomingBranchCommitHash);

  return true;
}
