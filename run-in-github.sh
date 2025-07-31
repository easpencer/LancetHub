#!/bin/bash

echo "🚀 Running development server in GitHub location..."
echo ""

cd /Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup

echo "📍 Current directory: $(pwd)"
echo ""

# Try to run with existing node_modules first
echo "🔍 Checking if we can run with current setup..."
npm run dev || {
    echo ""
    echo "❌ Failed with current setup. Installing fresh..."
    echo ""
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm install --no-optional --prefer-offline
    
    if [ $? -eq 0 ]; then
        echo "✅ Fresh install successful!"
        echo "🚀 Starting development server..."
        npm run dev
    else
        echo "❌ Fresh install failed. Manual intervention needed."
    fi
}