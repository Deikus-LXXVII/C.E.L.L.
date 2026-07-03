---
description: Scaffold a new project workspace with docs.llm/ context files, .gitignore, and kick off project-architect to analyze the stated project idea.
argument-hint: [project idea]
allowed-tools: Write, Read, Bash(mkdir:*)
---

# Project Initialization

Scaffold a new project in the current working directory. The user's project idea (if given) is: $ARGUMENTS

## Steps

1. **Check project state.** If `docs.llm/` already exists in the current directory, tell the user initialization was skipped because the project is already initialized — do not overwrite anything.

2. **Create `.gitignore`** (only if one doesn't already exist, otherwise append these lines if missing):
   ```
   .DS_Store
   node_modules
   .env
   dist
   logs
   ```

3. **Create `docs.llm/`** with these seed files (write each verbatim if the file doesn't already exist):

   - `docs.llm/context.md`:
     ```markdown
     # Project Context & Vision
     > **INSTRUCTIONS FOR AI:**
     > **WHAT:** The high-level vision, core philosophy, and methodology.
     ```
   - `docs.llm/file_map.md`:
     ```markdown
     # File Map & Architecture
     > **INSTRUCTIONS FOR AI:**
     > **WHAT:** Structural map of the codebase.
     ```
   - `docs.llm/guide.md`:
     ```markdown
     # Current State & Developer Guide
     > **INSTRUCTIONS FOR AI:**
     > **WHAT:** Executable instruction manual for the project AS IT IS NOW.
     ```
   - `docs.llm/memory_anchor.md`:
     ```markdown
     # Memory Anchor
     > **INSTRUCTIONS FOR AI:**
     > **WHAT:** Primary source of truth for all hard facts, global constants, and technical constraints.
     ```
   - `docs.llm/quirks.md`:
     ```markdown
     # Quirks
     This file documents project-specific anomalies, custom behaviors, and naming conventions discovered during development.
     ```

4. **Create a project-local `docs.llm/roadmap.md`** tracking the initialization pipeline:
   ```markdown
   # Execution Roadmap
   > **INSTRUCTIONS FOR AI:**
   > **WHAT:** Sequential execution plan. Update the checkboxes below as each step completes.

   ## Project Initialization Pipeline
   - [ ] **1. Concept Analysis & Architecture:** `project-architect` analyzes the concept, identifies pros/cons, and determines the tech stack.
   - [ ] **2. Environment Setup:** `environment-setup` audits the local system, installs missing tools, and writes `docs.llm/tools.md`.
   - [ ] **3. Infrastructure Planning:** Discuss and delegate any custom agent/command needs to `antiengine-builder`.
   - [ ] **4. Builder Execution:** `antiengine-builder` generates any requested new agents/commands/docs.
   - [ ] **5. Validation:** `antiengine-qa` validates the new setup.
   - [ ] **6. Execution:** Project development begins.
   ```

5. **Notify the user** that `docs.llm/` and `.gitignore` have been created.

6. **Kick off the Architect.** Use the Task tool to invoke the `project-architect` subagent, passing along the project idea from `$ARGUMENTS` (or asking the user for it if not provided). Tell the user the Architect has been deployed to analyze the concept and propose a tech stack.
