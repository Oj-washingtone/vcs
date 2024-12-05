import fs from "fs";
import path from "path";

export function parseStagingFile() {
  const stagingFilePath = path.join(".sc", "staging");

  if (!fs.existsSync(stagingFilePath)) return [];

  return fs
    .readFileSync(stagingFilePath, "utf8")
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [filePath, , status] = line.split(" | ");
      return { path: filePath, status };
    });
}
