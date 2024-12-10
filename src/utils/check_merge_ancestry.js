import path from "path";
import fs from "fs";

export default function isAncestor(scDir, startHash, targetHash) {
  let visitedHashes = new Set();
  let stack = [startHash];

  // Traverse the commit graph starting from startHash
  while (stack.length > 0) {
    const currentHash = stack.pop();

    if (!currentHash) {
      continue;
    }

    // If we find the target hash, return true
    if (currentHash === targetHash) {
      return true;
    }

    if (visitedHashes.has(currentHash)) {
      continue;
    }

    visitedHashes.add(currentHash);

    // Path to the commit object file
    const commitPath = path.join(
      scDir,
      "objects",
      currentHash.slice(0, 2),
      currentHash.slice(2)
    );

    // If the commit object doesn't exist, handle gracefully
    if (!fs.existsSync(commitPath)) {
      console.warn(`Commit ${currentHash} not found.`);
      continue;
    }

    // Read commit content
    const commitContent = fs.readFileSync(commitPath, "utf8").trim();

    // Extract parent commits from the commit content
    const parentLines = commitContent
      .split("\n")
      .filter((line) => line.trimStart().startsWith("parent"));

    const parentHashes = parentLines.map((line) => line.trim().split(" ")[1]);

    // Push parent hashes onto the stack to explore the commit graph
    stack.push(...parentHashes);
  }
  return false;
}
