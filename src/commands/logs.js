import fs from "fs";
import path from "path";
import chalk from "chalk";
import isRepo from "../utils/isRepo.js";

export function logs(graph = false) {
  if (!isRepo()) return;

  const scDir = path.join(process.cwd(), ".sc");
  const branchPath = path.join(scDir, "refs", "branches");
  const branches = fs.readdirSync(branchPath);

  branches.forEach((branch) => {
    console.log(chalk.green.bold(`On Branch --> [${branch}]`));

    let currentCommitHash = fs
      .readFileSync(path.join(branchPath, branch), "utf8")
      .trim();

    if (currentCommitHash === "") {
      console.log(chalk.yellow("No commits on this branch yet"));
      return;
    }

    const commitHistory = [];
    const commitGraph = [];

    while (currentCommitHash) {
      const commitPath = path.join(
        scDir,
        "objects",
        currentCommitHash.slice(0, 2),
        currentCommitHash.slice(2)
      );

      if (!fs.existsSync(commitPath)) {
        console.log(
          chalk.red(`Commit file not found for hash: ${currentCommitHash}`)
        );
        break;
      }

      const commitContent = fs.readFileSync(commitPath, "utf8").trim();
      const commitLines = commitContent.split("\n");

      let commitLog = {};
      commitLines.forEach((line) => {
        const trimmedLine = line.trim();

        if (trimmedLine.includes(" ")) {
          const [key, ...rest] = trimmedLine.split(" ");
          const value = rest.join(" ");
          commitLog[key] = value;
        }
      });

      commitHistory.push(commitLog);
      commitGraph.push({
        commitHash: currentCommitHash,
        parent: commitLog.parent || null,
        message: commitLog.message,
      });

      currentCommitHash = commitLog.parent || null;

      if (!currentCommitHash) {
        break;
      }
    }

    if (graph) {
      console.log(chalk.yellow("\nCommit Graph:"));
      let graphRepresentation = "";
      commitGraph.reverse().forEach((commit, index) => {
        const spaces = " ".repeat(index * 4);
        graphRepresentation += `${spaces}|-- ${commit.commitHash.slice(
          0,
          7
        )}: ${commit.message}\n`;

        if (commit.parent) {
          graphRepresentation += `${spaces}|   |\n`;
        }
      });
      console.log(graphRepresentation);
    } else {
      commitHistory.forEach((commitLog) => {
        console.log(chalk.yellow(`Commit: ${commitLog.commitHash}`));
        console.log(chalk.white(`Author: ${commitLog.author}`));
        console.log(chalk.white(`Message: ${commitLog.message}\n`));
      });
    }
  });
}
