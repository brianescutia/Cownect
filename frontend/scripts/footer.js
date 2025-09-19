// =============================================================================
// COWNECT FOOTER COMPONENT - DYNAMIC JAVASCRIPT
// =============================================================================

class CownectFooter {
    constructor() {
        this.footer = null;
        this.newsletterForm = null;
        this.statsAnimated = false;
        this.isVisible = false;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createFooter();
        this.setupEventListeners();
        this.updateCurrentYear();
        this.setupIntersectionObserver();
        this.loadFooterStats();
        console.log('✅ Cownect Footer initialized');
    }

    createFooter() {
        // Check if footer already exists
        if (document.getElementById('cownectFooter')) {
            this.footer = document.getElementById('cownectFooter');
            return;
        }

        // Create footer element from template
        const footerHTML = this.getFooterHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = footerHTML;
        this.footer = tempDiv.firstElementChild;

        // Append to body
        document.body.appendChild(this.footer);
    }

    setupEventListeners() {
        // Newsletter form submission
        this.newsletterForm = document.getElementById('newsletterForm');
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission();
            });
        }

        // Social link tracking (optional analytics)
        const socialLinks = document.querySelectorAll('.footer-social .social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(link);
                this.trackSocialClick(platform);
            });
        });

        // Footer link tracking
        const footerLinks = document.querySelectorAll('.footer-section a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackFooterLinkClick(link.textContent, link.href);
            });
        });
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.animateFooterEntry();
                    this.animateStats();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.footer);
    }

    animateFooterEntry() {
        this.footer.classList.add('animate-in');
    }

    animateStats() {
        if (this.statsAnimated) return;

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            this.animateNumber(stat, target);
        });

        this.statsAnimated = true;
    }

    animateNumber(element, target) {
        element.classList.add('counting');

        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    async handleNewsletterSubmission() {
        const emailInput = document.getElementById('newsletterEmail');
        const submitBtn = this.newsletterForm.querySelector('.newsletter-btn');
        const email = emailInput.value.trim();

        // Validate UC Davis email
        if (!this.isValidUCDavisEmail(email)) {
            this.showNewsletterMessage('Please use your UC Davis email address', 'error');
            return;
        }

        // Show loading state
        this.setNewsletterLoading(true);

        try {
            // Simulate API call (replace with actual endpoint)
            const response = await this.submitNewsletterSubscription(email);

            if (response.success) {
                this.showNewsletterMessage('Successfully subscribed! Welcome to Cownect updates.', 'success');
                emailInput.value = '';
                this.trackNewsletterSignup(email);
            } else {
                throw new Error(response.message || 'Subscription failed');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNewsletterMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            this.setNewsletterLoading(false);
        }
    }

    isValidUCDavisEmail(email) {
        const ucdavisPattern = /^[a-zA-Z0-9._%+-]+@(ucdavis\.edu|.*\.ucdavis\.edu)$/;
        return ucdavisPattern.test(email);
    }

    setNewsletterLoading(loading) {
        const submitBtn = document.querySelector('.newsletter-btn');
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    showNewsletterMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.newsletter-success, .newsletter-error');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-${type}`;
        messageEl.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                ${type === 'success'
                ? '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
            }
            </svg>
            <span>${message}</span>
        `;

        // Insert after form
        this.newsletterForm.insertAdjacentElement('afterend', messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    async submitNewsletterSubscription(email) {
        // Replace this with your actual API endpoint
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async loadFooterStats() {
        try {
            // Replace with actual API endpoint
            const response = await fetch('/api/stats/footer');
            if (response.ok) {
                const stats = await response.json();
                this.updateStats(stats);
            }
        } catch (error) {
            console.log('📊 Using default footer stats');
            // Keep default values if API fails
        }
    }

    updateStats(stats) {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (stats.clubs && statNumbers[0]) {
            statNumbers[0].setAttribute('data-target', stats.clubs);
        }
        if (stats.students && statNumbers[1]) {
            statNumbers[1].setAttribute('data-target', stats.students);
        }
    }

    getSocialPlatform(link) {
        const href = link.getAttribute('href') || '';
        if (href.includes('instagram')) return 'instagram';
        if (href.includes('discord')) return 'discord';
        if (href.includes('linkedin')) return 'linkedin';
        if (href.includes('github')) return 'github';
        return 'unknown';
    }

    // Analytics tracking methods (optional)
    trackSocialClick(platform) {
        console.log(`📱 Social click: ${platform}`);
        // Add your analytics tracking here
        // Example: gtag('event', 'social_click', { platform });
    }

    trackFooterLinkClick(linkText, href) {
        console.log(`🔗 Footer link click: ${linkText} -> ${href}`);
        // Add your analytics tracking here
    }

    trackNewsletterSignup(email) {
        console.log(`📧 Newsletter signup: ${email}`);
        // Add your analytics tracking here
    }

    // Public methods for external control
    show() {
        this.footer.style.display = 'block';
    }

    hide() {
        this.footer.style.display = 'none';
    }

    destroy() {
        if (this.footer && this.footer.parentNode) {
            this.footer.parentNode.removeChild(this.footer);
        }
    }

    getFooterHTML() {
        // Return the footer HTML (you can import this from the HTML artifact)
        return `
            <footer class="cownect-footer" id="cownectFooter">
                <div class="footer-container">
                    <div class="footer-top">
                        <div class="footer-brand">
                            <div class="footer-logo">
                                <img src="../assets/cowLogo.png" alt="Cownect Logo" class="footer-logo-img">
                                <span class="footer-brand-name">Cownect</span>
                            </div>
                            <p class="footer-description">
                                Connecting UC Davis students through technology, innovation, and shared passions. 
                                Discover clubs, events, and career paths that match your interests.
                            </p>
                            <div class="footer-social">
                                <a href="#" class="social-link" aria-label="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                                <a href="#" class="social-link" aria-label="Discord">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                    </svg>
                                </a>
                                <a href="#" class="social-link" aria-label="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" class="social-link" aria-label="GitHub">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div class="footer-nav">
                            <div class="footer-section">
                                <h4>Features</h4>
                                <ul>
                                    <li><a href="/tech-clubs">Tech Clubs</a></li>
                                    <li><a href="/events">Events</a></li>
                                    <li><a href="/niche-test">Niche Test</a></li>
                                    <li><a href="/mentor-matching">Mentor Matching</a></li>
                                </ul>
                            </div>

                            <div class="footer-section">
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="https://ucdavis.edu">About</a></li>
                                    <li><a href="https://ucdavis.edu">Contact</a></li>
                                    <li><a href="https://ucdavis.edu">Feedback Form</a></li>
                                    <li><a href="https://ucdavis.edu">Careers</a></li>
                                </ul>
                            </div>

                            <div class="footer-section">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="https://ucdavis.edu">Help Center</a></li>
                                    <li><a href="https://ucdavis.edu">Privacy Policy</a></li>
                                    <li><a href="https://ucdavis.edu">Terms of Service</a></li>
                                    <li><a href="https://ucdavis.edu">Support</a></li>
                                </ul>
                            </div>

                            <div class="footer-section">
                                <h4>UC Davis</h4>
                                <ul>
                                    <li><a href="https://ucdavis.edu" target="_blank">UC Davis Website</a></li>
                                    <li><a href="https://aggielife.ucdavis.edu" target="_blank">Aggie Life</a></li>
                                    <li><a href="https://engineering.ucdavis.edu" target="_blank">College of Engineering</a></li>
                                    <li><a href="https://cs.ucdavis.edu" target="_blank">Computer Science</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="footer-newsletter">
                            <h4>Stay Connected</h4>
                            <p>Get updates on new clubs, events, and features</p>
                            <form class="newsletter-form" id="newsletterForm">
                                <div class="newsletter-input-group">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your UC Davis email" 
                                        required 
                                        id="newsletterEmail"
                                        pattern=".*@(ucdavis\\.edu|.*\\.ucdavis\\.edu)"
                                        title="Please use your UC Davis email address"
                                    >
                                    <button type="submit" class="newsletter-btn">
                                        <span class="btn-text">Subscribe</span>
                                        <span class="btn-loading" style="display: none;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <circle cx="12" cy="12" r="10"/>
                                                <path d="m9 12 2 2 4-4"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <small class="newsletter-note">We respect your privacy. Unsubscribe anytime.</small>
                            </form>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <p class="copyright">
                                © <span id="currentYear">2025</span> Cownect. All rights reserved.
                            </p>
                            <div class="footer-bottom-links">
                                <a href="https://ucdavis.edu">Privacy</a>
                                <a href="https://ucdavis.edu">Terms</a>
                                <a href="https://ucdavis.edu">Cookies</a>
                            </div>
                            <div class="footer-stats" id="footerStats">
                                <span class="stat-item">                        
                                </span>
                                <span class="stat-item">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Initialize footer when DOM is ready
if (typeof window !== 'undefined') {
    window.CownectFooter = CownectFooter;

    // Auto-initialize on pages that should have footer
    document.addEventListener('DOMContentLoaded', () => {
        // Check if current page should have footer
        const currentPath = window.location.pathname;
        const excludePaths = ['/niche-test', '/quiz', '/test']; // Add paths where footer should be hidden

        const shouldShowFooter = !excludePaths.some(path => currentPath.includes(path));

        if (shouldShowFooter) {
            window.footerInstance = new CownectFooter();
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CownectFooter;
}