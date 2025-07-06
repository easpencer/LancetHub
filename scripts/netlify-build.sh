#!/bin/bash

# Custom build script for Netlify that avoids build-time Airtable access

echo "Starting custom Netlify build..."

# Set environment variables to prevent build-time API access
export NEXT_PUBLIC_BUILD_TIME="true"
export USE_MOCK_DATA="true"

# Run the standard Next.js build
npm run build

# Reset the environment variable
unset NEXT_PUBLIC_BUILD_TIME
unset USE_MOCK_DATA

echo "Build completed successfully!"