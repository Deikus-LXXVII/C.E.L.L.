---
description: "Meta-rule: How to generate dynamic rules for writing public Rules."
labels: ["builder", "rules", "generator", "meta"]
danger_level: "Low"
danger_details: "Safe to read."
---

# Builder Domain Rules: Rules Generator (Meta-Rule)

You are tasked with writing a public Rule for the main Antigravity library. A rule is a set of behavioral guidelines or code standards that apply to all agents. Before you write ANY rule, you MUST ensure that specific rules exist for the **Domain** (e.g. AWS, React, Bash).

If they do not exist, you MUST generate them using this Meta-Rule.

## 1. Structure of a Generated Domain Rule
When you generate a new `builder_rules_domain_*.md`, it MUST follow this exact structure:

### A. YAML Frontmatter
Include standard frontmatter (`description`, `labels`, `danger_level`, `danger_details`).

### B. Mini-Documentation & Resources
You MUST delegate Web Research to a subagent to gather the official documentation and best practices. Include a section at the top of the rule file containing:
- Links to official documentation regarding this domain.
- A brief summary of the core philosophy.

### C. 30 Specific Rules
You MUST generate an extensive list of rules (aim for up to 30 points) covering the specific domain.

## 2. Formatting the Public Rule
When you actually write the requested public Rule, follow these standards:
- **Clarity & Brevity**: Rules should be concise and actionable.
- **Alerts**: Use Github Alerts (`> [!IMPORTANT]`, `> [!CAUTION]`) for critical info.
- **No Ambiguity**: Use "MUST", "MUST NOT", "ALWAYS", "NEVER".
- **Actionable Triggers**: State exactly when the agent should consult this rule.

## 3. The Meta-Pipeline
1. Check library for `builder_rules_domain_<domain>.md` (using type: `domain_rules`). If missing -> Generate it.
2. Read the domain rules and apply standard rule formatting.
3. ONLY THEN, write the actual Rule requested by the user and save it to the public `rules` type.
