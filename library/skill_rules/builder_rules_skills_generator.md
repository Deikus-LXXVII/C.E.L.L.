---
description: "Meta-rule: How to generate dynamic rules for writing Skills."
labels: ["builder", "skills", "generator", "meta"]
danger_level: "Low"
danger_details: "Safe to read."
---

# Builder Domain Rules: Skills Generator (Meta-Rule)

You are tasked with writing a public Skill for the main Antigravity library. A skill is a set of step-by-step instructions that teaches an agent how to perform a complex task (e.g. AWS Deployment, Performance Optimization). Before you write ANY skill, you MUST ensure that specific rules exist for the **Domain** (e.g. AWS, React, Bash).

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

## 2. Formatting the Public Skill
When you actually write the requested public Skill, follow these standards:
- **Actionable Triggers**: State *when* the skill should trigger.
- **Step-by-step**: Provide a clear pipeline for the agent to follow.
- **Validation**: End with a command to validate success.
- **Idempotency**: Ensure steps are safe to run multiple times.

## 3. The Meta-Pipeline
1. Check library for `builder_rules_domain_<domain>.md` (using type: `domain_rules`). If missing -> Generate it.
2. Read the domain rules and apply standard skill formatting.
3. ONLY THEN, write the actual `SKILL.md` (and related scripts) requested by the user and save it to the public `skills` type.
