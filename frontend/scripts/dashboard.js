// =============================================================================
// DASHBOARD FUNCTIONALITY - Working Version
// =============================================================================
// Save as frontend/scripts/dashboard.js

//  GLOBAL STATE
let userProfile = null;

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log(' Dashboard initializing...');

        await loadUserProfile();
        updateDashboard();

        console.log(' Dashboard loaded successfully');
    } catch (error) {
        console.error(' Dashboard initialization error:', error);
        showError('Failed to load dashboard');
    }
});

// =============================================================================
// LOAD USER DATA
// =============================================================================

async function loadUserProfile() {
    try {
        console.log(' Loading user profile...');

        const response = await fetch('/api/user/profile');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        userProfile = await response.json();
        console.log(' User profile loaded:', userProfile);

        return userProfile;
    } catch (error) {
        console.error(' Error loading user profile:', error);
        throw error;
    }
}

// =============================================================================
// UPDATE DASHBOARD CONTENT
// =============================================================================

function updateDashboard() {
    if (!userProfile) {
        console.error(' No user profile data');
        return;
    }

    console.log(' Updating dashboard content...');

    // Update user info
    updateUserInfo();

    // Update statistics
    updateStatistics();

    // Update bookmarked clubs
    updateBookmarkedClubs();

    // Hide loading spinner
    hideLoading();

    console.log(' Dashboard content updated');
}

