#!/bin/bash

echo "📦 Copying essential packages only..."

SOURCE="/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup/node_modules"
TARGET="/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup/node_modules"

# Create target directory
mkdir -p "$TARGET"

# Copy essential packages for Next.js build
echo "Copying caniuse-lite..."
cp -r "$SOURCE/caniuse-lite" "$TARGET/" 2>/dev/null

echo "Copying browserslist..."
cp -r "$SOURCE/browserslist" "$TARGET/" 2>/dev/null

echo "Copying update-browserslist-db..."
cp -r "$SOURCE/update-browserslist-db" "$TARGET/" 2>/dev/null

echo "Copying next..."
cp -r "$SOURCE/next" "$TARGET/" 2>/dev/null

echo "Copying react..."
cp -r "$SOURCE/react" "$TARGET/" 2>/dev/null

echo "Copying react-dom..."
cp -r "$SOURCE/react-dom" "$TARGET/" 2>/dev/null

echo "Copying .bin directory..."
cp -r "$SOURCE/.bin" "$TARGET/" 2>/dev/null

echo "✅ Essential packages copied!"
echo ""
echo "Now try: cd /Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup && npm run dev"