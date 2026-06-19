---
name: audit_project
version: 1.0.0
description: "Global Workflow: Runs Phase 0 environment audit and bootstrapping."
---
<!-- VERSION: 1.0.0 -->

# Phase 0: Project Audit Workflow

> **INSTRUCTIONS FOR AI:**
> When the user triggers this workflow (e.g. via `/audit_project`), you MUST execute this sequence exactly:

1. **OS Detection:** Execute `uname -a` (or appropriate Python sys commands) to determine the OS.
2. **State Evaluation:** Execute `ls -la` in the current directory to check if the `docs.llm/` folder exists.
3. **Bootstrapping:**
   - If `docs.llm/` does **NOT** exist, execute the command `core_init_docs.sh` (this is globally available in your PATH). This will safely generate the documentation framework and local workflows directory.
   - If `docs.llm/` **DOES** exist, skip initialization and read the contents of `docs.llm/settings.yaml`.
4. **Reporting:** Output a concise, AI-optimized summary of the environment state to the user.
