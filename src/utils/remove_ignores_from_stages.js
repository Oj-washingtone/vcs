import fs from "fs";
import path from "path";
import stagedFiles from "./get_staged_files.js";
import { getIgnoredPatterns } from "./ignore.js";

export function removeIgnoresFromStages() {
  const ignorePatterns = getIgnoredPatterns();
  const stagedFilesList = stagedFiles();
  const staging = path.join(process.cwd(), ".sc/staging");

  if (!fs.existsSync(staging)) {
    return;
  }

  const updatedStagedFiles = stagedFilesList.filter((file) => {
    const relativePath = path.relative(process.cwd(), file.path);
    return !ignorePatterns.some((pattern) => {
      return relativePath.includes(pattern);
    });
  });

  const updatedStagingContent = updatedStagedFiles
    .map((file) => `${file.path} | ${file.modifiedTime} | ${file.status}`)
    .join("\n");

  fs.writeFileSync(staging, updatedStagingContent);
}
