---
description: Standardized practices for quickly reloading and testing MCP servers in a sandbox without full rebuilds.
labels: [mcp, testing, debugging, sandbox, hot-reload]
danger_level: LOW
danger_details: Safe to run locally, but ensure no conflicting MCP processes share the same ports when testing SSE.
---
# Skill: mcp_debugging_skill
**Domain**: mcp_protocol

This skill streamlines testing and debugging Model Context Protocol (MCP) servers using hot-reload proxies and the MCP Inspector. Testing against full AI clients requires manual restarts, breaking the development loop.

## Prerequisites
- For Node.js: `npx` and optionally `mcpmon` (`npm i -g mcpmon`)
- For Python: `fastmcp` (via `pip install fastmcp`)

## 1. Sandbox Setup (Hot-Reloading)
Start the MCP server with a proxy that preserves the client connection during code changes.
- **Node.js**:
  ```bash
  npx mcpmon node path/to/server.js
  ```
- **Python**:
  ```bash
  fastmcp dev inspector path/to/server.py
  ```

## 2. Inspector Bootstrapping
Test your MCP endpoints using Anthropic's interactive browser UI.
- Use `npx @modelcontextprotocol/inspector` along with your launch command.
- Example (Node without mcpmon):
  ```bash
  npx @modelcontextprotocol/inspector node path/to/server.js
  ```

## 3. Log Auditing
- When debugging, ALWAYS tail `stderr`.
- Do NOT use `console.log()` or `print()` if they output to `stdout` (in Stdio mode), as this breaks the JSON-RPC stream. 
- Use `console.error()` or `sys.stderr.write()` instead.

## 4. JSON-RPC Monitoring
- Monitor the network payload tab within the MCP Inspector.
- Look for mismatched Tool parameters, missing `required` keys, or malformed resource URIs before finalizing schemas for production clients.
