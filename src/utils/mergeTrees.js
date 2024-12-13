import readTree from "./read_tree.js";
import writeTree from "./writeTree.js";

export default function (currentHash, incomingHash, ancestorHash) {
  const currentTree = readTree(currentHash);
  const incomingTree = readTree(incomingHash);
  const ancestorTree = readTree(ancestorHash);

  if (isTreesIdentical(incomingTree, ancestorTree)) {
    throw new Error(
      "Incoming branch is behind the current branch; no changes to merge."
    );
  }

  if (isTreesIdentical(currentTree, incomingTree)) {
    throw new Error("Already up to date");
  }

  const mergedTree = new Map();

  const allKeys = new Set([
    ...currentTree.keys(),
    ...incomingTree.keys(),
    ...ancestorTree.keys(),
  ]);

  allKeys.forEach((filePath) => {
    const ancestorBlob = ancestorTree.get(filePath);
    const currentBlob = currentTree.get(filePath);
    const incomingBlob = incomingTree.get(filePath);

    if (currentBlob === incomingBlob) {
      mergedTree.set(filePath, currentBlob || ancestorBlob);
    } else if (ancestorBlob === currentBlob) {
      mergedTree.set(filePath, incomingBlob);
    } else if (ancestorBlob === incomingBlob) {
      mergedTree.set(filePath, currentBlob);
    } else {
      const conflictMarker = `CONFLICT:
    <<<<<<< Current Branch
    ${currentBlob}
    ${filePath}
    =======
    ${incomingBlob}
    ${filePath}
    >>>>>>> Incoming Branch`;
      throw new Error(conflictMarker);
    }
  });

  return writeTree(mergedTree);
}
function isTreesIdentical(treeA, treeB) {
  if (treeA.size !== treeB.size) {
    return false;
  }

  for (let [filePath, blob] of treeA) {
    const otherBlob = treeB.get(filePath);
    if (otherBlob !== blob) {
      console.log("Detected difference", filePath);
      return false;
    }
  }

  return true;
}
