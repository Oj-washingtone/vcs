#!/usr/bin/env node
import { program } from "commander";
import init from "../src/commands/init.js";
import { sc_branch, sc_switchto } from "../src/commands/branch.js";
import { sc_status, sc_add } from "../src/commands/staging.js";
import { sc_commit } from "../src/commands/commit.js";
import { logs } from "../src/commands/logs.js";
import { sc_merge } from "../src/commands/merge.js";

program
  .name("sc")
  .description("A distributed source control system")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize a new repository, default branch is main")
  .action(init);

program
  .command("branch [branch]")
  .description("List all branches, create new branch")
  .action(sc_branch);

program
  .command("switchto <branch>")
  .description("Switch to a branch")
  .action(sc_switchto);

program
  .command("merge <branch>")
  .description("Merge a branch into the current branch")
  .action(sc_merge);

program
  .command("status")
  .description("Show the working tree status")
  .action(sc_status);

program
  .command("add <file>")
  .description("Add a file to the staging area")
  .action(sc_add);

program
  .command("commit")
  .description("Record changes to the repository")
  .requiredOption("-m, --message <message>", "commit message")
  .action(sc_commit);

program
  .command("log")
  .description("Show commit history")
  .option("-g, --graph", "Show commit history in a graph format")
  .action((options) => {
    logs(options.graph);
  });

// program
//   .command("push [branch]")
//   .description("Push changes to the remote repository")
//   .option("-u, --set-upstream", "Set upstream for the specified branch")
//   .option("-r, --remote <remote>", "Specify the remote repository", "origin")
//   .action((branch = "main", options) => {
//     const remote = options.remote;
//     if (options.setUpstream) {
//       console.log(`Setting upstream for ${branch} to ${remote}/${branch}...`);
//     }
//     console.log(`Pushed ${branch} to ${remote}/${branch}`);
//   });

// program
//   .command("pull [branch]")
//   .description("Pull changes from the remote repository")
//   .option("-r, --remote <remote>", "Specify the remote repository", "origin")
//   .option("-v, --verbose", "Show detailed output")
//   .action((branch = "main", options) => {
//     const remote = options.remote;
//     if (options.verbose) {
//       console.log(`Fetching changes from ${remote}/${branch}...`);
//       console.log("Resolving conflicts if any...");
//     }
//     console.log(`Pulled ${branch} from ${remote}/${branch}`);
//   });

program
  .command("clone <repository>")
  .description("Clone a repository")
  .option("-d, --directory <dir>", "Specify the target directory", ".")
  .option("-v, --verbose", "Show detailed cloning process")
  .action((repository, options) => {
    const directory = options.directory;
    console.log(`Cloning ${repository} into '${directory}'...`);
    if (options.verbose) {
      console.log("Fetching objects...");
      console.log("Resolving deltas...");
      console.log("Checking out files...");
    }
    console.log("Clone completed.");
  });

// TODO: sc config - configuration file to be updated dynamically later using sc config.
// TODO: unstage - remove file from staging area

program.parse(process.argv);
