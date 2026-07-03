#!/bin/bash
# Antigravity Engine - Claude Code Installer
#
# Copies this repo's .claude/agents and .claude/commands into a target
# Claude Code project (default) or into ~/.claude for global, cross-project
# availability ("user" mode). No build step required — agents and commands
# are plain markdown files.

set -euo pipefail

echo "Installing Antigravity Engine for Claude Code..."

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-project}"   # project | user

if [ "$MODE" = "user" ]; then
    DEST="$HOME/.claude"
    echo "Installing globally to $DEST (available in every project)"
else
    DEST="$(pwd)/.claude"
    echo "Installing to current project: $DEST"
fi

mkdir -p "$DEST/agents" "$DEST/commands"
cp -R "$REPO_DIR/.claude/agents/." "$DEST/agents/"
cp -R "$REPO_DIR/.claude/commands/." "$DEST/commands/"

if [ ! -f "$DEST/settings.json" ]; then
    cp "$REPO_DIR/.claude/settings.json" "$DEST/settings.json"
    echo "Installed default $DEST/settings.json (permissions for common git/script operations)."
else
    echo "NOTE: $DEST/settings.json already exists — not overwritten."
    echo "Review $REPO_DIR/.claude/settings.json and merge manually if you want its permissions."
fi

echo ""
echo "Done. Agents and commands installed — no build step required."
echo ""
echo "Try it: open Claude Code in this project and run /ae-init"
echo "Usage: ./install.sh          — install into the current project's .claude/"
echo "       ./install.sh user     — install into ~/.claude/ for all projects"
