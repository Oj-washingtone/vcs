import fs from "fs";
import path from "path";
import stagedFiles from "./get_staged_files.js";
import { getIgnoredPatterns } from "./ignore.js";
import micromatch from "micromatch";

export function removeIgnoresFromStages() {
  const ignorePatterns = getIgnoredPatterns();
  const staging = path.join(process.cwd(), ".sc/staging");

  const normalizedPatterns = ignorePatterns.map((pattern) =>
    pattern.endsWith("/") || pattern.endsWith("**") ? pattern : `${pattern}/**`
  );

  const stagedFilesList = stagedFiles();
  const stagingFilePath = path.join(process.cwd(), ".sc/staging");

  if (!fs.existsSync(stagingFilePath)) {
    return;
  }

  const filesToKeep = stagedFilesList.filter((file) => {
    const relativePath = path.relative(process.cwd(), file.path);
    return !micromatch.isMatch(relativePath, normalizedPatterns);
  });

  // remove content of staging and write only files to keep
  fs.writeFileSync(stagingFilePath, "");

  filesToKeep.forEach((file) => {
    fs.appendFileSync(
      stagingFilePath,
      `${file.path} | ${file.modifiedTime.toISOString()} | ${file.status}\n`
    );
  });
}
