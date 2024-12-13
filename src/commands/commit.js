import fs from "fs";
import path from "path";
import { createTree } from "../utils/create_tree.js";
import { parseStagingFile } from "../utils/parse_staging_files.js";
import { createCommit } from "../utils/create_commit.js";
import { getUserConfig } from "../utils/get_configs.js";
import chalk from "chalk";

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

  const user = getUserConfig();

  if (!user || user.name === null || user.email === null) {
    console.log(
      chalk.red(
        "Use '-u' for user name or '-e' for email to configure settings."
      )
    );
    return;
  }

  console.log(user);
  const commitHash = createCommit(
    treeHash,
    options.message,
    `${user.name} <${user.email}>`
  );

  fs.writeFileSync(path.join(".sc", "staging"), "");

  console.log(`Commit created: ${commitHash}`);
}
