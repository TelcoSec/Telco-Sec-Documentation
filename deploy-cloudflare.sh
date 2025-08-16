#!/bin/bash

# 🚀 Cloudflare Pages Deployment Script
# Telco Security Documentation

echo "🚀 Starting Cloudflare Pages Deployment..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "_config.yml" ] || [ ! -f "cloudflare.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed or not in PATH"
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Please commit and push your changes first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    echo "   git push origin main"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Repository status: OK"

# Build the site locally to test
echo ""
echo "🔨 Building site locally..."
if bundle exec jekyll build; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed. Please fix build issues first."
    exit 1
fi

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch (currently on: $current_branch)"
    echo "   Cloudflare Pages will deploy from the main branch"
    echo ""
    read -p "Switch to main branch? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        echo "✅ Switched to main branch"
    fi
fi

# Push latest changes
echo ""
echo "📤 Pushing latest changes to GitHub..."
if git push origin main; then
    echo "✅ Changes pushed successfully"
else
    echo "❌ Failed to push changes. Please check your git configuration."
    exit 1
fi

echo ""
echo "🎉 Repository is ready for Cloudflare Pages deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://dash.cloudflare.com/"
echo "2. Select your domain: telco-sec.com"
echo "3. Navigate to Pages → Create a project"
echo "4. Connect to GitHub repository: TelcoSec/Telco-Sec-Documentation"
echo "5. Configure build settings:"
echo "   - Build command: bundle exec jekyll build"
echo "   - Build output directory: _site"
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see: CLOUDFLARE_DEPLOYMENT.md"
echo ""
echo "🌐 Your site will be available at: https://documentation.telco-sec.com"
echo ""
echo "Good luck with your deployment! 🚀"
