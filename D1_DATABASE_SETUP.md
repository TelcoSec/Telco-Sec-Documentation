# 🗄️ D1 Database Setup Guide

## Telco Security Documentation - D1 Database Integration

This guide covers setting up and using Cloudflare D1 database with your telecom security documentation site for dynamic content management, user interactions, and advanced features.

---

## 📋 Prerequisites

### 1. Cloudflare Account
- [Cloudflare Dashboard](https://dash.cloudflare.com/) access
- Pages project already configured
- Wrangler CLI installed

### 2. Wrangler CLI Installation
```bash
npm install -g wrangler
wrangler login
```

---

## 🚀 D1 Database Setup

### Step 1: Create D1 Database

#### A. Via Wrangler CLI
```bash
# Create the database
wrangler d1 create telco-security-docs

# Output will include database ID and name
# Example: Created database 'telco-security-docs' with ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### B. Via Cloudflare Dashboard
1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Select **D1** from the left sidebar
3. Click **Create database**
4. Name: `telco-security-docs`
5. Note the **Database ID**

### Step 2: Configure Database Binding

#### A. Update `cloudflare.toml`
```toml
# D1 Database Configuration
[[d1_databases]]
  binding = "DB"
  database_name = "telco-security-docs"
  database_id = "your-actual-database-id-here"
  migrations_dir = "migrations"
```

#### B. Replace Placeholder Values
- `your-actual-database-id-here` → Your actual database ID
- Ensure `migrations_dir` points to `migrations`

### Step 3: Run Database Migrations

#### A. Apply Initial Schema
```bash
# Apply the initial migration
wrangler d1 execute telco-security-docs --file=./migrations/0000_initial_schema.sql

# Verify tables were created
wrangler d1 execute telco-security-docs --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### B. Verify Schema
```bash
# Check table structure
wrangler d1 execute telco-security-docs --command="PRAGMA table_info(documents);"
wrangler d1 execute telco-security-docs --command="PRAGMA table_info(categories);"
wrangler d1 execute telco-security-docs --command="PRAGMA table_info(users);"
```

---

## 🔧 Database Schema Overview

### Core Tables

#### 1. **Users Table**
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    organization TEXT,
    expertise_areas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **Categories Table**
```sql
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0
);
```

#### 3. **Documents Table**
```sql
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    abstract TEXT,
    content TEXT,
    category_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    tags TEXT,
    keywords TEXT,
    status TEXT DEFAULT 'published'
);
```

#### 4. **Supporting Tables**
- **Document Versions**: Version control for documents
- **Comments**: User discussions on documents
- **User Interactions**: Track views, downloads, likes
- **Search Analytics**: Monitor search performance
- **Tags**: Document categorization system
- **Organizations**: User affiliations
- **API Keys**: External integrations
- **Audit Log**: System change tracking

---

## 🌐 Edge Functions Setup

### Step 1: Create Functions Directory
```bash
mkdir -p functions/api
```

### Step 2: Deploy Edge Functions
```bash
# Deploy all functions
wrangler pages deploy . --project-name=your-project-name

# Or deploy specific function
wrangler pages deploy functions/api/documents.js --project-name=your-project-name
```

### Step 3: Test API Endpoints

#### A. List Documents
```bash
curl "https://your-domain.pages.dev/api/documents?page=1&limit=10"
```

#### B. Get Specific Document
```bash
curl "https://your-domain.pages.dev/api/documents/document-slug"
```

#### C. Create Document
```bash
curl -X POST "https://your-domain.pages.dev/api/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "5G Network Security Threats",
    "abstract": "Comprehensive analysis of 5G security vulnerabilities",
    "category_id": "cat-002",
    "author_id": "user-001",
    "tags": ["5G", "Security", "Threats"],
    "keywords": ["5G security", "network threats", "vulnerabilities"]
  }'
```

---

## 🔐 Authentication & Security

### Step 1: User Management

#### A. Create Admin User
```sql
INSERT INTO users (id, email, username, full_name, role, organization) 
VALUES (
    'user-001',
    'admin@telcosec.org',
    'admin',
    'System Administrator',
    'admin',
    'Telco Security Community'
);
```

#### B. API Key Management
```sql
INSERT INTO api_keys (id, user_id, name, key_hash, permissions) 
VALUES (
    'key-001',
    'user-001',
    'Admin API Key',
    'hashed-api-key-here',
    '["read", "write", "delete", "admin"]'
);
```

### Step 2: Security Headers
The `cloudflare.toml` includes comprehensive security headers:
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

---

## 📊 Data Management

### Step 1: Sample Data Population

#### A. Insert Categories
```sql
INSERT INTO categories (id, name, slug, description, icon, color, sort_order) VALUES
('cat-001', 'Network Security', 'network-security', 'Network infrastructure security', 'shield-network', '#0d6efd', 1),
('cat-002', '5G Security', '5g-security', '5G network security', '5g', '#198754', 2),
('cat-003', 'IoT Security', 'iot-security', 'IoT security in telecom', 'iot', '#fd7e14', 3);
```

#### B. Insert Sample Documents
```sql
INSERT INTO documents (id, title, slug, abstract, category_id, author_id, status, published_at) VALUES
('doc-001', '5G Network Security Threats', '5g-network-security-threats', 'Analysis of 5G security vulnerabilities', 'cat-002', 'user-001', 'published', CURRENT_TIMESTAMP),
('doc-002', 'IoT Security Best Practices', 'iot-security-best-practices', 'Security guidelines for IoT devices', 'cat-003', 'user-001', 'published', CURRENT_TIMESTAMP);
```

### Step 2: Data Validation
```bash
# Verify data integrity
wrangler d1 execute telco-security-docs --command="
SELECT 
    c.name as category,
    COUNT(d.id) as document_count,
    AVG(d.rating) as avg_rating
FROM categories c
LEFT JOIN documents d ON c.id = d.category_id
GROUP BY c.id, c.name
ORDER BY c.sort_order;
"
```

---

## 🔍 Search & Analytics

### Step 1: Search Implementation

#### A. Full-Text Search
```sql
-- Search documents by title, abstract, or keywords
SELECT d.*, c.name as category_name, u.username as author_name
FROM documents d
JOIN categories c ON d.category_id = c.id
JOIN users u ON d.author_id = u.id
WHERE d.status = 'published'
  AND (d.title LIKE '%search_term%' 
       OR d.abstract LIKE '%search_term%' 
       OR d.keywords LIKE '%search_term%')
ORDER BY d.created_at DESC;
```

#### B. Tag-Based Search
```sql
-- Search by tags
SELECT DISTINCT d.*
FROM documents d
JOIN document_tags dt ON d.id = dt.document_id
JOIN tags t ON dt.tag_id = t.id
WHERE t.name IN ('5G', 'Security', 'Threats')
  AND d.status = 'published';
```

### Step 2: Analytics Tracking

#### A. View Counts
```sql
-- Track document popularity
SELECT 
    d.title,
    d.view_count,
    d.download_count,
    d.rating,
    d.rating_count
FROM documents d
ORDER BY d.view_count DESC
LIMIT 10;
```

#### B. Search Analytics
```sql
-- Monitor search performance
SELECT 
    query,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results,
    AVG(search_time_ms) as avg_search_time
FROM search_analytics
WHERE created_at >= datetime('now', '-30 days')
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;
```

---

## 🚀 Performance Optimization

### Step 1: Database Indexes
The schema includes optimized indexes for:
- **Document lookups**: By slug, category, author
- **Search queries**: Full-text search optimization
- **User interactions**: Fast aggregation queries
- **Analytics**: Time-based queries

### Step 2: Caching Strategy
- **Static Assets**: 1-year cache with ETags
- **API Responses**: No-cache for dynamic content
- **HTML Content**: 1-hour cache for updates
- **Search Results**: Moderate caching with invalidation

### Step 3: Edge Computing
- **Global Distribution**: 200+ data centers
- **Low Latency**: Sub-50ms response times
- **Automatic Scaling**: Handle traffic spikes

---

## 🔧 Development Workflow

### Step 1: Local Development
```bash
# Start local development server
wrangler pages dev . --d1=DB:telco-security-docs

# Test database locally
wrangler d1 execute telco-security-docs --local --command="SELECT * FROM categories;"
```

### Step 2: Testing
```bash
# Test API endpoints locally
curl "http://localhost:8788/api/documents"

# Test database operations
wrangler d1 execute telco-security-docs --local --file=./test_data.sql
```

### Step 3: Deployment
```bash
# Deploy to preview
wrangler pages deploy . --project-name=your-project --branch=feature-branch

# Deploy to production
wrangler pages deploy . --project-name=your-project --branch=main
```

---

## 📈 Monitoring & Maintenance

### Step 1: Database Health Checks
```bash
# Check database size
wrangler d1 execute telco-security-docs --command="PRAGMA page_count; PRAGMA page_size;"

# Check table statistics
wrangler d1 execute telco-security-docs --command="
SELECT 
    name,
    sqlite_compileoption_used('ENABLE_FTS5') as fts5_enabled,
    sqlite_compileoption_used('ENABLE_JSON1') as json1_enabled
FROM sqlite_master 
WHERE type='table';
"
```

### Step 2: Performance Monitoring
- **Query Performance**: Monitor slow queries
- **Index Usage**: Ensure indexes are effective
- **Connection Pooling**: Optimize database connections
- **Cache Hit Rates**: Monitor caching effectiveness

### Step 3: Backup & Recovery
```bash
# Export database
wrangler d1 execute telco-security-docs --command=".dump" > backup.sql

# Import database
wrangler d1 execute telco-security-docs --file=backup.sql
```

---

## 🎯 Advanced Features

### Step 1: Real-time Updates
- **WebSocket Support**: Real-time document updates
- **Push Notifications**: New document alerts
- **Live Collaboration**: Multi-user editing

### Step 2: AI Integration
- **Content Recommendations**: ML-based suggestions
- **Smart Search**: Semantic search capabilities
- **Automated Tagging**: AI-powered categorization

### Step 3: Integration APIs
- **GitHub Integration**: Sync with repositories
- **Slack Notifications**: Team collaboration
- **Analytics Export**: Data export capabilities

---

## 🚨 Troubleshooting

### Common Issues

#### A. Database Connection Errors
```bash
# Check database binding
wrangler d1 list

# Verify database exists
wrangler d1 info telco-security-docs
```

#### B. Migration Failures
```bash
# Check migration status
wrangler d1 migrations list telco-security-docs

# Reset migrations if needed
wrangler d1 migrations apply telco-security-docs --reset
```

#### C. Performance Issues
```bash
# Analyze query performance
wrangler d1 execute telco-security-docs --command="EXPLAIN QUERY PLAN SELECT * FROM documents WHERE category_id = 'cat-001';"

# Check index usage
wrangler d1 execute telco-security-docs --command="PRAGMA index_list(documents);"
```

---

## 📚 Additional Resources

### Documentation
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [D1 SQL Reference](https://developers.cloudflare.com/d1/reference/sql/)
- [Edge Functions Guide](https://developers.cloudflare.com/workers/platform/functions/)

### Tools
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Studio](https://dash.cloudflare.com/d1)
- [Cloudflare Analytics](https://developers.cloudflare.com/analytics/)

### Community
- [Cloudflare Community](https://community.cloudflare.com/)
- [Discord Server](https://discord.gg/cloudflare)
- [GitHub Discussions](https://github.com/cloudflare/workers-sdk/discussions)

---

## 🎉 Next Steps

### Immediate Actions
1. **Set up D1 database** using this guide
2. **Deploy Edge Functions** for API endpoints
3. **Test database operations** with sample data
4. **Configure security** and authentication

### Future Enhancements
1. **User Management System**: Registration, login, profiles
2. **Content Moderation**: Review workflows, approval processes
3. **Advanced Analytics**: User behavior, content performance
4. **Integration APIs**: Third-party service connections

---

## 📞 Support

### Getting Help
- **Documentation Issues**: Check this guide and Cloudflare docs
- **Technical Problems**: Use Cloudflare community forums
- **Feature Requests**: Submit via GitHub issues

### Contact Information
- **Email**: contact@telcosec.org
- **GitHub**: [TelcoSec Organization](https://github.com/TelcoSec)
- **Community**: [Telco Security Forum](https://community.telcosec.org)

---

*Your telecom security documentation site now has enterprise-grade database capabilities with D1! 🚀🗄️*

*Last Updated: January 2024*  
*Version: 1.0*  
*Status: Ready for Implementation*
