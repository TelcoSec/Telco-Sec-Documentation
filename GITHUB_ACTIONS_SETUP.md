# 🚀 GitHub Actions Pipeline Setup

## Telco Security Documentation - Automated Deployment

This guide covers setting up the GitHub Actions pipeline to automatically deploy your telecom security documentation site to Cloudflare Pages with D1 database integration.

---

## 📋 Prerequisites

### 1. GitHub Repository
- Repository must be public or have GitHub Actions enabled
- Admin access to repository settings
- Cloudflare Pages project already configured

### 2. Cloudflare Account
- Cloudflare API token with appropriate permissions
- D1 database created (if using database features)
- Pages project configured

---

## 🔧 Required Secrets

### Step 1: Access Repository Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Add Required Secrets

#### **CF_API_TOKEN** (Required)
```
Name: CF_API_TOKEN
Value: Your Cloudflare API token
```
**How to get:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use **Custom token** template
5. Permissions needed:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Workers Scripts** → **Edit**
   - **Zone** → **Zone** → **Read** (if using custom domain)

#### **CF_PAGES_PROJECT_NAME** (Optional)
```
Name: CF_PAGES_PROJECT_NAME
Value: Your Cloudflare Pages project name
```
**Default:** `telco-security-docs`

#### **CF_D1_DATABASE_ID** (Optional - for D1 database)
```
Name: CF_D1_DATABASE_ID
Value: Your D1 database ID
```
**How to get:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Find your database and copy the ID

---

## 🚀 Pipeline Features

### **1. Security & Quality Checks**
- ✅ **Secret Scanning**: Prevents accidental secret exposure
- ✅ **Configuration Validation**: Ensures required files exist
- ✅ **YAML Syntax Check**: Validates configuration files
- ✅ **Security Audit**: Basic security checks

### **2. Build & Test**
- ✅ **Ruby Setup**: Automatic Ruby 3.2.2 installation
- ✅ **Dependency Management**: Bundler and npm support
- ✅ **Jekyll Validation**: Configuration and build verification
- ✅ **Output Testing**: Critical file existence checks
- ✅ **Link Validation**: Basic broken link detection

### **3. Database Integration**
- ✅ **D1 Database Support**: Automatic migration execution
- ✅ **Conditional Execution**: Only runs when database ID is configured
- ✅ **Migration Management**: Applies schema changes automatically

### **4. Deployment**
- ✅ **Cloudflare Pages**: Automatic deployment to Pages
- ✅ **Environment Management**: Production vs. preview deployments
- ✅ **Branch-based Logic**: Main branch → production, others → preview
- ✅ **Deployment Verification**: Post-deployment testing
- ✅ **URL Extraction**: Automatic deployment URL detection

### **5. Performance & SEO Audit**
- ✅ **Lighthouse CI**: Performance, accessibility, best practices, SEO
- ✅ **SEO Validation**: Meta tags, structured data, sitemap
- ✅ **Performance Monitoring**: Core Web Vitals tracking

### **6. Notifications & Reporting**
- ✅ **PR Comments**: Automatic status updates on pull requests
- ✅ **Failure Notifications**: Detailed error reporting
- ✅ **Deployment Summary**: Comprehensive status overview
- ✅ **Artifact Management**: Build output preservation

---

## 🔄 Workflow Triggers

### **Automatic Triggers**
- **Push to main**: Deploys to production
- **Push to develop**: Deploys to preview
- **Pull Request**: Runs checks and preview deployment

### **Manual Triggers**
- **Workflow Dispatch**: Manual deployment with environment selection
- **Force Rebuild**: Clear cache and rebuild option

### **Path-based Triggers**
- **Smart Ignoring**: Skips deployment for documentation changes
- **Content-focused**: Only deploys when source code changes

---

## 📊 Job Dependencies

```
Security → Build → Database → Deploy → Audit → Notify
   ↓         ↓        ↓         ↓        ↓       ↓
  Fast    Medium    Fast     Fast    Slow    Fast
```

### **Job Execution Order**
1. **Security** (Parallel - no dependencies)
2. **Build** (Waits for Security)
3. **Database** (Waits for Build, only on main)
4. **Deploy** (Waits for Build + Database)
5. **Audit** (Waits for Deploy, only on main)
6. **Notify** (Waits for Deploy + Audit, always runs)

---

## 🌐 Environment Configuration

### **Production Environment**
- **Trigger**: Push to main branch
- **URL**: Your custom domain
- **Database**: Full D1 database operations
- **Audit**: Complete performance and SEO audit

### **Preview Environment**
- **Trigger**: Push to other branches, pull requests
- **URL**: Cloudflare Pages preview URL
- **Database**: Limited operations
- **Audit**: Basic validation only

---

## 🔍 Monitoring & Debugging

### **1. Workflow Logs**
- **Access**: Repository → Actions → Workflows
- **Details**: Click on any workflow run
- **Logs**: Expand individual job steps

### **2. Common Issues & Solutions**

