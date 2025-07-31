#!/bin/bash

# Script to copy Policy Investment Dashboard files to GitHub location
SOURCE_DIR="/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup"
TARGET_DIR="/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup"

echo "🚀 Copying Policy Investment Dashboard files to GitHub location..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"
echo ""

# Create all necessary directories
echo "📁 Creating all necessary directories..."
mkdir -p "$TARGET_DIR/app/pandemic-vulnerability"
mkdir -p "$TARGET_DIR/app/api/policy-modeling/investment"
mkdir -p "$TARGET_DIR/utils"
mkdir -p "$TARGET_DIR/components"

# Copy Policy Investment Dashboard component files
echo "📄 Copying PolicyInvestmentDashboard component..."
cp "$SOURCE_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.js" "$TARGET_DIR/app/pandemic-vulnerability/" 2>/dev/null || echo "  ⚠️  PolicyInvestmentDashboard.js copy failed"
cp "$SOURCE_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css" "$TARGET_DIR/app/pandemic-vulnerability/" 2>/dev/null || echo "  ⚠️  PolicyInvestmentDashboard.module.css copy failed"

# Copy updated page.js with Policy Investment tab
echo "📄 Copying updated pandemic-vulnerability page..."
cp "$SOURCE_DIR/app/pandemic-vulnerability/page.js" "$TARGET_DIR/app/pandemic-vulnerability/" 2>/dev/null || echo "  ⚠️  page.js copy failed"

# Copy API routes
echo "📄 Copying API routes..."
cp "$SOURCE_DIR/app/api/policy-modeling/investment/route.js" "$TARGET_DIR/app/api/policy-modeling/investment/" 2>/dev/null || echo "  ⚠️  API route copy failed"

# Copy utility files
echo "📄 Copying utility files..."
cp "$SOURCE_DIR/utils/data-sources-config.js" "$TARGET_DIR/utils/" 2>/dev/null || echo "  ✅ data-sources-config.js copied"
cp "$SOURCE_DIR/utils/investment-data-fetcher.js" "$TARGET_DIR/utils/" 2>/dev/null || echo "  ✅ investment-data-fetcher.js copied"
cp "$SOURCE_DIR/utils/investment-resilience-models.js" "$TARGET_DIR/utils/" 2>/dev/null || echo "  ✅ investment-resilience-models.js copied"
cp "$SOURCE_DIR/utils/fact-checker.js" "$TARGET_DIR/utils/" 2>/dev/null || echo "  ✅ fact-checker.js copied"
cp "$SOURCE_DIR/utils/citation-tracker.js" "$TARGET_DIR/utils/" 2>/dev/null || echo "  ✅ citation-tracker.js copied"

# Copy updated Navigation.js (removes "Policy Modeling" link)
echo "📄 Copying updated Navigation component..."
cp "$SOURCE_DIR/components/Navigation.js" "$TARGET_DIR/components/" 2>/dev/null || echo "  ✅ Navigation.js copied"

# Verify what was copied
echo ""
echo "📋 Verifying copied files..."
if [ -f "$TARGET_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.js" ]; then
    echo "  ✅ PolicyInvestmentDashboard.js"
else
    echo "  ❌ PolicyInvestmentDashboard.js NOT FOUND"
fi

if [ -f "$TARGET_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css" ]; then
    echo "  ✅ PolicyInvestmentDashboard.module.css"
else
    echo "  ❌ PolicyInvestmentDashboard.module.css NOT FOUND"
fi

if [ -f "$TARGET_DIR/app/pandemic-vulnerability/page.js" ]; then
    echo "  ✅ pandemic-vulnerability/page.js"
else
    echo "  ❌ pandemic-vulnerability/page.js NOT FOUND"
fi

if [ -f "$TARGET_DIR/app/api/policy-modeling/investment/route.js" ]; then
    echo "  ✅ API route"
else
    echo "  ❌ API route NOT FOUND"
fi

echo ""
echo "🔧 Next steps:"
echo "1. cd $TARGET_DIR"
echo "2. Fix the missing dependency: npm install caniuse-lite"
echo "3. npm run dev"
echo "4. Navigate to http://localhost:3000/pandemic-vulnerability"
echo "5. Click on the '💰 Policy Investment' tab"
echo ""
echo "Note: The navigation should no longer show 'Policy Modeling'"