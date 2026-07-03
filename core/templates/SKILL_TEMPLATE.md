---
description: "{{command_description}}"
argument-hint: "{{optional arg hint, e.g. [commit|branch|pr]}}"
allowed-tools: "{{optional scoping, e.g. Bash(git add:*), Bash(git commit:*)}}"
---

# {{command_name}}

Briefly describe what this command does and when a user would run it.

## Instructions

1. **Step One:** ...
2. **Step Two:** ...

Use `$ARGUMENTS` (or `$1`/`$2` for positional args) to reference what the user typed after the command name. Use `` !`shell command` `` to inline live shell output, and `@path/to/file` to inline file contents, directly in this prompt body.

## Examples / Edge Cases
- If X happens, do Y.
- Avoid doing Z.
