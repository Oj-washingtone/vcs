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

export function sc_add(file) {
  const scDir = path.join(process.cwd(), ".sc");
  const stagingFile = path.join(scDir, "staging");

  if (!fs.existsSync(scDir)) {
    console.error("Error: Source control repository is not initialized.");
    return;
  }

  let currentStaging = [];

  // Load existing staging file contents if it exists
  if (fs.existsSync(stagingFile)) {
    const content = fs.readFileSync(stagingFile, "utf-8");
    currentStaging = content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [path, date, status] = line.split(" | ");
        return { path, date, status };
      });
  }

  const { modifiedFiles, untrackedFiles, deletedFiles } = trackFileChnages();
  const allFiles = [...modifiedFiles, ...untrackedFiles, ...deletedFiles];

  if (file === ".") {
    allFiles.forEach((file) => {
      const index = currentStaging.findIndex(
        (staged) => staged.path === file.path
      );

      if (index !== -1) {
        // Update the existing entry in staging
        currentStaging[index] = {
          path: file.path,
          date: new Date(file.modifiedTime || Date.now()).toISOString(),
          status: file.status,
        };
      } else {
        // Add the new file to staging
        currentStaging.push({
          path: file.path,
          date: new Date(file.modifiedTime || Date.now()).toISOString(),
          status: file.status,
        });
      }
    });

    console.log("Staged all files successfully.");
  } else {
    const fileToAdd = allFiles.find((f) => f.path.endsWith(file));

    if (fileToAdd) {
      const index = currentStaging.findIndex(
        (staged) => staged.path === fileToAdd.path
      );

      if (index !== -1) {
        // Update the existing entry
        currentStaging[index] = {
          path: fileToAdd.path,
          date: new Date(fileToAdd.modifiedTime || Date.now()).toISOString(),
          status: fileToAdd.status,
        };
      } else {
        // Add the file to staging
        currentStaging.push({
          path: fileToAdd.path,
          date: new Date(fileToAdd.modifiedTime || Date.now()).toISOString(),
          status: fileToAdd.status,
        });
      }

      console.log(`Staged file: ${fileToAdd.path}`);
    } else {
      console.error(`Error: File '${file}' not found in tracked changes.`);
      return;
    }
  }

  // Handle deleted files separately
  deletedFiles.forEach((deletedFile) => {
    const index = currentStaging.findIndex(
      (staged) => staged.path === deletedFile.path
    );

    if (index !== -1) {
      // Update status and time for deleted files in the staging area
      currentStaging[index] = {
        path: deletedFile.path,
        date: new Date(Date.now()).toISOString(), // Use current time for deleted files
        status: deletedFile.status,
      };
    } else {
      // If not already in staging, add it
      currentStaging.push({
        path: deletedFile.path,
        date: new Date(Date.now()).toISOString(),
        status: deletedFile.status,
      });
    }
  });

  // Write updated staging content to the file
  const updatedContent = currentStaging
    .map(({ path, date, status }) => `${path} | ${date} | ${status}`)
    .join("\n");

  fs.writeFileSync(stagingFile, updatedContent);
}
