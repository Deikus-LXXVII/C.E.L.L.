---
name: "ae-init"
description: "Trigger this skill when the user types the slash command /ae-init. Initializes a new Antigravity project workspace."
---

# Project Initialization Skill

## Overview
This skill acts as the handler for the `/ae-init` slash command. It automates the process of scaffolding a new Antigravity project by creating standard documentation templates (`docs.llm/`) and injecting bootstrap resources into the project's local workspace.

## Instructions
> **INSTRUCTIONS FOR AI:**
> When using this skill, you MUST follow these steps exactly:

1. **Step One: Check Project State**
   You do not need to do manual checks. The MCP tool will handle safety internally to ensure it does not overwrite an existing initialized project.

2. **Step Two: Call Initialization Tool**
   Use the MCP tool `init_project`. 
   For the `targetDir` parameter, pass your current absolute workspace directory (e.g. `/Volumes/Crucial/Projects.local/MyNewProject` or whatever folder the user has currently opened).

3. **Step Three: Notify User**
   After the tool completes, report back to the user that the project has been successfully initialized. Let them know that `docs.llm/` has been generated and bootstrap rules have been loaded.

4. **Step Four: Kickoff Starter Pack (CRITICAL)**
   The project now has the engine rules loaded, and your next step is to initiate Step 1 of the `.agents/rules/roadmap.md` pipeline.
   - You MUST use the `import_resource` MCP tool to import the `project-architect` agent from the global library into the current project.
   - You MUST use `invoke_subagent` to spawn the `project-architect`. Pass it any context the user provided about their new project idea in the prompt.
   - Tell the user that the project is initialized and the Architect agent has already been deployed in the background to analyze the concept and prepare the tech stack.
