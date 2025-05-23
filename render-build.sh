#!/bin/bash
# Robust build script for Render deployment

set -e # Exit on any error

echo "=== STARTING DEPLOYMENT BUILD PROCESS ==="
echo "Running as: $(whoami) in $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clear any previous build artifacts
echo "Clearing previous build..."
rm -rf dist node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
npm ci

# Ensure data directory and files exist
echo "Ensuring data files exist..."
node ensure-data.js

# Create images directory if it doesn't exist
echo "Setting up image directories..."
mkdir -p client/public/assets/images/articles
mkdir -p public/assets/images/articles

# Create logs directory for call summaries
echo "Setting up logs directory..."
mkdir -p logs

# Copy necessary image files
echo "Checking image files for articles..."
cp -f client/public/assets/images/articles/* public/assets/images/articles/ 2>/dev/null || true

# Build the application
echo "Building application..."
npm run build

# Verify the build output
echo "Verifying build output..."
if [ -d "dist/public" ] && [ -f "dist/public/index.html" ]; then
  echo "✅ Build successful! Output exists at dist/public/index.html"
  
  # Create a build verification file
  echo "Creating build verification file..."
  cat > dist/public/build-info.txt << EOF
Build completed on: $(date)
Git commit: $(git rev-parse HEAD)
Git branch: $(git rev-parse --abbrev-ref HEAD)
Server: Render
Environment: Production
EOF
  
  # List important files to verify they exist
  echo "======== BUILD FILES ========"
  ls -la dist/public/
  echo "============================"
  
else
  echo "❌ Build failed! dist/public/index.html not found"
  exit 1
fi

# Clean up
echo "Cleaning up unnecessary files..."
rm -rf node_modules/.cache

echo "=== BUILD PROCESS COMPLETED ==="