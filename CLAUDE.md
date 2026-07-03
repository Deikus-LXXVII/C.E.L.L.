# Antigravity.Engine: Developer Guide for AI Assistants

**For Claude instances and AI assistants working on the Antigravity orchestration engine — a library of specialized subagents and slash commands for Claude Code.**

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Architecture](#2-architecture)
3. [Agent Reference](#3-agent-reference)
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

**Antigravity.Engine** is an orchestration layer for Claude Code: a set of 13 specialized subagents and 2 slash commands that turn the main conversation from a solo coder into an **Orchestrator** that delegates focused work to the right specialist.

### Key Concepts

- **Orchestrator pattern, enforced structurally.** The main thread delegates coding, research, and analysis to subagents via Claude Code's `Task` tool. Unlike a prose-only "please delegate" convention, each subagent's `description` field drives Claude Code's own auto-routing, and each subagent's `tools:` allowlist is a real, harness-enforced restriction — not just a label.
- **Plain files, no custom server.** Subagents live at `.claude/agents/*.md`, slash commands at `.claude/commands/*.md`. There is no build step and no background server process — everything is markdown read directly by the harness.
- **Self-learning.** Each subagent carries its own `## Known Quirks` section, appended to directly via `Edit` whenever it discovers a bug or gotcha, so knowledge accumulates in the file itself rather than in a separate system.
- **Permissions over prose.** Destructive/sensitive actions (force-push, `rm`, package installs) are gated by `.claude/settings.json`'s permission rules, not by every agent repeating "please be careful" in its own prompt.

> [!NOTE]
> This repository previously ran as a plugin for Google Antigravity/Gemini, with a custom MCP server providing a "library package manager" (search/save/taxonomy tools) and a delegation model enforced only by prompt convention (a mandatory `<delegation_plan>` XML block the model could still choose to skip). That architecture has been fully retired in favor of the native Claude Code system described here — see git history if you need the old design for reference.

### Target Users

This guide is for AI assistants (Claude instances) working on this codebase. It explains how to:
- Understand which subagent handles which kind of request, and how delegation actually works in Claude Code
- Read and modify subagents, slash commands, and reference docs
- Extend the system with new agents, commands, or domain reference docs
- Use the self-learning "Known Quirks" convention

---

## 2. Architecture

### 2.1 Layout

```
.claude/
├── agents/            # 13 subagent definitions (flat .md files)
├── commands/           # slash commands (/ae-init, /git:flow)
└── settings.json        # permissions (replaces the old "ask before destructive action" prose)
docs/
└── agent-rules/         # plain reference docs (domain knowledge + agent-class conventions)
    ├── domain/           # e.g. swift_macos.md, openwrt_posix.md, cybersecurity.md
    └── class/            # e.g. security_auditor.md, release_manager.md
core/
└── templates/           # starting-point templates for new agents/commands
CLAUDE.md                # this file
README.md
install.sh               # copies .claude/ into a target project or ~/.claude
```

### 2.2 How delegation actually works

1. The user or main thread states a request.
2. Claude Code compares the request against every subagent's `description` field and either auto-routes or the main thread explicitly calls `Task(subagent_type: "<name>", prompt: "...")`.
3. The subagent runs with **only** the tools listed in its `tools:` frontmatter — this is enforced by the harness, not by the subagent choosing to behave.
4. The subagent's final response is returned directly to the orchestrator as its result. There is no separate "send message back" step.
5. **Subagents cannot spawn further subagents.** Only the orchestrating (main) thread can call `Task`. If a subagent's work needs independent verification (e.g. `antiengine-builder`'s output should be checked by `antiengine-qa`), the subagent ends its report with an explicit recommendation, and the orchestrator performs that follow-up `Task` call itself. See §4.3.

### 2.3 Reference docs (`docs/agent-rules/`)

Domain knowledge (Swift, OpenWrt, security, etc.) and agent-class conventions (what a "security auditor" or "release manager" role generally looks like) live as plain markdown under `docs/agent-rules/`. Any subagent can `Read` these directly by path — there's no import/registry step. See `docs/agent-rules/README.md` for the index.

---

## 3. Agent Reference

| Agent | Tools | Use when... |
|---|---|---|
| `antiengine-builder` | Read, Write, Edit, Glob, Grep, WebSearch, Bash | Creating or refactoring a subagent, slash command, or reference doc in this repo |
| `antiengine-qa` | Read, Bash, Grep, Glob | Verifying a newly created/modified agent or command before treating it as done |
| `prompt-engineer` | Read, Write, Edit | Drafting or refining any subagent/command prompt using Claude-specific practices |
| `project-architect` | Read, Write, WebSearch | Right after project init, or a major architectural pivot — defines the tech stack |
| `environment-setup` | Read, Write, Bash, WebSearch | Auditing/installing local dev tools, logging them to `docs.llm/tools.md` |
| `doc-writer` | Read, Write, Edit, Grep, Glob, WebSearch | Keeping `docs.llm/` and inline docs in sync with code changes (background) |
| `project-cleaner` | Read, Write, Grep, Glob, Bash | Reporting dead code / unused deps / stale logs (never deletes) (background) |
| `security-analyst` | Read, Grep, Glob, WebSearch | Auditing for OWASP Top 10 issues, insecure deps, hardcoded secrets — **read-only** (background) |
| `git-master` | Bash, Read | Repo init, GitHub repo creation, remotes, initial push (beyond routine commits) |
| `backend-developer` | Read, Write, Edit, Bash, Grep, Glob | TypeScript/backend services, API design, tool/server implementations |
| `swift-developer` | Read, Write, Edit, Bash | macOS Swift 5.10+, Foundation.Process, CryptoKit, XPC |
| `openwrt-developer` | Read, Write, Edit, Bash, WebSearch | OpenWrt: POSIX/ash scripts, UCI, procd, ubus |
| `audio-ai-master` | Read, Write, Edit, Bash, WebSearch | macOS Audio AI pipelines: STT/TTS, real-time routing, local LLM audio bridging |
| `web-researcher` | WebSearch, WebFetch, Write | Deep, cited web research on an unfamiliar library/API/best-practice question |

Slash commands:

| Command | Purpose |
|---|---|
| `/ae-init [idea]` | Scaffold `docs.llm/`, `.gitignore`, and invoke `project-architect` |
| `/git:flow [commit\|branch\|pr]` | Analyze `git diff`, propose a Conventional Commit, manage branches safely |

---

## 4. Orchestration Conventions

### 4.1 Request routing

If a request clearly matches one of the specialists in §3, delegate to it via `Task` rather than doing the work in the main thread. A few concrete mappings:
- Generating/refactoring this repo's own agents, commands, or reference docs → `antiengine-builder`
- Git operations beyond a routine commit → `git-master` (routine commit/branch → `/git:flow`)
- Writing JSDoc/docstrings or updating `docs.llm/guide.md` → `doc-writer`
- Backend/TypeScript/API implementation → `backend-developer`
- Security auditing or checking for hardcoded secrets → `security-analyst`
- Deep web research or documentation synthesis → `web-researcher`
- Cleaning dead code/unused deps/obsolete logs → `project-cleaner`

### 4.2 Recommended development pipeline

For substantial work, the following staged approach (adapted from the engine's original 6-step pipeline) remains good practice, though it's guidance rather than a machine-enforced gate:
1. **Discussion** — clarify the request.
2. **Pros/Cons** — weigh the approach.
3. **Alternatives** — consider other designs.
4. **Blueprint** — write the plan before executing.
5. **Documentation** (optional) — update docs if the change is user-facing.
6. **Execution** — implement.

Reset to step 1 if the underlying concept changes mid-flight rather than patching a blueprint that no longer fits.

**Empirical verification (zero trust):** before declaring anything done, actually run it — the relevant build/typecheck/test command, not just a visual review of the diff.

### 4.3 Builder → QA pattern (replaces the old recursive "Tester Subagent" spawn)

`antiengine-builder` cannot spawn its own verifier — Claude Code subagents don't call `Task`. Instead: `antiengine-builder` finishes its artifact and explicitly recommends verification in its final report (e.g. *"Recommend invoking `antiengine-qa` to verify this before treating it as done"*). The orchestrator then performs that `Task` call itself. This is the general pattern for any multi-stage build→verify flow in this repo.

### 4.4 Background subagents

`doc-writer`, `project-cleaner`, and `security-analyst` are documented as **non-blocking background subagents**: they don't require upfront orchestrator approval before running, because their work is read-mostly/report-producing (project-cleaner and security-analyst never modify files at all; the former only writes a report, the latter is fully read-only). Any other agent that writes/executes should be treated as needing the normal blueprint→approval flow from §4.2 before it acts.

---

## 5. Self-Learning / Quirks Convention

Every subagent's `.md` file ends with a `## Known Quirks` section. The convention:
1. **Before starting a task**, a subagent should note what's already recorded in its own `## Known Quirks` section (it's right there in its own prompt — no separate file to fetch).
2. **When it discovers something new** — a bug, an undocumented gotcha, a workaround — it appends a short entry directly via `Edit`, in this format:
   ```markdown
   - **Problem**: <what went wrong or was unexpected>
     **Environment**: <where/when it happened>
     **Solution**: <the fix or workaround>
   ```
3. Knowledge accumulates in the agent's own file over time — there is no external quirks database or MCP tool involved.

---

## 6. Development Workflow

There is no build step. `.claude/agents/*.md` and `.claude/commands/*.md` are plain markdown, loaded directly by Claude Code.

**Local development:**
```bash
./install.sh          # copy .claude/ into the current project
./install.sh user     # copy .claude/ into ~/.claude for all projects
```

**Editing an agent or command:** edit the `.md` file directly, then re-run `install.sh` if you're testing it from a separate consuming project (editing in place is enough if you're working directly in this repo's own `.claude/`).

**Testing a change:** open a Claude Code session, either let auto-routing pick up the subagent via its `description`, or explicitly invoke it, and confirm it behaves as expected and only uses its declared tools.

---

## 7. Code Conventions & Patterns

### 7.1 Naming

| Context | Convention | Examples |
|---|---|---|
| Subagent files | kebab-case | `project-architect.md`, `antiengine-builder.md` |
| Slash command files | kebab-case, subfolders namespace | `ae-init.md` → `/ae-init`; `git/flow.md` → `/git:flow` |
| Reference docs | snake_case | `swift_macos.md`, `security_auditor.md` |

### 7.2 Subagent frontmatter schema (one schema, no exceptions)

```yaml
---
name: agent-name-kebab-case
description: "Use this agent when <trigger condition>."
tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch   # explicit allowlist, minimum needed
---
```

No `enable_*_tools` booleans, no `labels`/`danger_level`/`danger_details` fields — those belonged to the retired MCP validation system. If an agent carries real risk, note it as a `> [!CAUTION]` callout in the prompt body, backed by an actually-restrictive `tools:` list (e.g. `security-analyst` has no `Write`/`Edit`/`Bash` at all).

### 7.3 Slash command frontmatter schema

```yaml
---
description: "Shown in /help"
argument-hint: "[optional-arg-hint]"
allowed-tools: "Bash(git add:*), Bash(git commit:*)"   # optional scoping
---
```
Use `$ARGUMENTS`/`$1`/`$2` for positional inputs, `` !`shell command` `` to inline live shell output, `@path` to inline file contents.

### 7.4 Every subagent prompt includes

- `# Identity` — role statement
- Domain-specific rules (where applicable)
- `## Pipeline` — how it approaches its work
- `## Error Handling` — what to do on failure, when to stop vs. retry, when to report back instead of looping
- `## Known Quirks` — self-learning section (§5)

---

## 8. Extending the System

### 8.1 Adding a new agent

Ask `antiengine-builder` (or do it directly): create `.claude/agents/<name>.md` following the schema in §7.2, with Identity/Rules/Pipeline/Error Handling/Known Quirks sections. No import/registry step — the file existing under `.claude/agents/` is sufficient for Claude Code to discover it.

### 8.2 Adding a new slash command

Create `.claude/commands/<name>.md` (or `<namespace>/<name>.md` for `/namespace:name`) following the schema in §7.3.

### 8.3 Adding a reference doc

Create `docs/agent-rules/domain/<topic>.md` or `docs/agent-rules/class/<role>.md` with a simple `description` frontmatter field and the actual guidance as the body. Update `docs/agent-rules/README.md`'s index. Any subagent that needs it just `Read`s it by path.

---

## 9. Critical Files Reference

| File | Purpose |
|---|---|
| `.claude/agents/*.md` | The 13 subagent definitions |
| `.claude/commands/*.md` | Slash commands (`/ae-init`, `/git:flow`) |
| `.claude/settings.json` | Permission rules (allow/ask/deny) — the structural safety mechanism |
| `docs/agent-rules/domain/*.md`, `docs/agent-rules/class/*.md` | Reference docs, read directly by subagents |
| `docs/agent-rules/README.md` | Index of reference docs |
| `install.sh` | Copies `.claude/` into a target project or `~/.claude` |
| `core/templates/AGENT_PROMPT_TEMPLATE.md` | Starting point for a new subagent |
| `core/templates/SKILL_TEMPLATE.md` | Starting point for a new slash command |

---

## 10. Setup & Installation

### Prerequisites
- Claude Code (CLI, desktop, or web)
- Bash (for `install.sh`)

### Install
```bash
git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git
cd Antigravity.Engine
./install.sh          # into the current project's .claude/
# or:
./install.sh user     # into ~/.claude/ for every project
```
No build step, no API key of its own required — subagents run under whatever Claude Code session invokes them.

### Verify
```bash
ls .claude/agents .claude/commands   # confirm files landed
```
Then open Claude Code in the target project and run `/ae-init` to confirm the command and `project-architect` delegation work end-to-end.

---

## 11. Troubleshooting

| Issue | Likely cause | Fix |
|---|---|---|
| A subagent isn't auto-selected for a request that should route to it | `description` isn't trigger-phrased clearly enough | Rewrite it as "Use this agent when `<concrete condition>`." |
| A subagent tries to use a tool and is blocked | Tool isn't in its `tools:` allowlist | Either that's working as intended (tighten the request/route to a different agent), or add the tool if the agent genuinely needs it |
| A destructive command runs without confirmation | `.claude/settings.json`'s `ask`/`deny` lists don't cover it | Add the specific `Bash(...)` pattern to `ask` or `deny` |
| An agent's prompt references a tool/mechanism that doesn't exist (`invoke_subagent`, `thinking_level`, `run_command`, etc.) | Leftover from the retired Gemini/MCP architecture | Replace with the real Claude Code equivalent — see §2.2 and the agent reference table in §3 |

---

**Last Updated**: 2026 — Claude Code native rewrite (MCP server and Gemini-specific tooling fully retired).
