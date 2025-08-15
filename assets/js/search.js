/**
 * Telco Security Documentation - Search Functionality
 * Provides full-text search across all documents with filtering and highlighting
 */

class DocumentSearch {
    constructor() {
        this.documents = [];
        this.searchIndex = null;
        this.currentResults = [];
        this.searchTimeout = null;
        
        this.init();
    }
    
    init() {
        this.loadDocuments();
        this.setupEventListeners();
        this.setupSearchIndex();
    }
    
    /**
     * Load documents from the data source
     */
    async loadDocuments() {
        try {
            // In a real implementation, this would fetch from an API or data file
            // For now, we'll use sample data
            this.documents = this.getSampleDocuments();
            console.log(`Loaded ${this.documents.length} documents`);
        } catch (error) {
            console.error('Error loading documents:', error);
            this.showError('Failed to load documents. Please try again later.');
        }
    }
    
    /**
     * Setup search index using simple text indexing
     */
    setupSearchIndex() {
        this.searchIndex = {};
        
        this.documents.forEach((doc, index) => {
            // Index by title
            this.indexText(doc.title, index, 'title');
            
            // Index by abstract
            if (doc.abstract) {
                this.indexText(doc.abstract, index, 'abstract');
            }
            
            // Index by tags
            if (doc.tags && Array.isArray(doc.tags)) {
                doc.tags.forEach(tag => {
                    this.indexText(tag, index, 'tags');
                });
            }
            
            // Index by author
            if (doc.author) {
                this.indexText(doc.author, index, 'author');
            }
        });
    }
    
