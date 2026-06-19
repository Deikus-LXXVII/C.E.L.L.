---
name: git-flow-automator
description: "Provides standardized practices for analyzing git diff, generating semantic commit messages, and managing branches autonomously."
type: skills
labels:
  - version-control
  - git
  - automation
danger_level: 2
danger_details: "Executes git commands autonomously, modifying local repository state. Could cause uncommitted changes to be lost if not careful."
---

# Skill: Git Flow Automator

## Objective
Enable autonomous agents to safely manage git operations, analyze diffs, create semantic commits, and manage branches without risking repository corruption or data loss.

## Prerequisites
- The target repository must be initialized with git.
- The agent must verify `git status` before performing operations.

## Phase 1: Diff Analysis
1. **Check Status**: Always run `git status` to see what is modified, untracked, or already staged.
2. **Review Diffs**:   
   - Run `git diff` for unstaged changes.
   - Run `git diff --cached` for staged changes.
3. **Validation**:   
   - Check for accidental inclusion of `.env` files, credentials, or large binary files.
   - Look for leftover debug statements (e.g., `console.log`, `print()`, `debugger`).

## Phase 2: Staging and Committing
1. **Selective Staging**: Use `git add <file>` specifically rather than `git add .` to avoid committing unintended files.
2. **Semantic Commit Message Generation**:   
   - Analyze the diff and determine the Conventional Commit type (`feat`, `fix`, `docs`, `refactor`, `chore`, etc.).
   - Draft a subject line in the imperative mood, <= 50 characters.
   - Add a detailed body if the change is complex.
3. **Execution**:   
   - Execute `git commit -m "<type>(<scope>): <subject>" -m "<body>"`.

## Phase 3: Branch Management
1. **Creating Branches**:   
   - Run `git checkout -b <type>/<description>` (e.g., `feat/add-login`).
2. **Syncing**:   
   - Before branching off, ensure the base branch is up to date (`git pull origin main --rebase`).
3. **Autonomy Rules**:   
   - **DO NOT** use `git push --force` on any shared branches.
   - **DO NOT** delete branches unless you explicitly created them for the current task and they are merged.