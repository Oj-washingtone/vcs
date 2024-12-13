import fs from "fs";
import { createCommit } from "./create_commit.js";
import mergeTrees from "./mergeTrees.js";
import { getUserConfig } from "./get_configs.js";

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

    const user = getUserConfig();

    if (!user || user.name === null || user.email === null) {
      console.log(
        chalk.red(
          "Use '-u' for user name or '-e' for email to configure settings."
        )
      );
      return;
    }

    const mergeCommitHash = createCommit(
      mergedTreeHash,
      "Merge commit",
      `${user.name} <${user.email}>`,
      [currentCommitHash, incomingCommitHash]
    );

    fs.writeFileSync(currentBranchPath, mergeCommitHash);

    return mergeCommitHash;
  } catch (e) {
    console.error(e.message);
  }
}
