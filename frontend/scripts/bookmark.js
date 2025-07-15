// =============================================================================
// FUNCTIONAL BOOKMARK SYSTEM
// =============================================================================
// This replaces your old bookmark.js with real database functionality

// 🎯 GLOBAL STATE: Track user's bookmarks
let userBookmarks = []; // Array of club IDs that user has bookmarked

// 🔄 FUNCTION: Load user's existing bookmarks from database
async function loadUserBookmarks() {
    try {
        console.log('📖 Loading user bookmarks from database...');

        const response = await fetch('/api/bookmarks');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract just the club IDs for quick lookup
        userBookmarks = data.bookmarks.map(club => club._id);

        console.log(`✅ Loaded ${userBookmarks.length} user bookmarks:`, userBookmarks);

        // Update UI to show current bookmark states
        updateAllBookmarkUI();

        return data.bookmarks;

    } catch (error) {
        console.error('💥 Error loading bookmarks:', error);
        // Don't show error to user - just log it
        userBookmarks = []; // Default to empty if failed
    }
}

// 🔖 FUNCTION: Add bookmark to database
async function addBookmark(clubId) {
    try {
        console.log(`📌 Adding bookmark for club: ${clubId}`);

        const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clubId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add bookmark');
        }

        const data = await response.json();
        console.log('✅ Bookmark added:', data);

        // Update local state
        if (!userBookmarks.includes(clubId)) {
            userBookmarks.push(clubId);
        }

        // Update UI
        updateBookmarkUI(clubId, true);

        // Show success feedback
        showBookmarkFeedback(`Added "${data.clubName}" to bookmarks!`, 'success');

        return true;

    } catch (error) {
        console.error('💥 Error adding bookmark:', error);
        showBookmarkFeedback('Failed to add bookmark. Please try again.', 'error');
        return false;
    }
}

// 🗑️ FUNCTION: Remove bookmark from database
async function removeBookmark(clubId) {
    try {
        console.log(`🗑️ Removing bookmark for club: ${clubId}`);

        const response = await fetch(`/api/bookmarks/${clubId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove bookmark');
        }

        const data = await response.json();
        console.log('✅ Bookmark removed:', data);

        // Update local state
        userBookmarks = userBookmarks.filter(id => id !== clubId);

        // Update UI
        updateBookmarkUI(clubId, false);

        // Show success feedback
        showBookmarkFeedback('Removed from bookmarks', 'success');

        return true;

    } catch (error) {
        console.error('💥 Error removing bookmark:', error);
        showBookmarkFeedback('Failed to remove bookmark. Please try again.', 'error');
        return false;
    }
}

// 🔍 FUNCTION: Check if club is bookmarked
function isClubBookmarked(clubId) {
    return userBookmarks.includes(clubId);
}

// 🎨 FUNCTION: Update bookmark UI for specific club
function updateBookmarkUI(clubId, isBookmarked) {
    // Find the bookmark button for this club
    const bookmarkButton = document.querySelector(`[data-club-id="${clubId}"]`);

    if (!bookmarkButton) {
        console.warn(`⚠️ Bookmark button not found for club: ${clubId}`);
        return;
    }

    // Update visual state
    if (isBookmarked) {
        bookmarkButton.classList.add('bookmarked');
        bookmarkButton.style.filter = 'hue-rotate(120deg)'; // Make it green-ish
        bookmarkButton.title = 'Click to remove from bookmarks';
    } else {
        bookmarkButton.classList.remove('bookmarked');
        bookmarkButton.style.filter = 'none'; // Reset to original color
        bookmarkButton.title = 'Click to add to bookmarks';
    }
}

// 🎨 FUNCTION: Update all bookmark buttons on page
function updateAllBookmarkUI() {
    const allBookmarkButtons = document.querySelectorAll('[data-club-id]');

    allBookmarkButtons.forEach(button => {
        const clubId = button.dataset.clubId;
        const isBookmarked = isClubBookmarked(clubId);
        updateBookmarkUI(clubId, isBookmarked);
    });

    console.log(`🎨 Updated UI for ${allBookmarkButtons.length} bookmark buttons`);
}

// 🎭 FUNCTION: Handle bookmark button click
async function handleBookmarkClick(event) {
    // Prevent any default behavior
    event.preventDefault();
    event.stopPropagation();

    const button = event.target.closest('[data-club-id]');
    if (!button) {
        console.warn('⚠️ Bookmark click but no club ID found');
        return;
    }

    const clubId = button.dataset.clubId;
    const isCurrentlyBookmarked = isClubBookmarked(clubId);

    console.log(`🖱️ Bookmark clicked for club ${clubId}, currently bookmarked: ${isCurrentlyBookmarked}`);

    // Show loading state
    button.style.opacity = '0.6';
    button.style.pointerEvents = 'none';

    try {
        let success;

        if (isCurrentlyBookmarked) {
            success = await removeBookmark(clubId);
        } else {
            success = await addBookmark(clubId);
        }

        // If operation failed, don't change UI (error already shown)
        if (!success) {
            console.log('❌ Bookmark operation failed');
        }

    } finally {
        // Re-enable button regardless of success/failure
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    }
}

// 💬 FUNCTION: Show user feedback for bookmark actions
function showBookmarkFeedback(message, type = 'success') {
    // Create or update feedback element
    let feedback = document.querySelector('.bookmark-feedback');

    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'bookmark-feedback';
        document.body.appendChild(feedback);
    }

    // Set message and style
    feedback.textContent = message;
    feedback.className = `bookmark-feedback ${type}`;

    // Position it nicely
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// 🔗 FUNCTION: Set up bookmark event listeners
function setupBookmarkListeners() {
    // Use event delegation for dynamic content
    document.addEventListener('click', (event) => {
        // Check if clicked element is a bookmark button
        if (event.target.closest('.bookmark')) {
            handleBookmarkClick(event);
        }
    });

    console.log('🔗 Bookmark event listeners set up');
}

// 🚀 FUNCTION: Initialize bookmark system
async function initializeBookmarkSystem() {
    console.log('🚀 Initializing bookmark system...');

    // Set up event listeners
    setupBookmarkListeners();

    // Load user's existing bookmarks
    await loadUserBookmarks();

    console.log('✅ Bookmark system initialized');
}

// 🌐 GLOBAL FUNCTIONS (for external access)
window.loadUserBookmarks = loadUserBookmarks;
window.isClubBookmarked = isClubBookmarked;

// 🧪 DEBUG FUNCTIONS
window.debugBookmarks = function () {
    console.log('🐛 Bookmark System State:');
    console.log('  User bookmarks:', userBookmarks);
    console.log('  Total bookmarks:', userBookmarks.length);

    const buttons = document.querySelectorAll('[data-club-id]');
    console.log('  Bookmark buttons on page:', buttons.length);

    buttons.forEach(button => {
        const clubId = button.dataset.clubId;
        const isBookmarked = isClubBookmarked(clubId);
        console.log(`    Club ${clubId}: ${isBookmarked ? 'BOOKMARKED' : 'not bookmarked'}`);
    });
};

// =============================================================================
// AUTO-INITIALIZE
// =============================================================================
// Start bookmark system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts have loaded
    setTimeout(initializeBookmarkSystem, 100);
});

// =============================================================================
// INTEGRATION NOTES:
// =============================================================================
// This script works with your existing dynamicClubs.js:
// 1. Club cards are generated with data-club-id attributes
// 2. This script finds those buttons and adds click handlers
// 3. When clubs load, bookmarks are fetched and UI is updated
// 4. Everything stays in sync automatically
// =============================================================================