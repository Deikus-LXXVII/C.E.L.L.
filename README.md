# C.E.L.L. — Claude's Evolving Logic Library

An orchestration engine and library of specialized subagents — **cells** — for **Claude Code**.

C.E.L.L. upgrades the main agent from a solo coder into an **Orchestrator**. Like a biological cell, a new project starts from a small set of general-purpose "stem cells" and then **differentiates**: specialized cells, rules, and documentation are created for exactly what that project needs. Delegation is enforced structurally by Claude Code's own `Task` tool and permission system, not by prose convention alone.

## Installation

C.E.L.L. ships as a native Claude Code plugin — no cloning, no build step. Inside a Claude Code session:

```
/plugin marketplace add Deikus-LXXVII/C.E.L.L.
/plugin install cell@cell
```

Or, as a single shell command (equivalent, non-interactive):

```bash
claude plugin marketplace add Deikus-LXXVII/C.E.L.L. && claude plugin install cell@cell
```

That's it — all 14 cells and both slash commands are now available in every project.

## Updating

Since C.E.L.L. doesn't pin a `version` in its manifest, **every push to this repo is immediately available as a new version** — nothing needs to be tagged or released for an update to be pickable up.

**Automatic (recommended, one-time setup):** third-party marketplaces have auto-update off by default in Claude Code. Turn it on once and updates apply automatically at every session start:
1. Run `/plugin`
2. Go to **Marketplaces** → select **cell**
3. Choose **Enable auto-update**

From then on, Claude Code refreshes the marketplace and updates the plugin at startup, and notifies you to run `/reload-plugins` when something changed.

**Manual, anytime:**
```
/plugin marketplace update cell
/plugin update cell@cell
/reload-plugins
```
Or non-interactively:
```bash
claude plugin marketplace update cell && claude plugin update cell@cell
```

**For teams**, an admin can force auto-update on for everyone without each person toggling it, by adding this to the project's `.claude/settings.json`:
```json
{
  "extraKnownMarketplaces": {
    "cell": {
      "source": { "source": "github", "repo": "Deikus-LXXVII/C.E.L.L." },
      "autoUpdate": true
    }
  }
}
```

<details>
<summary>Alternative: manual install (no plugin marketplace)</summary>

For environments where plugin marketplaces are restricted, or for local development:

```bash
git clone https://github.com/Deikus-LXXVII/C.E.L.L..git
cd C.E.L.L.
./install.sh            # installs into the current project's .claude/
# or:
./install.sh user        # installs into ~/.claude/ for every project (recommended)
```

No build step is required either way — cells and commands are plain markdown files.

**Updating this path**: there's no auto-update for a manually-installed copy. Pull the latest changes and re-run `install.sh` to refresh the installed files:
```bash
git pull
./install.sh user   # or ./install.sh, matching however you installed originally
```
</details>

## How to use: Genesis

1. Install C.E.L.L. (above) — the plugin path makes every cell available in every project immediately, so new projects never need their own vendored copy of the starter cells.
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

Ask `cell-builder` to create a new specialized cell, slash command, or reference doc — it will draft, verify, and save it directly under `agents/`, `commands/`, or `docs/agent-rules/`.

## Contributing / Local Development

This repo is both the plugin and its own marketplace (`.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`, self-referencing via `"source": "./"`). To test changes locally without publishing:

```bash
claude --plugin-dir /path/to/this/repo
```

See this repo's `CLAUDE.md` for the full architecture, agent reference table, and orchestration conventions.
