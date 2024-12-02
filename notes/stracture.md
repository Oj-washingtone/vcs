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

Push

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
