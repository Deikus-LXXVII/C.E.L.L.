#!/bin/bash
# core_init_docs.sh - Modernized Project Bootstrapper

# Determine Engine root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
ENGINE_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

LOG_DIR=".agents/logs/core_init_docs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +'%Y-%m-%d').log"

log() {
    local msg="[$(date +'%Y-%m-%dT%H:%M:%S%z')] $1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log "[INFO] [Init] Initializing Documentation Framework and Local Environment..."

# 1. Safely generate docs.llm
mkdir -p docs.llm

if [ ! -f docs.llm/settings.yaml ]; then
    cat << 'EOF' > docs.llm/settings.yaml
# Antigravity Engine Dynamic Settings
web_search_strictness: "HIGH"
workflow_mode: "PLANNING"
EOF
    log "[INFO] [Init] docs.llm/settings.yaml created."
fi

if [ ! -f docs.llm/quirks.md ]; then
    cat << 'EOF' > docs.llm/quirks.md
# Project Quirks & Anomalies
> **INSTRUCTIONS FOR AI:**
> When an anomaly is discovered, document it here immediately.
---
*No anomalies recorded yet.*
EOF
    log "[INFO] [Init] docs.llm/quirks.md created."
fi

if [ ! -f docs.llm/memory_anchor.md ]; then
    cat << 'EOF' > docs.llm/memory_anchor.md
# Memory Anchor
> Document unchanging variables here (Target framework versions, APIs, specific build flags).
---
EOF
    log "[INFO] [Init] docs.llm/memory_anchor.md created."
fi

if [ ! -f docs.llm/roadmap.md ]; then
    cat << 'EOF' > docs.llm/roadmap.md
# Execution Roadmap
> Use checklists: [x] Done, [-] In Progress, [ ] To Do.
---
EOF
    log "[INFO] [Init] docs.llm/roadmap.md created."
fi

# 2. Generate Local Workflows and Rules Directories
mkdir -p .agents/workflows
mkdir -p .agents/rules

# 3. Copy Local Essential Workflows
log "[INFO] [Init] Syncing local_essential workflows from Engine..."
ESSENTIAL_DIR="$ENGINE_ROOT/workflows/local_essential"
if [ -d "$ESSENTIAL_DIR" ]; then
    for file in "$ESSENTIAL_DIR"/*.md; do
        if [ -f "$file" ]; then
            cp "$file" .agents/workflows/
            log "[INFO] [Init] Copied $(basename "$file")"
        fi
    done
else
    log "[WARN] [Init] No local_essential workflows found in Engine."
fi

log "[INFO] [Init] Initialization complete."
