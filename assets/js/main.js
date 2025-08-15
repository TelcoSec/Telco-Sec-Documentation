/**
 * Telco Security Documentation - Main JavaScript
 * Handles general site functionality, animations, and interactions
 */

class TelcoSecuritySite {
    constructor() {
        this.currentCategory = null;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadRecentDocuments();
        this.setupAnimations();
        this.setupCategoryNavigation();
        this.setupMobileMenu();
        this.setupScrollEffects();
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Category card interactions
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    const category = card.querySelector('.card-title').textContent;
                    this.navigateToCategory(category);
                }
            });
        });
        
        // Search input focus effects
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
        }
        
        // Form validation
        this.setupFormValidation();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    /**
     * Load and display recent documents
     */
    loadRecentDocuments() {
        const recentContainer = document.getElementById('recentDocuments');
        if (!recentContainer) return;
        
        // Sample recent documents
        const recentDocs = [
            {
                title: "5G Security Assessment Framework",
                author: "Dr. James Wilson",
                date: "2024-01-20",
                category: "5G Security",
                excerpt: "Comprehensive framework for assessing security posture in 5G networks..."
            },
            {
                title: "IoT Device Security Guidelines",
                author: "Security Standards Committee",
                date: "2024-01-18",
                category: "IoT Security",
                excerpt: "Updated guidelines for securing IoT devices in telecom environments..."
            },
            {
                title: "Cloud Security Compliance Report",
                author: "Cloud Security Alliance",
                date: "2024-01-16",
                category: "Cloud Security",
                excerpt: "Annual report on cloud security compliance in telecommunications..."
            }
        ];
        
        let html = '';
        recentDocs.forEach(doc => {
            html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="document-preview">
                        <h6>${doc.title}</h6>
                        <p><i class="fas fa-user me-1"></i>${doc.author}</p>
                        <p><i class="fas fa-calendar me-1"></i>${doc.date}</p>
                        <p><i class="fas fa-folder me-1"></i>${doc.category}</p>
                        <p class="text-muted">${doc.excerpt}</p>
                        <a href="#" class="btn btn-sm btn-outline-primary">Read More</a>
                    </div>
                </div>
            `;
        });
        
        recentContainer.innerHTML = html;
    }
    
    /**
     * Setup animations and transitions
     */
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.category-card, .document-preview, .result-card').forEach(el => {
            observer.observe(el);
        });
        
        // Hero section animations
        this.animateHeroSection();
    }
    
    /**
     * Animate hero section elements
     */
    animateHeroSection() {
        const heroElements = document.querySelectorAll('.hero-section h1, .hero-section .lead, .hero-section .hero-stats');
        
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    /**
     * Setup category navigation
     */
    setupCategoryNavigation() {
        const categoryLinks = document.querySelectorAll('a[href^="/category/"]');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('href').split('/').pop();
                this.navigateToCategory(category);
            });
        });
    }
    
    /**
     * Navigate to a specific category
     */
    navigateToCategory(category) {
        // In a real implementation, this would navigate to the category page
        console.log(`Navigating to category: ${category}`);
        
        // For demo purposes, show a modal or update the current view
        this.showCategoryModal(category);
    }
    
    /**
     * Show category modal (demo implementation)
     */
    showCategoryModal(category) {
        const modalHtml = `
            <div class="modal fade" id="categoryModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${category} Documents</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>This would display all documents in the ${category} category.</p>
                            <p>In a full implementation, this would fetch and display actual documents.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">View All Documents</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('categoryModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    }
    
    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }
    }
    
    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbar = document.querySelector('.navbar');
            
            if (navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
                
                // Add background when scrolled
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    /**
     * Setup form validation
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Validate form inputs
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearInputError(input);
            }
        });
        
        return isValid;
    }
    
    /**
     * Show input error
     */
    showInputError(input, message) {
        this.clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        input.classList.add('is-invalid');
        input.parentNode.appendChild(errorDiv);
    }
    
    /**
     * Clear input error
     */
    clearInputError(input) {
        input.classList.remove('is-invalid');
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    const modal = bootstrap.Modal.getInstance(openModal);
                    if (modal) {
                        modal.hide();
                    }
                }
            }
        });
    }
    
    /**
     * Show loading state
     */
    showLoading(element) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        element.innerHTML = '<div class="loading"></div>';
        element.disabled = true;
    }
    
    /**
     * Hide loading state
     */
    hideLoading(element, originalText) {
        this.isLoading = false;
        element.innerHTML = originalText;
        element.disabled = false;
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * Export site data
     */
    exportSiteData() {
        const data = {
            title: document.title,
            url: window.location.href,
            categories: this.getCategoriesData(),
            documents: this.getDocumentsData(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'telco-security-docs-export.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Get categories data
     */
    getCategoriesData() {
        const categories = [];
        document.querySelectorAll('.category-card').forEach(card => {
            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('.card-text').textContent;
            const icon = card.querySelector('.category-icon i').className;
            
            categories.push({ title, description, icon });
        });
        
        return categories;
    }
    
    /**
     * Get documents data
     */
    getDocumentsData() {
        // This would return actual document data in a real implementation
        return [];
    }
}

// Initialize the site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.telcoSecuritySite = new TelcoSecuritySite();
    
    // Add some interactive features
    console.log('Telco Security Documentation site initialized');
    
    // Add keyboard shortcut hint
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.setAttribute('placeholder', 'Search for telecom security documents, topics, or keywords... (Ctrl+K)');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelcoSecuritySite;
}