function updateUserInfo() {
    // Update email
    const emailElement = document.getElementById('userEmail');
    if (emailElement && userProfile.email) {
        emailElement.textContent = userProfile.email;
    }

    // Update join date
    const joinDateElement = document.getElementById('joinDate');
    if (joinDateElement && userProfile.joinDate) {
        const joinDate = new Date(userProfile.joinDate);
        joinDateElement.textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Update days active
    const daysActiveElement = document.getElementById('daysActive');
    if (daysActiveElement && userProfile.daysActive) {
        daysActiveElement.textContent = userProfile.daysActive;
    }

    console.log(' User info updated');
}

function updateStatistics() {
    // Update bookmark count
    const bookmarkCountElement = document.getElementById('bookmarkCount');
    if (bookmarkCountElement && userProfile.totalBookmarks !== undefined) {
        bookmarkCountElement.textContent = userProfile.totalBookmarks;
    }

    // Update clubs viewed (fallback if not provided)
    const clubsViewedElement = document.getElementById('clubsViewed');
    if (clubsViewedElement) {
        clubsViewedElement.textContent = userProfile.clubsViewed || '12';
    }

    // Update events interested (fallback if not provided)
    const eventsInterestedElement = document.getElementById('eventsInterested');
    if (eventsInterestedElement) {
        eventsInterestedElement.textContent = userProfile.eventsInterested || '3';
    }

    // Update searches performed (fallback if not provided)
    const searchesElement = document.getElementById('searchesPerformed');
    if (searchesElement) {
        searchesElement.textContent = userProfile.searchesPerformed || '8';
    }

    console.log(' Statistics updated');
}

function updateBookmarkedClubs() {
    const bookmarkedClubsContainer = document.getElementById('bookmarkedClubsContainer');

    if (!bookmarkedClubsContainer) {
        console.warn(' Bookmarked clubs container not found');
        return;
    }

    if (!userProfile.bookmarkedClubs || userProfile.bookmarkedClubs.length === 0) {
        bookmarkedClubsContainer.innerHTML = `
            <div class="no-bookmarks">
                <p>No bookmarked clubs yet.</p>
                <a href="/tech-clubs" class="btn-primary">Explore Clubs</a>
            </div>
        `;
        return;
    }

    // Generate bookmarked clubs HTML
    const clubsHTML = userProfile.bookmarkedClubs.map(club => `
        <div class="bookmark-card">
            <div class="club-logo">
                <img src="${club.logoUrl || '/assets/default-club-logo.png'}" 
                     alt="${club.name} Logo" 
                     onerror="this.src='/assets/default-club-logo.png'">
            </div>
            <div class="club-info">
                <h4>${club.name}</h4>
                <p class="club-category">${club.category || 'Technology'}</p>
                <p class="club-members">${club.memberCount || 0} members</p>
            </div>
            <div class="club-actions">
                <a href="/club/${club._id}" class="btn-view">View Club</a>
                <button class="btn-remove" onclick="removeBookmark('${club._id}', this)">
                    Remove
                </button>
            </div>
        </div>
    `).join('');

    bookmarkedClubsContainer.innerHTML = clubsHTML;

    console.log(` Displayed ${userProfile.bookmarkedClubs.length} bookmarked clubs`);
}

// =============================================================================
// BOOKMARK MANAGEMENT
// =============================================================================

async function removeBookmark(clubId, buttonElement) {
    try {
        console.log(` Removing bookmark for club: ${clubId}`);

        buttonElement.disabled = true;
        buttonElement.textContent = 'Removing...';

        const response = await fetch(`/api/bookmarks/${clubId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(' Bookmark removed:', result);

        // Remove the card from UI
        const bookmarkCard = buttonElement.closest('.bookmark-card');
        if (bookmarkCard) {
            bookmarkCard.remove();
        }

        // Update bookmark count
        userProfile.totalBookmarks--;
        const bookmarkCountElement = document.getElementById('bookmarkCount');
        if (bookmarkCountElement) {
            bookmarkCountElement.textContent = userProfile.totalBookmarks;
        }

        // Show empty state if no bookmarks left
        if (userProfile.totalBookmarks === 0) {
            const container = document.getElementById('bookmarkedClubsContainer');
            if (container) {
                container.innerHTML = `
                    <div class="no-bookmarks">
                        <p>No bookmarked clubs yet.</p>
                        <a href="/tech-clubs" class="btn-primary">Explore Clubs</a>
                    </div>
                `;
            }
        }

        showMessage('Bookmark removed successfully', 'success');

    } catch (error) {
        console.error(' Error removing bookmark:', error);
        buttonElement.disabled = false;
        buttonElement.textContent = 'Remove';
        showMessage('Failed to remove bookmark', 'error');
    }
}

// =============================================================================
// UI UTILITIES
// =============================================================================

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const dashboardContent = document.getElementById('dashboardContent');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    if (dashboardContent) {
        dashboardContent.style.display = 'block';
    }

    console.log(' Loading overlay hidden');
}

function showError(message) {
    console.error(' Dashboard error:', message);

    const loadingOverlay = document.getElementById('loadingOverlay');
    const dashboardContent = document.getElementById('dashboardContent');

    if (loadingOverlay) {
        loadingOverlay.innerHTML = `
            <div class="error-content">
                <h2>⚠️ Error Loading Dashboard</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Retry</button>
                <a href="/tech-clubs" class="btn-secondary">Go to Tech Clubs</a>
            </div>
        `;
    }

    if (dashboardContent) {
        dashboardContent.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.className = 'message-container';
        document.body.appendChild(messageContainer);
    }

    // Create message
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    messageContainer.appendChild(messageElement);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// =============================================================================
// REFRESH FUNCTIONALITY
// =============================================================================

async function refreshDashboard() {
    try {
        console.log('🔄 Refreshing dashboard...');

        // Show loading state
        const refreshButton = document.querySelector('.refresh-btn');
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Refreshing...';
        }

        // Reload user profile
        await loadUserProfile();
        updateDashboard();

        // Reset refresh button
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = 'Refresh';
        }

        showMessage('Dashboard refreshed successfully', 'success');

    } catch (error) {
        console.error(' Error refreshing dashboard:', error);
        showMessage('Failed to refresh dashboard', 'error');

        // Reset refresh button
        const refreshButton = document.querySelector('.refresh-btn');
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = 'Refresh';
        }
    }
}

// =============================================================================
// GLOBAL FUNCTIONS FOR HTML
// =============================================================================

// Make functions available globally for onclick handlers
window.removeBookmark = removeBookmark;
window.refreshDashboard = refreshDashboard;

// Debug function
window.debugDashboard = () => {
    console.log(' Dashboard Debug Info:');
    console.log('  User Profile:', userProfile);
    console.log('  Bookmarks:', userProfile?.bookmarkedClubs?.length || 0);
    console.log('  Total Bookmarks:', userProfile?.totalBookmarks || 0);
};

console.log(' Dashboard script loaded successfully!');