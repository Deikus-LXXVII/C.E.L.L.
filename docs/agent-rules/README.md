# Agent Rules Reference

These are plain reference docs — no import/registry mechanism, taxonomy, or MCP tooling is involved. Any `.claude/agents/*.md` subagent can `Read` a file below directly by path when it needs domain- or class-specific guidance.

## Domain docs (`domain/`)

| File | Description |
|------|-------------|
| `agentic_testing.md` | Rules for autonomous agent testing and sandbox isolation. |
| `builder_rules_domain_advanced_search.md` | Domain rules for advanced web search. |
| `builder_rules_domain_audio.md` | Rules for building audio pipelines (STT, TTS, Routing) on Apple Silicon. |
| `builder_rules_domain_luci.md` | Architectural rules for OpenWrt LuCI web interface (ES6+, CSR). |
| `builder_rules_domain_openwrt.md` | Architectural rules for OpenWrt development (POSIX, UCI, procd, ubus). |
| `builder_rules_domain_swift.md` | Architectural rules for Swift 5.10+ development on macOS. |
| `builder_rules_domain_web.md` | Rules for generating agents working with the Web. |
| `builder_rules_domain_workspace_maintenance.md` | Rules for workspace maintenance tasks such as cleaning up dead code and logs. |
| `cybersecurity.md` | Domain rules for cybersecurity analysis, including vulnerability scanning, secure dependency management, and secrets detection. |
| `local_environment.md` | Domain rules for interacting with and setting up the user's local OS environment. |
| `luci_csr.md` | Domain rules for modern Client-Side Rendering (CSR) apps in LuCI using ES6+ and OpenWrt JSON-RPC. |
| `openwrt_posix.md` | Domain rules for OpenWrt 21.02+, POSIX Shell (ash), procd, ubus, and UCI. |
| `prompt_engineering.md` | Guidance for writing/refining subagent and slash-command prompts for Claude models. |
| `swift_macos.md` | Domain rules for Swift 5.10+, SwiftUI, and Foundation on macOS. |
| `technical_documentation.md` | Global domain rules for technical documentation. |
| `version_control.md` | Rules for interacting with Git, GitHub, and other version control systems. |

## Class docs (`class/`)

| File | Description |
|------|-------------|
| `backend_developer.md` | Class rule for backend developers focusing on TypeScript and Node.js best practices. |
| `devops_engineer.md` | Class rules for the DevOps Engineer persona. |
| `qa_engineer.md` | Behavioral rules and mandate for QA engineering agents. |
| `release_manager.md` | Class rule for release managers focusing on version control workflows and deployment pipelines. |
| `security_auditor.md` | Class rules for the security_auditor role, responsible for analyzing written code and project structure. |
| `technical_writer.md` | Class rules for technical writers. |
