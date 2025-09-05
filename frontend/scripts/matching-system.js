// =============================================================================
// ENHANCED STUDENT MATCHING UI
// Add this to your dashboard.js or create a new file: matching-system.js
// =============================================================================

class StudentMatchingSystem {
    constructor() {
        this.matches = [];
        this.filters = {
            lookingFor: '',
            skills: '',
            major: '',
            year: '',
            availability: ''
        };
        this.currentView = 'grid'; // grid or detailed
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Student Matching System');
        await this.loadSmartMatches();
        this.setupEventListeners();
        this.initializeSwipeCards();
    }

    // =============================================================================
    // LOAD MATCHES WITH SMART ALGORITHM
    // =============================================================================

    async loadSmartMatches() {
        try {
            const params = new URLSearchParams(this.filters);
            const response = await fetch(`/api/user/smart-matches?${params}`);

            if (!response.ok) throw new Error('Failed to load matches');

            const data = await response.json();
            this.matches = data.matches;
            this.matchGroups = data.matchGroups;

            this.renderMatches();
            this.updateMatchStats();

        } catch (error) {
            console.error('Error loading matches:', error);
            this.showError('Failed to load potential matches');
        }
    }

    // =============================================================================
    // RENDER MATCHES IN DASHBOARD
    // =============================================================================

