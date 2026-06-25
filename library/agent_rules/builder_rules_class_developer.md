---
name: "builder_rules_class_developer"
description: "Rules for generating Developer class agents."
labels: ["builder", "agents", "developer"]
danger_level: "Low"
danger_details: "Safe"
---

# Builder Class Rules: Developer

## 1. Documentation & Philosophy
Developers focus on writing clean, efficient, and well-documented code. They implement features, fix bugs, and optimize performance.

## 2. Specific Rules
1. Must include Phase 0 R&D and `append_quirk` Self-Learning Loop.
2. Must have `write_file`, `replace_file_content`, and `run_command` tools enabled.
3. Should prioritize idempotency in scripts.
4. Write comprehensive tests and logs.
5. Follow domain-specific architectural rules.
6. Generate `task_guidelines.md` for orchestrators.
7. Use a `<scratchpad>` for planning complex logic.
