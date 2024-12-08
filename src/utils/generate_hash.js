import crypto from "crypto";
import fs from "fs";

export function generateFileHash(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return crypto.createHash("sha1").update(fileContent).digest("hex");
}
