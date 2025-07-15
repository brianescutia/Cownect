// =============================================================================
// DASHBOARD FUNCTIONALITY
// =============================================================================
// This file loads and displays user profile data on the dashboard page
// Connects to the /api/user/profile endpoint for detailed user information

// 🎯 WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {

    // 🔍 FIND DASHBOARD ELEMENTS
    const loadingOverlay = document.getElementById('loadingOverlay');
    const userEmail = document.getElementById('userEmail');
    const joinDate = document.getElementById('joinDate');
    const bookmarkCount = document.getElementById('bookmarkCount');
    const bookmarkList = document.getElementById('bookmarkList');

    // Stats elements (placeholder for future features)
    const clubsViewed = document.getElementById('clubsViewed');
    const eventsInterested = document.getElementById('eventsInterested');
    const daysActive = document.getElementById('daysActive');
    const searchesPerformed = document.getElementById('searchesPerformed');

    try {
        // 📡 FETCH USER PROFILE DATA
        console.log('Loading user profile data...');
        const response = await fetch('/api/user/profile');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const profileData = await response.json();
        console.log('Profile data loaded:', profileData);

        // 🎨 UPDATE UI WITH PROFILE DATA
        updateProfileInfo(profileData);
        updateBookmarksSection(profileData);
        updateStatsSection(profileData);

        // ✅ HIDE LOADING OVERLAY
        hideLoadingOverlay();

    } catch (error) {
        console.error('Error loading profile:', error);
        showErrorState();
        hideLoadingOverlay();
    }
});

// =============================================================================
// UPDATE PROFILE INFORMATION SECTION
// =============================================================================
function updateProfileInfo(profileData) {
    const userEmail = document.getElementById('userEmail');
    const joinDate = document.getElementById('joinDate');

    // 📧 UPDATE EMAIL DISPLAY
    if (userEmail) {
        userEmail.textContent = profileData.email;
    }

    // 📅 UPDATE JOIN DATE - Format the date nicely
    if (joinDate && profileData.joinDate) {
        const date = new Date(profileData.joinDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        joinDate.textContent = formattedDate;
    }

    console.log('Profile info updated');
}

// =============================================================================
// UPDATE BOOKMARKS SECTION
// =============================================================================
function updateBookmarksSection(profileData) {
    const bookmarkCount = document.getElementById('bookmarkCount');
    const bookmarkList = document.getElementById('bookmarkList');

    // 🔖 UPDATE BOOKMARK COUNT
    if (bookmarkCount) {
        const count = profileData.totalBookmarks || 0;
        bookmarkCount.textContent = count;
    }

    // 📝 UPDATE BOOKMARK LIST
    if (bookmarkList) {
        if (profileData.bookmarkedClubs && profileData.bookmarkedClubs.length > 0) {
            // Show actual bookmarked clubs (Week 4 will implement this)
            displayBookmarkedClubs(profileData.bookmarkedClubs, bookmarkList);
        } else {
            // Show placeholder message
            bookmarkList.innerHTML = `
                <p class="placeholder-text">
                    No bookmarks yet. Start exploring clubs to save your favorites!
                </p>
            `;
        }
    }

    console.log('Bookmarks section updated');
}

// =============================================================================
// UPDATE STATS SECTION
// =============================================================================
function updateStatsSection(profileData) {
    // 📊 CALCULATE DAYS ACTIVE
    const daysActiveElement = document.getElementById('daysActive');
    if (daysActiveElement && profileData.joinDate) {
        const joinDate = new Date(profileData.joinDate);
        const today = new Date();
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysActiveElement.textContent = diffDays;
    }

    // 🔢 PLACEHOLDER STATS (Will be real data in future weeks)
    const clubsViewed = document.getElementById('clubsViewed');
    const eventsInterested = document.getElementById('eventsInterested');
    const searchesPerformed = document.getElementById('searchesPerformed');

    // For now, show placeholder values
    if (clubsViewed) clubsViewed.textContent = '12';
    if (eventsInterested) eventsInterested.textContent = '3';
    if (searchesPerformed) searchesPerformed.textContent = '8';

    console.log('Stats section updated');
}

// =============================================================================
// DISPLAY BOOKMARKED CLUBS (Preview for Week 4)
// =============================================================================
function displayBookmarkedClubs(bookmarkedClubs, container) {
    // 🎴 CREATE MINI CLUB CARDS for bookmarked clubs
    const clubsHTML = bookmarkedClubs.map(club => `
        <div class="mini-club-card">
            <span class="club-icon">${club.icon || '🏛️'}</span>
            <span class="club-name">${club.name}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="bookmark-clubs-grid">
            ${clubsHTML}
        </div>
        <p class="bookmark-note">Click on any club to view details</p>
    `;
}

// =============================================================================
// LOADING AND ERROR STATES
// =============================================================================

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function showErrorState() {
    // 🚨 SHOW ERROR MESSAGE if profile loading fails
    const userEmail = document.getElementById('userEmail');
    const joinDate = document.getElementById('joinDate');

    if (userEmail) userEmail.textContent = 'Error loading profile';
    if (joinDate) joinDate.textContent = 'Unable to load';

    // Show error notification
    showNotification('Failed to load profile data. Please refresh the page.', 'error');
}

// =============================================================================
// NOTIFICATION SYSTEM (Simple version)
// =============================================================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#5F96C5'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// =============================================================================
// HOW THIS WORKS:
// =============================================================================
//
// 1. Page loads → Show loading overlay
// 2. Fetch /api/user/profile → Get detailed user data
// 3. Update each dashboard section with real data:
//    - Profile: email, join date, status
//    - Bookmarks: count and list (placeholder for now)
//    - Stats: calculated days active, placeholder metrics
// 4. Hide loading overlay → Show completed dashboard
//
// ERROR HANDLING:
// - Network errors → Show error state
// - API errors → Display error notification
// - Missing data → Graceful fallbacks
//
// FUTURE ENHANCEMENTS (Week 4+):
// - Real bookmark data from database
// - Activity tracking and analytics
// - Profile editing capabilities
// - Settings and preferences management
//
// =============================================================================