// =============================================================================
// UPDATED DASHBOARD FUNCTIONALITY - Now with Real Bookmarks
// =============================================================================

// 🎯 GLOBAL STATE: Store dashboard data
let dashboardData = null;

// 🎯 WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {

    // 🔍 FIND DASHBOARD ELEMENTS
    const loadingOverlay = document.getElementById('loadingOverlay');

    try {
        // 📡 FETCH USER PROFILE DATA
        console.log('Loading user profile data...');
        await loadDashboardData();

        // ✅ HIDE LOADING OVERLAY
        hideLoadingOverlay();

    } catch (error) {
        console.error('Error loading profile:', error);
        showErrorState();
        hideLoadingOverlay();
    }
});

// 📡 FUNCTION: Load dashboard data from API
async function loadDashboardData() {
    const response = await fetch('/api/user/profile');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    dashboardData = await response.json();
    console.log('Profile data loaded:', dashboardData);

    // 🎨 UPDATE ALL DASHBOARD SECTIONS
    updateProfileInfo(dashboardData);
    updateBookmarksSection(dashboardData);
    updateStatsSection(dashboardData);
}

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
// UPDATE BOOKMARKS SECTION - NOW WITH REAL DATA!
// =============================================================================
function updateBookmarksSection(profileData) {
    const bookmarkCount = document.getElementById('bookmarkCount');
    const bookmarkList = document.getElementById('bookmarkList');

    // 🔖 UPDATE BOOKMARK COUNT
    if (bookmarkCount) {
        const count = profileData.totalBookmarks || 0;
        bookmarkCount.textContent = count;
        console.log(`📊 Updated bookmark count to: ${count}`);
    }

    // 📝 UPDATE BOOKMARK LIST
    if (bookmarkList) {
        if (profileData.bookmarkedClubs && profileData.bookmarkedClubs.length > 0) {
            // Show actual bookmarked clubs
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

    console.log('Bookmarks section updated with real data');
}

// =============================================================================
// DISPLAY BOOKMARKED CLUBS
// =============================================================================
function displayBookmarkedClubs(bookmarkedClubs, container) {
    // 🎴 CREATE MINI CLUB CARDS for bookmarked clubs
    const clubsHTML = bookmarkedClubs.map(club => `
        <div class="mini-club-card" onclick="goToClub('${club._id}')">
            <div class="mini-club-info">
                <img src="${club.logoUrl}" alt="${club.name}" class="mini-club-logo" />
                <div class="mini-club-details">
                    <span class="mini-club-name">${club.name}</span>
                    <span class="mini-club-category">${club.category}</span>
                </div>
            </div>
            <div class="mini-club-tags">
                ${club.tags.slice(0, 2).map(tag => `<span class="mini-tag">#${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="bookmark-clubs-grid">
            ${clubsHTML}
        </div>
        <div class="bookmark-actions">
            <a href="/tech-clubs" class="view-all-btn">View All Clubs</a>
        </div>
    `;
}

// =============================================================================
// UPDATE STATS SECTION
// =============================================================================
function updateStatsSection(profileData) {
    // 📊 UPDATE DAYS ACTIVE (now calculated from server)
    const daysActiveElement = document.getElementById('daysActive');
    if (daysActiveElement && profileData.daysActive) {
        daysActiveElement.textContent = profileData.daysActive;
    }

    // 🔢 UPDATE OTHER STATS
    const clubsViewed = document.getElementById('clubsViewed');
    const eventsInterested = document.getElementById('eventsInterested');
    const searchesPerformed = document.getElementById('searchesPerformed');

    if (clubsViewed) clubsViewed.textContent = profileData.clubsViewed || '12';
    if (eventsInterested) eventsInterested.textContent = profileData.eventsInterested || '3';
    if (searchesPerformed) searchesPerformed.textContent = profileData.searchesPerformed || '8';

    console.log('Stats section updated');
}

// =============================================================================
// REAL-TIME BOOKMARK UPDATES
// =============================================================================

// 🔄 FUNCTION: Refresh bookmark data (called when bookmarks change)
async function refreshBookmarkData() {
    try {
        console.log('🔄 Refreshing bookmark data...');
        await loadDashboardData();
        console.log('✅ Bookmark data refreshed');
    } catch (error) {
        console.error('💥 Error refreshing bookmark data:', error);
    }
}

// 🎯 FUNCTION: Handle navigation to club details
function goToClub(clubId) {
    // For now, just go to tech-clubs page
    // Later we could add a specific club detail page
    window.location.href = '/tech-clubs';
}

// =============================================================================
// LISTEN FOR BOOKMARK CHANGES
// =============================================================================
// Listen for custom events from bookmark system
document.addEventListener('bookmarkChanged', () => {
    console.log('📡 Bookmark change detected, refreshing dashboard...');
    refreshBookmarkData();
});

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
    const userEmail = document.getElementById('userEmail');
    const joinDate = document.getElementById('joinDate');

    if (userEmail) userEmail.textContent = 'Error loading profile';
    if (joinDate) joinDate.textContent = 'Unable to load';

    showNotification('Failed to load profile data. Please refresh the page.', 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

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

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// 🌐 GLOBAL FUNCTIONS (for external access)
window.refreshBookmarkData = refreshBookmarkData;
window.goToClub = goToClub;