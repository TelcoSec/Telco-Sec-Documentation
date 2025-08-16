-- Initial D1 Database Schema for Telco Security Documentation
-- Migration: 0000_initial_schema.sql
-- Description: Core tables for telecom security documentation system

-- Users table for authentication and user management
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    organization TEXT,
    expertise_areas TEXT, -- JSON array of expertise areas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT true
);

-- Categories table for organizing documents
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Documents table for storing document metadata
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    abstract TEXT,
    content TEXT,
    file_path TEXT,
    file_size INTEGER,
    file_type TEXT,
    category_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    tags TEXT, -- JSON array of tags
    keywords TEXT, -- JSON array of keywords
    source TEXT,
    license TEXT,
    doi TEXT,
    citation TEXT,
    related_documents TEXT, -- JSON array of related document IDs
    search_keywords TEXT, -- JSON array of search keywords
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'review')),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document versions table for version control
CREATE TABLE document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    file_path TEXT,
    file_size INTEGER,
    file_type TEXT,
    change_log TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(document_id, version_number)
);

-- Comments table for document discussions
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    parent_id TEXT, -- For nested comments
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- User interactions table for tracking user behavior
CREATE TABLE user_interactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    document_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'download', 'like', 'bookmark', 'share')),
    metadata TEXT, -- JSON object for additional data
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Search analytics table for tracking search queries
CREATE TABLE search_analytics (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    user_id TEXT,
    results_count INTEGER,
    clicked_document_id TEXT,
    search_time_ms INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (clicked_document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Tags table for document tagging system
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Document tags junction table
CREATE TABLE document_tags (
    document_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (document_id, tag_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Organizations table for user affiliations
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    industry TEXT,
    size TEXT,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User organizations junction table
CREATE TABLE user_organizations (
    user_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, organization_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- API keys table for external integrations
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    permissions TEXT, -- JSON array of permissions
    last_used DATETIME,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit log table for tracking system changes
CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_values TEXT, -- JSON object of old values
    new_values TEXT, -- JSON object of new values
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_documents_category_id ON documents(category_id);
CREATE INDEX idx_documents_author_id ON documents(author_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_published_at ON documents(published_at);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_title ON documents(title);
CREATE INDEX idx_documents_slug ON documents(slug);

CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_document_id ON user_interactions(document_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);

CREATE INDEX idx_search_analytics_query ON search_analytics(query);
CREATE INDEX idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at);

CREATE INDEX idx_comments_document_id ON comments(document_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Insert default categories
INSERT INTO categories (id, name, slug, description, icon, color, sort_order) VALUES
('cat-001', 'Network Security', 'network-security', 'Network infrastructure security, protocols, and protection mechanisms', 'shield-network', '#0d6efd', 1),
('cat-002', '5G Security', '5g-security', '5G network security, vulnerabilities, and mitigation strategies', '5g', '#198754', 2),
('cat-003', 'IoT Security', 'iot-security', 'Internet of Things security in telecommunications', 'iot', '#fd7e14', 3),
('cat-004', 'Cloud Security', 'cloud-security', 'Cloud-based telecom security and infrastructure protection', 'cloud', '#6f42c1', 4),
('cat-005', 'Mobile Security', 'mobile-security', 'Mobile network and device security', 'mobile', '#e83e8c', 5);

-- Insert default tags
INSERT INTO tags (id, name, slug, description, color) VALUES
('tag-001', 'Network Security', 'network-security', 'Network infrastructure protection', '#0d6efd'),
('tag-002', '5G', '5g', 'Fifth generation mobile networks', '#198754'),
('tag-003', 'IoT', 'iot', 'Internet of Things', '#fd7e14'),
('tag-004', 'Cloud', 'cloud', 'Cloud computing security', '#6f42c1'),
('tag-005', 'Mobile', 'mobile', 'Mobile security', '#e83e8c'),
('tag-006', 'Vulnerabilities', 'vulnerabilities', 'Security vulnerabilities', '#dc3545'),
('tag-007', 'Best Practices', 'best-practices', 'Security best practices', '#20c997'),
('tag-008', 'Compliance', 'compliance', 'Regulatory compliance', '#6c757d'),
('tag-009', 'Threats', 'threats', 'Security threats', '#ffc107'),
('tag-010', 'Mitigation', 'mitigation', 'Threat mitigation strategies', '#17a2b8');
