import micromatch from "micromatch";
import path from "path";
import fs from "fs";

export function getIgnoredPatterns() {
  const defaultIgnorePatterns = [".sc"];

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
