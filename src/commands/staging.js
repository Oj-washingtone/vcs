import { program } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export function sc_status() {
  const scDir = path.join(process.cwd(), ".sc");

  const headFile = path.join(scDir, "HEAD");
  const currentBranch = fs.existsSync(headFile)
    ? fs.readFileSync(headFile, "utf-8").replace("ref: refs/branches/", "")
    : "unknown";

  console.log(`On branch [${chalk.green(currentBranch)}]`);
}
