import fs from "fs";
import path from "path";
import chalk from "chalk";
import isRepo from "../utils/isRepo.js";
import stagedFiles from "../utils/get_staged_files.js";
import trackFileChnages from "../utils/track_file_changes.js";
import getFiles from "../utils/get_files.js";
import { getTreeFiles } from "../utils/get_tree_files.js";
import { parseStagingFile } from "../utils/parse_staging_files.js";
import { generateFileHash } from "../utils/generate_hash.js";

export function sc_status() {
  const scDir = path.join(process.cwd(), ".sc");

  if (!isRepo(scDir)) {
    return;
  }

  const stagedFilesList = stagedFiles();
  const allFiles = getFiles();
  const latestCommitTreeFiles = getTreeFiles();

  const stagedFilesMap = new Map(
    stagedFilesList.map((file) => [file.path, true])
  );
  const latestCommitTreeFilesMap = new Map(
    latestCommitTreeFiles.map((file) => [file.path, file.hash])
  );

  const modifiedFiles = [];
  const untrackedFiles = [];

  allFiles.forEach(({ path: filePath }) => {
    const fileHash = generateFileHash(filePath);

    if (stagedFilesMap.has(filePath)) {
      return;
    }

    const commitFile = latestCommitTreeFilesMap.get(filePath);

    if (commitFile) {
      if (commitFile !== fileHash) {
        modifiedFiles.push({ path: filePath, status: "modified" });
      }
    } else {
      untrackedFiles.push({ path: filePath, status: "untracked" });
    }
  });

  console.log("Changes to be committed:");
  stagedFilesList.forEach(({ path, status }) => {
    console.log(chalk.green(`  ${status}: ${path}`));
  });

  console.log("\nChanges not staged for commit:");
  modifiedFiles.forEach(({ path, status }) => {
    console.log(chalk.yellow(`  ${status}: ${path}`));
  });

  console.log("\nUntracked files:");
  untrackedFiles.forEach(({ path }) => {
    console.log(chalk.red(`  ${path}`));
  });

  console.log(
    `\nUse "sc add <file>..." or "sc add ." to stage files for commit.\n`
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

  const allFiles = getFiles();
  const lastCommitedFiles = getTreeFiles();

  if (file === ".") {
    allFiles.forEach((file) => {
      const fileHash = generateFileHash(file.path);
      const commitFile = lastCommitedFiles.find((f) => f.path === file.path);

      const index = currentStaging.findIndex(
        (staged) => staged.path === file.path
      );

      if (commitFile) {
        if (commitFile.hash !== fileHash) {
          if (index !== -1) {
            currentStaging[index] = {
              path: file.path,
              date: new Date(file.modifiedTime || Date.now()).toISOString(),
              status: "modified",
            };
          } else {
            currentStaging.push({
              path: file.path,
              date: new Date(file.modifiedTime || Date.now()).toISOString(),
              status: "modified",
            });
          }
        }
      } else {
        if (index === -1) {
          currentStaging.push({
            path: file.path,
            date: new Date(file.modifiedTime || Date.now()).toISOString(),
            status: "new",
          });
        }
      }
    });

    const updatedContent = currentStaging
      .map(({ path, date, status }) => `${path} | ${date} | ${status}`)
      .join("\n");

    fs.writeFileSync(stagingFile, updatedContent);

    console.log("Staged all files successfully.");
  } else {
    const targetFile = allFiles.find((f) => f.path === file);

    if (!targetFile) {
      console.error(`Error: File "${file}" does not exist.`);
      return;
    }

    const fileHash = generateFileHash(targetFile.path);
    const commitFile = lastCommitedFiles.find(
      (f) => f.path === targetFile.path
    );

    const index = currentStaging.findIndex(
      (staged) => staged.path === targetFile.path
    );

    if (commitFile) {
      if (commitFile.hash !== fileHash) {
        if (index !== -1) {
          currentStaging[index] = {
            path: targetFile.path,
            date: new Date(targetFile.modifiedTime || Date.now()).toISOString(),
            status: "modified",
          };
        } else {
          currentStaging.push({
            path: targetFile.path,
            date: new Date(targetFile.modifiedTime || Date.now()).toISOString(),
            status: "modified",
          });
        }
      }
    } else {
      if (index === -1) {
        currentStaging.push({
          path: targetFile.path,
          date: new Date(targetFile.modifiedTime || Date.now()).toISOString(),
          status: "new",
        });
      }
    }

    console.log(`Staged file "${file}" successfully.`);
  }

  const updatedContent = currentStaging
    .map(({ path, date, status }) => `${path} | ${date} | ${status}`)
    .join("\n");

  fs.writeFileSync(stagingFile, updatedContent);
}
