import fs from "fs";
import zlib from "zlib";

export function readBlob(hash) {
  const objectPath = path.join(
    ".sc",
    "objects",
    hash.slice(0, 2),
    hash.slice(2)
  );
  const compressedContent = fs.readFileSync(objectPath);
  return zlib.inflateSync(compressedContent).toString();
}
