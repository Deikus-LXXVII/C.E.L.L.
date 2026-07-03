# Antigravity.Engine: Developer Guide for AI Assistants

**For Claude instances and AI assistants working on the Antigravity orchestration engine and library system.**

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Architecture & Core Concepts](#2-architecture--core-concepts)
3. [Resource System (Library)](#3-resource-system-library)
4. [MCP Server & Tools](#4-mcp-server--tools)
5. [Development Workflow](#5-development-workflow)
6. [Code Conventions & Patterns](#6-code-conventions--patterns)
7. [Extending the System](#7-extending-the-system)
8. [Critical Files Reference](#8-critical-files-reference)
9. [Setup & Installation](#9-setup--installation)
10. [Troubleshooting & Self-Learning](#10-troubleshooting--self-learning)

---

## 1. Project Overview & Philosophy

**Antigravity.Engine** is a sophisticated orchestration engine and library system that transforms an AI agent from a solo contributor into an effective orchestrator of specialized subagents. It provides a strict cognitive pipeline, robust resource management, and a library of 15+ pre-built specialist agents for automation tasks like architecture analysis, environment setup, documentation, security audits, and Git workflows.

### Key Concepts

- **Orchestrator Pattern**: The main agent never codes directly—it delegates to specialized subagents (architect, builder, cleaner, security analyst, etc.)
- **Library-Based Resources**: Everything is a discoverable, reusable resource: agents, rules, skills, scripts, and domain-specific guidance
- **MCP Server Hub**: All persistence and resource management flows through an MCP (Model Context Protocol) server with built-in validation
- **Strict Cognitive Pipeline**: Every project follows a 6-step pipeline: Architect Analysis → Environment Setup → Infrastructure Planning → Builder Execution → QA Validation → Execution Phase
- **Self-Learning System**: Agents continuously improve through a quirks system, recording bugs, workarounds, and discoveries

### Target Users

This guide is written for AI assistants (Claude instances) working on the Antigravity codebase. It explains how to:
- Understand the MCP architecture and tool system
- Read and modify resources (agents, rules, skills, scripts)
- Follow strict validation patterns before persisting changes
- Extend the system with new agents, domain rules, and skills
- Debug and troubleshoot using the self-learning quirks system

---

## 2. Architecture & Core Concepts

### 2.1 Core Components

**MCP Server** (`core/mcp-server/index.ts`)
- Single-file TypeScript server (500+ lines) built on `@modelcontextprotocol/sdk`
- Exposes 10 tools via JSON-RPC protocol for resource management
- Implements antiengine-guard validation system for YAML frontmatter, syntax, and logging requirements
- Automatically creates timestamped backups of modified resources

**Library System** (`core/library/` and `library/`)
- Central repository of agents, rules, skills, scripts, and domain-specific guidance
- Organized by resource type: `agents/`, `domain_rules/`, `agent_rules/`, `skill_rules/`, `script_rules/`, `rule_rules/`, `bootstrap/`, `skills/`, `scripts/`
- Taxonomy-driven: All resources are labeled from a controlled vocabulary (taxonomy.json)
- Versioned via backup system: Last 3 versions of each resource retained automatically

**Validation System** (antiengine-guard)
- Enforces YAML frontmatter structure (name, description, labels, danger_level, danger_details)
- Validates labels exist in taxonomy.json before persistence
- Checks script syntax (bash -n for .sh, node --check for .js/.ts)
- Requires daily logging system in all scripts (logs/<script_name>/YYYY-MM-DD.log pattern)
- Prevents overwrites with automatic versioned backups

**Taxonomy System** (`library/taxonomy.json`)
- Central registry of ~20 allowed labels
- Examples: `builder`, `task`, `guidelines`, `bootstrap`, `qa`, `testing`, `agents`, `researcher`, `web`, `developer`, `openwrt`, `swift`, `audio`, `ai`, `meta`
- New labels must be registered via `register_label` MCP tool before use

### 2.2 Data Flow

```
Agent Request
    ↓
MCP Tool Call (search_library, save_to_library, etc.)
    ↓
Library Operation (read/write resource)
    ↓
antiengine-guard Validation
    ├─ Check YAML frontmatter
    ├─ Validate labels in taxonomy
    ├─ Check script syntax & logging
    └─ Create timestamped backup
    ↓
Persistence to disk (.agents/, library/)
```

### 2.3 Resource Types

| Type | Location | Persistence | Validation |
|------|----------|-------------|-----------|
| **agents** | `agents/` or `library/agents/` | Via save_to_library | YAML: name, description, enable_mcp_tools, etc. |
| **rules** | `library/rules/` | Via save_to_library | YAML: description, labels, danger_level |
| **skills** | `skills/` or `library/skills/` | Via save_to_library | YAML: description, labels, danger_level |
| **scripts** | `library/scripts/` | Via save_to_library | YAML + mandatory daily logging + syntax check |
| **bootstrap** | `library/bootstrap/` | Via save_to_library | YAML: description, labels, danger_level |
| **domain_rules** | `library/domain_rules/` | Via save_to_library | YAML: description, labels, danger_level |
| **agent_rules** | `library/agent_rules/` | Via save_to_library | YAML: description, labels, danger_level |
| **skill_rules** | `library/skill_rules/` | Via save_to_library | YAML: description, labels, danger_level |
| **script_rules** | `library/script_rules/` | Via save_to_library | YAML: description, labels, danger_level |
| **rule_rules** | `library/rule_rules/` | Via save_to_library | YAML: description, labels, danger_level |

---

## 3. Resource System (Library)

### 3.1 YAML Frontmatter Requirements

All resources must begin with YAML frontmatter enclosed in `---` delimiters.

**For Agents (AGENT.md)**:
```yaml
---
name: agent-name
description: "What this agent does and specializes in"
enable_mcp_tools: true
enable_write_tools: true
enable_subagent_tools: true
labels: ["relevant", "taxonomy", "labels"]
danger_level: "High"
danger_details: "Why this agent is considered high-risk"
---
```

**For Rules, Skills, Domain Rules, etc. (.md files)**:
```yaml
---
name: "resource-name"
description: "Clear explanation of what this resource provides"
labels: ["taxonomy", "labels"]
danger_level: "Low|Medium|High"
danger_details: "Specific risks or side effects"
---
```

### 3.2 Taxonomy Labels

Current labels in `library/taxonomy.json`:

| Label | Meaning |
|-------|---------|
| `builder` | Internal resources for Antigravity Builder agent |
| `task` | Task templates and instructions for agents |
| `guidelines` | General best practices and development guidance |
| `bootstrap` | Core resources injected into new projects |
| `qa` | Quality assurance and testing-related |
| `testing` | Sandboxes, assertions, and mock isolation |
| `agents` | Resources related to autonomous agents |
| `researcher` | Research-focused tools and agents |
| `web` | Web technologies and searching |
| `developer` | Developer agents that write code |
| `openwrt` | OpenWrt routers and embedded Linux |
| `swift` | Apple Swift programming language |
| `luci` | OpenWrt LuCI web interface |
| `javascript` | JavaScript and ES6+ |
| `skills` | Skills and executable tools |
| `audio` | Audio pipelines, STT, TTS |
| `mac` | macOS and Apple Silicon |
| `ai` | AI, MLX, and local models |
| `meta` | Rules about rules |

**To use a new label**, call `register_label` MCP tool first with the label name and description.

### 3.3 antiengine-guard Validation Rules

The validation system enforces these non-negotiable requirements:

1. **YAML Frontmatter**: All text resources MUST have `---` at top and bottom
2. **Required Fields**: All resources MUST include `description:` and `labels:`
3. **Label Validation**: All labels in `labels: [...]` MUST exist in taxonomy.json
4. **Danger Level**: All resources MUST specify `danger_level:` (High/Medium/Low) and `danger_details:`
5. **Script Logging**: All scripts MUST implement daily log rotation:
   - Pattern: `logs/<script_name>/<YYYY-MM-DD>.log`
   - Bash example: `LOG_DIR="logs/my_script"; mkdir -p "$LOG_DIR"; LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"`
   - Node example: `const logDir = path.join("logs", "my_script"); fs.mkdirSync(logDir, { recursive: true }); const logFile = path.join(logDir, new Date().toISOString().split('T')[0] + '.log');`
6. **Script Syntax**: All scripts MUST pass syntax validation (bash -n for .sh, node --check for .js/.ts)
7. **Backups**: `save_to_library` automatically creates timestamped backups, keeping last 3 versions

### 3.4 Resource Organization

**Agent File Structure**:
```
agents/agent-name/
├── AGENT.md              # System prompt with YAML + XML instructions
└── references/
    └── quirks.md        # Self-learning knowledge base
```

**Domain Rule Pattern**:
```
library/domain_rules/builder_rules_domain_<domain>.md
```
Example: `builder_rules_domain_swift.md`, `builder_rules_domain_typescript.md`

**Skill Structure**:
```
skills/skill-name/
├── SKILL.md              # Executable skill definition with YAML
└── (optional supporting files)
```

---

## 4. MCP Server & Tools

The MCP server (`core/mcp-server/index.ts`) exposes 10 tools via JSON-RPC protocol. All tools are available through the MCP server interface.

### 4.1 Tool Reference

#### 1. **search_library**
Search for resources by type and optional keywords.

**Parameters**:
- `type` (required): Resource type (agents, rules, skills, scripts, bootstrap, domain_rules, agent_rules, skill_rules, script_rules, rule_rules)
- `query` (optional): Search keywords for filtering by description or filename

**Output**: Array of matching resources with names and descriptions

**Restrictions**: Some types (script_rules, agent_rules, domain_rules, skill_rules, rule_rules) are restricted to antiengine-builder only

**Example**:
```
search_library(type: "domain_rules", query: "swift")
→ Returns all Swift domain rules
```

#### 2. **get_resource_content**
Retrieve the full content of a resource. Automatically alerts to danger_level.

**Parameters**:
- `type` (required): Resource type
- `name` (required): Resource filename or name

**Output**: Full resource content with metadata and danger warnings

**Example**:
```
get_resource_content(type: "agents", name: "antiengine-builder")
→ Returns full AGENT.md with system prompt
```

#### 3. **save_to_library**
Persist new or updated resources. Triggers antiengine-guard validation before writing.

**Parameters**:
- `type` (required): Resource type
- `name` (required): Resource filename/name
- `content` (required): Full resource content (must include YAML frontmatter)

**Output**: Success confirmation or validation error details

**Validation**: Checks YAML, labels, danger_level, syntax, logging requirements

**Backups**: Automatically creates timestamped backup before overwriting

#### 4. **setup_global_prompt**
Append an instruction to the global AGENTS.md prompt file for the orchestrator.

**Parameters**:
- `instruction` (required): Text to append

**Output**: Confirmation of append

#### 5. **init_project**
Initialize a new Antigravity project workspace.

**Parameters**:
- `targetDir` (required): Absolute path to target directory

**Output**: Initialization report with created files and bootstrap resources injected

**Creates**:
- `.agents/` directory structure
- `docs.llm/` directory with context files
- `.gitignore` with Antigravity patterns
- Bootstrap resources (core_engine_protocol.md, ae-chains.md, etc.)

#### 6. **get_taxonomy**
Retrieve all registered labels and descriptions.

**Parameters**: None

**Output**: JSON object mapping label names to descriptions

**Use before**: Using new labels in resources

#### 7. **register_label**
Register a new label in the global taxonomy.

**Parameters**:
- `name` (required): Label name (e.g., "swift", "python")
- `description` (required): What this label represents

**Output**: Success confirmation

**Usage**: Call this BEFORE using the label in any resource

#### 8. **import_resource**
Copy a resource from global library to a local project's `.agents/` directory.

**Parameters**:
- `type` (required): Resource type (agents, rules, skills, scripts)
- `name` (required): Resource name/filename
- `targetProjectDir` (required): Absolute path to project root

**Output**: Import success/failure message

#### 9. **finish_builder_task**
Clear the builder's `.scratch/` workspace after task completion.

**Parameters**: None

**Output**: Cleanup confirmation

**Important**: Call this ONCE at the very end of entire builder assignment, not for each subtask

#### 10. **append_quirk**
Append a discovered bug, feature, or workaround to an agent's quirks knowledge base (self-learning).

**Parameters**:
- `agentName` (required): Agent name (e.g., "antiengine-builder")
- `quirkText` (required): Quirk description (must include Problem, Environment, Solution)

**Output**: Confirmation of append

**Format**: Use structured format with Problem, Environment, Solution sections

### 4.2 Tool Access Patterns

Most agents have access to core tools via `enable_mcp_tools: true`. However:

- **Restricted to antiengine-builder**: script_rules, agent_rules, domain_rules, skill_rules, rule_rules
- **Available to all**: search_library, get_resource_content, init_project, get_taxonomy, import_resource
- **Common pattern**: search_library → get_resource_content → save_to_library

---

## 5. Development Workflow

### 5.1 Build Process

```bash
npm run build
```

This executes:
```bash
esbuild core/mcp-server/index.ts --bundle --platform=node --outfile=dist/mcp-server.js
```

- Bundles the MCP server into a single distributable file
- Output: `dist/mcp-server.js` (standalone Node.js executable)
- Run this after any TypeScript changes to the MCP server

### 5.2 Testing

The project uses custom Node.js scripts for MCP protocol testing (no Jest/Mocha):

**test_mcp.js**: Lists all available MCP tools
```bash
node test_mcp.js
```
- Spawns MCP server via stdio
- Sends tools/list JSON-RPC request
- Outputs available tool names and schemas

**run_mcp.js**: Invokes specific MCP tools
```bash
node run_mcp.js
```
- Used for testing individual tool behavior
- Spawns server and sends tool invocation requests
- Useful for debugging new tools or resource persistence

### 5.3 Installation

The `install.sh` script installs Antigravity.Engine to the Gemini plugin directory:

```bash
git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git ~/.gemini/config/plugins/antiengine
cd ~/.gemini/config/plugins/antiengine
./install.sh
```

Steps performed:
1. Verifies destination path
2. Runs `npm install` in core/mcp-server/
3. Builds MCP server via `npm run build`
4. Registers plugin via `plugin.json`

### 5.4 Local Development

For iterative development:

```bash
npm install                    # Install dependencies
npm run build                  # Build MCP server
node test_mcp.js              # Test tool availability
./dev_link.sh                 # Create symlink for live development
```

### 5.5 Environment Setup

**Requirements**:
- Node.js 18+ (for TypeScript 5.3.3 and esbuild compatibility)
- npm or yarn for package management
- Google Gemini API key (for agent operations)

**Environment Variables** (from `.env.template`):
```bash
GEMINI_API_KEY=your_api_key_here
```

---

## 6. Code Conventions & Patterns

### 6.1 Naming Conventions

| Context | Convention | Examples |
|---------|-----------|----------|
| Agent directories | kebab-case | `project-architect`, `antiengine-builder`, `security-analyst` |
| Resource files | snake_case (rules) | `builder_rules_domain_swift.md`, `builder_rules_class_developer.md` |
| Skill directories | kebab-case | `ae-init`, `git-flow-automator`, `mcp_debugging_skill` |
| MCP tool names | snake_case | `search_library`, `save_to_library`, `get_resource_content` |
| Directory names | lowercase hyphenated | `agents/`, `skills/`, `library/`, `domain_rules/` |

### 6.2 File Organization

```
Antigravity.Engine/
├── core/
│   ├── mcp-server/index.ts       # MCP server (500+ lines)
│   ├── library/                  # Core library resources
│   │   ├── agents/
│   │   ├── domain_rules/
│   │   ├── agent_rules/
│   │   ├── bootstrap/
│   │   └── taxonomy.json
│   └── templates/                # Scaffolding templates
├── agents/                       # 15+ local agent definitions
│   └── agent-name/
│       ├── AGENT.md
│       └── references/quirks.md
├── skills/                       # Local skills
│   └── skill-name/SKILL.md
├── library/                      # Symlink to core/library or resources
├── plugin.json                   # MCP server registration
├── package.json                  # Node dependencies
├── tsconfig.json                 # TypeScript configuration
├── .env.template                 # Environment variables template
├── install.sh                    # Installation script
└── CLAUDE.md                     # This file
```

### 6.3 Agent File Structure

Each agent has a consistent structure:

**AGENT.md**:
```yaml
---
name: agent-name
description: "Clear description of agent specialization"
enable_mcp_tools: true
enable_write_tools: true
enable_subagent_tools: true
labels: ["taxonomy", "labels"]
danger_level: "High|Medium|Low"
danger_details: "Why this level"
---

<instructions>
# Identity
You are the [Agent Name]...

# Capabilities & Guardrails
You have access to...

# Rules
1. Rule one
2. Rule two
...
</instructions>
```

**references/quirks.md** (Self-Learning Knowledge Base):
```markdown
# Quirks & Discoveries

- **Date:** YYYY-MM-DD
  - **Problem:** What went wrong or was unexpected
  - **Environment:** Where/when it happened (MCP version, OS, etc.)
  - **Solution:** How to fix or workaround it

- **Date:** YYYY-MM-DD
  - **Problem:** ...
```

### 6.4 Logging Patterns (Required for Scripts)

All scripts MUST implement daily log rotation or antiengine-guard will reject them.

**Bash Pattern**:
```bash
#!/bin/bash

LOG_DIR="logs/my_script"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"

echo "Script started at $(date)" >> "$LOG_FILE"
# ... script logic ...
echo "Script completed at $(date)" >> "$LOG_FILE"
```

**Node.js Pattern**:
```js
const fs = require('fs');
const path = require('path');

const logDir = path.join('logs', 'my_script');
fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, new Date().toISOString().split('T')[0] + '.log');

console.log('Script started');
fs.appendFileSync(logFile, `Started at ${new Date().toISOString()}\n`);
// ... script logic ...
fs.appendFileSync(logFile, `Completed at ${new Date().toISOString()}\n`);
```

### 6.5 Critical Patterns

**Orchestrator vs. Specialist**:
- Main orchestrator agent reads roadmap, delegates to specialists
- Specialists never invoke other specialists directly
- Each specialist has a single focused responsibility

**Validation-First Architecture**:
- Check existing resources before modifying them
- Understand validation rules before attempting to save
- Use antiengine-guard feedback to fix frontmatter issues

**MCP-First Persistence**:
- Never write directly to library/ directory
- Always use `save_to_library` MCP tool for persistence
- Backup system is automatic via MCP server

**Taxonomy-Driven Labels**:
- Never invent labels; use only registered taxonomy labels
- Register new labels with `register_label` before using them
- Label choices are part of resource discoverability

---

## 7. Extending the System

### 7.1 Adding a New Agent

1. **Conceptualize**: Define the agent's specialization and core responsibilities
2. **Research Context**: Use `search_library` to find similar agent_rules and domain_rules
3. **Check Builder Resources**: Get the antiengine-builder's task_guidelines and agent classes
4. **Write AGENT.md**: Create full system prompt with identity, capabilities, rules, cognitive pipeline
5. **Save to Library**: Use `save_to_library` with type `agents` and correct YAML frontmatter
6. **Import to Project**: Use `import_resource` to copy to project's `.agents/` directory

Example YAML frontmatter for new agent:
```yaml
---
name: "swift-code-reviewer"
description: "Specialized agent for reviewing Swift iOS code with style and performance checks"
enable_mcp_tools: true
enable_write_tools: true
enable_subagent_tools: false
labels: ["agents", "developer", "swift"]
danger_level: "Low"
danger_details: "Read-only code review, no execution risk"
---
```

### 7.2 Adding Domain Rules

Domain rules guide agents on technology-specific practices.

1. **Check for Existing**: Use `search_library` type `domain_rules` to see if one exists
2. **Create Rule File**: Name it `builder_rules_domain_<domain>.md`
3. **Add Frontmatter**: Include description, labels (must include "builder", "developer", domain name)
4. **Write 10+ Rules**: Concrete guidance with examples for this tech domain
5. **Include Links**: Reference official documentation and best practices
6. **Save to Library**: Use `save_to_library` with type `domain_rules`

Example frontmatter:
```yaml
---
name: "builder_rules_domain_swift"
description: "Guidance for building Swift/iOS agents and tools"
labels: ["builder", "developer", "swift", "mac"]
danger_level: "Low"
danger_details: "None - guidance only"
---
```

### 7.3 Adding Skills

Skills are executable capabilities exposed as slash-commands.

1. **Create SKILL.md**: Define command, description, step-by-step instructions
2. **Add Frontmatter**: Include name, description, labels, danger_level
3. **Write Clear Steps**: What users should do, what happens, expected output
4. **Save to Library**: Use `save_to_library` with type `skills`
5. **Import to Project**: Use `import_resource` to make available

Example skill:
```yaml
---
name: "git-squash-commits"
description: "Squash multiple commits into one with a clean message"
labels: ["skills", "developer", "git"]
danger_level: "Medium"
danger_details: "Rewrites git history; ensure all developers are synced"
---

## Instructions

1. Identify the commit range you want to squash
2. Run `git rebase -i <base-commit>`
3. Mark all commits except the first as 'squash'
4. Write a new commit message
5. Force-push with `git push origin --force-with-lease`
```

### 7.4 Adding Scripts

Scripts are persistent, logged executables stored in the library.

**Critical Requirements**:
- MUST implement daily logging (non-negotiable)
- MUST pass syntax validation
- MUST include complete YAML frontmatter

```yaml
---
name: "backup_library.sh"
description: "Daily backup script for the Antigravity library"
labels: ["scripts", "maintenance", "builder"]
danger_level: "Low"
danger_details: "Reads only, no write risk"
---

#!/bin/bash
LOG_DIR="logs/backup_library"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"

echo "Starting library backup at $(date)" >> "$LOG_FILE"
# ... backup logic ...
```

### 7.5 Registering New Taxonomy Labels

If existing labels don't fit your use case:

1. **Check Current Labels**: Call `get_taxonomy` to see all registered labels
2. **Register New Label**: Use `register_label` with name and description
3. **Use in Resources**: Include the new label in resource `labels: [...]` arrays immediately

```
register_label(
  name: "python",
  description: "Python programming language and ecosystem"
)
```

### 7.6 Versioning Pattern

When updating existing resources:

- **First version**: Save as-is
- **Subsequent versions**: Create new version (e.g., `script_name_v2.sh`) rather than overwriting
- **Exception**: Only overwrite if explicitly authorized and backup is sufficient

The backup system automatically keeps last 3 versions in `.backups/` directory.

---

## 8. Critical Files Reference

| File | Size | Purpose | Edit By |
|------|------|---------|---------|
| `core/mcp-server/index.ts` | 500+ lines | MCP server, all tool implementations | mcp-developer agent, rebuild after changes |
| `plugin.json` | 20 lines | MCP server registration manifest, tool registry | Manual edit + `npm run build` to register |
| `package.json` | 16 lines | Node.js dependencies and build scripts | Manual or npm CLI |
| `tsconfig.json` | ~15 lines | TypeScript compiler configuration | Rarely modified |
| `library/taxonomy.json` | ~30 lines | Label registry (allowed labels) | `register_label` MCP tool only |
| `library/bootstrap/core_engine_protocol.md` | 27 lines | Core orchestration rules and delegation patterns | antiengine-builder agent only |
| `library/bootstrap/ae-chains.md` | 54 lines | Orchestration pipeline and task delegation | antiengine-builder agent only |
| `library/bootstrap/manual-book.md` | 49 lines | Additional protocol documentation | antiengine-builder agent only |
| `agents/antiengine-builder/AGENT.md` | 200+ lines | Builder agent system prompt (critical reference) | antiengine-builder agent only |
| `agents/*/AGENT.md` | varies | Individual specialist agent prompts | Respective agents or antiengine-builder |
| `agents/*/references/quirks.md` | varies | Self-learned knowledge and bug tracking | `append_quirk` MCP tool |
| `library/domain_rules/*.md` | 10-25 lines | Technology-specific guidance (Swift, TypeScript, etc.) | antiengine-builder agent only |
| `library/agent_rules/*.md` | 10-25 lines | Agent class patterns (Developer, Researcher, etc.) | antiengine-builder agent only |
| `skills/*/SKILL.md` | varies | Executable skill definitions | antiengine-builder or manual |

---

## 9. Setup & Installation

### 9.1 Prerequisites

- **Node.js**: 18.x or later (for TypeScript 5.3.3 and esbuild)
- **npm**: Latest stable version
- **Git**: For repository cloning
- **Bash**: For install.sh execution
- **Google Gemini API Key**: For agent operations (set in .env)

### 9.2 Installation Steps

```bash
# Clone repository to Gemini plugin directory
git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git ~/.gemini/config/plugins/antiengine

# Enter directory
cd ~/.gemini/config/plugins/antiengine

# Run installation script
./install.sh
```

The `install.sh` script:
1. Verifies correct installation directory
2. Runs `npm install` in `core/mcp-server/`
3. Builds MCP server via `npm run build`
4. Creates necessary directory structure

### 9.3 Local Development Setup

After installation:

```bash
# Install dependencies
npm install

# Build MCP server
npm run build

# Test MCP tool availability
node test_mcp.js

# Test specific tool invocation
node run_mcp.js
```

### 9.4 Environment Variables

Copy `.env.template` to `.env` and set:

```bash
GEMINI_API_KEY=your_api_key_here
```

This is required for agents that spawn subagents or use external APIs.

### 9.5 Verifying Installation

After setup, verify the system works:

```bash
# Check MCP server bundle exists
ls -lh dist/mcp-server.js

# Test tool availability
node test_mcp.js
# Output should list 10 tools: search_library, get_resource_content, save_to_library, etc.

# Check library structure
ls library/
# Should contain: agents, domain_rules, agent_rules, bootstrap, etc.
```

---

## 10. Troubleshooting & Self-Learning

### 10.1 Common Issues & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `antiengine-guard Error: Missing YAML frontmatter` | Resource missing `---` delimiters | Add YAML block: `---\nname: ...\n---\n` at the top |
| `Label '[label]' is not registered in taxonomy` | Using unregistered label | Call `register_label` first, then use in resource |
| `Script rejected. Mandatory daily logging system is missing` | Script lacks logs/ directory pattern | Add logging: `LOG_DIR="logs/script"; mkdir -p "$LOG_DIR"; LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"` |
| `antiengine-guard Syntax Error: [error]` | Script has syntax errors | Check syntax: `bash -n script.sh` (bash) or `node --check script.js` (Node) |
| `save_to_library fails: Frontmatter MUST include 'danger_details'` | Missing required YAML field | Add: `danger_details: "Description of risk or 'None'."` |
| Resource path resolution errors | Using relative paths in MCP calls | Always use absolute paths (e.g., `/home/user/project/...`) |
| Backup file accumulation | More than 3 versions kept | Automatic cleanup occurs; manually remove if needed via `.backups/` |

### 10.2 Self-Learning Mechanisms

The quirks system allows agents to record and learn from discoveries:

**Recording a Quirk**:
```
append_quirk(
  agentName: "antiengine-builder",
  quirkText: "
- **Date:** 2026-06-19
  - **Problem:** save_to_library path resolution failed on Windows
  - **Environment:** Windows 11, Node.js 22.x, core/mcp-server/index.ts
  - **Solution:** Use path.join() instead of string concatenation for cross-platform paths
"
)
```

**Quirk Format**:
- **Date**: YYYY-MM-DD when discovered
- **Problem**: What went wrong or was unexpected
- **Environment**: OS, version, tool, specific context
- **Solution**: How to fix or workaround

**Usage**:
- Agents read `agents/<name>/references/quirks.md` on startup
- Agents append new quirks when discovering bugs or workarounds
- Knowledge accumulates, improving decision-making

### 10.3 MCP Debugging

**Test Tool Availability**:
```bash
node test_mcp.js
```
Lists all registered tools and their schemas via JSON-RPC.

**Test Tool Invocation**:
```bash
node run_mcp.js
```
Spawns MCP server and tests actual tool calls.

**Manual JSON-RPC Testing**:
The MCP server accepts JSON-RPC 2.0 requests via stdio:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_library",
    "arguments": {
      "type": "agents",
      "query": "architect"
    }
  }
}
```

### 10.4 Backup File Management

Backups are stored in `.backups/` with timestamp suffixes:

```
library/.backups/
├── agents/
│   └── my-agent.v1234567890
│   └── my-agent.v1234567891
│   └── my-agent.v1234567892
└── domain_rules/
    └── builder_rules_domain_swift.md.v...
```

**Cleanup**:
- Automatic: Keeps last 3 versions
- Manual: Delete old `.v` files if disk space needed
- Recovery: Restore with `cp .backups/type/name.vOLDEST type/name`

### 10.5 Performance & Optimization

**Large Library Searches**:
- Use specific `type` parameter to narrow search
- Use `query` keywords to filter results
- Consider caching frequently accessed resources

**Backup System**:
- Automatic cleanup keeps only 3 versions
- Log files grow daily; implement rotation in scripts
- Archive old logs to save space

---

## Key Takeaways for AI Assistants

1. **Think like an Orchestrator**: Delegate specialized work to appropriate agents; never code directly
2. **Respect Validation**: antiengine-guard is your guardian—follow YAML/label/logging rules strictly
3. **Use MCP Tools**: All persistence happens through MCP server tools, never direct file writes
4. **Check Before You Act**: Search library, get resource content, understand current state
5. **Learn & Record**: Use quirks system to capture discoveries and improve over time
6. **Follow Conventions**: Naming, file organization, and patterns are documented for consistency
7. **Taxonomy Controls Labels**: Register before using new labels; controlled vocabulary aids discoverability
8. **Backup is Automatic**: Last 3 versions kept; safe to experiment and iterate
9. **Build & Test**: Always rebuild after TypeScript changes; test with test_mcp.js
10. **Document Intent**: Use danger_level and danger_details to communicate risk clearly

---

## Quick Reference Commands

```bash
# Build
npm run build

# Test
node test_mcp.js          # List tools
node run_mcp.js           # Invoke tools

# Install
./install.sh

# Development
./dev_link.sh             # Create symlink

# Common MCP Patterns
search_library(type: "agents", query: "architect")
get_resource_content(type: "domain_rules", name: "builder_rules_domain_swift.md")
save_to_library(type: "skills", name: "new-skill", content: "...")
register_label(name: "python", description: "Python language")
import_resource(type: "agents", name: "security-analyst", targetProjectDir: "/path/to/project")
init_project(targetDir: "/path/to/new/project")
get_taxonomy()
append_quirk(agentName: "agent-name", quirkText: "...")
finish_builder_task()
```

---

**Last Updated**: July 2026  
**For Questions**: See README.md or check agent-specific task_guidelines.md files
