import fs from "fs";
import path from "path";
import getCommitAncestors from "../utils/get_commit_ancestors.js";
import isRepo from "../utils/isRepo.js";
import chalk from "chalk";
import getCurrentBranch from "../utils/get_current_branch.js";
import fastForwardMerge from "../utils/fast_forward_merge.js";
import threeWayMerge from "../utils/3_way_recussive_merge.js";

export function sc_merge(branch) {
  if (!isRepo()) {
    return;
  }

  const scDir = path.join(process.cwd(), ".sc");
  const branchDir = path.join(scDir, "refs/branches");
  const HEAD = path.join(scDir, "HEAD");
  const branchPath = path.join(branchDir, branch);

  if (!fs.existsSync(branchPath)) {
    console.error(`Branch "${branch}" does not exist.`);
    return;
  }

  const currentBranchPath = getCurrentBranch();
  const currentBranchName = path.basename(currentBranchPath);

  const incomingBranchCommitHash = fs.readFileSync(branchPath, "utf8").trim();
  const currentCommitHash = fs.readFileSync(currentBranchPath, "utf8").trim();

  console.log(`Merging branch "${branch}" into "${currentBranchName}"...`);

  const currentBranchAncestors = getCommitAncestors(currentCommitHash);
  const incomingBranchAncestors = getCommitAncestors(incomingBranchCommitHash);

  if (currentBranchAncestors.includes(incomingBranchCommitHash)) {
    console.log(`Already up to date with ${branch}`);
    return;
  }

  if (
    currentBranchAncestors.includes(incomingBranchCommitHash) ||
    incomingBranchAncestors.includes(currentCommitHash)
  ) {
    const merged = fastForwardMerge(
      currentBranchPath,
      incomingBranchCommitHash
    );
    if (merged) {
      console.log(`OK: Merged ${branch} into ${currentBranchName}`);
      console.log(chalk.green.bold(incomingBranchCommitHash));
    }
    return;
  }

  const commonAncestor = currentBranchAncestors.find((hash) =>
    incomingBranchAncestors.includes(hash)
  );

  if (commonAncestor) {
    const mergeChange = threeWayMerge(
      currentBranchPath,
      currentCommitHash,
      incomingBranchCommitHash,
      commonAncestor
    );

    if (mergeChange) {
      console.log(`OK: Merged ${branch} into ${currentBranchName}`);
      console.log(chalk.green.bold(mergeChange));
    }
  }
}
