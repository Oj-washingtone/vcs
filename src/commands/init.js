import fs from "fs";
import path from "path";

export default function init() {
  const scDir = path.join(process.cwd(), ".sc");

  if (fs.existsSync(scDir)) {
    console.log("Reinitialized existing source control repository");
    return;
  }

  fs.mkdirSync(scDir, { recursive: true });

  fs.mkdirSync(path.join(scDir, "refs/branches"), {
    recursive: true,
  });

  fs.writeFileSync(path.join(scDir, "refs/branches/main"), "");

  // head
  const headFile = path.join(scDir, "HEAD");
  fs.writeFileSync(headFile, "ref: refs/branches/main");

  // staging
  const stagingFile = path.join(scDir, "staging");
  fs.writeFileSync(stagingFile, "");

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
        fetch: "+refs/branches/*:refs/remotes/origin/*",
      },
    },

    branch: {
      main: {
        remote: "origin",
        merge: "refs/branches/main",
      },
    },
    user: {},
  };

  fs.writeFileSync(configFile, JSON.stringify(configContent, null, 2));

  const objects = path.join(scDir, "objects");
  fs.mkdirSync(objects, { recursive: true });

  const logs = path.join(scDir, "logs", "refs", "heads");
  fs.mkdirSync(logs, { recursive: true });

  const headLogs = path.join(scDir, "logs", "HEAD");
  fs.writeFileSync(headLogs, "");

  const ignoreFile = path.join(process.cwd(), ".scignore");
  if (!fs.existsSync(ignoreFile)) {
    fs.writeFileSync(ignoreFile, "");
  }

  console.log("OK: Source control repository initialized in ./.sc/");
}
