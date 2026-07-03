# C.E.L.L. Library

The library is a flat, tag-classified store of reusable material — no per-domain
subfolders. Three folders:

- `rules/` — domain rules and agent-class conventions (plain markdown, real YAML
  `tags:` frontmatter).
- `books/` — research reports gathered by `cell-research` (same format as `rules/`).
- `agents/` — a canonical catalog of domain-specific cell definitions, tagged in a
  `## Tags` body section instead of frontmatter (see below for why). This is separate
  from the plugin-root `agents/` directory: `library/agents/` is a searchable source
  catalog, not an auto-discovered/active roster. A project pulls a copy of whichever
  cell it currently needs into its own active `agents/`/`.claude/agents/`, and simply
  deletes it locally when done — the canonical copy in `library/agents/` is untouched.

## Finding things: `find-by-tag.sh`, not manual reading

Never read through `rules/`, `books/`, or `agents/` wholesale to find something relevant —
that burns tokens for no reason. Use the search script instead:

```
library/find-by-tag.sh <tag> [more-tags...]
```

It greps `rules/`/`books/` frontmatter `tags:` lists and `agents/`'s `## Tags` body
sections, and prints `<matched-tag><TAB><file-path>` for every hit (OR-matched across
all given tags). Read only the files it returns.

## Why two different tag-storage conventions?

`rules/*.md` and `books/*.md` are plain reference docs with no special parsing — a
`tags:` YAML field in frontmatter is completely safe there. `agents/*.md` files are full
Claude Code subagent definitions, whose frontmatter schema (`name`/`description`/`tools`/
`model`, see CLAUDE.md §7.2) is a real, parsed contract — adding an undocumented custom
field there is unverified/unsafe behavior we chose not to risk. So `library/agents/*.md`
puts its tags in a `## Tags` markdown body section instead, right after the frontmatter
block and before `# Identity`. See `library/agents/README.md` for the exact template.

## Tag governance

Every tag in use here must be listed in `library/tag-taxonomy.md`. Before assigning any
tag to a new or edited entry, `cell-builder`/`cell-research` read that file first, reuse
an existing canonical tag if a semantically equivalent one exists, and append genuinely
new tags there in the same change. See `tag-taxonomy.md` itself and `cell-builder.md`'s
Rules section for the full governance process.

## Adding something

- **A new rule or book**: create the file directly under `rules/` or `books/`, no
  subfolder, with `tags:` frontmatter (governance above).
- **A new domain-specific cell for the catalog**: create it under `agents/` following
  the template in `library/agents/README.md`, then copy it into the requesting project's
  own active `agents/`/`.claude/agents/` — see CLAUDE.md §8.3.
