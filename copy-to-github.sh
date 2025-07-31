#!/bin/bash

# Script to copy Policy Investment Dashboard files to GitHub location
SOURCE_DIR="/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup"
TARGET_DIR="/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup"

echo "🚀 Copying Policy Investment Dashboard files to GitHub location..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$TARGET_DIR/app/api/policy-modeling/investment"
mkdir -p "$TARGET_DIR/utils"

# Copy Policy Investment Dashboard component files
echo "📄 Copying PolicyInvestmentDashboard component..."
cp "$SOURCE_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.js" "$TARGET_DIR/app/pandemic-vulnerability/"
cp "$SOURCE_DIR/app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css" "$TARGET_DIR/app/pandemic-vulnerability/"

# Copy updated page.js with Policy Investment tab
echo "📄 Copying updated pandemic-vulnerability page..."
cp "$SOURCE_DIR/app/pandemic-vulnerability/page.js" "$TARGET_DIR/app/pandemic-vulnerability/"

# Copy API routes
echo "📄 Copying API routes..."
cp "$SOURCE_DIR/app/api/policy-modeling/investment/route.js" "$TARGET_DIR/app/api/policy-modeling/investment/"

# Copy utility files
echo "📄 Copying utility files..."
cp "$SOURCE_DIR/utils/data-sources-config.js" "$TARGET_DIR/utils/"
cp "$SOURCE_DIR/utils/investment-data-fetcher.js" "$TARGET_DIR/utils/"
cp "$SOURCE_DIR/utils/investment-resilience-models.js" "$TARGET_DIR/utils/"
cp "$SOURCE_DIR/utils/fact-checker.js" "$TARGET_DIR/utils/"
cp "$SOURCE_DIR/utils/citation-tracker.js" "$TARGET_DIR/utils/"

# Copy updated Navigation.js (removes "Policy Modeling" link)
echo "📄 Copying updated Navigation component..."
cp "$SOURCE_DIR/components/Navigation.js" "$TARGET_DIR/components/"

echo ""
echo "✅ All files copied successfully!"
echo ""
echo "📋 Files copied:"
echo "  - app/pandemic-vulnerability/PolicyInvestmentDashboard.js"
echo "  - app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css"
echo "  - app/pandemic-vulnerability/page.js (updated with Policy Investment tab)"
echo "  - app/api/policy-modeling/investment/route.js"
echo "  - utils/data-sources-config.js"
echo "  - utils/investment-data-fetcher.js"
echo "  - utils/investment-resilience-models.js"
echo "  - utils/fact-checker.js"
echo "  - utils/citation-tracker.js"
echo "  - components/Navigation.js (updated to remove 'Policy Modeling')"
echo ""
echo "🔧 Next steps:"
echo "1. cd $TARGET_DIR"
echo "2. npm install (if you haven't already)"
echo "3. npm run dev"
echo "4. Navigate to http://localhost:3000/pandemic-vulnerability"
echo "5. Click on the '💰 Policy Investment' tab"