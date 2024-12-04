### Folder stracture

.vcs => main version control folder
staging.txt

- shows files that are going to be part of the next commit
- status.txt
- the content is in the stracture

```txt
file path | file modification time |file status

example
testdata/Readme.md | 2024-04-14 | Created/ updated/ Deleted
```

Commit logs example

```bash
[main (root-commit) fd61ce0] First commit
 6 files changed, 3684 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 create mode 100644 app.js
 create mode 100644 notes/stracture.md
 create mode 100644 package-lock.json
 create mode 100644 package.json
```

Push logs example

```bash
Enumerating objects: 8, done.
Counting objects: 100% (8/8), done.
Delta compression using up to 8 threads
Compressing objects: 100% (5/5), done.
Writing objects: 100% (8/8), 30.65 KiB | 10.22 MiB/s, done.
Total 8 (delta 0), reused 0 (delta 0), pack-reused 0
To github.com:Oj-washingtone/vcs.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

Excludes folder contains anything that should be ignored / excluded
excludes.txt

Blob folder stores only the content of files, not its name or permission
Tree is used to store directory stractures, what files/directories are in the tree, their name and permission

commits store include the commit message, author and committer, parent commits etc

// all objects are identified by a 40 character SHA-1 HASH also known as object hash
Example: e88f7a929cd70b0274c4ea33b209c97fa845fdbc.

# Git object storage

git objects are stored in /git/objects
the path to the object is the is derived from its hash
the path to object with hash e88f7a929cd70b0274c4ea33b209c97fa845fdbc would be
./.git/objects/e8/8f7a929cd70b0274c4ea33b209c97fa845fdbc

NOte that the file is not placed directly into /objects folder, instead it is placed in a directory named with the first two characters of the object hash, the remaining 38 are used as the file name
