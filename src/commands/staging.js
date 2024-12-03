import { program } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import isRepo from "../utils/isRepo.js";
import getFiles from "../utils/get_files.js";
import stagedFiles from "../utils/get_staged_files.js";
import trackFileChnages from "../utils/track_file_changes.js";

export function sc_status() {
  if (!isRepo()) {
    return;
  }

  const scDir = path.join(process.cwd(), ".sc");
  const stagingFile = path.join(scDir, "staging");
  const HEAD = path.join(scDir, "HEAD");

  if (!fs.existsSync(HEAD)) {
    console.log(
      chalk.red(
        "HEAD file not found. Something went wrong with the repository initialization."
      )
    );
    return;
  }

  const readHead = fs.readFileSync(HEAD, "utf-8").trim();
  const currentBranch = readHead.split("refs/branches/")[1]?.trim();

  if (!currentBranch) {
    console.log(chalk.red("Unable to determine the current branch."));
    return;
  }

  const staging = stagedFiles();
  const fileChanges = trackFileChnages(staging);

  console.log(`On branch ${chalk.green(currentBranch)}`);

  if (staging.length > 0) {
    console.log("Changes to be committed:");
    staging.forEach((file) => {
      console.log(chalk.green(`\t${file.status}: ${file.path} `));
    });

    console.log("\n\tuse 'sc unstage <file>...' to unstage");
    console.log("\tuse 'sc commit -m <message>' to commit changes \n");
  }

  if (fileChanges.modifiedFiles.length > 0) {
    console.log("Changes not staged for commit:");

    fileChanges.modifiedFiles.forEach((file) => {
      console.log(chalk.yellow(`\t${file.status}: ${file.path} `));
    });

    console.log(
      "\n\tuse 'sc add <file>...' or 'sc add .' to add them to staging  \n"
    );
  }

  if (fileChanges.untrackedFiles.length > 0) {
    console.log("Untracked files:");
    fileChanges.untrackedFiles.forEach((file) => {
      console.log(chalk.red(`\t${file.status}: ${file.path} `));
    });
  }

  console.log(
    `\nUse "sc add <file>..." or "sc add ." to update what will be committed \n`
  );
}

// add files to staging area
export function sc_add(file) {
  if (file === ".") {
    console.log("Added all files to the staging area");
    return;
  }
  console.log(`Added ${file} to the staging area`);
}
