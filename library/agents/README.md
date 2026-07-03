# Library agent catalog

This folder is the canonical, permanent catalog of domain-specific cell definitions —
separate from the plugin-root `agents/` directory, which holds only the 14 core cells
that Claude Code actually discovers/routes to in this repo. A cell in `library/agents/`
becomes usable in a given project by copying it into that project's own active
`agents/` (this repo) or `.claude/agents/` (a consumer project). When a project no
longer needs it, delete the local copy — the catalog entry here is unaffected and can
be pulled again later, by this or any other project.

Currently empty — no domain-specific catalog cells have been differentiated yet. When
`cell-builder` creates the first one, it should follow this exact template.

## Template

Standard cell frontmatter (identical schema to any plugin-root cell — see CLAUDE.md
§7.2: `name`, `description`, `tools`, optional `model`), followed immediately by a
`## Tags` section, then the rest of the cell as usual:

```markdown
---
name: cell-<role>
description: "Use this agent when <trigger condition>."
tools: Read, Write, Edit, Bash
---

## Tags
swift, macos, appkit, native-app

# Identity

You are `cell-<role>`, ...

## Rules
...

## Pipeline
1. **Self-pull applicable rules** — identify 1-3 tags for the current task/project,
   resolve the library path (self-hosting vs. installed, per CLAUDE.md §10), run
   `find-by-tag.sh <tag...>` against `library/rules/` (and `library/books/` for deeper
   reference), `Read` whichever matching files are returned, and apply them.
...

## Error Handling
...

## Known Quirks
(Append discoveries here directly via Edit as you learn them.)
```

Rules for the `## Tags` line specifically:

1. It's a single comma-separated line, no brackets, no YAML — plain prose. This keeps
   it clearly out of the protected frontmatter block and easy for `find-by-tag.sh` to
   parse with a simple state machine.
2. Exactly one blank line separates `## Tags` from the tag line, and one blank line
   follows before `# Identity` — `find-by-tag.sh` treats the first non-blank line after
   the heading as the tag list.
3. Tags are assigned via the same governance process as `rules/`/`books/` entries — read
   `library/tag-taxonomy.md` first, reuse existing canonical tags, append genuinely new
   ones (see `cell-builder.md`'s Rules section).
