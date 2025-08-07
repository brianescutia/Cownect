// =============================================================================
// EVENT BOOKMARK SYSTEM - Frontend JavaScript
// Save as frontend/scripts/event-bookmark.js
// =============================================================================

let userEventBookmarks = []; // Array of event IDs that user has bookmarked

// =============================================================================
// LOAD USER'S EXISTING EVENT BOOKMARKS
// =============================================================================
async function loadUserEventBookmarks() {
    try {
        console.log('📌 Loading user event bookmarks from database...');

        const response = await fetch('/api/event-bookmarks');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract just the event IDs for quick lookup
        userEventBookmarks = data.bookmarks.map(event => event._id);

        console.log(`📌 Loaded ${userEventBookmarks.length} event bookmarks:`, userEventBookmarks);

        // Update UI to show current bookmark states
        updateAllEventBookmarkUI();

        return data.bookmarks;

    } catch (error) {
        console.error('💥 Error loading event bookmarks:', error);
        userEventBookmarks = []; // Default to empty if failed
    }
}

// =============================================================================
// ADD EVENT BOOKMARK
// =============================================================================
async function addEventBookmark(eventId) {
    try {
        console.log(`📌 Adding event bookmark for event: ${eventId}`);

        const response = await fetch(`/api/events/${eventId}/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to bookmark event');
        }

        const data = await response.json();
        console.log('✅ Event bookmarked:', data);

        // Update local state
        if (!userEventBookmarks.includes(eventId)) {
            userEventBookmarks.push(eventId);
        }

        // Update UI
        updateEventBookmarkUI(eventId, true);

        // Show success feedback
        showEventBookmarkFeedback(`Bookmarked "${data.eventTitle}"! 📌`, 'success');

        return true;

    } catch (error) {
        console.error('💥 Error adding event bookmark:', error);
        showEventBookmarkFeedback('Failed to bookmark event. Please try again.', 'error');
        return false;
    }
}

// =============================================================================
// REMOVE EVENT BOOKMARK
// =============================================================================
async function removeEventBookmark(eventId) {
    try {
        console.log(`🗑️ Removing event bookmark for event: ${eventId}`);

        const response = await fetch(`/api/events/${eventId}/bookmark`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove bookmark');
        }

        const data = await response.json();
        console.log('✅ Event bookmark removed:', data);

        // Update local state
        userEventBookmarks = userEventBookmarks.filter(id => id !== eventId);

        // Update UI
        updateEventBookmarkUI(eventId, false);

        // Show success feedback
        showEventBookmarkFeedback('Bookmark removed', 'success');

        return true;

    } catch (error) {
        console.error('💥 Error removing event bookmark:', error);
        showEventBookmarkFeedback('Failed to remove bookmark. Please try again.', 'error');
        return false;
    }
}

// =============================================================================
// CHECK IF EVENT IS BOOKMARKED
// =============================================================================
function isEventBookmarked(eventId) {
    return userEventBookmarks.includes(eventId);
}

// =============================================================================
// UPDATE BOOKMARK UI FOR SPECIFIC EVENT
// =============================================================================
function updateEventBookmarkUI(eventId, isBookmarked) {
    // Find all bookmark buttons for this event
    const eventCards = document.querySelectorAll(`[data-event-id="${eventId}"]`);

    eventCards.forEach(card => {
        const bookmarkButton = card.querySelector('.event-bookmark');
        if (bookmarkButton) {
            if (isBookmarked) {
                bookmarkButton.classList.add('bookmarked');
                bookmarkButton.title = 'Click to remove from bookmarks';
                // Don't set inline styles - let CSS handle it
            } else {
                bookmarkButton.classList.remove('bookmarked');
                bookmarkButton.title = 'Click to add to bookmarks';
                // Don't set inline styles - let CSS handle it
            }
        }
    });

    console.log(`🎨 Event bookmark UI updated: ${isBookmarked ? 'FILLED' : 'EMPTY'}`);
}
// =============================================================================
// UPDATE ALL EVENT BOOKMARK BUTTONS ON PAGE
// =============================================================================
function updateAllEventBookmarkUI() {
    const allEventCards = document.querySelectorAll('[data-event-id]');

    allEventCards.forEach(card => {
        const eventId = card.dataset.eventId;
        const isBookmarked = isEventBookmarked(eventId);
        updateEventBookmarkUI(eventId, isBookmarked);
    });

    console.log(`🎨 Updated UI for ${allEventCards.length} event bookmark buttons`);
}

// =============================================================================
// HANDLE EVENT BOOKMARK BUTTON CLICK
// =============================================================================
async function handleEventBookmarkClick(event) {
    // Prevent any default behavior and stop propagation
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();


    console.log('📌 Event bookmark click detected!', event.target);
    if (event.target.tagName === 'BUTTON') {
        event.target.blur(); // Remove focus to prevent scroll
    }

    // Find the event card that contains this bookmark button
    const eventCard = event.target.closest('[data-event-id]');
    if (!eventCard) {
        console.warn('⚠️ No event card found with data-event-id');
        return;
    }

    const eventId = eventCard.dataset.eventId;
    if (!eventId) {
        console.warn('⚠️ No event ID found on event card');
        return;
    }

    const isCurrentlyBookmarked = isEventBookmarked(eventId);

    console.log(`📌 Event bookmark clicked for event ${eventId}, currently bookmarked: ${isCurrentlyBookmarked}`);

    // Show loading state on the clicked element
    const bookmarkButton = event.target.closest('.event-bookmark');
    if (bookmarkButton) {
        bookmarkButton.style.opacity = '0.6';
        bookmarkButton.style.pointerEvents = 'none';
    }

    try {
        let success;

        if (isCurrentlyBookmarked) {
            success = await removeEventBookmark(eventId);
        } else {
            success = await addEventBookmark(eventId);
        }

        // If operation failed, don't change UI (error already shown)
        if (!success) {
            console.log('💥 Event bookmark operation failed');
        }

    } finally {
        // Re-enable button regardless of success/failure
        if (bookmarkButton) {
            bookmarkButton.style.opacity = '1';
            bookmarkButton.style.pointerEvents = 'auto';
        }
    }
}

// =============================================================================
// SHOW USER FEEDBACK FOR BOOKMARK ACTIONS
// =============================================================================
function showEventBookmarkFeedback(message, type = 'success') {
    // Create or update feedback element
    let feedback = document.querySelector('.event-bookmark-feedback');

    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'event-bookmark-feedback';
        document.body.appendChild(feedback);
    }

    // Set message and style
    feedback.textContent = message;
    feedback.className = `event-bookmark-feedback ${type}`;

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
        font-weight: 500;
        font-size: 0.95rem;
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

// =============================================================================
// SET UP EVENT BOOKMARK EVENT LISTENERS
// =============================================================================
function setupEventBookmarkListeners() {
    // Remove any existing listeners to prevent duplicates
    document.removeEventListener('click', globalEventBookmarkHandler);

    // Use event delegation to handle clicks on bookmark buttons
    document.addEventListener('click', globalEventBookmarkHandler);

    console.log('🔗 Event bookmark listeners set up');
}

function globalEventBookmarkHandler(event) {
    // Check if the clicked element is an event bookmark button
    const bookmarkButton = event.target.closest('.event-bookmark');

    if (bookmarkButton) {
        console.log('🎯 Event bookmark button clicked');
        handleEventBookmarkClick(event);
    }
}

// =============================================================================
// INITIALIZE EVENT BOOKMARK SYSTEM
// =============================================================================
async function initializeEventBookmarkSystem() {
    console.log('🚀 Initializing event bookmark system...');

    // Set up event listeners
    setupEventBookmarkListeners();

    // Load user's existing event bookmarks
    await loadUserEventBookmarks();

    console.log('✅ Event bookmark system initialized');
}

// =============================================================================
// GLOBAL FUNCTIONS (for external access)
// =============================================================================
window.loadUserEventBookmarks = loadUserEventBookmarks;
window.isEventBookmarked = isEventBookmarked;
window.handleEventBookmarkClick = handleEventBookmarkClick; // Export for debugging

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================
window.debugEventBookmarks = function () {
    console.log('🐛 Event Bookmark System State:');
    console.log('  User event bookmarks:', userEventBookmarks);
    console.log('  Total event bookmarks:', userEventBookmarks.length);

    const eventElements = document.querySelectorAll('[data-event-id]');
    console.log('  Event elements on page:', eventElements.length);

    eventElements.forEach(element => {
        const eventId = element.dataset.eventId;
        const isBookmarked = isEventBookmarked(eventId);
        console.log(`    Event ${eventId}: ${isBookmarked ? 'BOOKMARKED' : 'not bookmarked'}`);
    });
};

// =============================================================================
// AUTO-INITIALIZE
// =============================================================================
// Start event bookmark system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure events are loaded first
    setTimeout(initializeEventBookmarkSystem, 500);
});

// Also initialize when the page becomes visible (for better reliability)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-initialize if page becomes visible and bookmarks aren't loaded
        if (userEventBookmarks.length === 0) {
            setTimeout(initializeEventBookmarkSystem, 200);
        }
    }
});

console.log('📌 Event bookmark system script loaded successfully!');