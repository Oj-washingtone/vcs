import fs from "fs";
import path from "path";
import chalk from "chalk";

export function sc_branch(branch) {
  const scDir = path.join(process.cwd(), ".sc");
  const branchDir = path.join(scDir, "refs/branches");
  const HEAD = path.join(scDir, "HEAD");

  if (branch) {
    const branchPath = path.join(branchDir, branch);

    if (fs.existsSync(branchPath)) {
      console.log(
        `Branch ${branch} already exists, use switchto to switch to it`
      );
    }

    fs.writeFileSync(branchPath, "");
    console.log(`Branch ${branch} created`);
    return;
  }

  // All branches
  const branches = fs.readdirSync(branchDir);
  const readHead = fs.readFileSync(HEAD, "utf-8");
  const currentBranch = readHead.split("refs/branches/")[1]?.trim();

  console.log("Source control branches:");

  for (let branch of branches) {
    if (branch === currentBranch) {
      console.log(chalk.green(`* ${branch} (current)`));
    } else {
      console.log(chalk.yellow(`${branch}`));
    }
  }
}

export function sc_switchto(branch) {
  const scDir = path.join(process.cwd(), ".sc");
  const branchDir = path.join(scDir, "refs/branches");
  const HEAD = path.join(scDir, "HEAD");

  const branchPath = path.join(branchDir, branch);

  if (!fs.existsSync(branchPath)) {
    console.log(`Branch ${branch} does not exist`);
    return;
  }

  fs.writeFileSync(HEAD, `ref: refs/branches/${branch}`);
  console.log(`Switched to branch [${chalk.green(branch)}]`);
}
