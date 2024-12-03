import { program } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import isRepo from "../utils/isRepo.js";
import getFiles from "../utils/get_files.js";

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

  // Read staging file and parse it into a structured format
  let staging = [];
  if (fs.existsSync(stagingFile)) {
    staging = fs
      .readFileSync(stagingFile, "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
  }

  const files = getFiles();

  console.log(`On branch ${chalk.green(currentBranch)}`);
  console.log("Changes to be committed:");

  if (staging.length > 0) {
    staging.forEach((file) => {
      const parts = file.split("|").map((part) => part.trim());

      if (parts.length === 3) {
        const filePath = parts[0];
        const modifiedTime = new Date(parts[1]);
        const status = parts[2];

        const fileInWorkingDir = files.find((f) => f.path === filePath);
        if (fileInWorkingDir) {
          const fileModifiedTime = new Date(fileInWorkingDir.modifiedTime);

          if (fileModifiedTime > modifiedTime) {
            console.log(chalk.green(`\tmodified: ${filePath} `));
          } else {
            console.log(
              chalk.green(
                `\t${status}: ${filePath} | Last modified: ${modifiedTime}`
              )
            );
          }
        }
      } else {
        console.log(chalk.red(`\tMalformed entry in staging file: ${file}`));
      }
    });
  } else {
    console.log(chalk.red("\tNo files staged for commit"));
  }

  console.log("Changes not staged for commit:");

  if (files.length > 0) {
    files.forEach((file) => {
      if (!staging.some((stagedFile) => stagedFile.includes(file.path))) {
        console.log(
          chalk.yellow(
            `\tmodified: ${file.path} | Last modified: ${file.modifiedTime}`
          )
        );
      }
    });
  } else {
    console.log(chalk.red("\tNo modified files found"));
  }

  console.log("Untracked files:");

  const trackedFiles = staging.map((stagedFile) =>
    stagedFile.split("|")[0].trim()
  );
  files.forEach((file) => {
    if (!trackedFiles.includes(file.path)) {
      console.log(chalk.red(`\t${file.path}`));
    }
  });

  console.log(`Use "sc add <file>..." to update what will be committed`);
}
