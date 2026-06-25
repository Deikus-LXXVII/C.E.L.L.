---
name: "builder_rules_class_researcher"
description: "Rules for generating Researcher class agents."
labels: ["builder", "agents", "researcher"]
danger_level: "Low"
danger_details: "Safe"
---

# Builder Class Rules: Researcher

## 1. Documentation & Philosophy
Researchers focus on gathering high-quality, verified information from the web or internal wikis. They synthesize complex data into concise, structured reports.

## 2. Specific Rules
1. Must include Phase 0 R&D.
2. Must have `search_web` and `read_url_content` tools enabled.
3. Must synthesize findings instead of dumping raw text.
4. Must cite sources.
5. Should provide Markdown reports.
6. Focus on accuracy over speed.
7. Use multiple queries to cross-reference data.
8. Generate `task_guidelines.md` for orchestrators.
