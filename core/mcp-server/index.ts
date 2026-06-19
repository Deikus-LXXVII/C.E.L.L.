import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

// Determine library path
const LIBRARY_DIR = path.resolve(__dirname, "../library");
const TAXONOMY_FILE = path.join(LIBRARY_DIR, "taxonomy.json");

const SEARCH_LIBRARY_TOOL: Tool = {
    name: "search_library",
    description: "Search for resources in the Antigravity library using labels and descriptions.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search query or keyword." },
            type: { type: "string", description: "Resource type: rules, skills, scripts, agents, bootstrap, script_rules, agent_rules, domain_rules, skill_rules, or rule_rules (last five are RESTRICTED to antiengine-builder only)." }
        },
        required: ["type"]
    }
};

const GET_RESOURCE_CONTENT_TOOL: Tool = {
    name: "get_resource_content",
    description: "Get the content of a resource. Alerts agent to danger levels automatically.",
    inputSchema: {
        type: "object",
        properties: {
            type: { type: "string", description: "Resource type: rules, skills, scripts, agents, bootstrap, script_rules, agent_rules, domain_rules, skill_rules, or rule_rules (last five are RESTRICTED to antiengine-builder only)." },
            name: { type: "string", description: "Name of the resource file." }
        },
        required: ["type", "name"]
    }
};

const SAVE_TO_LIBRARY_TOOL: Tool = {
    name: "save_to_library",
    description: "Save a new resource. Protected by antiengine-guard (validates frontmatter/syntax and creates backups).",
    inputSchema: {
        type: "object",
        properties: {
            type: { type: "string", description: "Resource type: rules, skills, scripts, agents, bootstrap, script_rules, agent_rules, domain_rules, skill_rules, or rule_rules (last five are RESTRICTED to antiengine-builder only)." },
            name: { type: "string", description: "Name of the resource file." },
            content: { type: "string", description: "Full content of the resource." }
        },
        required: ["type", "name", "content"]
    }
};

const SETUP_GLOBAL_PROMPT_TOOL: Tool = {
    name: "setup_global_prompt",
    description: "Appends an instruction to the global AGENTS.md prompt.",
    inputSchema: {
        type: "object",
        properties: {
            instruction: { type: "string", description: "Instruction to append." }
        },
        required: ["instruction"]
    }
};

const INIT_PROJECT_TOOL: Tool = {
    name: "init_project",
    description: "Initializes an Antigravity project workspace. Creates docs.llm, .gitignore, and injects bootstrap resources.",
    inputSchema: {
        type: "object",
        properties: {
            targetDir: { type: "string", description: "Absolute path to the workspace directory to initialize." }
        },
        required: ["targetDir"]
    }
};

const GET_TAXONOMY_TOOL: Tool = {
    name: "get_taxonomy",
    description: "Retrieve the list of officially allowed labels and their descriptions.",
    inputSchema: {
        type: "object",
        properties: {}
    }
};

const REGISTER_LABEL_TOOL: Tool = {
    name: "register_label",
    description: "Register a new label in the global taxonomy. Use ONLY if existing labels don't fit.",
    inputSchema: {
        type: "object",
        properties: {
            name: { type: "string", description: "The new label name (e.g. 'swift')." },
            description: { type: "string", description: "Description of what this label represents." }
        },
        required: ["name", "description"]
    }
};

const FINISH_BUILDER_TASK_TOOL: Tool = {
    name: "finish_builder_task",
    description: "Wipes the builder's .scratch directory. Call this ONCE at the very end of your entire assignment after all subtasks are complete.",
    inputSchema: {
        type: "object",
        properties: {}
    }
};

const APPEND_QUIRK_TOOL: Tool = {
    name: "append_quirk",
    description: "Append a newly discovered quirk/bug/feature to an agent's knowledge base. Use this for self-learning.",
    inputSchema: {
        type: "object",
        properties: {
            agentName: { type: "string", description: "The name of the agent (e.g. 'antiengine-builder')." },
            quirkText: { type: "string", description: "The text to append. Must include Problem, Environment, and Solution." }
        },
        required: ["agentName", "quirkText"]
    }
};

