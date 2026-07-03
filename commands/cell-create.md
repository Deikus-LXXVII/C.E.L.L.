---
description: Initialize a new project as a C.E.L.L. — scaffold docs.llm/, seed starter cells from the library, and kick off the project genesis pipeline (concept analysis, critique, and cell differentiation).
argument-hint: [project idea]
allowed-tools: Write, Read, Bash(mkdir:*), Bash(ls:*)
---

# Cell Creation (Project Genesis)

Initialize the current working directory as a new C.E.L.L. project. The user's project idea (if given) is: $ARGUMENTS

Like a biological cell, this project starts from a small set of general-purpose starter cells (subagents), which then **differentiate** — the orchestrator and `cell-builder` create new, specialized cells, rules, and docs tailored to exactly what this project needs, rather than carrying every possible specialist from day one.

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

4. **Seed starter cells (if not already available).** Check whether `cell-architect`, `cell-environment`, and `cell-builder` are already usable in this session (they're globally available if C.E.L.L. was installed via `install.sh user` into `~/.claude/agents/`, or already present in this project's own `.claude/agents/`).
   - If they're **already available** (globally or locally), skip straight to step 6 — nothing to copy.
   - If **not available**, look for the C.E.L.L. library on disk (check `~/.claude/agents/` for a prior user-level install, or ask the user for the path to their local clone of the C.E.L.L. repo) and copy exactly three files into this project's `.claude/agents/` (creating the directory if needed): `cell-architect.md`, `cell-environment.md`, `cell-builder.md`. These three are the project's "stem cells" — general enough to bootstrap any project; `cell-builder` will differentiate specialized cells from here as the project's actual needs become clear.
   - If the library can't be located either way, tell the user plainly: install C.E.L.L. globally first (`install.sh user`, recommended — makes every cell available in every project), or point you at their local clone so the three seed files can be copied manually.

5. **Notify the user** that `docs.llm/`, `.gitignore`, and (if applicable) the starter cells have been created.

6. **Kick off the Genesis Pipeline.** Create `docs.llm/roadmap.md` tracking these stages, then use the Task tool to invoke `cell-architect`, passing along the project idea from `$ARGUMENTS` (or asking the user for it if not provided):
   ```markdown
   # Execution Roadmap
   > **INSTRUCTIONS FOR AI:**
   > **WHAT:** Sequential execution plan. Update the checkboxes below as each stage completes.

   ## Project Genesis Pipeline
   - [ ] **1. Concept Analysis & Critique:** `cell-architect` analyzes the idea, critiques it, refines it together with the user, and locks the tech stack.
   - [ ] **2. Environment Setup:** `cell-environment` audits the local system, installs missing tools, and writes `docs.llm/tools.md`.
   - [ ] **3. Cell Differentiation:** `cell-builder` creates the project-specific cells, rules, and documentation this project actually needs (not a generic one-size-fits-all roster).
   - [ ] **4. Validation:** `cell-qa` validates the new project-specific cells and setup.
   - [ ] **5. Execution:** Development begins — delegated primarily to specialized cells via the Task tool, keeping the orchestrator's own context window free for coordination rather than implementation detail.
   ```
   Tell the user the Architect cell has been deployed to analyze and critique the concept, and that development work for the rest of the pipeline will happen mostly through delegated cells rather than in the main conversation directly.
