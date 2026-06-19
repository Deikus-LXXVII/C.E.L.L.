# Quirks & Learnings


- **Date:** 2026-06-19
  Problem: `save_to_library` writes `type: agents` to `../../agents` relative to `__dirname`. When running from `dist/mcp-server.js` (1 level deep), this resolves to `Projects.local/agents` outside the repository instead of `Antigravity.Engine/agents`.
  Environment: Antigravity.Engine MCP server in compiled `dist` mode.
  Solution: Used a manual `mv` to relocate the agent to `Antigravity.Engine/agents`. Codebase needs updating to properly resolve relative to `dist/` vs `core/`.
