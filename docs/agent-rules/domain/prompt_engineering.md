---
description: "Guidance for writing/refining subagent and slash-command prompts for Claude models in this repository."
---
# Domain Rules: Prompt Engineering (Claude)

1. **Be direct.** State role, constraints, and output format explicitly — Claude follows clear, literal instructions well.
2. **Structure with headings or XML tags.** Separate identity, rules, pipeline, and error handling into distinct sections.
3. **Positive framing where practical, explicit negatives where safety-critical.** "Do X" beats "don't do Y" for routine guidance, but a hard prohibition ("never commit `.env`") should just say so plainly.
4. **No `thinking_level` or similar invented parameters.** Claude Code has no such prompt-settable field — don't reference one.
5. **Tool grants are the real safety mechanism.** A subagent's `tools:` allowlist should match what its prompt actually asks it to do.
6. **`description` fields drive auto-routing** for subagents — phrase them as "Use this agent when `<condition>`."