const IMPORT_RESOURCE_TOOL: Tool = {
    name: "import_resource",
    description: "Import an agent, rule, or skill from the Antigravity library to a local project directory.",
    inputSchema: {
        type: "object",
        properties: {
            type: { type: "string", description: "Resource type: agents, rules, skills, scripts." },
            name: { type: "string", description: "Name of the resource (e.g. 'python-tester' or 'aws_security.md')." },
            targetProjectDir: { type: "string", description: "Absolute path to the target project directory where the resource should be imported (e.g. into its .agents/ folder)." }
        },
        required: ["type", "name", "targetProjectDir"]
    }
};

const server = new Server(
    { name: "AntiengineLibrary", version: "2.0.0" },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        SEARCH_LIBRARY_TOOL, 
        GET_RESOURCE_CONTENT_TOOL, 
        SAVE_TO_LIBRARY_TOOL, 
        SETUP_GLOBAL_PROMPT_TOOL, 
        INIT_PROJECT_TOOL,
        GET_TAXONOMY_TOOL,
        REGISTER_LABEL_TOOL,
        FINISH_BUILDER_TASK_TOOL,
        APPEND_QUIRK_TOOL,
        IMPORT_RESOURCE_TOOL
    ]
}));

// --- antiengine-guard internals ---
function backupFile(type: string, name: string) {
    const originalPath = path.join(LIBRARY_DIR, type, name);
    if (!fs.existsSync(originalPath)) return;
    
    const backupsDir = path.join(LIBRARY_DIR, ".backups", type);
    if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const backupName = `${name}.v${timestamp}`;
    const backupPath = path.join(backupsDir, backupName);
    
    fs.copyFileSync(originalPath, backupPath);
    
    const allBackups = fs.readdirSync(backupsDir)
                         .filter(f => f.startsWith(name + ".v"))
                         .sort((a, b) => {
                             const ta = parseInt(a.split('.v').pop() || '0');
                             const tb = parseInt(b.split('.v').pop() || '0');
                             return tb - ta; 
                         });
    
    if (allBackups.length > 3) {
        for (let i = 3; i < allBackups.length; i++) {
            fs.unlinkSync(path.join(backupsDir, allBackups[i]));
        }
    }
}

function getTaxonomy(): Record<string, string> {
    if (!fs.existsSync(TAXONOMY_FILE)) return {};
    return JSON.parse(fs.readFileSync(TAXONOMY_FILE, "utf-8"));
}

function validateAgentResource(content: string) {
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) {
        throw new Error("antiengine-guard Error: Missing YAML frontmatter (---...---) at the top of the file.");
    }
    const yamlStr = yamlMatch[1];
    
    if (!yamlStr.includes("name:") || !yamlStr.includes("description:")) {
        throw new Error("antiengine-guard Error: Agent configuration MUST include 'name:' and 'description:' in the YAML frontmatter.");
    }
}

