#!/bin/bash
# C.E.L.L. (Claude's Evolving Logic Library) - Manual Installer (fallback)
#
# The recommended way to install C.E.L.L. is Claude Code's native plugin
# system — see README.md for the one-line install. This script is a manual
# fallback for environments where plugin marketplaces are restricted (e.g.
# managed/locked-down settings), or for local development/testing.
#
# Copies this repo's agents/ (cells) and commands/ into a target Claude Code
# project's .claude/ directory (default) or into ~/.claude/ for global,
# cross-project availability ("user" mode). No build step required — cells
# and commands are plain markdown files.

set -euo pipefail

echo "Installing C.E.L.L. for Claude Code (manual/fallback method)..."

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
cp -R "$REPO_DIR/agents/." "$DEST/agents/"
cp -R "$REPO_DIR/commands/." "$DEST/commands/"

if [ ! -f "$DEST/settings.json" ]; then
    cp "$REPO_DIR/settings.example.json" "$DEST/settings.json"
    echo "Installed default $DEST/settings.json (permissions for common git/script operations)."
else
    echo "NOTE: $DEST/settings.json already exists — not overwritten."
    echo "Review $REPO_DIR/settings.example.json and merge manually if you want its permissions."
fi

echo ""
echo "Done. Cells and commands installed — no build step required."
echo ""
echo "Try it: open Claude Code in this project and run /cell-create"
echo "Usage: ./install.sh          — install into the current project's .claude/"
echo "       ./install.sh user     — install into ~/.claude/ for all projects (recommended)"
echo ""
echo "Prefer the plugin install instead? See README.md for the one-line /plugin method."
