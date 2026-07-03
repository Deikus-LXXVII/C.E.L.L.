---
description: Analyze the current git diff, propose a Conventional Commit message, and manage staging/branching safely.
argument-hint: [commit|branch|pr]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git checkout:*), Bash(git pull:*)
---

## Current repository state

Working tree status:
!`git status`

Unstaged changes:
!`git diff`

Staged changes:
!`git diff --cached`

## Objective

Requested action: $ARGUMENTS (defaults to "commit" if not specified)

Using the diff output above, safely manage git operations without risking repository corruption or data loss.

## Phase 1: Diff Analysis

1. Check the status/diff output above for anything that shouldn't be committed: `.env` files, credentials, large binaries, leftover debug statements (`console.log`, `print()`, `debugger`).
2. If anything concerning is found, flag it to the user before proceeding — do not commit it silently.

## Phase 2: Staging and Committing

1. Stage files selectively (`git add <file>`) rather than `git add .`, to avoid committing unintended files.
2. Determine the Conventional Commit type (`feat`, `fix`, `docs`, `refactor`, `chore`, etc.) from the diff.
3. Draft a subject line in the imperative mood, ≤ 50 characters, plus a body if the change is non-trivial.
4. Commit: `git commit -m "<type>(<scope>): <subject>" -m "<body>"`.

## Phase 3: Branch Management (if requested)

1. Before branching, ensure the base branch is up to date: `git pull origin main --rebase`.
2. Create the new branch: `git checkout -b <type>/<description>` (e.g. `feat/add-login`).
3. **Never** use `git push --force` on a shared branch.
4. **Never** delete a branch unless it was created for the current task and is already merged.
