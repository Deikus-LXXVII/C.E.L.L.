# C.E.L.L. — Claude's Evolving Logic Library

An orchestration engine and library of specialized subagents — **cells** — for **Claude Code**.

C.E.L.L. upgrades the main agent from a solo coder into an **Orchestrator**. Like a biological cell, a new project starts from a small set of general-purpose "stem cells" and then **differentiates**: specialized cells, rules, and documentation are created for exactly what that project needs. Delegation is enforced structurally by Claude Code's own `Task` tool and permission system, not by prose convention alone.

## Installation

```bash
git clone <this repository's URL>
cd CELL
./install.sh            # installs into the current project's .claude/
# or:
./install.sh user        # installs into ~/.claude/ for every project (recommended)
```

No build step is required — cells and commands are plain markdown files.

## How to use: Genesis

1. Run `./install.sh user` once (recommended — makes every cell available in every project, so new projects never need their own vendored copy of the starter cells).
2. Create a new project folder (or `cd` into an existing one) and open Claude Code.
3. Type: `/cell-create I want to build a [your project idea]`

**What happens next?** `/cell-create` scaffolds `docs.llm/` context files and a `.gitignore`, seeds the three starter cells if they aren't already globally available, and kicks off the **Genesis Pipeline**: `cell-architect` analyzes and critiques your idea via the `Task` tool.

## The Genesis Pipeline

`/cell-create` tracks a 5-stage roadmap in `docs.llm/roadmap.md`:
1. **Concept Analysis & Critique:** `cell-architect` analyzes the idea, critiques it, refines it with you, and locks the tech stack.
2. **Environment Setup:** `cell-environment` checks local tools (node, python, docker, etc.) and installs what's missing.
3. **Cell Differentiation:** `cell-builder` creates the project-specific cells, rules, and docs this project actually needs — the literal "cell division" step.
4. **Validation:** `cell-qa` validates the new project-specific setup.
5. **Execution:** development begins, delegated mostly to specialized cells so the orchestrator's own context window stays free for coordination.

See this repo's `CLAUDE.md` for the full Orchestration Conventions (which cell handles which kind of request) and the complete cell reference table.

## The Starter Cells

- **`cell-architect`** — conducts user interviews, critiques and refines the concept, defines the tech stack.
- **`cell-environment`** — DevOps engineer that audits and configures the local environment.
- **`cell-builder`** — differentiates new project-specific cells, commands, and reference docs.

## The Rest of the Library

- **`cell-cleaner`** — workspace janitor: finds dead code, unused dependencies, obsolete logs (reports only, never deletes).
- **`cell-docs`** — keeps `docs.llm/` and inline documentation in sync with the code.
- **`cell-security`** — read-only OWASP Top 10 / hardcoded-secret auditor.
- **`cell-git`** — repository/release management (GitHub repo creation, remotes, initial pushes).
- **`cell-qa`** — validates new/modified cells and commands before they're treated as done.
- **`cell-prompt`** — drafts/refines cell and command prompts using Claude-specific prompt engineering.
- **`cell-backend`**, **`cell-swift`**, **`cell-openwrt`**, **`cell-audio`** — domain specialists for backend/TypeScript, macOS Swift, OpenWrt embedded Linux, and macOS audio AI pipelines respectively.
- **`cell-research`** — deep web research and documentation synthesis.
- **`/git:flow`** (slash command) — analyzes `git diff`, proposes Conventional Commit messages, manages branches.

## Customization

Ask `cell-builder` to create a new specialized cell, slash command, or reference doc — it will draft, verify, and save it directly under `.claude/agents/`, `.claude/commands/`, or `docs/agent-rules/`.
