import fs from "fs";
import path from "path";

export default function stagedFiles() {
  const scDir = path.join(process.cwd(), ".sc");
  const stagingFile = path.join(scDir, "staging");

  if (fs.existsSync(stagingFile)) {
    try {
      const fileContent = fs.readFileSync(stagingFile, "utf-8").trim();
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading or parsing the staging file:", error);
      return [];
    }
  }

  return [];
}