    /**
     * Index text for search
     */
    indexText(text, docIndex, field) {
        if (!text) return;
        
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 2) { // Only index words longer than 2 characters
                if (!this.searchIndex[cleanWord]) {
                    this.searchIndex[cleanWord] = [];
                }
                this.searchIndex[cleanWord].push({ docIndex, field });
            }
        });
    }
    
    /**
     * Setup event listeners for search functionality
     */
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const categoryFilter = document.getElementById('categoryFilter');
        const dateFilter = document.getElementById('dateFilter');
        const typeFilter = document.getElementById('typeFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.performSearch();
            });
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.performSearch();
            });
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.performSearch();
            });
        }
    }
    
    /**
     * Handle search input with debouncing
     */
    handleSearchInput(query) {
        clearTimeout(this.searchTimeout);
        
        if (query.length === 0) {
            this.hideSearchResults();
            return;
        }
        
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }
    
    /**
     * Perform the search operation
     */
    performSearch() {
        const query = document.getElementById('searchInput')?.value || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const date = document.getElementById('dateFilter')?.value || '';
        const type = document.getElementById('typeFilter')?.value || '';
        
        if (query.length === 0 && !category && !date && !type) {
            this.hideSearchResults();
            return;
        }
        
        const results = this.search(query, category, date, type);
        this.displaySearchResults(results, query);
    }
    
    /**
     * Execute search with filters
     */
    search(query, category = '', date = '', type = '') {
        let results = [];
        
        if (query.length > 0) {
            results = this.textSearch(query);
        } else {
            results = this.documents.map((doc, index) => ({ docIndex: index, score: 1 }));
        }
        
        // Apply filters
        results = this.applyFilters(results, category, date, type);
        
        // Sort by relevance score
        results.sort((a, b) => b.score - a.score);
        
        return results;
    }
    
    /**
     * Perform text-based search
     */
    textSearch(query) {
        const queryWords = query.toLowerCase().split(/\s+/);
        const results = new Map();
        
        queryWords.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 2 && this.searchIndex[cleanWord]) {
                this.searchIndex[cleanWord].forEach(({ docIndex, field }) => {
                    if (!results.has(docIndex)) {
                        results.set(docIndex, { docIndex, score: 0, matches: [] });
                    }
                    
                    const result = results.get(docIndex);
                    result.score += this.getFieldWeight(field);
                    result.matches.push({ field, word: cleanWord });
                });
            }
        });
        
        return Array.from(results.values());
    }
    
    /**
     * Get weight for different fields
     */
    getFieldWeight(field) {
        const weights = {
            title: 10,
            abstract: 5,
            tags: 3,
            author: 2
        };
        return weights[field] || 1;
    }
    
    /**
     * Apply filters to search results
     */
    applyFilters(results, category, date, type) {
        return results.filter(result => {
            const doc = this.documents[result.docIndex];
            
            if (category && doc.category !== category) {
                return false;
            }
            
            if (date && doc.date && !doc.date.includes(date)) {
                return false;
            }
            
            if (type && doc.type !== type) {
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Display search results
     */
    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (!searchResults || !resultsContainer) return;
        
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }
        
        searchResults.style.display = 'block';
        
        let html = `
            <div class="row mb-3">
                <div class="col-12">
                    <p class="text-muted">Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</p>
                </div>
            </div>
        `;
        
        results.forEach(result => {
            const doc = this.documents[result.docIndex];
            html += this.createResultCard(doc, result, query);
        });
        
        resultsContainer.innerHTML = html;
        
        // Scroll to results
        searchResults.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Create a result card for display
     */
    createResultCard(doc, result, query) {
        const highlightedTitle = this.highlightText(doc.title, query);
        const highlightedAbstract = doc.abstract ? this.highlightText(doc.abstract, query) : '';
        
        return `
            <div class="col-12 mb-3">
                <div class="result-card">
                    <h5 class="result-title">
                        <a href="${doc.url || '#'}" target="_blank">${highlightedTitle}</a>
                    </h5>
                    <div class="result-meta">
                        <span class="me-3"><i class="fas fa-user me-1"></i>${doc.author || 'Unknown'}</span>
                        <span class="me-3"><i class="fas fa-calendar me-1"></i>${doc.date || 'Unknown'}</span>
                        <span class="me-3"><i class="fas fa-folder me-1"></i>${doc.category || 'Uncategorized'}</span>
                        <span class="me-3"><i class="fas fa-file me-1"></i>${doc.type || 'Document'}</span>
                        ${result.score > 1 ? `<span class="badge bg-success">Relevance: ${Math.round(result.score)}</span>` : ''}
                    </div>
                    ${highlightedAbstract ? `<p class="result-excerpt">${highlightedAbstract}</p>` : ''}
                    ${doc.tags && doc.tags.length > 0 ? `
                        <div class="tags mt-2">
                            ${doc.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Highlight search terms in text
     */
    highlightText(text, query) {
        if (!text || !query) return text;
        
        const queryWords = query.toLowerCase().split(/\s+/);
        let highlightedText = text;
        
        queryWords.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 2) {
                const regex = new RegExp(`(${cleanWord})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
            }
        });
        
        return highlightedText;
    }
    
    /**
     * Show no results message
     */
    showNoResults(query) {
        const searchResults = document.getElementById('searchResults');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (!searchResults || !resultsContainer) return;
        
        searchResults.style.display = 'block';
        
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No results found</h4>
                    <p class="text-muted">No documents match your search for "${query}"</p>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary me-2" onclick="documentSearch.clearSearch()">Clear Search</button>
                        <button class="btn btn-primary" onclick="documentSearch.showSearchTips()">Search Tips</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Hide search results
     */
    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
    
    /**
     * Clear search
     */
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const dateFilter = document.getElementById('dateFilter');
        const typeFilter = document.getElementById('typeFilter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (dateFilter) dateFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        
        this.hideSearchResults();
    }
    
    /**
     * Show search tips
     */
    showSearchTips() {
        const tips = [
            'Try using broader terms',
            'Check spelling',
            'Use fewer words',
            'Try different categories',
            'Use specific technology names (e.g., "5G", "IoT")',
            'Include vendor names if searching for specific equipment'
        ];
        
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-lightbulb me-2"></i>Search Tips</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0">
                                ${tips.map(tip => `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Show error message
     */
    showError(message) {
        const searchResults = document.getElementById('searchResults');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (!searchResults || !resultsContainer) return;
        
        searchResults.style.display = 'block';
        
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                </div>
            </div>
        `;
    }
    
    /**
     * Get sample documents for demonstration
     */
    getSampleDocuments() {
        return [
            {
                title: "5G Network Security: Threats and Mitigations",
                author: "Dr. Sarah Chen",
                date: "2024-01-15",
                category: "5g-security",
                type: "research",
                tags: ["5G", "Network Security", "Threats", "Mitigation"],
                abstract: "Comprehensive analysis of security threats in 5G networks and effective mitigation strategies for telecom operators.",
                url: "#"
            },
            {
                title: "IoT Security in Telecom Environments",
                author: "Prof. Michael Rodriguez",
                date: "2024-01-10",
                category: "iot-security",
                type: "whitepaper",
                tags: ["IoT", "Device Security", "Telecom", "Vulnerabilities"],
                abstract: "Security challenges and solutions for Internet of Things devices deployed in telecommunications infrastructure.",
                url: "#"
            },
            {
                title: "Cloud Security Best Practices for Telecom",
                author: "Lisa Thompson",
                date: "2024-01-08",
                category: "cloud-security",
                type: "guideline",
                tags: ["Cloud Security", "Best Practices", "Telecom", "Multi-cloud"],
                abstract: "Essential security practices for implementing cloud infrastructure in telecommunications services.",
                url: "#"
            },
            {
                title: "Network Security Incident Response Framework",
                author: "Security Team Alpha",
                date: "2024-01-05",
                category: "incident-response",
                type: "framework",
                tags: ["Incident Response", "Network Security", "Framework", "Telecom"],
                abstract: "Comprehensive framework for responding to security incidents in telecommunications networks.",
                url: "#"
            },
            {
                title: "Threat Intelligence Sharing in Telecom Sector",
                author: "Global Telecom Security Alliance",
                date: "2024-01-03",
                category: "threat-intelligence",
                type: "report",
                tags: ["Threat Intelligence", "Information Sharing", "Telecom", "Collaboration"],
                abstract: "Analysis of threat intelligence sharing practices and recommendations for the telecommunications sector.",
                url: "#"
            }
        ];
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.documentSearch = new DocumentSearch();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentSearch;
}
