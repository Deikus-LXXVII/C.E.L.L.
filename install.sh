#!/bin/bash
# C.E.L.L. (Claude's Evolving Logic Library) - Manual Installer (fallback)
#
# The recommended way to install C.E.L.L. is Claude Code's native plugin
# system — see README.md for the one-line install. This script is a manual
# fallback for environments where plugin marketplaces are restricted (e.g.
# managed/locked-down settings), for local development/testing, or for a
# target project that needs to work in remote/cloud Claude Code sessions
# (see "sync" mode below).
#
# Copies this repo's agents/ (cells) and commands/ into a target Claude Code
# project's .claude/ directory (default), into ~/.claude/ for global,
# cross-project availability ("user" mode), or into the target project's own
# .claude/ with a LIVE, auto-refreshing git clone of the library ("sync"
# mode — needs network; the clone/symlink are always .gitignore'd so they
# never pollute the consumer project's own history).
# No build step required — cells and commands are plain markdown files.

set -euo pipefail

echo "Installing C.E.L.L. for Claude Code (manual/fallback method)..."

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-project}"   # project | user | sync

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

if [ "$MODE" = "user" ]; then
    LIBRARY_DEST="$DEST/cell-library"
    echo "Installing C.E.L.L. library (tagged rules/agents/books) to $LIBRARY_DEST"
    mkdir -p "$LIBRARY_DEST/agents" "$LIBRARY_DEST/rules" "$LIBRARY_DEST/books"
    cp -R "$REPO_DIR/library/." "$LIBRARY_DEST/"
    chmod +x "$LIBRARY_DEST/find-by-tag.sh"
fi

if [ "$MODE" = "sync" ]; then
    CLONE_DIR="$DEST/cell-library-src"
    LIBRARY_LINK="$DEST/cell-library"
    REMOTE_URL="https://github.com/Deikus-LXXVII/C.E.L.L..git"

    if [ -d "$CLONE_DIR/.git" ]; then
        echo "Existing sync clone found at $CLONE_DIR — refreshing with git pull"
        git -C "$CLONE_DIR" pull --ff-only || echo "NOTE: git pull failed (offline, or diverged) — using existing local copy."
    else
        echo "Creating sparse, shallow clone of the C.E.L.L. library/ subtree at $CLONE_DIR"
        rm -rf "$CLONE_DIR"
        git clone --depth 1 --filter=blob:none --sparse "$REMOTE_URL" "$CLONE_DIR"
        git -C "$CLONE_DIR" sparse-checkout set library
    fi
    chmod +x "$CLONE_DIR/library/find-by-tag.sh"

    rm -f "$LIBRARY_LINK"
    ln -s "$CLONE_DIR/library" "$LIBRARY_LINK"
    echo "Linked $LIBRARY_LINK -> $CLONE_DIR/library (live, auto-refreshing)"

    # .gitignore both the clone and the symlink in the consumer project's own repo —
    # this is a live mirror of the canonical C.E.L.L. repo, not a snapshot meant to be
    # committed to this project's own history.
    GITIGNORE_FILE="$(pwd)/.gitignore"
    for ENTRY in ".claude/cell-library-src/" ".claude/cell-library"; do
        if [ -f "$GITIGNORE_FILE" ]; then
            grep -qxF "$ENTRY" "$GITIGNORE_FILE" || printf '%s\n' "$ENTRY" >> "$GITIGNORE_FILE"
        else
            printf '# C.E.L.L. sync-mode library clone (live git working tree, not a snapshot)\n%s\n' "$ENTRY" > "$GITIGNORE_FILE"
        fi
    done
    echo "Added .claude/cell-library-src/ and .claude/cell-library to $GITIGNORE_FILE (idempotent)"
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
elif [ "$MODE" = "sync" ]; then
    echo "Library linked to $(pwd)/.claude/cell-library/ (live clone at .claude/cell-library-src/)"
    echo ".gitignore updated so this project's own repo never commits the clone/symlink."
    echo "Re-run './install.sh sync' anytime to refresh (or let cells auto-pull it themselves)."
fi
echo ""
echo "Try it: open Claude Code in this project and run /cell-create"
echo "Usage: ./install.sh          — install into the current project's .claude/"
echo "       ./install.sh user     — install into ~/.claude/ for all projects (recommended)"
echo "       ./install.sh sync     — install into THIS project's .claude/, with a live,"
echo "                               auto-refreshing git clone of the library (needs"
echo "                               network access) — always .gitignore'd, never committed"
echo ""
echo "Prefer the plugin install instead? See README.md for the one-line /plugin method."
