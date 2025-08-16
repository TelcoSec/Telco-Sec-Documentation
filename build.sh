#!/bin/bash

# Telco Security Documentation - Build Script for Cloudflare Pages
# This script ensures proper environment setup and builds the Jekyll site

set -e  # Exit on any error

echo "🚀 Starting build process for Telco Security Documentation..."

# Check Ruby version
echo "🔍 Checking Ruby version..."
ruby --version

# Check if bundler is available
if ! command -v bundle &> /dev/null; then
    echo "📦 Installing bundler..."
    gem install bundler --version 2.4.22
else
    echo "✅ Bundler already available"
    bundle --version
fi

# Install dependencies
echo "📦 Installing Ruby dependencies..."
bundle install --jobs 4 --retry 3

# Verify Jekyll configuration
echo "🔍 Verifying Jekyll configuration..."
bundle exec jekyll doctor

# Build the site
echo "🏗️ Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build --verbose

# Verify build output
if [ -d "_site" ]; then
    echo "✅ Site built successfully!"
    echo "📊 Build size: $(du -sh _site | cut -f1)"
    echo "📁 Files generated: $(find _site -type f | wc -l)"
    
    # List some key files
    echo "🔍 Key files in build output:"
    ls -la _site/ | head -10
else
    echo "❌ Build failed - _site directory not found"
    exit 1
fi

echo "🎉 Build process completed successfully!"
