# Source Control Tool (sc)

`sc` is a distributed source control system designed for developers to manage their code repositories efficiently. This lightweight tool offers intuitive commands for version control and collaboration.

---

## Features

- Initialize repositories
- Create, switch, and manage branches
- Add files to staging and commit changes
- Merge branches
- View commit history and repository status
- Clone repositories

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
   sc log
   ```
