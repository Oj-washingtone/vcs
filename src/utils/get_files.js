import micromatch from "micromatch";
import fs from "fs";
import path from "path";
import { getIgnoredPatterns } from "./ignore.js";

export default function getFiles() {
  let files = [];

  const ignoredPatterns = getIgnoredPatterns();
  const rootDir = process.cwd();
  const items = fs.readdirSync(rootDir);

  items.forEach((item) => {
    const fullPath = path.join(rootDir, item);
    const stats = fs.statSync(fullPath);

    if (micromatch.isMatch(item, ignoredPatterns)) {
      return;
    }

    if (stats.isDirectory()) {
      files = files.concat(getFilesFromDir(fullPath, ignoredPatterns, rootDir));
    } else if (stats.isFile()) {
      // Track file path and last modified time
      files.push({
        path: path.relative(rootDir, fullPath),
        modifiedTime: stats.mtime, // Last modified time
      });
    }
  });

  return files;
}

function getFilesFromDir(dir, ignoredPatterns, rootDir) {
  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (micromatch.isMatch(item, ignoredPatterns)) {
      return;
    }

    if (stats.isDirectory()) {
      files = files.concat(getFilesFromDir(fullPath, ignoredPatterns, rootDir));
    } else if (stats.isFile()) {
      // Track file path and last modified time
      files.push({
        path: path.relative(rootDir, fullPath),
        modifiedTime: stats.mtime, // Last modified time
      });
    }
  });

  return files;
}
