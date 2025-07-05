#!/bin/bash

# Function to handle errors
error_exit() {
  echo "Error: $1" >&2
  exit 1
}

echo "Setting up LancetHub directories and files..."

# Create necessary directories
mkdir -p public/images/people || error_exit "Failed to create image directories"
mkdir -p public/data || error_exit "Failed to create data directory"

# Create a placeholder profile image
echo "Creating placeholder profile image..."
echo "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" > public/images/placeholder-profile.png || error_exit "Failed to create placeholder profile image"

# Create hero illustration SVG
echo "Creating hero illustration..."
cat > public/images/hero-illustration.svg << 'EOF' || error_exit "Failed to create hero illustration"
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0070f3;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#4caf50;stop-opacity:0.9" />
    </linearGradient>
    <radialGradient id="grad2" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#ff6e40;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ff6e40;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="#f5f8fa" />
  
  <!-- Abstract network visualization -->
  <g stroke-width="1.5" stroke-opacity="0.6">
    <!-- Network nodes and links -->
    <circle cx="200" cy="200" r="50" fill="url(#grad2)" opacity="0.7" />
    <circle cx="400" cy="150" r="70" fill="url(#grad1)" opacity="0.6" />
    <circle cx="600" cy="250" r="60" fill="#0070f3" opacity="0.5" />
    <circle cx="300" cy="400" r="80" fill="#4caf50" opacity="0.4" />
    <circle cx="550" cy="450" r="40" fill="#ff6e40" opacity="0.6" />
    
    <!-- Connection lines -->
    <line x1="200" y1="200" x2="400" y2="150" stroke="#0070f3" />
    <line x1="400" y1="150" x2="600" y2="250" stroke="#0070f3" />
    <line x1="600" y1="250" x2="550" y2="450" stroke="#0070f3" />
    <line x1="550" y1="450" x2="300" y2="400" stroke="#0070f3" />
    <line x1="300" y1="400" x2="200" y2="200" stroke="#0070f3" />
    <line x1="400" y1="150" x2="300" y2="400" stroke="#0070f3" />
    <line x1="600" y1="250" x2="300" y2="400" stroke="#0070f3" />
  </g>
  
  <!-- Decorative elements -->
  <circle cx="150" cy="450" r="100" fill="url(#grad2)" opacity="0.3" />
  <circle cx="650" cy="100" r="80" fill="url(#grad1)" opacity="0.3" />
  
  <!-- Title text -->
  <text x="400" y="300" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#333">
    Societal Resilience Framework
  </text>
</svg>
EOF

# Create favicon
echo "Creating favicon..."
cat > public/favicon.ico << 'EOF' || error_exit "Failed to create favicon"
AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAMMOAADDDgAAAAAAAAAAAAD///8A////
EOF

echo "Placeholders created successfully!"
