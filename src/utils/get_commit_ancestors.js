import { getParentCommitHash } from "./get_parent_commit_hash.js";

export default function getCommitAncestors(commitHash) {
  const ancestors = [];

  while (commitHash) {
    ancestors.push(commitHash);

    commitHash = getParentCommitHash(commitHash);
  }

  return ancestors;
}