function validateTextResource(content: string) {
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) {
        throw new Error("antiengine-guard Error: Missing YAML frontmatter (---...---) at the top of the file.");
    }
    const yamlStr = yamlMatch[1];
    
    if (!yamlStr.includes("description:") || !yamlStr.includes("labels:") || !yamlStr.includes("danger_level:") || !yamlStr.includes("danger_details:")) {
        throw new Error("antiengine-guard Error: Frontmatter MUST include 'description:', 'labels:', 'danger_level:', and 'danger_details:'.");
    }

    // Extract labels array
    const labelsMatch = yamlStr.match(/labels:\s*\[(.*?)\]/);
    if (labelsMatch) {
        const labels = labelsMatch[1].split(",").map(s => s.replace(/["']/g, "").trim()).filter(s => s.length > 0);
        const taxonomy = getTaxonomy();
        const allowedLabels = Object.keys(taxonomy);
        
        for (const label of labels) {
            if (!allowedLabels.includes(label)) {
                throw new Error(`antiengine-guard Error: Label '${label}' is not registered in taxonomy. Allowed labels: ${allowedLabels.join(", ")}. If needed, register it first with register_label.`);
            }
        }
    }
}

function validateScript(name: string, content: string, filePath: string) {
    // 1. Validate Logging System Requirement
    const hasLogsDir = /logs\//i.test(content) || /['"]logs['"]/i.test(content) || /join\([^,]+,\s*['"]logs['"]/i.test(content);
    let hasDateRotation = false;

    if (name.endsWith(".sh")) {
        hasDateRotation = /date/i.test(content) && /%Y/i.test(content);
    } else if (name.endsWith(".js") || name.endsWith(".ts")) {
        hasDateRotation = /Date\(/i.test(content) || /toISOString/i.test(content) || /dayjs/i.test(content) || /moment/i.test(content);
    } else {
        hasDateRotation = true; // For other languages, skip strict date check or add as needed
    }

    if (!hasLogsDir || !hasDateRotation) {
        throw new Error("antiengine-guard Error: Script rejected. Mandatory daily logging system is missing. The script MUST create a 'logs/<script_name>/' directory and divide log files by day (e.g. YYYY-MM-DD.log).");
    }

    // 2. Validate Syntax
    const tmpPath = filePath + ".guard-tmp";
    fs.writeFileSync(tmpPath, content, "utf-8");
    try {
        if (name.endsWith(".js") || name.endsWith(".ts")) {
            execSync(`node --check ${tmpPath}`);
        } else if (name.endsWith(".sh")) {
            execSync(`bash -n ${tmpPath}`);
        }
    } catch (e: any) {
        fs.unlinkSync(tmpPath);
        throw new Error("antiengine-guard Syntax Error:\n" + (e.stderr ? e.stderr.toString() : e.message));
    }
    fs.unlinkSync(tmpPath);
}
// ----------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
        if (name === GET_TAXONOMY_TOOL.name) {
            const taxonomy = getTaxonomy();
            return { content: [{ type: "text", text: JSON.stringify(taxonomy, null, 2) }] };
        }

        if (name === REGISTER_LABEL_TOOL.name) {
            const labelName = args?.name as string;
            const labelDesc = args?.description as string;
            const taxonomy = getTaxonomy();
            if (taxonomy[labelName]) {
                return { content: [{ type: "text", text: `Label '${labelName}' is already registered.` }] };
            }
            taxonomy[labelName] = labelDesc;
            fs.writeFileSync(TAXONOMY_FILE, JSON.stringify(taxonomy, null, 2), "utf-8");
            return { content: [{ type: "text", text: `Successfully registered label '${labelName}'.` }] };
        }

        if (name === FINISH_BUILDER_TASK_TOOL.name) {
            const scratchDir = path.join(os.homedir(), ".gemini", "config", "plugins", "antiengine", ".scratch");
            if (fs.existsSync(scratchDir)) {
                fs.rmSync(scratchDir, { recursive: true, force: true });
            }
            fs.mkdirSync(scratchDir, { recursive: true });
            return { content: [{ type: "text", text: `Builder workspace cleaned up successfully.` }] };
        }

        if (name === APPEND_QUIRK_TOOL.name) {
            const agentName = args?.agentName as string;
            const quirkText = args?.quirkText as string;
            const quirksPath = path.join(__dirname, "../../agents", agentName, "references", "quirks.md");
            
            if (!fs.existsSync(quirksPath)) {
                fs.mkdirSync(path.dirname(quirksPath), { recursive: true });
                fs.writeFileSync(quirksPath, "# Quirks & Learnings\n\n", "utf-8");
            }
            
            fs.appendFileSync(quirksPath, `\n- **Date:** ${new Date().toISOString().split('T')[0]}\n  ${quirkText.replace(/\n/g, "\n  ")}\n`, "utf-8");
            return { content: [{ type: "text", text: `Successfully appended learning to ${agentName}'s quirks.md.` }] };
        }

        if (name === SEARCH_LIBRARY_TOOL.name) {
            const type = args?.type as string;
            const query = args?.query as string | undefined;
            const dirPath = type === "agents" ? path.join(__dirname, "../../agents") : path.join(LIBRARY_DIR, type);
            if (!fs.existsSync(dirPath)) {
                return { content: [{ type: "text", text: `Error: Type '${type}' not found in library.` }] };
            }
            
            const files = fs.readdirSync(dirPath).filter(f => !f.startsWith("."));
            const results = [];
            for (const file of files) {
                if (query) {
                    const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
                    if (content.toLowerCase().includes(query.toLowerCase())) {
                        results.push(file);
                    }
                } else {
                    results.push(file);
                }
            }
            return { content: [{ type: "text", text: `Found resources in ${type}:\n${results.join("\n")}` }] };
        }

        if (name === IMPORT_RESOURCE_TOOL.name) {
            const type = args?.type as string;
            const resourceName = args?.name as string;
            const targetProjectDir = args?.targetProjectDir as string;
            
            const sourcePath = type === "agents" ? path.join(__dirname, "../agents", resourceName) : path.join(LIBRARY_DIR, type, resourceName);
            
            if (!fs.existsSync(sourcePath)) {
                return { content: [{ type: "text", text: `Error: Resource '${resourceName}' not found in library under type '${type}'.` }] };
            }
            
            let destPath = "";
            if (type === "agents") {
                destPath = path.join(targetProjectDir, ".agents", "agents", resourceName);
                fs.cpSync(sourcePath, destPath, { recursive: true });
            } else if (type === "rules") {
                destPath = path.join(targetProjectDir, ".agents", "rules", resourceName);
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
                fs.copyFileSync(sourcePath, destPath);
            } else if (type === "skills") {
                destPath = path.join(targetProjectDir, ".agents", "skills", resourceName);
                fs.cpSync(sourcePath, destPath, { recursive: true });
            } else {
                return { content: [{ type: "text", text: `Error: Import is currently supported only for 'agents', 'rules', and 'skills'.` }] };
            }
            
            return { content: [{ type: "text", text: `Successfully imported ${resourceName} to ${destPath}` }] };
        }
        
        if (name === GET_RESOURCE_CONTENT_TOOL.name) {
            const type = args?.type as string;
            const fileName = args?.name as string;
            const filePath = type === "agents" ? path.join(__dirname, "../agents", fileName) : path.join(LIBRARY_DIR, type, fileName);
            if (!fs.existsSync(filePath)) {
                return { content: [{ type: "text", text: `Error: Resource '${fileName}' not found in ${type}.` }] };
            }
            
            const content = fs.readFileSync(filePath, "utf-8");
            let warningBanner = "";
            const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (yamlMatch) {
                const yamlStr = yamlMatch[1];
                const dangerLevelMatch = yamlStr.match(/danger_level:\s*(.*)/i);
                const dangerDetailsMatch = yamlStr.match(/danger_details:\s*(.*)/i);
                
                if (dangerLevelMatch) {
                    const level = dangerLevelMatch[1].trim();
                    const details = dangerDetailsMatch ? dangerDetailsMatch[1].trim() : "No details provided.";
                    warningBanner = `\n> [!CAUTION]\n> **antiengine-guard Alert**\n> **Danger Level:** ${level}\n> **Details:** ${details}\n\n`;
                }
            }
            
            return { content: [{ type: "text", text: warningBanner + content }] };
        }
        
        if (name === SAVE_TO_LIBRARY_TOOL.name) {
            const type = args?.type as string;
            const fileName = args?.name as string;
            const content = args?.content as string;
            const filePath = type === "agents" ? path.join(__dirname, "../agents", fileName) : path.join(LIBRARY_DIR, type, fileName);
            
            // Ensure parent directory exists (especially for agents/name/AGENT.md)
            fs.mkdirSync(path.dirname(filePath), { recursive: true });

            if (type === "agents") {
                if (path.basename(fileName) === "AGENT.md") {
                    validateAgentResource(content);
                }
            } else if (type === "rules" || type === "skills" || type === "script_rules" || type === "agent_rules" || type === "domain_rules" || type === "skill_rules" || type === "rule_rules" || type === "bootstrap" || fileName.endsWith(".md")) {
                validateTextResource(content);
            } else if (type === "scripts") {
                validateScript(fileName, content, filePath);
            }
            
            backupFile(type, fileName);
            fs.writeFileSync(filePath, content, "utf-8");
            return { content: [{ type: "text", text: `antiengine-guard: Successfully validated and saved ${fileName} to ${type} library.` }] };
        }

        if (name === SETUP_GLOBAL_PROMPT_TOOL.name) {
            const instruction = args?.instruction as string;
            const agentsMdPath = path.join(os.homedir(), ".gemini", "config", "AGENTS.md");
            let existing = "";
            if (fs.existsSync(agentsMdPath)) {
                existing = fs.readFileSync(agentsMdPath, "utf-8");
            }
            if (!existing.includes(instruction)) {
                fs.appendFileSync(agentsMdPath, `\n${instruction}\n`, "utf-8");
                return { content: [{ type: "text", text: `Instruction appended to global AGENTS.md.` }] };
            }
            return { content: [{ type: "text", text: `Instruction already exists in global AGENTS.md.` }] };
        }

        if (name === INIT_PROJECT_TOOL.name) {
            const targetDir = args?.targetDir as string;
            const docsDir = path.join(targetDir, "docs.llm");
            const agentsRulesDir = path.join(targetDir, ".agents", "rules");
            const bootstrapDir = path.join(LIBRARY_DIR, "bootstrap");

            if (fs.existsSync(docsDir)) {
                return { content: [{ type: "text", text: `Initialization skipped. Project already initialized (docs.llm exists).` }] };
            }

            // Create .gitignore
            fs.writeFileSync(path.join(targetDir, ".gitignore"), ".DS_Store\nnode_modules\n.env\ndist\nlogs\n", "utf-8");

            // Create docs.llm
            fs.mkdirSync(docsDir, { recursive: true });
            const docs = {
                "context.md": "# Project Context & Vision\n> **INSTRUCTIONS FOR AI:**\n> **WHAT:** The high-level vision, core philosophy, and methodology.\n",
                "file_map.md": "# File Map & Architecture\n> **INSTRUCTIONS FOR AI:**\n> **WHAT:** Structural map of the codebase.\n",
                "guide.md": "# Current State & Developer Guide\n> **INSTRUCTIONS FOR AI:**\n> **WHAT:** Executable instruction manual for the project AS IT IS NOW.\n",
                "memory_anchor.md": "# Memory Anchor\n> **INSTRUCTIONS FOR AI:**\n> **WHAT:** Primary source of truth for all hard facts, global constants, and technical constraints.\n",
                "quirks.md": "# Quirks\nThis file documents project-specific anomalies, custom behaviors, and naming conventions discovered during development.\n",
                "roadmap.md": `# Execution Roadmap
> **INSTRUCTIONS FOR AI:**
> **WHAT:** Sequential execution plan.

## Project Initialization Pipeline
- [ ] **1. Concept Analysis & Architecture:** \`project-architect\` agent analyzes user concept, identifies pros/cons, and determines required tools.
- [ ] **2. Environment Setup:** \`environment-setup\` agent audits local system, installs missing tools, and updates \`docs.llm/tools.md\`.
- [ ] **3. Infrastructure Planning:** Main Agent and User discuss and delegate custom agent/skill generation to Builder.
- [ ] **4. Builder Execution:** \`antiengine-builder\` generates requested resources.
- [ ] **5. Infrastructure Validation:** \`antiengine-qa\` validates environment and configurations.
- [ ] **6. Execution:** Project development begins.
`
            };
            for (const [docName, docContent] of Object.entries(docs)) {
                fs.writeFileSync(path.join(docsDir, docName), docContent, "utf-8");
            }

            // Create .agents/rules and inject bootstrap resources
            fs.mkdirSync(agentsRulesDir, { recursive: true });
            if (fs.existsSync(bootstrapDir)) {
                const bootstrapFiles = fs.readdirSync(bootstrapDir).filter(f => !f.startsWith("."));
                for (const file of bootstrapFiles) {
                    const srcPath = path.join(bootstrapDir, file);
                    if (fs.statSync(srcPath).isFile()) {
                        fs.copyFileSync(srcPath, path.join(agentsRulesDir, file));
                    }
                }
            }

            return { content: [{ type: "text", text: `Project successfully initialized at ${targetDir}. Created docs.llm, .gitignore, and injected bootstrap resources.` }] };
        }
        
        throw new Error(`Tool not found: ${name}`);
    } catch (e: any) {
        return { content: [{ type: "text", text: `Tool Execution Failed: ${e.message}` }] };
    }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(error => {
    console.error("MCP Server Error:", error);
    process.exit(1);
});
