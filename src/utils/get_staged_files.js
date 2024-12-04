import fs from "fs";
import path from "path";

export default function stagedFiles() {
  const scDir = path.join(process.cwd(), ".sc");
  const stagingFile = path.join(scDir, "staging");

  if (!fs.existsSync(stagingFile)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(stagingFile, "utf-8").trim();

    if (!fileContent) {
      return [];
    }

    return fileContent.split("\n").map((line) => {
      const [filePath, date, status] = line
        .split(" | ")
        .map((item) => item.trim());
      return {
        path: filePath,
        modifiedTime: new Date(date),
        status,
      };
    });
  } catch (error) {
    console.error("Error reading or parsing the staging file:", error);
    return [];
  }
}
