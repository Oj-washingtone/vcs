import fs from "fs";
import path from "path";
import isRepo from "../utils/isRepo.js";
import getCurrentBranch from "../utils/get_current_branch.js";
import { createTree } from "../utils/create_tree.js";
import { createCommit } from "../utils/create_commit.js";
import loadTree from "../utils/load_tree.js";
import mergeTrees from "../utils/merge_trees.js";
import saveTree from "../utils/save_tree.js";
import isAncestor from "../utils/check_merge_ancestry.js";

export function sc_merge(branch) {
  if (!isRepo) {
    console.error("Not a repository.");
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

  if (currentBranchPath === branchPath) {
    console.log("Already up to date.");
    return;
  }

  console.log(`Merging branch "${branch}" into "${currentBranchName}"...`);

  const targetCommitHash = fs.readFileSync(branchPath, "utf8").trim();
  const currentCommitHash = fs.readFileSync(currentBranchPath, "utf8").trim();

  if (
    isAncestor(scDir, currentCommitHash, targetCommitHash) ||
    isAncestor(scDir, targetCommitHash, currentCommitHash)
  ) {
    console.log(`"${branch}" is already up to date.`);
    return;
  }

  const targetTree = loadTree(scDir, targetCommitHash);
  const currentTree = loadTree(scDir, currentCommitHash);

  try {
    const mergedTree = mergeTrees(currentTree, targetTree);

    const mergedTreeHash = saveTree(scDir, mergedTree);

    const mergeCommitHash = createCommit(
      mergedTreeHash,
      `Merge branch '${branch}' into '${currentBranchName}'`,
      "Author Name <author@example.com>",
      [currentCommitHash, targetCommitHash]
    );

    fs.writeFileSync(currentBranchPath, mergeCommitHash);

    console.log(`Merge complete. New commit: ${mergeCommitHash}`);
  } catch (error) {
    console.error(error.message);
  }
}
