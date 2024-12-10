export default function mergeTrees(currentTree, targetTree) {
  const mergedTree = new Map(currentTree);
  let hasConflicts = false;

  targetTree.forEach((blobHash, filePath) => {
    if (!mergedTree.has(filePath)) {
      mergedTree.set(filePath, blobHash);
    } else if (mergedTree.get(filePath) !== blobHash) {
      console.warn(`Conflict detected for file: ${filePath}.`);
      hasConflicts = true;
    }
  });

  if (hasConflicts) {
    console.log("Resolve the conflicts and try merging again.");
    throw new Error("Merge aborted due to conflicts.");
  }

  return mergedTree;
}