    renderMatches() {
        const matchesContainer = document.getElementById('matchesList');
        if (!matchesContainer) return;

        if (this.matches.length === 0) {
            matchesContainer.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Show top 3 matches in dashboard card
        const topMatches = this.matches.slice(0, 3);

        matchesContainer.innerHTML = topMatches.map(match => `
            <div class="enhanced-match-item" data-user-id="${match._id}">
                <div class="match-avatar-container">
                    ${this.getAvatarHTML(match)}
                    <span class="match-score-badge">${match.matchScore}%</span>
                </div>
                
                <div class="match-info-enhanced">
                    <div class="match-header">
                        <h4 class="match-name">${match.displayName}</h4>
                        <span class="match-compatibility">${this.getCompatibilityBadge(match.matchScore)}</span>
                    </div>
                    
                    <div class="match-details">
                        <span class="match-year-major">${match.year || 'Student'} • ${match.major || 'Tech'}</span>
                    </div>
                    
                    <div class="match-reasons">
                        ${this.getTopMatchReasons(match).map(reason =>
            `<span class="reason-pill">✨ ${reason}</span>`
        ).join('')}
                    </div>
                    
                    <div class="match-skills">
                        ${(match.skills || []).slice(0, 3).map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('')}
                    </div>
                    
                    <div class="match-actions">
                        <button class="quick-connect-btn" onclick="matchingSystem.quickConnect('${match._id}')">
                            <svg width="16" height="16" fill="currentColor">
                                <path d="M8 2C4.13 2 1 5.13 1 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm3 8h-2v2H7v-2H5V8h2V6h2v2h2v2z"/>
                            </svg>
                            Connect
                        </button>
                        <button class="view-profile-btn" onclick="matchingSystem.viewProfile('${match._id}')">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Show "View All" button if more than 3 matches
        if (this.matches.length > 3) {
            const viewAllBtn = document.querySelector('.view-all-matches-btn');
            if (viewAllBtn) {
                viewAllBtn.style.display = 'block';
                viewAllBtn.textContent = `View All ${this.matches.length} Matches`;
                viewAllBtn.onclick = () => this.openAdvancedMatchingModal();
            }
        }
    }

    // =============================================================================
    // ADVANCED MATCHING MODAL
    // =============================================================================

    openAdvancedMatchingModal() {
        const modal = document.getElementById('matchingModal') || this.createAdvancedModal();
        modal.style.display = 'flex';
        this.renderAdvancedMatchingView();
    }

    createAdvancedModal() {
        const modal = document.createElement('div');
        modal.id = 'advancedMatchingModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content advanced-matching">
                <div class="modal-header">
                    <h2>🎯 Find Your Perfect Match</h2>
                    <button class="modal-close" onclick="matchingSystem.closeModal()">&times;</button>
                </div>
                
                <div class="matching-tabs">
                    <button class="tab-btn active" data-view="smart">Smart Matches</button>
                    <button class="tab-btn" data-view="swipe">Swipe Mode</button>
                    <button class="tab-btn" data-view="explore">Explore All</button>
                </div>
                
                <div class="modal-body">
                    <div class="advanced-filters">
                        ${this.getAdvancedFiltersHTML()}
                    </div>
                    
                    <div class="match-view-toggle">
                        <button class="view-toggle-btn active" data-view="grid">
                            <svg width="20" height="20"><rect x="2" y="2" width="6" height="6"/><rect x="12" y="2" width="6" height="6"/><rect x="2" y="12" width="6" height="6"/><rect x="12" y="12" width="6" height="6"/></svg>
                        </button>
                        <button class="view-toggle-btn" data-view="list">
                            <svg width="20" height="20"><rect x="2" y="4" width="16" height="3"/><rect x="2" y="10" width="16" height="3"/><rect x="2" y="16" width="16" height="3"/></svg>
                        </button>
                    </div>
                    
                    <div class="matches-container" id="advancedMatchesContainer">
                        <!-- Matches will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    renderAdvancedMatchingView() {
        const container = document.getElementById('advancedMatchesContainer');
        if (!container) return;

        // Group matches by compatibility
        const perfectMatches = this.matchGroups?.perfect || [];
        const greatMatches = this.matchGroups?.great || [];
        const goodMatches = this.matchGroups?.good || [];

        container.innerHTML = `
            ${perfectMatches.length > 0 ? `
                <div class="match-group">
                    <h3 class="group-title">🎯 Perfect Matches (${perfectMatches.length})</h3>
                    <div class="matches-grid">
                        ${perfectMatches.map(m => this.getMatchCard(m, 'perfect')).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${greatMatches.length > 0 ? `
                <div class="match-group">
                    <h3 class="group-title">🌟 Great Matches (${greatMatches.length})</h3>
                    <div class="matches-grid">
                        ${greatMatches.map(m => this.getMatchCard(m, 'great')).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${goodMatches.length > 0 ? `
                <div class="match-group">
                    <h3 class="group-title">👍 Good Matches (${goodMatches.length})</h3>
                    <div class="matches-grid">
                        ${goodMatches.map(m => this.getMatchCard(m, 'good')).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    getMatchCard(match, tier) {
        const tierColors = {
            perfect: '#10B981',
            great: '#3B82F6',
            good: '#8B5CF6'
        };

        return `
            <div class="advanced-match-card ${tier}-tier">
                <div class="match-card-header" style="background: linear-gradient(135deg, ${tierColors[tier]}, ${tierColors[tier]}dd)">
                    <div class="match-score-large">${match.matchScore}%</div>
                    <div class="match-tier-label">${tier} match</div>
                </div>
                
                <div class="match-card-body">
                    ${this.getAvatarHTML(match)}
                    
                    <h4>${match.displayName}</h4>
                    <p class="match-bio">${match.bio || 'Passionate about technology and innovation'}</p>
                    
                    <div class="match-highlights">
                        ${match.matchReasons.slice(0, 2).map(reason =>
            `<div class="highlight">✅ ${reason}</div>`
        ).join('')}
                    </div>
                    
                    <div class="shared-interests">
                        <strong>Shared:</strong>
                        ${match.sharedInterests.slice(0, 3).map(interest =>
            `<span class="interest-tag">${interest}</span>`
        ).join('')}
                    </div>
                    
                    <div class="complementary-skills">
                        <strong>They offer:</strong>
                        ${match.complementarySkills.slice(0, 2).map(skill =>
            `<span class="skill-offer">${skill}</span>`
        ).join('')}
                    </div>
                    
                    <div class="card-actions">
                        <button class="connect-btn" onclick="matchingSystem.sendConnection('${match._id}')">
                            Connect Now
                        </button>
                        <button class="message-btn" onclick="matchingSystem.startChat('${match._id}')">
                            Message
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // =============================================================================
    // SWIPE MODE (Like Tinder for Study Buddies)
    // =============================================================================

    initializeSwipeCards() {
        // This creates a fun swipe interface for quick matching
        this.swipeIndex = 0;
    }

    renderSwipeMode() {
        const container = document.getElementById('advancedMatchesContainer');
        if (!container || this.swipeIndex >= this.matches.length) {
            container.innerHTML = '<p>No more matches to show!</p>';
            return;
        }

        const match = this.matches[this.swipeIndex];

        container.innerHTML = `
            <div class="swipe-card-container">
                <div class="swipe-card" id="currentSwipeCard">
                    <div class="swipe-card-image">
                        ${this.getAvatarHTML(match, 'large')}
                    </div>
                    
                    <div class="swipe-card-content">
                        <h2>${match.displayName}</h2>
                        <p class="swipe-card-subtitle">${match.year} • ${match.major}</p>
                        
                        <div class="swipe-match-score">
                            <div class="score-circle" style="background: conic-gradient(#10B981 ${match.matchScore * 3.6}deg, #e5e7eb 0deg)">
                                <span>${match.matchScore}%</span>
                            </div>
                            <span class="score-label">Match Score</span>
                        </div>
                        
                        <div class="swipe-card-reasons">
                            ${match.matchReasons.map(reason =>
            `<div class="reason-card">
                                    <span class="reason-icon">✨</span>
                                    <span>${reason}</span>
                                </div>`
        ).join('')}
                        </div>
                        
                        <div class="swipe-bio">
                            <h4>About</h4>
                            <p>${match.bio || 'No bio yet'}</p>
                        </div>
                        
                        <div class="swipe-looking-for">
                            <h4>Looking For</h4>
                            <div class="looking-tags">
                                ${(match.lookingFor || []).map(item =>
            `<span class="looking-tag">${this.formatLookingFor(item)}</span>`
        ).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="swipe-actions">
                        <button class="swipe-btn swipe-pass" onclick="matchingSystem.swipeLeft()">
                            <svg width="30" height="30" fill="currentColor">
                                <path d="M18.2 7.8L16.8 6.4 10.4 12.8l6.4 6.4 1.4-1.4-5-5z"/>
                            </svg>
                            Pass
                        </button>
                        <button class="swipe-btn swipe-super" onclick="matchingSystem.superLike()">
                            <svg width="30" height="30" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            Super
                        </button>
                        <button class="swipe-btn swipe-connect" onclick="matchingSystem.swipeRight()">
                            <svg width="30" height="30" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            Connect
                        </button>
                    </div>
                </div>
                
                <div class="swipe-progress">
                    ${this.swipeIndex + 1} / ${this.matches.length}
                </div>
            </div>
        `;
    }

    swipeLeft() {
        this.animateSwipe('left');
        setTimeout(() => {
            this.swipeIndex++;
            this.renderSwipeMode();
        }, 300);
    }

    swipeRight() {
        this.animateSwipe('right');
        this.sendConnection(this.matches[this.swipeIndex]._id);
        setTimeout(() => {
            this.swipeIndex++;
            this.renderSwipeMode();
        }, 300);
    }

    superLike() {
        this.animateSwipe('up');
        this.sendConnection(this.matches[this.swipeIndex]._id, true);
        setTimeout(() => {
            this.swipeIndex++;
            this.renderSwipeMode();
        }, 300);
    }

    animateSwipe(direction) {
        const card = document.getElementById('currentSwipeCard');
        if (!card) return;

        const animations = {
            left: 'translateX(-150%) rotate(-30deg)',
            right: 'translateX(150%) rotate(30deg)',
            up: 'translateY(-150%) rotate(10deg) scale(0.8)'
        };

        card.style.transform = animations[direction];
        card.style.opacity = '0';
    }

    // =============================================================================
    // CONNECTION & MESSAGING
    // =============================================================================

    async sendConnection(userId, superLike = false) {
        try {
            const response = await fetch('/api/user/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUserId: userId,
                    message: superLike ? 'Super interested in connecting!' : 'Would love to connect!',
                    superLike
                })
            });

            if (response.ok) {
                this.showNotification('Connection request sent! 🎉', 'success');
            }
        } catch (error) {
            console.error('Error sending connection:', error);
            this.showNotification('Failed to send connection request', 'error');
        }
    }

    async quickConnect(userId) {
        // Quick connect from dashboard
        await this.sendConnection(userId);
    }

    startChat(userId) {
        // In a real implementation, this would open a chat interface
        alert('Chat feature coming soon! For now, connection request has been sent.');
        this.sendConnection(userId);
    }

    viewProfile(userId) {
        const match = this.matches.find(m => m._id === userId);
        if (!match) return;

        // Open detailed profile view
        this.openProfileModal(match);
    }

    // =============================================================================
    // HELPER METHODS
    // =============================================================================

    getAvatarHTML(match, size = 'normal') {
        const sizeClasses = {
            normal: 'match-avatar',
            large: 'match-avatar-large'
        };

        if (match.profilePictureUrl) {
            return `<img src="${match.profilePictureUrl}" alt="${match.displayName}" class="${sizeClasses[size]}">`;
        }

        const initials = match.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        return `<div class="${sizeClasses[size]} avatar-initials">${initials}</div>`;
    }

    getCompatibilityBadge(score) {
        if (score >= 85) return '🎯 Perfect';
        if (score >= 70) return '🌟 Great';
        if (score >= 50) return '👍 Good';
        return '🔍 Explore';
    }

    getTopMatchReasons(match) {
        return match.matchReasons?.slice(0, 2) || ['Similar interests'];
    }

    formatLookingFor(item) {
        const formatted = item.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        return formatted;
    }

    getAdvancedFiltersHTML() {
        return `
            <div class="filter-row">
                <select id="filterLookingFor" onchange="matchingSystem.applyFilters()">
                    <option value="">All Goals</option>
                    <option value="study-partners">Study Partners</option>
                    <option value="project-collaborators">Project Collaborators</option>
                    <option value="research-partners">Research Partners</option>
                    <option value="hackathon-teammates">Hackathon Teams</option>
                    <option value="mentorship">Mentorship</option>
                </select>
                
                <select id="filterMajor" onchange="matchingSystem.applyFilters()">
                    <option value="">All Majors</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Engineering">Engineering</option>
                </select>
                
                <select id="filterYear" onchange="matchingSystem.applyFilters()">
                    <option value="">All Years</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="graduate">Graduate</option>
                </select>
                
                <select id="filterAvailability" onchange="matchingSystem.applyFilters()">
                    <option value="">Any Availability</option>
                    <option value="very-available">Very Available</option>
                    <option value="moderately-available">Moderately Available</option>
                    <option value="limited-availability">Limited</option>
                </select>
            </div>
        `;
    }

    async applyFilters() {
        this.filters = {
            lookingFor: document.getElementById('filterLookingFor')?.value || '',
            major: document.getElementById('filterMajor')?.value || '',
            year: document.getElementById('filterYear')?.value || '',
            availability: document.getElementById('filterAvailability')?.value || ''
        };

        await this.loadSmartMatches();
        this.renderAdvancedMatchingView();
    }

    updateMatchStats() {
        // Update any stats displays
        const statsEl = document.getElementById('matchStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="stat">
                    <span class="stat-number">${this.matches.length}</span>
                    <span class="stat-label">Total Matches</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${this.matchGroups?.perfect?.length || 0}</span>
                    <span class="stat-label">Perfect Matches</span>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    closeModal() {
        const modal = document.getElementById('advancedMatchingModal');
        if (modal) modal.style.display = 'none';
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelectorAll('.tab-btn').forEach(btn =>
                    btn.classList.remove('active')
                );
                e.target.classList.add('active');

                const view = e.target.dataset.view;
                if (view === 'swipe') {
                    this.swipeIndex = 0;
                    this.renderSwipeMode();
                } else if (view === 'smart') {
                    this.renderAdvancedMatchingView();
                }
            }
        });
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🤝</div>
                <div class="empty-state-text">Complete your profile to find matches</div>
                <div class="empty-state-subtext">Add your skills, interests, and what you're looking for!</div>
            </div>
        `;
    }
}

// Initialize the matching system when dashboard loads
let matchingSystem;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard')) {
        matchingSystem = new StudentMatchingSystem();
        window.matchingSystem = matchingSystem; // Make it globally accessible
    }
});

// =============================================================================
// COURSE-BASED MATCHING & ENHANCED FEATURES
// Add to your matching-system.js or dashboard.js
// =============================================================================

class EnhancedMatchingFeatures {
    constructor() {
        this.notifications = {
            count: 0,
            items: []
        };
        this.courseMatches = [];
        this.recommendations = [];
        this.init();
    }

    async init() {
        await this.loadNotifications();
        await this.loadRecommendations();
        this.setupCourseMatching();
        this.initNotificationBadge();
    }

    // =============================================================================
    // COURSE-BASED STUDY PARTNER FINDER
    // =============================================================================

    setupCourseMatching() {
        // Add course matching section to dashboard
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (!dashboardContainer) return;

        const courseMatchSection = document.createElement('section');
        courseMatchSection.className = 'course-match-card';
        courseMatchSection.innerHTML = `
            <h2>📚 Find Study Partners</h2>
            <div class="course-input-container">
                <input type="text" 
                       id="courseCodesInput" 
                       placeholder="Enter course codes (e.g., ECS50, MAT21C, PHY9A)"
                       class="course-input">
                <button onclick="enhancedMatching.findCoursePartners()" class="find-partners-btn">
                    Find Partners
                </button>
            </div>
            <div id="courseMatchResults" class="course-matches-container">
                <div class="empty-state">
                    <div class="empty-state-icon">📖</div>
                    <div class="empty-state-text">Enter your courses to find study partners</div>
                    <div class="empty-state-subtext">We'll match you with students in the same classes!</div>
                </div>
            </div>
        `;

        // Insert after potential matches card
        const potentialMatchesCard = document.querySelector('.potential-matches-card');
        if (potentialMatchesCard) {
            potentialMatchesCard.parentNode.insertBefore(courseMatchSection, potentialMatchesCard.nextSibling);
        }
    }

    async findCoursePartners() {
        const input = document.getElementById('courseCodesInput');
        const courses = input.value.trim();

        if (!courses) {
            this.showNotification('Please enter at least one course code', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/user/course-matches?courseCodes=${encodeURIComponent(courses)}`);
            const data = await response.json();

            this.courseMatches = data.matches;
            this.renderCourseMatches(data);

        } catch (error) {
            console.error('Error finding course partners:', error);
            this.showNotification('Failed to find course partners', 'error');
        }
    }