#### **Build Failures**
```bash
# Check Ruby version compatibility
bundle exec ruby --version

# Verify Jekyll configuration
bundle exec jekyll doctor

# Test local build
bundle exec jekyll build
```

#### **Deployment Failures**
```bash
# Verify Cloudflare API token
wrangler whoami

# Check project configuration
wrangler pages project list

# Test manual deployment
wrangler pages deploy _site --project-name=your-project
```

#### **Database Issues**
```bash
# Verify D1 database access
wrangler d1 list

# Check database status
wrangler d1 info your-database-id

# Test migrations locally
wrangler d1 execute your-database-id --local --file=./migrations/0000_initial_schema.sql
```

### **3. Performance Monitoring**
- **Lighthouse Reports**: Available in workflow artifacts
- **Build Metrics**: File counts, sizes, timing
- **Deployment Status**: Success/failure rates

---

## 🛠️ Customization

### **1. Environment Variables**
```yaml
env:
  RUBY_VERSION: '3.2.2'        # Ruby version
  BUNDLE_VERSION: '2.4.22'     # Bundler version
  NODE_VERSION: '18'           # Node.js version
  CF_PAGES_PROJECT_NAME: 'your-project-name'
```

### **2. Build Configuration**
```yaml
- name: Build Site
  run: |
    JEKYLL_ENV=production bundle exec jekyll build --verbose
    # Add custom build steps here
```

### **3. Deployment Options**
```yaml
- name: Deploy to Cloudflare Pages
  run: |
    # Custom deployment logic
    wrangler pages deploy _site --project-name=$PROJECT_NAME --branch=$BRANCH
```

### **4. Notification Settings**
```yaml
- name: Custom Notification
  run: |
    # Add Slack, Discord, or email notifications
    curl -X POST $WEBHOOK_URL -d "Deployment completed"
```

---

## 📈 Performance Optimization

### **1. Caching Strategies**
- **Ruby Dependencies**: Bundler cache enabled
- **Node.js Dependencies**: npm cache enabled
- **Build Artifacts**: 7-day retention

### **2. Parallel Execution**
- **Security Checks**: Run independently
- **Build Process**: Optimized dependency installation
- **Database Operations**: Conditional execution

### **3. Resource Management**
- **Runner Selection**: Ubuntu latest for best performance
- **Job Dependencies**: Minimize wait times
- **Artifact Management**: Efficient storage and retrieval

---

## 🔒 Security Considerations

### **1. Secret Management**
- **API Tokens**: Stored as GitHub secrets
- **Database IDs**: Encrypted in workflow
- **Access Control**: Repository-level permissions

### **2. Permission Scoping**
- **Cloudflare API**: Minimal required permissions
- **Repository Access**: Read-only for public repos
- **Workflow Permissions**: Controlled via repository settings

### **3. Audit Trail**
- **Complete Logging**: All actions logged
- **Change Tracking**: Git-based version control
- **Access Monitoring**: GitHub audit logs

---

## 🚨 Troubleshooting

### **Common Error Messages**

#### **"Workflow not found"**
- Ensure workflow file is in `.github/workflows/` directory
- Check file naming and YAML syntax
- Verify GitHub Actions is enabled

#### **"Permission denied"**
- Check repository permissions
- Verify secret names and values
- Ensure API token has correct permissions

#### **"Build failed"**
- Review build logs for specific errors
- Test build locally with same Ruby version
- Check Jekyll configuration and dependencies

#### **"Deployment failed"**
- Verify Cloudflare API token
- Check project name and configuration
- Review Cloudflare Pages settings

### **Debug Mode**
```yaml
# Add to workflow for debugging
- name: Debug Information
  run: |
    echo "Repository: ${{ github.repository }}"
    echo "Branch: ${{ github.ref }}"
    echo "Event: ${{ github.event_name }}"
    echo "Actor: ${{ github.actor }}"
```

---

## 📚 Additional Resources

### **GitHub Actions**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### **Cloudflare**
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database Guide](https://developers.cloudflare.com/d1/)

### **Jekyll**
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll on GitHub Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

---

## 🎉 Next Steps

### **Immediate Actions**
1. **Add Required Secrets** to your repository
2. **Push the Workflow File** to `.github/workflows/`
3. **Test the Pipeline** with a small change
4. **Monitor First Deployment** for any issues

### **Future Enhancements**
1. **Custom Notifications**: Slack, Discord, email
2. **Advanced Testing**: Unit tests, integration tests
3. **Performance Monitoring**: Custom metrics and alerts
4. **Multi-environment**: Staging, testing environments

---

## 📞 Support

### **Getting Help**
- **Workflow Issues**: Check GitHub Actions logs
- **Cloudflare Issues**: Review Cloudflare documentation
- **Jekyll Issues**: Consult Jekyll community

### **Community Resources**
- [GitHub Community](https://github.com/orgs/community/discussions)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Jekyll Talk](https://talk.jekyllrb.com/)

---

*Your telecom security documentation site now has enterprise-grade CI/CD with GitHub Actions! 🚀⚡*

*Last Updated: January 2024*  
*Version: 1.0*  
*Status: Ready for Implementation*
