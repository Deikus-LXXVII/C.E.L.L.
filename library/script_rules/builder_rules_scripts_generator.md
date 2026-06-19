---
description: "Meta-rule: How to generate dynamic rules for writing scripts."
labels: ["builder", "scripts", "generator", "meta"]
danger_level: "Low"
danger_details: "Safe to read."
---

# Builder Domain Rules: Scripts Generator (Meta-Rule)

You are tasked with writing a script. However, the world of scripting is too vast for a single rule file. Before you write ANY script, you MUST ensure that specific rules exist for the **Domain** (e.g. Python, AWS, Deployment, Data Parsing). 

If they do not exist, you MUST generate them using this Meta-Rule.

## 1. Naming Convention
- Domain Rules: `builder_rules_domain_<domain>.md` (e.g., `builder_rules_domain_python.md`, `builder_rules_domain_aws.md`, `builder_rules_domain_deployment.md`)

## 2. Structure of a Generated Domain Rule
When you generate a new `builder_rules_domain_*.md`, it MUST follow this exact structure:

### A. YAML Frontmatter
Include standard frontmatter (`description`, `labels`, `danger_level`, `danger_details`).

### B. Mini-Documentation & Resources
You MUST delegate Web Research to a subagent to gather the official documentation and best practices. Include a section at the top of the rule file containing:
- Links to official documentation.
- Links to essential standard libraries or popular safe third-party tools (e.g., `boto3` for AWS in Python, `jq` for JSON in Bash).
- A brief summary of the core philosophy of this language/domain (e.g., "Python prefers readability and explicit error handling").

### C. 30 Specific Rules
You MUST generate an extensive list of rules (aim for up to 30 points) covering:
- **Logging**: How to implement daily rotated logs (`YYYY-MM-DD.log`) specifically in this language/domain.
- **Error Handling**: How to catch and gracefully exit on errors (e.g., `set -e`, `try/catch`).
- **Dependencies**: How to manage and isolate dependencies safely (e.g., `virtualenv`, `npm`, `go mod`).
- **Idempotency**: How to ensure the script can run multiple times without causing duplication or corruption.
- **Security**: Specific vulnerabilities to avoid in this language/domain.

## 3. The Meta-Pipeline
1. Check library for `builder_rules_domain_<domain>.md` (using type: `domain_rules`). If missing -> Generate it.
2. Read the domain rules and apply standard scripting practices (logging, idempotency, exit codes).
3. ONLY THEN, write the actual script requested by the user.
