import getFiles from "./get_files.js";
import stagedFiles from "./get_staged_files.js";

export default function trackFileChnages() {
  let modifiedFiles = [];
  let untrackedFiles = [];
  let deletedFiles = [];

  const staged_files = stagedFiles();
  const files = getFiles();

  files.forEach((file) => {
    const stagedFile = staged_files.find((staged) => staged.path === file.path);

    if (stagedFile) {
      const fileModifiedTime = new Date(file.modifiedTime).getTime();
      const stagedModifiedTime = new Date(stagedFile.modifiedTime).getTime();

      if (fileModifiedTime > stagedModifiedTime) {
        modifiedFiles.push({
          path: file.path,
          modifiedTime: file.modifiedTime,
          status: "modified",
        });
      }
    } else {
      untrackedFiles.push({
        path: file.path,
        modifiedTime: file.modifiedTime,
        status: "new",
      });
    }
  });

  staged_files.forEach((stagedFile) => {
    const fileExistsInWorkingDir = files.some(
      (f) => f.path === stagedFile.path
    );

    if (!fileExistsInWorkingDir) {
      deletedFiles.push({
        path: stagedFile.path,
        modifiedTime: stagedFile.modifiedTime,
        status: "deleted",
      });
    }
  });

  return {
    modifiedFiles,
    untrackedFiles,
    deletedFiles,
  };
}
