# C.E.L.L. — Claude's Evolving Logic Library: Developer Guide for AI Assistants

**For Claude instances and AI assistants working on C.E.L.L. — a library of specialized subagents ("cells") and slash commands for Claude Code.**

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Architecture](#2-architecture)
3. [Cell Reference](#3-cell-reference)
4. [Orchestration Conventions](#4-orchestration-conventions)
5. [Self-Learning / Quirks Convention](#5-self-learning--quirks-convention)
6. [Development Workflow](#6-development-workflow)
7. [Code Conventions & Patterns](#7-code-conventions--patterns)
8. [Extending the System](#8-extending-the-system)
9. [Critical Files Reference](#9-critical-files-reference)
10. [Setup & Installation](#10-setup--installation)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview & Philosophy

**C.E.L.L. (Claude's Evolving Logic Library)** is an orchestration layer for Claude Code: a set of specialized subagents — called **cells** — and slash commands that turn the main conversation from a solo coder into an **Orchestrator** that delegates focused work to the right specialist.

### The biology metaphor

The name is deliberate. Like a biological cell, this library starts a new project from a small set of general-purpose **stem cells** (`cell-architect`, `cell-environment`, `cell-builder`). As the project's actual needs become clear, `cell-builder` **differentiates** new, specialized cells, rules, and documentation for that specific project — rather than every project carrying every possible specialist from day one. The library keeps evolving: cells accumulate knowledge in their own `## Known Quirks` sections as they work.

### Key Concepts

- **Orchestrator pattern, enforced structurally.** The main thread delegates coding, research, and analysis to cells via Claude Code's `Task` tool. Unlike a prose-only "please delegate" convention, each cell's `description` field drives Claude Code's own auto-routing, and each cell's `tools:` allowlist is a real, harness-enforced restriction — not just a label.
- **Plain files, no custom server.** In this repo, cells live at `agents/*.md` and slash commands at `commands/*.md` (plugin root — see §2.1). Once installed into a consuming project via the manual path, they land under that project's `.claude/agents/*.md` and `.claude/commands/*.md`. Either way, there is no build step and no background server process — everything is markdown read directly by the harness.
- **Self-learning.** Each cell carries its own `## Known Quirks` section, appended to directly via `Edit` whenever it discovers a bug or gotcha, so knowledge accumulates in the file itself rather than in a separate system.
- **Permissions over prose.** Destructive/sensitive actions (force-push, `rm`, package installs) are meant to be gated by permission rules (see `settings.example.json`), not by every cell repeating "please be careful" in its own prompt — though note this only auto-applies via the manual `install.sh` path today, see §9/§10.

> [!NOTE]
> This project was previously named "Antigravity Engine" and ran as a plugin for Google Antigravity/Gemini, with a custom MCP server providing a "library package manager" (search/save/taxonomy tools) and a delegation model enforced only by prompt convention (a mandatory `<delegation_plan>` XML block the model could still choose to skip). That architecture has been fully retired in favor of the native Claude Code system described here — see git history if you need the old design for reference.

### Target Users

This guide is for AI assistants (Claude instances) working on this codebase. It explains how to:
- Understand which cell handles which kind of request, and how delegation actually works in Claude Code
- Read and modify cells, slash commands, and reference docs
- Extend the system with new cells, commands, or domain reference docs
- Use the self-learning "Known Quirks" convention

---

## 2. Architecture

### 2.1 Layout

```
.claude-plugin/
├── plugin.json           # plugin manifest (name: "cell")
└── marketplace.json       # self-referencing marketplace catalog (source: "./")
agents/                  # 14 cell (subagent) definitions (flat .md files) — plugin root, not under .claude/
commands/                 # slash commands (/cell-create, /git:flow) — plugin root
settings.example.json     # example permissions block for the manual/install.sh path (see §10)
library/                 # tagged, flat cell library — see §2.3
├── README.md
├── tag-taxonomy.md        # canonical tag registry, governed by cell-builder (§8.3)
├── find-by-tag.sh         # POSIX search helper, no build/runtime deps
├── agents/                # catalog of domain-specific cells, pulled into a project's agents/ on demand
├── rules/                 # domain rules + agent-class conventions (flat, tags in frontmatter)
└── books/                 # cell-research output (flat, tags in frontmatter)
core/
└── templates/            # starting-point templates for new cells/commands
CLAUDE.md                 # this file (repo docs only — not loaded as plugin context, see §2.4)
README.md
install.sh                # manual/fallback installer — copies agents/ and commands/ into a target project's .claude/ or ~/.claude
```

> [!NOTE]
> Cells and commands live at the **plugin root** (`agents/`, `commands/`), not inside `.claude/` — this is a hard requirement of Claude Code's plugin system (only `plugin.json` goes inside `.claude-plugin/`). This repo is simultaneously its own plugin and its own single-plugin marketplace, so the primary install path is entirely inside a Claude Code session: `/plugin marketplace add <owner>/<repo>` then `/plugin install cell@cell`. See §10.
>
> **`agents/` (plugin root) is distinct from `library/agents/` (tagged catalog) — never conflate them.** `agents/` holds the 14 cells Claude Code actually discovers/routes to in this repo right now. `library/agents/` is a separate, permanent, tag-searchable catalog of domain-specific cell definitions that a project pulls a copy from when needed and deletes locally when done — see §2.3.

### 2.2 How delegation actually works

1. The user or main thread states a request.
2. Claude Code compares the request against every cell's `description` field and either auto-routes or the main thread explicitly calls `Task(subagent_type: "<name>", prompt: "...")`.
3. The cell runs with **only** the tools listed in its `tools:` frontmatter — this is enforced by the harness, not by the cell choosing to behave.
4. The cell's final response is returned directly to the orchestrator as its result. There is no separate "send message back" step.
5. **Cells cannot spawn further cells.** Only the orchestrating (main) thread can call `Task`. If a cell's work needs independent verification (e.g. `cell-builder`'s output should be checked by `cell-qa`), the cell ends its report with an explicit recommendation, and the orchestrator performs that follow-up `Task` call itself. See §4.3.

### 2.3 The library (`library/rules/`, `library/books/`, `library/agents/`)

Domain knowledge (Swift, OpenWrt, security, etc.), agent-class conventions, and gathered research live as plain markdown under `library/`. The structure is deliberately **flat** — no per-domain/per-sphere subfolders — because classification is done entirely through **tags**, not directory paths:

- `library/rules/*.md` — domain rules and agent-class conventions. Plain reference docs with a real YAML `tags:` frontmatter field (e.g. `tags: [swift, macos, swiftui]`).
- `library/books/*.md` — research reports written by `cell-research`. Same format as `rules/`.
- `library/agents/*.md` — a canonical, permanent catalog of domain-specific cell definitions, kept separate from plugin-root `agents/` (see the note in §2.1). Because these are full Claude Code subagent definitions with a real, parsed frontmatter schema (§7.2), their tags live in a `## Tags` markdown-body section instead of frontmatter — adding an undocumented custom frontmatter field to a cell file is unverified/unsafe behavior we chose not to risk. A project pulls whichever cell it currently needs by copying it into its own active `agents/`/`.claude/agents/`, and simply deletes the local copy when done — the catalog entry here is untouched and can be pulled again later.

**Never search these folders by reading them wholesale.** The sanctioned search mechanism is `library/find-by-tag.sh <tag...>` — a POSIX `sh`/`awk` script (no jq/python3 dependency) that greps `rules/`/`books/` frontmatter and `agents/`'s `## Tags` sections and prints matching file paths. Read only what it returns. Every tag in use must be listed in `library/tag-taxonomy.md`, which `cell-builder`/`cell-research` consult before assigning any tag, to avoid near-duplicate tags with different spelling but the same meaning (see §8.3).

**Fixed install path:** once installed via `install.sh user`, the library also lives at `~/.claude/cell-library/` (a copy, not a symlink — see §10), so any project's cells can reach it via a predictable, fixed path without per-project configuration. A cell resolves which copy to use by checking whether the current repo *is* the C.E.L.L. library itself (`.claude-plugin/plugin.json` with `"name": "cell"` at the repo root) — if so, it uses the local `library/`; otherwise it uses `~/.claude/cell-library/`.

### 2.4 Project genesis (`/cell-create`)

`/cell-create` is how a brand-new project is born into a C.E.L.L. project. It scaffolds `docs.llm/` context files, seeds three "stem cell" subagents (`cell-architect`, `cell-environment`, `cell-builder`) if they aren't already globally available, and kicks off the **Genesis Pipeline** — see §4.5.

---

## 3. Cell Reference

| Cell | Tools | Use when... |
|---|---|---|
| `cell-builder` | Read, Write, Edit, Glob, Grep, WebSearch, Bash | Creating or refactoring a cell, slash command, or reference doc; differentiating new project-specific cells during genesis; also governs `library/`'s tag taxonomy |
| `cell-qa` | Read, Bash, Grep, Glob | Verifying a newly created/modified cell or command before treating it as done |
| `cell-prompt` | Read, Write, Edit | Drafting or refining any cell/command prompt using Claude-specific practices |
| `cell-architect` | Read, Write, WebSearch, Bash | Right after project genesis, or a major architectural pivot — analyzes, critiques, and defines the tech stack; surfaces relevant `library/` guidance via `find-by-tag.sh` |
| `cell-environment` | Read, Write, Bash, WebSearch | Auditing/installing local dev tools, logging them to `docs.llm/tools.md` |
| `cell-docs` | Read, Write, Edit, Grep, Glob, WebSearch | Keeping `docs.llm/` and inline docs in sync with code changes (background) |
| `cell-cleaner` | Read, Write, Grep, Glob, Bash | Reporting dead code / unused deps / stale logs (never deletes) (background) |
| `cell-security` | Read, Grep, Glob, WebSearch | Auditing for OWASP Top 10 issues, insecure deps, hardcoded secrets — **read-only** (background) |
| `cell-git` | Bash, Read | Repo init, GitHub repo creation, remotes, initial push (beyond routine commits) |
| `cell-backend` | Read, Write, Edit, Bash, Grep, Glob | TypeScript/backend services, API design, tool/server implementations |
| `cell-swift` | Read, Write, Edit, Bash | macOS Swift 5.10+, Foundation.Process, CryptoKit, XPC |
| `cell-openwrt` | Read, Write, Edit, Bash, WebSearch | OpenWrt: POSIX/ash scripts, UCI, procd, ubus |
| `cell-audio` | Read, Write, Edit, Bash, WebSearch | macOS Audio AI pipelines: STT/TTS, real-time routing, local LLM audio bridging |
| `cell-research` | WebSearch, WebFetch, Write, Bash | Deep, cited web research on an unfamiliar library/API/best-practice question — saves tagged reports to `library/books/` |

Slash commands:

| Command | Purpose |
|---|---|
| `/cell-create [idea]` | Scaffold `docs.llm/`, seed starter cells, and kick off the Genesis Pipeline |
| `/git:flow [commit\|branch\|pr]` | Analyze `git diff`, propose a Conventional Commit, manage branches safely |

---

## 4. Orchestration Conventions

### 4.1 Request routing

If a request clearly matches one of the specialists in §3, delegate to it via `Task` rather than doing the work in the main thread. A few concrete mappings:
- Generating/refactoring this library's own cells, commands, or reference docs (or differentiating new project-specific ones) → `cell-builder`
- Git operations beyond a routine commit → `cell-git` (routine commit/branch → `/git:flow`)
- Writing JSDoc/docstrings or updating `docs.llm/guide.md` → `cell-docs`
- Backend/TypeScript/API implementation → `cell-backend`
- Security auditing or checking for hardcoded secrets → `cell-security`
- Deep web research or documentation synthesis → `cell-research`
- Cleaning dead code/unused deps/obsolete logs → `cell-cleaner`

### 4.2 Recommended development pipeline

For substantial work, the following staged approach remains good practice, though it's guidance rather than a machine-enforced gate:
1. **Discussion** — clarify the request.
2. **Pros/Cons** — weigh the approach.
3. **Alternatives** — consider other designs.
4. **Blueprint** — write the plan before executing.
5. **Documentation** (optional) — update docs if the change is user-facing.
6. **Execution** — implement.

Reset to step 1 if the underlying concept changes mid-flight rather than patching a blueprint that no longer fits.

**Empirical verification (zero trust):** before declaring anything done, actually run it — the relevant build/typecheck/test command, not just a visual review of the diff.

### 4.3 Builder → QA pattern (no recursive cell spawning)

`cell-builder` cannot spawn its own verifier — Claude Code cells don't call `Task`. Instead: `cell-builder` finishes its artifact and explicitly recommends verification in its final report (e.g. *"Recommend invoking `cell-qa` to verify this before treating it as done"*). The orchestrator then performs that `Task` call itself. This is the general pattern for any multi-stage build→verify flow in this library.

### 4.4 Background cells

`cell-docs`, `cell-cleaner`, and `cell-security` are documented as **non-blocking background cells**: they don't require upfront orchestrator approval before running, because their work is read-mostly/report-producing (`cell-cleaner` and `cell-security` never modify files at all; the former only writes a report, the latter is fully read-only). Any other cell that writes/executes should be treated as needing the normal blueprint→approval flow from §4.2 before it acts.

### 4.5 The Genesis Pipeline (`/cell-create`)

When a brand-new project is initialized via `/cell-create`, the orchestrator drives it through 5 stages (tracked in the project's own `docs.llm/roadmap.md`):

1. **Concept Analysis & Critique** — `cell-architect` analyzes the stated idea, actively critiques it (weak points, mismatched stack choices, unclear scope), refines it together with the user, and locks the tech stack once it's genuinely solid — not just proposed.
2. **Environment Setup** — `cell-environment` audits the local system, installs missing tools, and writes `docs.llm/tools.md`.
3. **Cell Differentiation** — `cell-builder` creates the project-specific cells, rules, and documentation this particular project actually needs. This is the literal "cell division" step: general stem cells give rise to specialized ones matched to the concrete problem, instead of every project inheriting the full generic roster.
4. **Validation** — `cell-qa` validates the new project-specific cells and setup before development starts.
5. **Execution** — development begins, delegated primarily to specialized cells via `Task` so the orchestrator's own context window stays free for coordination rather than filling up with implementation detail.

---

## 5. Self-Learning / Quirks Convention

Every cell's `.md` file ends with a `## Known Quirks` section. The convention:
1. **Before starting a task**, a cell should note what's already recorded in its own `## Known Quirks` section (it's right there in its own prompt — no separate file to fetch).
2. **When it discovers something new** — a bug, an undocumented gotcha, a workaround — it appends a short entry directly via `Edit`, in this format:
   ```markdown
   - **Problem**: <what went wrong or was unexpected>
     **Environment**: <where/when it happened>
     **Solution**: <the fix or workaround>
   ```
3. Knowledge accumulates in the cell's own file over time — there is no external quirks database or MCP tool involved.

---

## 6. Development Workflow

There is no build step. `agents/*.md` and `commands/*.md` are plain markdown, loaded directly by Claude Code.

**Local development (test as a plugin without publishing):**
```bash
claude --plugin-dir /path/to/this/repo
```

**Local development (manual path):**
```bash
./install.sh          # copy agents/commands into the current project's .claude/
./install.sh user     # copy agents/commands into ~/.claude for all projects
```

**Editing a cell or command:** edit the `.md` file directly under `agents/`/`commands/`. If testing via `--plugin-dir`, run `/reload-plugins` to pick up changes without restarting. If testing via the manual path from a separate consuming project, re-run `install.sh` after editing.

**Testing a change:** open a Claude Code session, either let auto-routing pick up the cell via its `description`, or explicitly invoke it, and confirm it behaves as expected and only uses its declared tools.

---

## 7. Code Conventions & Patterns

### 7.1 Naming

| Context | Convention | Examples |
|---|---|---|
| Cell files | `cell-<role>.md`, kebab-case | `cell-architect.md`, `cell-builder.md` |
| Slash command files | kebab-case, subfolders namespace | `cell-create.md` → `/cell-create`; `git/flow.md` → `/git:flow` |
| Reference docs | snake_case | `swift_macos.md`, `security_auditor.md` |

### 7.2 Cell frontmatter schema (one schema, no exceptions)

```yaml
---
name: cell-role-kebab-case
description: "Use this agent when <trigger condition>."
tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch   # explicit allowlist, minimum needed
---
```

No `enable_*_tools` booleans, no `labels`/`danger_level`/`danger_details` fields — those belonged to the retired MCP validation system. If a cell carries real risk, note it as a `> [!CAUTION]` callout in the prompt body, backed by an actually-restrictive `tools:` list (e.g. `cell-security` has no `Write`/`Edit`/`Bash` at all).

**Tag storage has two conventions, by design.** `library/rules/*.md` and `library/books/*.md` use real YAML frontmatter (`tags: [...]`) since they have no protected schema; `library/agents/*.md` — being full cell definitions with the exhaustive, documented frontmatter schema above — keep tags in a `## Tags` markdown-body section instead, since adding an undocumented frontmatter field to a schema Claude Code itself parses is unverified/unsafe behavior. `find-by-tag.sh` knows to check both locations. This schema itself is otherwise unchanged — no `tags:` field is ever added to a cell's frontmatter.

### 7.3 Slash command frontmatter schema

```yaml
---
description: "Shown in /help"
argument-hint: "[optional-arg-hint]"
allowed-tools: "Bash(git add:*), Bash(git commit:*)"   # optional scoping
---
```
Use `$ARGUMENTS`/`$1`/`$2` for positional inputs, `` !`shell command` `` to inline live shell output, `@path` to inline file contents.

### 7.4 Every cell prompt includes

- `# Identity` — role statement
- Domain-specific rules (where applicable)
- `## Pipeline` — how it approaches its work
- `## Error Handling` — what to do on failure, when to stop vs. retry, when to report back instead of looping
- `## Known Quirks` — self-learning section (§5)

---

## 8. Extending the System

### 8.1 Adding a new cell

Ask `cell-builder` (or do it directly): create `agents/cell-<role>.md` following the schema in §7.2, with Identity/Rules/Pipeline/Error Handling/Known Quirks sections. No import/registry step — the file existing under `agents/` is sufficient for Claude Code to discover it (run `/reload-plugins` if testing via `--plugin-dir`). A domain-specific cell meant for the tagged catalog instead of this repo's own permanent roster goes under `library/agents/` — see §8.3.

### 8.2 Adding a new slash command

Create `commands/<name>.md` (or `<namespace>/<name>.md` for `/namespace:name`) following the schema in §7.3.

### 8.3 Adding to the library

- **A new rule or book**: create the file directly under `library/rules/` or `library/books/` — no subfolder, flat only. Give it a `description` and a `tags:` YAML frontmatter field. Before choosing tags, `Read` `library/tag-taxonomy.md` in full, reuse an existing canonical tag if a semantically equivalent one already exists, and append genuinely new tags there (alphabetically, one-line description) in the same change. There is no separate index file to update — `find-by-tag.sh` replaces that role.
- **A new domain-specific cell for the catalog**: create it under `library/agents/` following the template in `library/agents/README.md` (standard cell frontmatter + a `## Tags` body section, tagged via the same governance process above), then copy it into the requesting project's own active `agents/` (this repo) or `.claude/agents/` (a consumer project) so it's actually usable. Delete the local copy when the project no longer needs it — the catalog entry is unaffected.

---

## 9. Critical Files Reference

| File | Purpose |
|---|---|
| `.claude-plugin/plugin.json` | Plugin manifest (name `cell`) — makes this repo installable via `/plugin install` |
| `.claude-plugin/marketplace.json` | Self-referencing marketplace catalog (`source: "./"`) — makes this repo addable via `/plugin marketplace add` |
| `agents/*.md` | The 14 cell definitions (plugin root, not under `.claude/`) |
| `commands/*.md` | Slash commands (`/cell-create`, `/git:flow`) (plugin root) |
| `settings.example.json` | Example permission rules (allow/ask/deny) for the manual/`install.sh` path — a plugin's own `settings.json` only supports `agent`/`subagentStatusLine` keys, so permissions can't ship through the plugin itself |
| `library/find-by-tag.sh` | POSIX tag-search helper — the only sanctioned way any cell searches the library |
| `library/tag-taxonomy.md` | Canonical tag registry — read-before-tag governance for `cell-builder`/`cell-research` |
| `library/rules/*.md`, `library/books/*.md`, `library/agents/*.md` | Flat, tagged library content — see §2.3/§7.2 |
| `install.sh` | Manual/fallback installer — copies `agents/`/`commands/` into a target project's `.claude/` or `~/.claude` |
| `core/templates/AGENT_PROMPT_TEMPLATE.md` | Starting point for a new cell |
| `core/templates/SKILL_TEMPLATE.md` | Starting point for a new slash command |

---

## 10. Setup & Installation

### Prerequisites
- Claude Code (CLI, desktop, or web)
- A public GitHub repo hosting this project (or a private one with matching git credentials configured — see the plugin marketplace docs)

### Install (recommended — plugin marketplace)
Inside a Claude Code session:
```
/plugin marketplace add <owner>/<repo>
/plugin install cell@cell
```
Or as one non-interactive shell command:
```bash
claude plugin marketplace add <owner>/<repo> && claude plugin install cell@cell
```
No cloning, no build step. Every cell becomes immediately available, namespaced as `cell:<cell-name>` for explicit @-mentions (auto-routing via `description` works the same regardless of install method). Update with `/plugin update cell@cell`.

### Install (manual/fallback)
For environments where plugin marketplaces are restricted:
```bash
git clone <this repository's URL>
cd C.E.L.L.
./install.sh          # into the current project's .claude/
# or:
./install.sh user     # into ~/.claude/ for every project (recommended — makes every cell available everywhere, so /cell-create never needs to vendor a local copy of the starter cells)
```
No build step either way, no API key of its own required — cells run under whatever Claude Code session invokes them.

`install.sh user` also copies `library/` (agents/rules/books + tag registry + `find-by-tag.sh`) to `~/.claude/cell-library/` — a copy, not a symlink (re-run `install.sh user` after `git pull` to refresh it, same as the existing `agents/`/`commands/` copy already requires). Cells resolve this path automatically at runtime — self-hosting inside this repo's own working tree uses the local `library/` instead, detected via the same `.claude-plugin/plugin.json` name-`cell` check used elsewhere (see §2.3).

### Verify
```bash
claude plugin list                     # confirm the plugin-based install landed
# or, for the manual path:
ls .claude/agents .claude/commands     # confirm files landed
```
Then open Claude Code in the target project and run `/cell-create` to confirm the command and `cell-architect` delegation work end-to-end.

### Local plugin development
To test changes to this repo's own plugin without publishing:
```bash
claude --plugin-dir /path/to/this/repo
```

### Updating

No `version` is pinned in `plugin.json`/`marketplace.json`, so every push to this repo is immediately available as a new version — nothing to tag or release.

- **Plugin path, automatic (recommended):** third-party marketplaces default to auto-update **off**. Enable it once per user via `/plugin` → **Marketplaces** → `cell` → **Enable auto-update**; from then on, updates apply at every session start (Claude Code prompts for `/reload-plugins` when something changed). Teams can force this org-wide by adding `"autoUpdate": true` to a `cell` entry under `extraKnownMarketplaces` in their project's `.claude/settings.json`.
- **Plugin path, manual:** `/plugin marketplace update cell` then `/plugin update cell@cell`, then `/reload-plugins`.
- **Manual/`install.sh` path:** no auto-update mechanism exists for this path — `git pull` then re-run `./install.sh` (or `./install.sh user`) to refresh the installed copy.

---

## 11. Troubleshooting

| Issue | Likely cause | Fix |
|---|---|---|
| A cell isn't auto-selected for a request that should route to it | `description` isn't trigger-phrased clearly enough | Rewrite it as "Use this agent when `<concrete condition>`." |
| A cell tries to use a tool and is blocked | Tool isn't in its `tools:` allowlist | Either that's working as intended (tighten the request/route to a different cell), or add the tool if the cell genuinely needs it |
| A destructive command runs without confirmation | Installed via the plugin path, where `settings.example.json`'s permissions never apply (plugin `settings.json` only supports `agent`/`subagentStatusLine`) | Either accept this tradeoff of the plugin path, or use the manual `install.sh` path and copy `settings.example.json` to `.claude/settings.json` in the target project/`~/.claude` |
| `/cell-create` can't find `cell-architect`/`cell-environment`/`cell-builder` to seed a new project | C.E.L.L. wasn't installed (neither `/plugin install cell@cell` nor `install.sh user` has been run), and no local library clone was found | Install via the plugin marketplace (recommended, §10) or run `install.sh user` once — either makes the three seed cells available everywhere so nothing needs vendoring per-project |
| `/plugin marketplace add` fails or can't find the repo | Repo is private, or the `owner/repo` shorthand is wrong | Make the GitHub repo public (Settings → General → Danger Zone → Change visibility), then retry with the exact `owner/repo` |
| A cell's prompt references a tool/mechanism that doesn't exist (`invoke_subagent`, `thinking_level`, `run_command`, etc.) | Leftover from the retired Gemini/MCP architecture | Replace with the real Claude Code equivalent — see §2.2 and the cell reference table in §3 |
| Pushed changes to this repo don't show up for plugin users | Auto-update is off by default for third-party marketplaces, or `/reload-plugins` wasn't run after an update | Run `/plugin marketplace update cell && /plugin update cell@cell` then `/reload-plugins`, or enable auto-update per §10 |

---

**Last Updated**: 2026 — renamed to C.E.L.L. (Claude's Evolving Logic Library); all cells renamed to the `cell-*` convention; `/cell-create` redesigned around the 5-stage Genesis Pipeline; restructured as a native Claude Code plugin + self-referencing marketplace for one-command installation; replaced `docs/agent-rules/` with a flat, tag-based `library/` (agents/rules/books) plus `library/find-by-tag.sh` and a canonical tag-taxonomy registry; `install.sh user` now also installs the library to `~/.claude/cell-library/`.
