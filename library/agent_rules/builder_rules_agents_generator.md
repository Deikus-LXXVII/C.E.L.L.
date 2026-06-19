---
description: "Meta-rule: How to generate dynamic rules for writing agents."
labels: ["builder", "agents", "generator", "meta"]
danger_level: "Low"
danger_details: "Safe to read."
---

# Builder Domain Rules: Agents Generator (Meta-Rule)

You are tasked with building a specialized Subagent (Agent Factory). The world of agents is complex: a Python Reviewer operates very differently from a Web Search Documenter. Before you write ANY `AGENT.md`, you MUST ensure that specific rules exist for both the **Agent Class** (e.g. reviewer, generator) and the **Domain** (e.g. python, aws, swift).

If they do not exist, you MUST generate them using this Meta-Rule.

## 1. Naming Convention
- Class Rules: `builder_rules_class_<class>.md` (e.g., `builder_rules_class_reviewer.md`, `builder_rules_class_searcher.md`)
- Domain Rules: `builder_rules_domain_<domain>.md` (e.g., `builder_rules_domain_python.md`, `builder_rules_domain_aws.md`, `builder_rules_domain_swift.md`)

## 2. Structure of a Generated Rule
When you generate a new `builder_rules_class_*.md` or `builder_rules_domain_*.md`, it MUST follow this exact structure:

### A. YAML Frontmatter
Include standard frontmatter (`description`, `labels`, `danger_level`, `danger_details`).

### B. Mini-Documentation & Resources
You MUST delegate Web Research to a subagent to gather the official documentation and best practices. Include a section at the top of the rule file containing:
- Links to official documentation regarding this class or domain.
- A brief summary of the core philosophy (e.g., "Reviewers must focus on security and performance", or "Swift domain rules must adhere to Apple Human Interface Guidelines").

### C. 30 Specific Rules
You MUST generate an extensive list of rules (aim for up to 30 points) covering:
- **Universal Pipeline**: Remind that the agent must implement Phase 0 (R&D) and the `append_quirk` Self-Learning Loop.
- **Task Guidelines Generation**: Remind that the builder must generate `task_guidelines.md` for orchestrators on how to prompt this specific class/domain.
- **Tool Restriction**: What tools should be given or denied to this specific class/domain?
- **Cognitive Pipeline**: How should this agent think? Does it need a `<scratchpad>`? Does it need to break down tasks?
- **Security & Tone**: How should it communicate and what must it never do.

## 3. The Meta-Pipeline
1. Check library for `builder_rules_class_<class>.md` (using type: `agent_rules`). If missing -> Generate it.
2. Check library for `builder_rules_domain_<domain>.md` (using type: `domain_rules`). If missing -> Generate it.
3. Once both files exist, read them.
4. ONLY THEN, write the actual `AGENT.md` (and its `task_guidelines.md`) requested by the user.
