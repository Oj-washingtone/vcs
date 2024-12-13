# Source Control Tool (sc)

`sc` is a lightweight, distributed source control system designed for developers who prefer a minimalistic yet powerful tool for managing code repositories. With an intuitive command structure, `sc` makes version control and collaboration straightforward without the overhead of more complex systems.

## Features

- **Repository Initialization**: Set up a source control system in minutes.
- **Branch Management**: Create, switch, and manage branches with ease.
- **Staging & Committing**: Stage files and commit changes in a simple workflow.
- **Branch Merging**: Supports both fast-forward and recursive merges for divergent branches.
- **Commit History**: View commit logs and repository status.
- **Repository Cloning**: Clone repositories to work on existing projects.

## How It Works

`sc` is built with simplicity and efficiency in mind. Unlike heavyweight systems, it uses a minimal set of files to manage version control, including:

- **Staging Area**: Where files you want to commit are listed with their statuses.
- **Configuration**: Stores user and repository configuration.
- **Branch Management**: Keeps track of branch states and commit history.
- **Objects Directory**: Stores compressed file content and commit trees.
- **Merge Strategies**: Offers fast-forward and recursive merges based on branch history.

### Unique Approach

#### **Repository Initialization**

`sc` initializes repositories by creating essential directories and files:

- `config` for repository settings (including user name and email).
- `Ref` for storing branch information.
- `Objects` for storing compressed commit data.
- `HEAD` to keep track of the current branch.
- `.scignore` for ignoring untracked files.

#### **Staging**

`sc` automatically scans the working directory for files that need to be tracked or committed, excluding those listed in `.scignore`. Files are tracked with a unique status and timestamp in a staging file, helping you stay on top of what needs to be committed.

#### **Committing Code**

Committing in `sc` is a two-step process:

1. Retrieve the latest commit from the current branch (or use the root commit if it’s the first commit).
2. Generate new blobs for modified files, create a tree snapshot, and store the commit in the repository.

This structure allows you to track file changes efficiently and creates a simple yet powerful version control mechanism.

#### **Branch Merging**

`sc` supports two merge strategies:

1. **Fast Forward Merge**: When a branch is directly behind another, simply update the current branch pointer to the tip of the other.
2. **Recursive Merge**: When branches diverge, `sc` finds the common ancestor and merges the trees. Conflicts are detected, and if any occur, they need to be resolved manually.

This flexibility provides a seamless experience for both linear and divergent development workflows.

---

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. You can download it [here](https://nodejs.org).

### Install via npm

```bash
npm install -g source-control-tool
```

---

## Usage

Run the following command to see all available options:

```bash
sc --help
```

### Commands

#### `init`

Initialize a new repository. By default, the main branch is named `main`.

```bash
sc init
```

### `config`

Configure your repository settings, specifically the user name and email that will be used for commits.

- `-u, --user <name>`: Set the user name for the repository.
  - Example: `sc config --user "John Doe"`
- `-e, --email <email>`: Set the user email for the repository.

  - Example:

  `sc config --email "johndoe@example.com"`

- Use the `--user` option to set the user name that will be used for commits in the repository.
- Use the `--email` option to set the user email that will be used for commits in the repository.
- Both options can be used together to configure both the user name and email at once.

#### `branch [branch]`

List all branches or create a new branch.

- To list all branches:
  ```bash
  sc branch
  ```
- To create a new branch:
  ```bash
  sc branch <branch-name>
  ```

#### `switchto <branch>`

Switch to a specific branch.

```bash
sc switchto <branch-name>
```

#### `merge <branch>`

Merge a branch into the current branch.

```bash
sc merge <branch-name>
```

#### `status`

Show the working tree status.

```bash
sc status
```

#### `add <file>`

Add a file to the staging area.

```bash
sc add <file-name>
```

#### `commit [options]`

Record changes to the repository.

- To commit all staged changes:
  ```bash
  sc commit -m "Your commit message"
  ```

#### `log [options]`

View the commit history.

```bash
sc log
```

View the commit history in graph format

```bash
sc log -g
```

#### `clone [options] <repository>`

Clone a repository.

```bash
sc clone <repository-url>
```

#### `help [command]`

Display help for a specific command.

```bash
sc help <command>
```

---

## Example Workflow

1. Initialize a repository:

   ```bash
   sc init
   ```

2. Configure repocitory user and email

   ```bash
   sc config -u "My name" -e "example@example.com"
   ```

3. Create and switch to a new branch:

   ```bash
   sc branch feature-xyz
   sc switchto feature-xyz
   ```

4. Add files to the staging area:

   ```bash
   sc add index.js
   ```

5. Commit changes:

   ```bash
   sc commit -m "Added index.js"
   ```

6. Merge the feature branch into the main branch:

   ```bash
   sc switchto main
   sc merge feature-xyz
   ```

7. View the commit history:

   ```bash
   sc log -g
   ```
