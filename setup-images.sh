#!/bin/bash

# Create necessary directories
mkdir -p public/images/people
mkdir -p public/images

# Create a simple SVG placeholder for hero image
cat > public/images/hero-illustration.svg << EOF
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#e3f2fd"/>
  <circle cx="300" cy="200" r="150" fill="#0070f3" opacity="0.5"/>
  <circle cx="200" cy="150" r="100" fill="#4caf50" opacity="0.5"/>
  <circle cx="400" cy="150" r="100" fill="#ff6e40" opacity="0.5"/>
  <text x="300" y="200" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">
    Societal Resilience
  </text>
</svg>
EOF

# Create a simple profile placeholder image
cat > public/images/placeholder-profile.png << EOF
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#e3f2fd"/>
  <circle cx="100" cy="80" r="60" fill="#0070f3" opacity="0.2"/>
  <rect x="40" y="150" width="120" height="40" rx="5" fill="#0070f3" opacity="0.2"/>
  <text x="100" y="180" font-family="Arial" font-size="16" text-anchor="middle" fill="#666">
    User Profile
  </text>
</svg>
EOF

# Create a favicon
cat > public/favicon.ico << EOF
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0070f3"/>
  <text x="16" y="22" font-family="Arial" font-size="18" text-anchor="middle" fill="white">
    L
  </text>
</svg>
EOF

# Create a simple placeholder logo
echo "Creating Lancet logo placeholder..."
cat > public/images/lancet-logo.png << EOL
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
EOL

# Create a research image placeholder
echo "Creating featured research image placeholder..."
cat > public/images/featured-research.jpg << EOL
/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsK
CwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQU
FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsASwDASIA
AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA
AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3
ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm
p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA
AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx
BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK
U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3
uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KK
KACiiigAqC8vre0tpZp5UghRSzySMFVR6knpUE2p+XK8MFtNeSoAXW3xhSegrj9e8S6vIXstYtbX
w8i/6i5iuFmnlP8Asy4GxPUjLH0HWgDc/tia7ZotJgaGCQbZLy4BCOvqiDgt7nj24zWFdeNI0uCt
5qt5LcKcNbQQmMj28sZNZFrp+o2dnDZxaIs0cI/eXWX8yZvVnLHJ/CiWxvLKJXvNKiYuMDyJo5FX
/ZBJ3N+RoAt/8JANQbFjdTMT91XiKE/8CxtP4EU6fxL9ilEdxJLazE4UXcDRkn0BO0n8Caox6rpd
zILb7FfRCT5Y5Zf3qFj0BZTlc+4xV7Rrm+1G5P8AZs1q4t2YTeavzW0gP3TnoGHJX6n2oAs0UUUA
FFFFABRRRQAUUUUAFFFFABRRRQB//9k=
EOL

# Create simple pattern for background
echo "Creating pattern background image..."
cat > public/images/pattern-bg.svg << EOL
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 102, 204, 0.1)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#grid)" />
  <circle cx="50" cy="50" r="30" fill="rgba(0, 102, 204, 0.05)" />
</svg>
EOL

echo "Creating og-image.jpg..."
cat > public/images/og-image.jpg << EOL
/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsK
CwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQU
FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoACgDASIA
AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA
AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3
ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm
p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA
AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx
BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK
U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3
uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KK
KACiiigAqC8vre0tpZp5UghRSzySMFVR6knpUE2p+XK8MFtNeSoAXW3xhSegrj9e8S6vIXstYtbX
w8i/6i5iuFmnlP8Asy4GxPUjLH0HWgDc/tia7ZotJgaGCQbZLy4BCOvqiDgt7nj24zWFdeNI0uCt
5qt5LcKcNbQQmMj28sZNZFrp+o2dnDZxaIs0cI/eXWX8yZvVnLHJ/CiWxvLKJXvNKiYuMDyJo5FX
/ZBJ3N+RoAt/8JANQbFjdTMT91XiKE/8CxtP4EU6fxL9ilEdxJLazE4UXcDRkn0BO0n8Caox6rpd
zILb7FfRCT5Y5Zf3qFj0BZTlc+4xV7Rrm+1G5P8AZs1q4t2YTeavzW0gP3TnoGHJX6n2oAs0UUUA
FFFFABRRRQAUUUUAFFFFABRRRQB//9k=
EOL

echo "All placeholder images created successfully!"
