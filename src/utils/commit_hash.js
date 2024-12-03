import crypto from "crypto";

export function commit_hash(commit) {
  const hash = crypto.createHash("sha1");
  hash.update(commit);
  return hash.digest("hex");
}