    renderCourseMatches(data) {
        const container = document.getElementById('courseMatchResults');
        if (!container) return;

        if (data.matches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">😕</div>
                    <div class="empty-state-text">No matches found for these courses</div>
                    <div class="empty-state-subtext">Try different courses or check back later!</div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="course-matches-header">
                <h3>Study Partners for ${data.courses.join(', ')}</h3>
                <button class="create-group-btn" onclick="enhancedMatching.createStudyGroup()">
                    Create Study Group
                </button>
            </div>
            
            <div class="course-matches-grid">
                ${data.matches.map(match => `
                    <div class="course-match-card" data-user-id="${match._id}">
                        <div class="course-match-header">
                            ${this.getAvatarHTML(match)}
                            <div class="course-match-info">
                                <h4>${match.displayName}</h4>
                                <p>${match.year} • ${match.major}</p>
                            </div>
                            <span class="match-badge">${match.matchScore}%</span>
                        </div>
                        
                        <div class="course-match-reasons">
                            ${match.matchReasons.map(r => `<span class="reason-tag">✓ ${r}</span>`).join('')}
                        </div>
                        
                        <div class="course-match-availability">
                            <span class="availability-indicator ${match.availability}">
                                ${this.formatAvailability(match.availability)}
                            </span>
                        </div>
                        
                        <button class="invite-to-study-btn" onclick="enhancedMatching.inviteToStudy('${match._id}')">
                            Invite to Study
                        </button>
                    </div>
                `).join('')}
            </div>
            
            ${data.studyGroups && data.studyGroups.length > 0 ? `
                <div class="suggested-groups">
                    <h3>💡 Suggested Study Groups</h3>
                    ${data.studyGroups.map(group => `
                        <div class="study-group-card">
                            <div class="group-members">
                                ${group.members.map(m => `
                                    <div class="member-avatar" title="${m.displayName}">
                                        ${this.getMiniAvatar(m)}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="group-info">
                                <p class="group-score">Average Match: ${group.averageScore}%</p>
                                <p class="meeting-time">${group.suggestedMeetingTime}</p>
                            </div>
                            <button class="join-group-btn">Join Group</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    async inviteToStudy(userId) {
        try {
            const response = await fetch('/api/user/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUserId: userId,
                    message: 'Want to study together? I found you through course matching!',
                    type: 'study-invite'
                })
            });

            if (response.ok) {
                this.showNotification('Study invitation sent! 📚', 'success');
                this.animateInviteButton(userId);
            }
        } catch (error) {
            console.error('Error sending study invite:', error);
            this.showNotification('Failed to send invitation', 'error');
        }
    }

    // =============================================================================
    // NOTIFICATION SYSTEM
    // =============================================================================

    async loadNotifications() {
        try {
            const response = await fetch('/api/user/match-notifications');
            const data = await response.json();

            this.notifications = data;
            this.updateNotificationBadge();
            this.renderNotificationDropdown();

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    initNotificationBadge() {
        // Add notification bell to navbar or dashboard
        const navbarRight = document.querySelector('.navbar-right') || document.querySelector('.dashboard-container');
        if (!navbarRight) return;

        const notificationBell = document.createElement('div');
        notificationBell.className = 'notification-bell-container';
        notificationBell.innerHTML = `
            <button class="notification-bell" onclick="enhancedMatching.toggleNotifications()">
                <svg width="24" height="24" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <span class="notification-count" id="notificationCount">0</span>
            </button>
            <div class="notification-dropdown" id="notificationDropdown" style="display: none;">
                <!-- Notifications will be rendered here -->
            </div>
        `;

        navbarRight.appendChild(notificationBell);
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationCount');
        if (!badge) return;

        const totalCount = this.notifications.newMatches +
            this.notifications.messages +
            this.notifications.connectionRequests;

        badge.textContent = totalCount > 99 ? '99+' : totalCount;
        badge.style.display = totalCount > 0 ? 'block' : 'none';

        // Add pulse animation for new notifications
        if (totalCount > 0) {
            badge.classList.add('pulse');
        }
    }

    renderNotificationDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (!dropdown) return;

        dropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button onclick="enhancedMatching.markAllRead()" class="mark-read-btn">
                    Mark all read
                </button>
            </div>
            
            <div class="notification-stats">
                ${this.notifications.newMatches > 0 ? `
                    <div class="stat-item">
                        <span class="stat-icon">🎯</span>
                        <span>${this.notifications.newMatches} new matches</span>
                    </div>
                ` : ''}
                ${this.notifications.mutualInterests > 0 ? `
                    <div class="stat-item">
                        <span class="stat-icon">💘</span>
                        <span>${this.notifications.mutualInterests} mutual interests</span>
                    </div>
                ` : ''}
                ${this.notifications.studyGroupInvites > 0 ? `
                    <div class="stat-item">
                        <span class="stat-icon">📚</span>
                        <span>${this.notifications.studyGroupInvites} study invites</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="notification-list">
                ${this.notifications.recentActivity.map(activity => `
                    <div class="notification-item ${activity.type}">
                        <div class="notification-icon">
                            ${this.getActivityIcon(activity.type)}
                        </div>
                        <div class="notification-content">
                            <p>${activity.message}</p>
                            <span class="notification-time">${activity.time}</span>
                        </div>
                        <button class="notification-action" onclick="enhancedMatching.handleNotificationAction('${activity.type}')">
                            View
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }

    // =============================================================================
    // SMART RECOMMENDATIONS
    // =============================================================================

    async loadRecommendations() {
        try {
            const response = await fetch('/api/user/recommended-connections');
            const data = await response.json();

            this.recommendations = data.recommendations;
            this.renderRecommendations();

        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    renderRecommendations() {
        if (this.recommendations.length === 0) return;

        // Add recommendations section to dashboard
        const container = document.createElement('section');
        container.className = 'recommendations-card';
        container.innerHTML = `
            <h2>🎯 Recommended Connections</h2>
            <p class="recommendations-subtitle">Based on your clubs and events</p>
            
            <div class="recommendations-carousel">
                ${this.recommendations.slice(0, 5).map(rec => `
                    <div class="recommendation-card">
                        ${this.getAvatarHTML(rec)}
                        <h4>${rec.displayName}</h4>
                        <p class="rec-details">${rec.year} • ${rec.major}</p>
                        
                        <div class="rec-reasons">
                            ${rec.recommendationReasons.slice(0, 2).map(reason =>
            `<span class="rec-reason">🔗 ${reason}</span>`
        ).join('')}
                        </div>
                        
                        <div class="rec-score">
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${rec.relevanceScore}%"></div>
                            </div>
                            <span>${rec.relevanceScore}% relevant</span>
                        </div>
                        
                        <button class="quick-connect" onclick="enhancedMatching.connectFromRecommendation('${rec._id}')">
                            Connect
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        const dashboard = document.querySelector('.dashboard-container');
        if (dashboard) {
            dashboard.appendChild(container);
        }
    }

    // =============================================================================
    // ICEBREAKER MESSAGES
    // =============================================================================

    async showIcebreakers(targetUserId) {
        try {
            const response = await fetch(`/api/user/icebreakers/${targetUserId}`);
            const data = await response.json();

            this.openIcebreakerModal(data);

        } catch (error) {
            console.error('Error loading icebreakers:', error);
        }
    }

    openIcebreakerModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content icebreaker-modal">
                <div class="modal-header">
                    <h3>💬 Start a Conversation with ${data.targetUser.name}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <p class="icebreaker-subtitle">Choose an icebreaker or write your own message:</p>
                    
                    <div class="icebreaker-suggestions">
                        ${data.icebreakers.map((text, i) => `
                            <div class="icebreaker-option" onclick="enhancedMatching.selectIcebreaker(${i})">
                                <p>${text}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="custom-message">
                        <textarea id="customMessage" placeholder="Or write your own message..."></textarea>
                    </div>
                    
                    <button class="send-message-btn" onclick="enhancedMatching.sendMessage()">
                        Send Message
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    selectIcebreaker(index) {
        const options = document.querySelectorAll('.icebreaker-option');
        const textarea = document.getElementById('customMessage');

        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');

        textarea.value = options[index].textContent.trim();
    }

    // =============================================================================
    // HELPER METHODS
    // =============================================================================

    getAvatarHTML(user) {
        if (user.profilePictureUrl) {
            return `<img src="${user.profilePictureUrl}" alt="${user.displayName}" class="user-avatar">`;
        }

        const initials = (user.displayName || 'UC').split(' ').map(n => n[0]).join('').substring(0, 2);
        return `<div class="user-avatar avatar-initials">${initials}</div>`;
    }

    getMiniAvatar(user) {
        const initials = (user.displayName || 'UC').substring(0, 2);
        return `<span>${initials}</span>`;
    }

    formatAvailability(availability) {
        const labels = {
            'very-available': '🟢 Very Available',
            'moderately-available': '🟡 Moderate',
            'limited-availability': '🟠 Limited',
            'busy': '🔴 Busy'
        };
        return labels[availability] || '⚫ Unknown';
    }

    getActivityIcon(type) {
        const icons = {
            'mutual-match': '💘',
            'study-group': '📚',
            'connection': '🤝',
            'message': '💬',
            'event': '📅'
        };
        return icons[type] || '🔔';
    }

    animateInviteButton(userId) {
        const btn = document.querySelector(`[data-user-id="${userId}"] .invite-to-study-btn`);
        if (btn) {
            btn.textContent = 'Invited! ✓';
            btn.disabled = true;
            btn.style.background = '#10B981';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize enhanced features
let enhancedMatching;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard')) {
        enhancedMatching = new EnhancedMatchingFeatures();
        window.enhancedMatching = enhancedMatching;
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
`;
document.head.appendChild(style);