#!/bin/bash
# Antigravity Engine - Local Installer

set -e

echo "🚀 Installing Antigravity Engine..."

DEST="$HOME/.gemini/config/plugins/antiengine"

# Check if we are running this script from the destination directory
if [ "$PWD" != "$DEST" ]; then
    echo "⚠️  It looks like you haven't cloned the repository to the correct location."
    echo "Please clone the repo directly to the plugin directory using:"
    echo "git clone https://github.com/Deikus-LXXVII/Antigravity.Engine.git $DEST"
    echo "And then run this script from there."
    exit 1
fi

echo "📦 Building MCP Server..."
cd core/mcp-server
npm install
npm run build

echo ""
echo "✅ Antigravity Engine installed successfully!"
echo "To start a new project, create an empty folder, open it in your IDE, and type /ae-init"
