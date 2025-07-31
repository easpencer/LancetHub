#!/bin/bash

echo "🚀 Copying working node_modules to GitHub location..."
echo ""

SOURCE_DIR="/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup"
TARGET_DIR="/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup"

# Check if source node_modules exists
if [ ! -d "$SOURCE_DIR/node_modules" ]; then
    echo "❌ Error: No node_modules found in Desktop location"
    echo "Please run 'npm install' in $SOURCE_DIR first"
    exit 1
fi

echo "📦 Removing old node_modules from GitHub location..."
rm -rf "$TARGET_DIR/node_modules"
rm -f "$TARGET_DIR/package-lock.json"

echo "📋 Copying node_modules (this may take a minute)..."
cp -r "$SOURCE_DIR/node_modules" "$TARGET_DIR/"

echo "📋 Copying package-lock.json..."
cp "$SOURCE_DIR/package-lock.json" "$TARGET_DIR/" 2>/dev/null || echo "No package-lock.json found"

echo ""
echo "✅ Done! Now you can:"
echo "1. cd $TARGET_DIR"
echo "2. npm run dev"
echo ""
echo "The server should start without any dependency errors!"