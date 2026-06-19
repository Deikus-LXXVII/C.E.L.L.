#!/bin/bash

# Configuration
PLUGIN_NAME="antiengine"
PLUGIN_DIR="$HOME/.gemini/config/plugins/$PLUGIN_NAME"
PROJECT_DIR="$(pwd)"

echo "[1/3] Compiling MCP Server bundle..."
npm run build

echo "[2/3] Setting up Antigravity 2.0 Plugin Symlink..."
mkdir -p "$HOME/.gemini/config/plugins"
rm -rf "$PLUGIN_DIR"
ln -s "$PROJECT_DIR" "$PLUGIN_DIR"

echo "[3/3] Done!"
echo "The Antiengine plugin is now lively linked to Antigravity 2.0."
echo "If you restart Antigravity 2.0 or run 'agy plugin list', it should appear."
