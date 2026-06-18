#!/bin/bash
# setup.sh - Installer for Antigravity Engine

ENGINE_ROOT=$(pwd)
TOOLS_DIR="$ENGINE_ROOT/core/tools"
GLOBAL_WORKFLOWS_DIR="$HOME/.gemini/config/global_workflows"
LOG_DIR="$ENGINE_ROOT/logs/setup"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +'%Y-%m-%d').log"

# Setup logging function
log() {
    local msg="[$(date +'%Y-%m-%dT%H:%M:%S%z')] $1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log "[INFO] Starting Antigravity Engine Setup..."

# 1. Ensure global workflows directory exists
mkdir -p "$GLOBAL_WORKFLOWS_DIR"

# 2. Create Symlinks for Global Workflows and Rules
log "[INFO] Symlinking global workflows..."
if [ -d "$ENGINE_ROOT/workflows/global" ]; then
    for file in "$ENGINE_ROOT"/workflows/global/*.md; do
        if [ -f "$file" ]; then
            base=$(basename "$file")
            ln -sf "$file" "$GLOBAL_WORKFLOWS_DIR/$base"
            log "  -> Linked workflow: $base"
        fi
    done
else
    log "[WARN] workflows/global directory not found."
fi

log "[INFO] Symlinking global rules..."
if [ -f "$ENGINE_ROOT/rules/rules_global/GEMINI.md" ]; then
    ln -sf "$ENGINE_ROOT/rules/rules_global/GEMINI.md" "$HOME/.gemini/GEMINI.md"
    log "  -> Linked global rule: GEMINI.md"
else
    log "[WARN] rules/rules_global/GEMINI.md not found. (Run setup.sh again after creating it)"
fi

# 3. Handle PATH Injection Automatically
log "[INFO] Checking PATH for $TOOLS_DIR..."
ZSHRC="$HOME/.zshrc"

if [[ ":$PATH:" != *":$TOOLS_DIR:"* ]]; then
    if grep -q "export PATH=.*$TOOLS_DIR" "$ZSHRC" 2>/dev/null; then
        log "[INFO] Tools directory is already in ~/.zshrc but not in active PATH. Run 'source ~/.zshrc'."
    else
        log "[INFO] Automatically injecting PATH into $ZSHRC..."
        echo "" >> "$ZSHRC"
        echo "# Antigravity Engine Tools" >> "$ZSHRC"
        echo "export PATH=\"\$PATH:$TOOLS_DIR\"" >> "$ZSHRC"
        log "[SUCCESS] Injected PATH. Please run 'source ~/.zshrc' or restart your terminal to activate."
    fi
else
    log "[INFO] Tools directory is already in active PATH."
fi

# Make tools executable
chmod +x "$TOOLS_DIR"/* 2>/dev/null

log "[INFO] Setup complete."
