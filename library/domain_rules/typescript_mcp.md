---
name: typescript_mcp
description: Domain rules for building Model Context Protocol (MCP) servers in TypeScript
labels: [guidelines]
danger_level: low
danger_details: Provides architectural instructions for Model Context Protocol integrations.
---

# MCP Server Development Standards
1. **SDK Usage:** Always use the official `@modelcontextprotocol/sdk` for Node.js.
2. **Server Initialization:** Initialize the `Server` with proper metadata (name, version) and set required capabilities.
3. **Transports:** Understand the distinction between `StdioServerTransport` (for local IDE integration) and `SSEServerTransport` (for network/web).
4. **Schema Definition:** Define tool and resource schemas using strict JSON Schema types. Using a library like `zod` alongside `zodToJsonSchema` is highly recommended.
5. **Request Handling:** Properly implement `server.setRequestHandler` for MCP methods like `ListToolsRequestSchema` and `CallToolRequestSchema`.
6. **Error Protocol:** Use the `McpError` standard for throwing specific errors like `ErrorCode.MethodNotFound` or `ErrorCode.InvalidRequest`.
7. **Connection Lifecycle:** Ensure the transport connects properly and cleanly handles process signals (`SIGINT`, `SIGTERM`) using `server.close()`.
