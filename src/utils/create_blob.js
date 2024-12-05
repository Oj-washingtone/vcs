import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "zlib";

export function createBlob(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const hash = crypto.createHash("sha1").update(fileContent).digest("hex");
  const blobPath = path.join(".sc", "objects", hash.slice(0, 2), hash.slice(2));

  if (!fs.existsSync(blobPath)) {
    const compressedContent = zlib.deflateSync(fileContent);
    fs.mkdirSync(path.dirname(blobPath), { recursive: true });
    fs.writeFileSync(blobPath, compressedContent);
  }

  return hash;
}
