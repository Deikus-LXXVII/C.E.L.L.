---
description: Practices and constraints for debugging and testing Model Context Protocol (MCP) servers.
labels: [mcp, nodejs, python, testing, debugging]
danger_level: LOW
danger_details: Sandbox environment isolation prevents most risks. Incorrectly formatted JSON-RPC could break client integrations if tested directly on production clients instead of proxy.
---
# Domain Rules: mcp_protocol

1. **Strict Stdio Separation**: All debugging/console logs MUST be routed to `stderr`. `stdout` is exclusively reserved for JSON-RPC messages; polluting it will instantly crash the protocol handshake.
2. **Hot Reload Proxies**: Code changes MUST use an MCP wrapper proxy (like `mcpmon` or `fastmcp`) rather than manual process restarts to prevent breaking the live client connection.
3. **Zero-Client Verification**: Features MUST be empirically verified via the MCP Inspector before integration into a full AI client (e.g., Claude Desktop, Antigravity Desktop).
