#!/bin/bash
# C.E.L.L. (Claude's Evolving Logic Library) - Manual Installer (fallback)
#
# The recommended way to install C.E.L.L. is Claude Code's native plugin
# system — see README.md for the one-line install. This script is a manual
# fallback for environments where plugin marketplaces are restricted (e.g.
# managed/locked-down settings), for local development/testing, or for a
# target project that needs to work in remote/cloud Claude Code sessions
# (see "cloud" mode below).
#
# Copies this repo's agents/ (cells) and commands/ into a target Claude Code
# project's .claude/ directory (default), into ~/.claude/ for global,
# cross-project availability ("user" mode), or into the target project's own
# .claude/ together with a committable copy of the library ("cloud" mode).
# No build step required — cells and commands are plain markdown files.

set -euo pipefail

echo "Installing C.E.L.L. for Claude Code (manual/fallback method)..."

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-project}"   # project | user | cloud

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

if [ "$MODE" = "user" ] || [ "$MODE" = "cloud" ]; then
    LIBRARY_DEST="$DEST/cell-library"
    echo "Installing C.E.L.L. library (tagged rules/agents/books) to $LIBRARY_DEST"
    mkdir -p "$LIBRARY_DEST/agents" "$LIBRARY_DEST/rules" "$LIBRARY_DEST/books"
    cp -R "$REPO_DIR/library/." "$LIBRARY_DEST/"
    chmod +x "$LIBRARY_DEST/find-by-tag.sh"
fi

if [ "$MODE" = "cloud" ]; then
    echo "NOTE: cloud mode commits a frozen snapshot of the library into THIS project's"
    echo "      .claude/cell-library/ — commit it to git so a remote/cloud Claude Code"
    echo "      session (which clones this repo onto a fresh, ephemeral machine with no"
    echo "      persistent ~/.claude/) still has it. Tradeoff: this project no longer"
    echo "      shares newly-generated library resources with other projects on the same"
    echo "      machine — re-run './install.sh cloud' to refresh the snapshot when needed."
fi

if [ ! -f "$DEST/settings.json" ]; then
    cp "$REPO_DIR/settings.example.json" "$DEST/settings.json"
    echo "Installed default $DEST/settings.json (permissions for common git/script operations)."
else
    echo "NOTE: $DEST/settings.json already exists — not overwritten."
    echo "Review $REPO_DIR/settings.example.json and merge manually if you want its permissions."
fi

echo ""
echo "Done. Cells and commands installed — no build step required."
if [ "$MODE" = "user" ]; then
    echo "Library (tagged rules/agents/books) installed to $HOME/.claude/cell-library/"
    echo "NOTE: this is a copy, not a symlink — re-run './install.sh user' after 'git pull'"
    echo "      on this repo to refresh it."
elif [ "$MODE" = "cloud" ]; then
    echo "Library (tagged rules/agents/books) installed to $(pwd)/.claude/cell-library/"
    echo "Commit .claude/ to this project's own git repo for it to survive in cloud sessions."
fi
echo ""
echo "Try it: open Claude Code in this project and run /cell-create"
echo "Usage: ./install.sh          — install into the current project's .claude/"
echo "       ./install.sh user     — install into ~/.claude/ for all projects (recommended)"
echo "       ./install.sh cloud    — install into THIS project's .claude/, including a"
echo "                               committable library snapshot (for remote/cloud sessions)"
echo ""
echo "Prefer the plugin install instead? See README.md for the one-line /plugin method."
