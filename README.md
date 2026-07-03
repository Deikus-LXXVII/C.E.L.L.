# Antigravity Engine

An orchestration engine and library of specialized subagents for **Claude Code**.

Antigravity Engine upgrades the main agent from a solo coder into an **Orchestrator**. It ships 13 specialist subagents (`.claude/agents/`) and slash commands (`.claude/commands/`) that automate project architecture, environment setup, documentation, security analysis, and Git workflows — with delegation enforced structurally by Claude Code's own `Task` tool and permission system, not by prose convention alone.

## Installation

```bash
git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git
cd Antigravity.Engine
./install.sh            # installs into the current project's .claude/
# or:
./install.sh user        # installs into ~/.claude/ for every project
```

No build step is required — agents and commands are plain markdown files.

## How to use: The Starter Pack

1. Create a new project folder (or `cd` into an existing one) and run `./install.sh` from this repo.
2. Open Claude Code in that project.
3. Type: `/ae-init I want to build a [your project idea]`

**What happens next?** The `/ae-init` command scaffolds `docs.llm/` context files and a `.gitignore`, then invokes the **Architect** subagent (`project-architect`) via the `Task` tool to analyze your idea and propose a tech stack.

## The 6-Step Cognitive Pipeline

`/ae-init` kicks off a roadmap tracked in `docs.llm/roadmap.md`:
1. **Architect Analysis:** `project-architect` analyzes the idea and determines the tech stack.
2. **Environment Setup:** `environment-setup` checks local tools (node, python, docker, etc.) and installs what's missing.
3. **Infrastructure Planning:** discuss and delegate any custom agent/command generation to `antiengine-builder`.
4. **Builder Execution:** `antiengine-builder` writes any needed new agents/commands/docs.
5. **QA Validation:** `antiengine-qa` validates the new setup.
6. **Execution Phase:** actual product development begins.

See this repo's `CLAUDE.md` for the full Orchestration Conventions (which agent handles which kind of request) and the complete agent reference table.

## The Antigravity Specialists

- **`project-architect`** — conducts user interviews, analyzes tradeoffs, defines the tech stack.
- **`environment-setup`** — DevOps engineer that audits and configures the local environment.
- **`project-cleaner`** — workspace janitor: finds dead code, unused dependencies, obsolete logs (reports only, never deletes).
- **`doc-writer`** — keeps `docs.llm/` and inline documentation in sync with the code.
- **`security-analyst`** — read-only OWASP Top 10 / hardcoded-secret auditor.
- **`git-master`** — repository/release management (GitHub repo creation, remotes, initial pushes).
- **`antiengine-builder`** — creates and maintains this repo's own subagents, commands, and reference docs.
- **`antiengine-qa`** — validates new/modified agents and commands before they're treated as done.
- **`prompt-engineer`** — drafts/refines subagent and command prompts using Claude-specific prompt engineering.
- **`backend-developer`**, **`swift-developer`**, **`openwrt-developer`**, **`audio-ai-master`** — domain specialists for backend/TypeScript, macOS Swift, OpenWrt embedded Linux, and macOS audio AI pipelines respectively.
- **`web-researcher`** — deep web research and documentation synthesis.
- **`/git:flow`** (slash command) — analyzes `git diff`, proposes Conventional Commit messages, manages branches.

## Customization

Ask `antiengine-builder` to create a new specialist agent, slash command, or reference doc — it will draft, verify, and save it directly under `.claude/agents/`, `.claude/commands/`, or `docs/agent-rules/`.
