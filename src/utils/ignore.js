import micromatch from "micromatch";
import path from "path";
import fs from "fs";
import stagedFiles from "./get_staged_files.js";

export function getIgnoredPatterns() {
  const defaultIgnorePatterns = [".sc"];
  const stagedFilesList = stagedFiles();
  const staging = path.join(process.cwd(), ".sc/staging");

  const ignoreFilePath = path.join(process.cwd(), ".scignore");
  if (fs.existsSync(ignoreFilePath)) {
    const content = fs.readFileSync(ignoreFilePath, "utf-8");
    const userPatterns = content
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim());

    return [...defaultIgnorePatterns, ...userPatterns];
  }

  return defaultIgnorePatterns;
}
