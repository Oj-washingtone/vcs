import fs from "fs";
import path from "path";

export default function branch(branchName) {
  const scDir = path.join(process.cwd(), ".sc");

  if (!fs.existsSync(scDir)) {
    console.log(
      "Not a repocitory. Please run `sc init` to initialize a repocitory."
    );
    return;
  }

  const branchFile = path.join(scDir, "branch");

  if (branchName) {
    // Create a new branch by writing the branch name inside the branch file
    // If the branch already exists, do not create a duplicate
    if (fs.existsSync(branchFile)) {
      const existingBranches = fs.readFileSync(branchFile, "utf-8").split("\n");

      if (existingBranches.includes(branchName)) {
        console.log(`Branch ${branchName} already exists.`);
        return;
      }

      existingBranches.push(branchName);
      fs.writeFileSync(branchFile, existingBranches.join("\n"));
      console.log(`Branch ${branchName} created.`);
    } else {
      fs.writeFileSync(branchFile, branchName);
      console.log(`Branch ${branchName} created.`);
    }
  } else {
    // List all the branches if no branch name is provided
    if (fs.existsSync(branchFile)) {
      const branches = fs.readFileSync(branchFile, "utf-8").split("\n");
      console.log("Branches:", branches.join(", "));
    } else {
      console.log("No branches found.");
    }
  }
}
