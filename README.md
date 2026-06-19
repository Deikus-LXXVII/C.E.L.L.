# Antigravity Engine 🚀

The ultimate orchestration engine and library of specialized agents for the Gemini ecosystem. 

Antigravity Engine upgrades the main agent from a solo coder to an **Orchestrator**. It introduces a strict cognitive pipeline, a robust background execution architecture, and a rich library of specialist subagents to automate project architecture, environment setup, documentation, security analysis, and Git workflows.

## Installation

Because this repository is private, you can install the engine with a single console command:

```bash
git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git ~/.gemini/config/plugins/antiengine && cd ~/.gemini/config/plugins/antiengine && ./install.sh
```

## How to use: The Starter Pack
1. Create a brand new, empty folder for your project.
2. Open it in your IDE.
3. Open chat and type: `/ae-init I want to build a [your project idea]`

**What happens next?**
The engine will instantly inject its rules into your project, spin up the **Architect Agent** (`project-architect`) in the background to analyze your idea, and map out the tech stack.

## The 6-Step Cognitive Pipeline
Whenever `/ae-init` is run, Antigravity Engine enforces a strict 6-step project initialization pipeline:
1. **Architect Analysis:** `project-architect` analyzes the idea and determines the tech stack.
2. **Environment Setup:** `environment-setup` checks your local tools (node, python, docker, etc.) and installs what's missing.
3. **Infrastructure Planning:** The engine generates the initial directory structure and roadmap.
4. **Builder Execution:** `antiengine-builder` handles writing all necessary infrastructure code.
5. **QA Validation:** Tests are run against the initial setup to ensure stability.
6. **Execution Phase:** Actual product features begin development.

## The Antigravity Specialists

Your local engine library includes these pre-built specialists ready to be assigned tasks:
- 🧠 **`project-architect`**: Conducts user interviews, analyzes tradeoffs, and dynamically loads language/framework rules.
- 🛠️ **`environment-setup`**: A DevOps engineer that audits and configures the user's terminal environment.
- 🧹 **`project-cleaner`**: A workspace Janitor that searches for dead code, unused dependencies, and obsolete logs.
- 📖 **`doc-writer`**: Keeps your codebase and `docs.llm/guide.md` perfectly in sync.
- 🛡️ **`security-analyst`**: A zero-trust security auditor that checks for OWASP Top 10 vulnerabilities and hardcoded secrets.
- 🚀 **`git-master`**: Handles publishing the project to GitHub.
- 🔄 **`skill: git-flow-automator`**: A standard skill for parsing `git diff` and generating perfect semantic commit messages.

## Customization & Builders
If you need an agent that doesn't exist, simply ask the engine. The engine will automatically deploy an `antiengine-builder` subagent to write, validate, and securely compile the new agent into your global library!
