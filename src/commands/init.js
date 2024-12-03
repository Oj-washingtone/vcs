import fs from "fs";
import path from "path";

export default function init() {
  const scDir = path.join(process.cwd(), ".sc");

  if (fs.existsSync(scDir)) {
    console.log("Reinitialized existing source control repository");
    return;
  }

  fs.mkdirSync(scDir, { recursive: true });

  // make refs/branches directory
  fs.mkdirSync(path.join(scDir, "refs/branches"), {
    recursive: true,
  }); /* Each file in the is a branch and the content of the file is the commit hash */

  // add a default branch
  fs.writeFileSync(path.join(scDir, "refs/branches/main"), "");

  // head
  const headFile = path.join(scDir, "HEAD"); // points to the current branch your're on by default it points to the main branch
  fs.writeFileSync(headFile, "ref: refs/branches/main");

  // staging
  const stagingFile = path.join(scDir, "staging");
  fs.writeFileSync(stagingFile, JSON.stringify([]));

  const configFile = path.join(scDir, "config", "");

  const configContent = {
    core: {
      repositoryformatversion: 0,
      filemode: false,
      bare: false,
      logallrefupdates: true,
      ignorecase: true,
      precomposeunicode: true,
    },

    remote: {
      origin: {
        url: "",
        fetch: "+refs/heads/*:refs/remotes/origin/*",
      },
    },

    branch: {
      main: {
        remote: "origin",
        merge: "refs/heads/main",
      },
    },
  };

  fs.writeFileSync(configFile, JSON.stringify(configContent, null, 2));

  const commitsDir = path.join(scDir, "commits");
  fs.mkdirSync(commitsDir, { recursive: true });

  const objects = path.join(scDir, "objects");
  fs.mkdirSync(objects, { recursive: true });

  const ignoreFile = path.join(process.cwd(), ".scignore");
  if (!fs.existsSync(ignoreFile)) {
    fs.writeFileSync(ignoreFile, "");
  }

  console.log("OK: Source control repository initialized in ./.sc/");
}
