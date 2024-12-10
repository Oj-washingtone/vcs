import fs from "fs";
import path from "path";
import chalk from "chalk";
import getCurrentBranch from "./get_current_branch.js";

export default function createBranch(branch) {
  const scDir = path.join(process.cwd(), ".sc");
  const branchDir = path.join(scDir, "refs/branches");
  const HEAD = path.join(scDir, "HEAD");

  const branchPath = path.join(branchDir, branch);

  if (fs.existsSync(branchPath)) {
    console.log(
      `Branch ${branch} already exists, use sc switchto to switch to it`
    );

    return;
  }

  const branchCommit = fs.existsSync(getCurrentBranch())
    ? fs.readFileSync(getCurrentBranch(), "utf8")
    : null;

  fs.writeFileSync(branchPath, branchCommit);
  console.log(`Branch ${chalk.green.bold(branch)} created`);
}
