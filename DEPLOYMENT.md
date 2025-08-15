# Deployment Guide - GitHub Pages

This guide provides step-by-step instructions for deploying your telecom security documentation site to GitHub Pages.

## 🚀 Quick Deployment

### 1. Push to GitHub
```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial setup: Complete telecom security documentation site"

# Push to main branch
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Set **Source** to "GitHub Actions"
4. Click **Save**

### 3. Monitor Deployment
1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for completion (usually 2-5 minutes)
4. Your site will be live at: `https://yourusername.github.io/Telco-Sec-Documentation`

## 🔧 Manual Deployment Steps

### Step 1: Repository Setup
```bash
# Ensure you're on the main branch
git checkout main

# Verify remote origin
git remote -v

# If no remote, add it:
# git remote add origin https://github.com/yourusername/Telco-Sec-Documentation.git
```

### Step 2: Build and Test Locally
```bash
# Install dependencies
bundle install

# Build the site
bundle exec jekyll build

# Test locally
bundle exec jekyll serve
# Visit http://localhost:4000
```

### Step 3: Deploy to GitHub
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Deploy telecom security documentation site

- Complete Jekyll site setup
- Responsive design with Bootstrap
- Advanced search functionality
- Category-based organization
- GitHub Pages deployment ready"

# Push to trigger deployment
git push origin main
```

## 📋 Pre-Deployment Checklist

### ✅ Files Present
- [ ] `_config.yml` - Jekyll configuration
- [ ] `index.html` - Main page
- [ ] `assets/css/style.css` - Custom styling
- [ ] `assets/js/search.js` - Search functionality
- [ ] `assets/js/main.js` - Site interactions
- [ ] `Gemfile` - Ruby dependencies
- [ ] `.github/workflows/deploy.yml` - GitHub Actions
- [ ] `docs/` - Document structure
- [ ] `README.md` - Project documentation
- [ ] `CONTRIBUTING.md` - Contribution guidelines

### ✅ Configuration Check
- [ ] Update `_config.yml` with your GitHub username
- [ ] Verify repository name matches
- [ ] Check baseurl configuration
- [ ] Ensure all links are correct

### ✅ Content Verification
- [ ] Sample document in `docs/5g-security/`
- [ ] All category links working
- [ ] Search functionality tested
- [ ] Responsive design verified

## 🚨 Common Deployment Issues

### Issue: Build Fails
**Symptoms**: GitHub Actions workflow fails
**Solutions**:
1. Check Ruby version compatibility
2. Verify Gemfile syntax
3. Check for YAML syntax errors in `_config.yml`
4. Review build logs in Actions tab

### Issue: Site Not Accessible
**Symptoms**: 404 error or site not found
**Solutions**:
1. Verify GitHub Pages is enabled
2. Check repository is public
3. Wait for deployment to complete
4. Clear browser cache

### Issue: Styling Not Applied
**Symptoms**: Site loads but looks unstyled
**Solutions**:
1. Check CSS file paths
2. Verify Bootstrap CDN links
3. Check browser console for errors
4. Verify asset compilation

### Issue: Search Not Working
**Symptoms**: Search box present but no results
**Solutions**:
1. Check JavaScript console for errors
2. Verify search.js is loaded
3. Check document data structure
4. Test with sample documents

## 🔍 Post-Deployment Verification

### 1. Site Accessibility
- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Navigation works correctly
- [ ] Responsive design functional

### 2. Search Functionality
- [ ] Search box visible and functional
- [ ] Search results display correctly
- [ ] Filters work as expected
- [ ] Search highlighting functional

### 3. Content Display
- [ ] Categories display correctly
- [ ] Sample documents visible
- [ ] Links work properly
- [ ] Images and icons load

### 4. Performance
- [ ] Page load times reasonable
- [ ] No broken resource links
- [ ] Mobile performance acceptable
- [ ] Search response time good

## 🎯 Customization After Deployment

### 1. Update Site Information
```yaml
# In _config.yml
title: "Your Organization Name"
url: "https://yourusername.github.io"
baseurl: "/Your-Repo-Name"
author:
  name: "Your Name"
  email: "your.email@example.com"
```

### 2. Add Your Logo
1. Place logo file in `assets/images/`
2. Update `index.html` with your logo
3. Adjust styling in `assets/css/style.css`

### 3. Customize Colors
```css
/* In assets/css/style.css */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
}
```

### 4. Add Custom Domain (Optional)
1. Purchase domain name
2. Add CNAME record pointing to `yourusername.github.io`
3. Update `.github/workflows/deploy.yml`:
   ```yaml
   cname: yourdomain.com
   ```

## 📊 Monitoring and Maintenance

### 1. Regular Checks
- [ ] Site accessibility weekly
- [ ] Search functionality monthly
- [ ] Performance monitoring quarterly
- [ ] Security updates as needed

### 2. Content Updates
- [ ] Add new documents regularly
- [ ] Update existing content
- [ ] Review and update tags
- [ ] Maintain document quality

### 3. Technical Maintenance
- [ ] Update dependencies quarterly
- [ ] Monitor GitHub Actions
- [ ] Check for security updates
- [ ] Optimize performance

## 🆘 Getting Help

### 1. GitHub Issues
- Open issue in repository
- Include error messages
- Provide reproduction steps
- Attach relevant logs

### 2. Community Support
- Jekyll community forums
- GitHub Pages documentation
- Stack Overflow
- GitHub Discussions

### 3. Documentation
- `SETUP.md` - Complete setup guide
- `CONTRIBUTING.md` - Contribution guidelines
- `README.md` - Project overview
- Jekyll official documentation

## 🎉 Success Indicators

Your deployment is successful when:

1. **GitHub Actions**: Workflow completes without errors
2. **Site Access**: Site loads at expected URL
3. **Functionality**: All features work as expected
4. **Performance**: Site loads quickly and responsively
5. **Content**: Documents and categories display correctly
6. **Search**: Search functionality works properly
7. **Mobile**: Site works well on mobile devices

## 🔄 Continuous Deployment

After initial deployment:

1. **Automatic Updates**: Every push to main triggers deployment
2. **Pull Request Testing**: PRs are tested before merging
3. **Rollback**: Previous versions remain accessible
4. **Monitoring**: GitHub Actions provide deployment status

---

*This deployment guide ensures your telecom security documentation site goes live successfully. For additional help, refer to the troubleshooting section or open an issue in the repository.*

*Last updated: December 2024*
