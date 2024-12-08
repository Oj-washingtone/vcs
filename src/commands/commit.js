import fs from "fs";
import path from "path";
import { createTree } from "../utils/create_tree.js";
import { parseStagingFile } from "../utils/parse_staging_files.js";
import { createCommit } from "../utils/create_commit.js";

export function sc_commit(options) {
  const stagedFiles = parseStagingFile();

  if (stagedFiles.length === 0) {
    console.log("No changes to commit");
    return;
  }

  const modifiedFiles = stagedFiles.filter(
    ({ status }) => status !== "deleted"
  );
  const treeHash = createTree(modifiedFiles);
  const commitHash = createCommit(
    treeHash,
    options.message,
    "Author Name <author@example.com>"
  );

  fs.writeFileSync(path.join(".sc", "staging"), "");

  console.log(`Commit created: ${commitHash}`);
}
