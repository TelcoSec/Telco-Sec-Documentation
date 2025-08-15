# Setup Guide for Telco Security Documentation

This guide will walk you through setting up the telecom security documentation repository and GitHub Pages site on your local machine and in production.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Telco-Sec-Documentation.git
cd Telco-Sec-Documentation
```

### 2. Install Dependencies
```bash
# Install Ruby (if not already installed)
# Windows: Download from https://rubyinstaller.org/
# macOS: brew install ruby
# Linux: sudo apt-get install ruby ruby-dev

# Install Jekyll and Bundler
gem install jekyll bundler

# Install project dependencies
bundle install
```

### 3. Run Locally
```bash
bundle exec jekyll serve
# Site will be available at http://localhost:4000
```

## 🔧 Prerequisites

### System Requirements
- **Ruby**: Version 3.0 or higher
- **Git**: Latest version
- **Node.js**: Version 16 or higher (for some build tools)
- **GitHub Account**: For repository access and GitHub Pages

### Required Software
- **Ruby**: [Download Ruby](https://www.ruby-lang.org/en/downloads/)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Text Editor**: VS Code, Sublime Text, or your preferred editor

## 📋 Detailed Setup Instructions

### Step 1: Environment Setup

#### Windows
1. Download and install [RubyInstaller](https://rubyinstaller.org/)
2. Download and install [Git for Windows](https://git-scm.com/download/win)
3. Download and install [Node.js](https://nodejs.org/)
4. Restart your computer
5. Open Git Bash and verify installations:
   ```bash
   ruby --version
   git --version
   node --version
   ```

#### macOS
1. Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Ruby and Git:
   ```bash
   brew install ruby git node
   ```
3. Add Ruby to your PATH:
   ```bash
   echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install ruby ruby-dev git nodejs npm
```

### Step 2: Repository Setup

#### Clone and Configure
```bash
# Clone the repository
git clone https://github.com/yourusername/Telco-Sec-Documentation.git
cd Telco-Sec-Documentation

# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Create and switch to development branch
git checkout -b develop
```

#### Install Dependencies
```bash
# Install Jekyll and Bundler
gem install jekyll bundler

# Install project dependencies
bundle install

# If you encounter permission issues on Linux/macOS:
sudo gem install jekyll bundler
```

### Step 3: Local Development

#### Start Development Server
```bash
# Start Jekyll server
bundle exec jekyll serve

# For live reload (recommended for development)
bundle exec jekyll serve --livereload

# For external access (if needed)
bundle exec jekyll serve --host 0.0.0.0
```

#### Access Your Site
- **Local**: http://localhost:4000
- **Network**: http://your-ip-address:4000 (if using --host 0.0.0.0)

#### Development Features
- **Live Reload**: Automatically refreshes browser when files change
- **Auto-rebuild**: Rebuilds site when source files are modified
- **Error Reporting**: Detailed error messages in terminal and browser

### Step 4: GitHub Pages Deployment

#### Repository Configuration
1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Set **Source** to "GitHub Actions"
4. Ensure the repository is public (or you have GitHub Pro for private repos)

#### GitHub Actions Setup
The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will:
- Automatically build the site on every push to main
- Deploy to GitHub Pages
- Run build checks on pull requests

#### First Deployment
1. Push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Initial setup and configuration"
   git push origin main
   ```
2. Check the **Actions** tab in your repository
3. Wait for the deployment to complete
4. Your site will be available at: `https://yourusername.github.io/Telco-Sec-Documentation`

## 🛠️ Development Workflow

### Adding New Documents
1. Create a new Markdown file in the appropriate category folder
2. Use the document template from `docs/README.md`
3. Include proper YAML front matter
4. Test locally with `bundle exec jekyll serve`
5. Commit and push your changes

### Document Structure
```
docs/
├── network-security/
├── 5g-security/
├── iot-security/
├── cloud-security/
├── compliance/
├── incident-response/
├── threat-intelligence/
└── vendor-security/
```

### File Naming Convention
- Use descriptive, lowercase names with hyphens
- Include date prefix: `YYYY-MM-DD-document-title.md`
- Example: `2024-01-15-5g-network-security-threats.md`

## 🔍 Testing and Validation

### Local Testing
```bash
# Build the site
bundle exec jekyll build

# Check for build errors
bundle exec jekyll build --verbose

# Validate HTML (optional)
bundle exec htmlproofer ./_site
```

### Search Functionality Testing
1. Start the local server
2. Navigate to the search section
3. Test various search queries
4. Verify filtering works correctly
5. Check search result highlighting

### Responsive Design Testing
1. Test on different screen sizes
2. Use browser developer tools
3. Test on mobile devices
4. Verify navigation works on all devices

## 🚨 Troubleshooting

### Common Issues

#### Ruby/Jekyll Installation Problems
```bash
# Clear gem cache
gem cleanup

# Reinstall Jekyll
gem uninstall jekyll
gem install jekyll

# Check Ruby version compatibility
ruby --version
```

#### Bundle Install Issues
```bash
# Clear bundle cache
bundle clean --force

# Update bundle
bundle update

# Install with specific Ruby version
bundle install --path vendor/bundle
```

#### Build Errors
```bash
# Check Jekyll configuration
bundle exec jekyll doctor

# Build with verbose output
bundle exec jekyll build --verbose

# Check for syntax errors in Markdown files
bundle exec jekyll build --trace
```

#### GitHub Pages Deployment Issues
1. Check GitHub Actions logs
2. Verify repository settings
3. Ensure main branch is set as source
4. Check for build errors in Actions tab

### Performance Optimization

#### Build Performance
```bash
# Enable incremental builds
bundle exec jekyll serve --incremental

# Disable plugins for faster builds
bundle exec jekyll serve --skip-plugins

# Use parallel processing
bundle exec jekyll serve --workers 4
```

#### Site Performance
- Optimize images before adding
- Minimize JavaScript and CSS
- Use CDN for external resources
- Enable GitHub Pages compression

## 📚 Additional Resources

### Jekyll Documentation
- [Jekyll Official Site](https://jekyllrb.com/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll GitHub Repository](https://github.com/jekyll/jekyll)

### GitHub Pages
- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Pages Help](https://help.github.com/categories/github-pages-basics/)
- [Custom Domains](https://help.github.com/articles/using-a-custom-domain-with-github-pages/)

### Markdown
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### CSS and JavaScript
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Font Awesome](https://fontawesome.com/)
- [Modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🤝 Getting Help

### Community Support
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Stack Overflow**: Search for Jekyll and GitHub Pages solutions

### Documentation
- **README.md**: Project overview and quick start
- **CONTRIBUTING.md**: Contribution guidelines
- **docs/README.md**: Document structure and format

### Contact
- Open an issue in the repository
- Start a discussion for questions
- Contact maintainers for urgent issues

## 🎯 Next Steps

After completing the setup:

1. **Customize the Site**
   - Update `_config.yml` with your information
   - Modify colors and styling in `assets/css/style.css`
   - Add your logo and branding

2. **Add Content**
   - Create sample documents in each category
   - Test search functionality
   - Verify all links work correctly

3. **Deploy and Share**
   - Push to GitHub and verify deployment
   - Share with your team or community
   - Collect feedback and iterate

4. **Maintain and Update**
   - Regular content updates
   - Security patches and dependency updates
   - Performance monitoring and optimization

---

*This setup guide covers the essential steps to get your telecom security documentation site up and running. For additional help or questions, please refer to the troubleshooting section or open an issue in the repository.*

*Last updated: December 2024*
