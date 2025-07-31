#!/bin/bash

echo "🔧 Fixing caniuse-lite dependency issue in GitHub location..."
echo ""

TARGET_DIR="/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup"

echo "📍 Target directory: $TARGET_DIR"
echo ""

# Change to the target directory
cd "$TARGET_DIR" || exit 1

echo "🔍 Current directory: $(pwd)"
echo ""

# Try Option 1: Install caniuse-lite directly
echo "📦 Option 1: Installing caniuse-lite directly..."
npm install caniuse-lite@latest

# Check if it worked
if [ $? -eq 0 ]; then
    echo "✅ Successfully installed caniuse-lite!"
    echo ""
    echo "🚀 Now trying to start the development server..."
    npm run dev
else
    echo "❌ Direct install failed. Trying Option 2..."
    echo ""
    
    # Option 2: Clean reinstall
    echo "🧹 Option 2: Performing clean reinstall..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Clean reinstall successful!"
        echo ""
        echo "🚀 Now trying to start the development server..."
        npm run dev
    else
        echo "❌ Clean reinstall failed. Trying Option 3..."
        echo ""
        
        # Option 3: Update browserslist
        echo "🔄 Option 3: Updating browserslist database..."
        npx browserslist@latest --update-db
        npm install caniuse-lite browserslist
        
        if [ $? -eq 0 ]; then
            echo "✅ Browserslist update successful!"
            echo ""
            echo "🚀 Now trying to start the development server..."
            npm run dev
        else
            echo "❌ All automatic fixes failed."
            echo ""
            echo "📋 Manual steps to try:"
            echo "1. Delete node_modules folder manually"
            echo "2. Delete package-lock.json file"
            echo "3. Run: npm cache verify"
            echo "4. Run: npm install"
            echo "5. If still failing, check your Node.js version with: node --version"
        fi
    fi
fi