// =============================================================================
// FILTER TOGGLE FUNCTIONALITY
// =============================================================================
// This file controls the visibility of the filter tags section
// Users click the filter icon to show/hide tag buttons for a cleaner interface

// 🎯 WAIT FOR PAGE TO LOAD - Ensure DOM elements are ready
// =============================================================================
// ENHANCED FILTER TOGGLE FUNCTIONALITY
// =============================================================================
// Replace or update your existing filterToggle.js with this enhanced version

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Setting up enhanced filter toggle...');

    // Find filter controls
    const filterIcon = document.getElementById('filterToggle');
    const filterTags = document.getElementById('filterTags');

    // Ensure filters are hidden on page load
    if (filterTags) {
        filterTags.classList.add('hidden');
        console.log('✅ Filter tags initially hidden');
    }

    // Add click listener to filter icon
    if (filterIcon && filterTags) {
        filterIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Toggle visibility
            const isHidden = filterTags.classList.contains('hidden');

            if (isHidden) {
                // Show filters
                filterTags.classList.remove('hidden');
                filterIcon.style.color = '#5F96C5'; // Change color to indicate active
                console.log('👁️ Filter tags shown');

                // Add visual feedback to filter button
                filterIcon.style.transform = 'scale(1.1)';
                filterIcon.style.backgroundColor = 'rgba(95, 150, 197, 0.1)';

            } else {
                // Hide filters
                filterTags.classList.add('hidden');
                filterIcon.style.color = ''; // Reset color
                console.log('🙈 Filter tags hidden');

                // Reset filter button styling
                filterIcon.style.transform = '';
                filterIcon.style.backgroundColor = '';
            }

            // Update ARIA attributes for accessibility
            filterIcon.setAttribute('aria-expanded', !isHidden);
            filterTags.setAttribute('aria-hidden', isHidden);
        });

        console.log('✅ Filter toggle event listener attached');
    } else {
        console.error('❌ Filter elements not found:', {
            filterIcon: !!filterIcon,
            filterTags: !!filterTags
        });
    }

    // Add keyboard support (Enter or Space to toggle)
    if (filterIcon) {
        filterIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filterIcon.click();
            }
        });

        // Make filter icon focusable for keyboard navigation
        filterIcon.setAttribute('tabindex', '0');
        filterIcon.setAttribute('role', 'button');
        filterIcon.setAttribute('aria-label', 'Toggle filter options');

        console.log('⌨️ Keyboard support added to filter toggle');
    }

    // Close filters when clicking outside
    document.addEventListener('click', (e) => {
        if (filterTags && !filterTags.classList.contains('hidden')) {
            // Check if click is outside filter area
            const isClickInsideFilter = filterTags.contains(e.target) ||
                filterIcon.contains(e.target);

            if (!isClickInsideFilter) {
                filterTags.classList.add('hidden');
                if (filterIcon) {
                    filterIcon.style.color = '';
                    filterIcon.style.transform = '';
                    filterIcon.style.backgroundColor = '';
                    filterIcon.setAttribute('aria-expanded', 'false');
                }
                filterTags.setAttribute('aria-hidden', 'true');
                console.log('🖱️ Filters closed by outside click');
            }
        }
    });

    // Enhanced tag functionality
    setupTagInteractions();
});

// =============================================================================
// TAG INTERACTION FUNCTIONALITY
// =============================================================================

function setupTagInteractions() {
    const tagButtons = document.querySelectorAll('.filter-tags .tag');
    let activeFilters = new Set();

    tagButtons.forEach(tag => {
        // Make tags focusable and accessible
        tag.setAttribute('tabindex', '0');
        tag.setAttribute('role', 'button');

        // Click handler
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const tagText = tag.textContent.toLowerCase();

            // Toggle active state
            if (activeFilters.has(tagText)) {
                // Remove filter
                activeFilters.delete(tagText);
                tag.classList.remove('active-filter');
                tag.setAttribute('aria-pressed', 'false');
                console.log(`🏷️ Removed filter: ${tagText}`);
            } else {
                // Add filter
                activeFilters.add(tagText);
                tag.classList.add('active-filter');
                tag.setAttribute('aria-pressed', 'true');
                console.log(`🏷️ Added filter: ${tagText}`);
            }

            // Apply filters to clubs
            applyTagFilters(Array.from(activeFilters));

            // Visual feedback
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tag.style.transform = '';
            }, 150);
        });

        // Keyboard handler
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tag.click();
            }
        });

        // Initialize ARIA attributes
        tag.setAttribute('aria-pressed', 'false');
    });

    console.log(`🏷️ Set up ${tagButtons.length} tag interactions`);
}

// =============================================================================
// FILTER APPLICATION FUNCTIONALITY
// =============================================================================

function applyTagFilters(activeFilters) {
    const clubCards = document.querySelectorAll('.club-card');
    let visibleCount = 0;

    clubCards.forEach(card => {
        const cardTags = card.querySelector('.club-tags')?.textContent.toLowerCase() || '';

        if (activeFilters.length === 0) {
            // No filters active - show all cards
            card.style.display = 'flex';
            visibleCount++;
        } else {
            // Check if card matches any active filter
            const matchesFilter = activeFilters.some(filter =>
                cardTags.includes(filter.replace('#', ''))
            );

            if (matchesFilter) {
                card.style.display = 'flex';
                visibleCount++;

                // Add highlight animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.3s ease-in';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Show results summary
    showFilterResults(visibleCount, activeFilters);
    console.log(`🔍 Filter applied: ${visibleCount} clubs visible`);
}

// =============================================================================
// RESULTS DISPLAY
// =============================================================================

function showFilterResults(count, filters) {
    // Remove existing results display
    const existingResults = document.querySelector('.filter-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create results display if filters are active
    if (filters.length > 0) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'filter-results';
        resultsDiv.innerHTML = `
            <div style="
                background: rgba(95, 150, 197, 0.1);
                border: 1px solid rgba(95, 150, 197, 0.3);
                border-radius: 10px;
                padding: 1rem;
                margin: 1rem auto;
                max-width: 65.5vw;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 1rem;
            ">
                <div>
                    <strong style="color: #5F96C5;">${count} clubs found</strong>
                    <span style="color: #666; margin-left: 0.5rem;">
                        with ${filters.map(f => f).join(', ')}
                    </span>
                </div>
                <button onclick="clearAllFilters()" style="
                    background: #5F96C5;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                ">Clear Filters</button>
            </div>
        `;

        // Insert before clubs grid
        const clubsGrid = document.querySelector('.clubs-grid');
        if (clubsGrid) {
            clubsGrid.parentNode.insertBefore(resultsDiv, clubsGrid);
        }
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function clearAllFilters() {
    // Clear active filters
    const activeFilterTags = document.querySelectorAll('.tag.active-filter');
    activeFilterTags.forEach(tag => {
        tag.classList.remove('active-filter');
        tag.setAttribute('aria-pressed', 'false');
    });

    // Show all club cards
    const clubCards = document.querySelectorAll('.club-card');
    clubCards.forEach(card => {
        card.style.display = 'flex';
    });

    // Remove results display
    const resultsDisplay = document.querySelector('.filter-results');
    if (resultsDisplay) {
        resultsDisplay.remove();
    }

    console.log('🗑️ All filters cleared');
}

// Make clearAllFilters globally available
window.clearAllFilters = clearAllFilters;

// =============================================================================
// ANIMATIONS
// =============================================================================

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .tag {
        transition: all 0.3s ease;
    }
    
    .tag:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(95, 150, 197, 0.3);
    }
`;
document.head.appendChild(style);

// =============================================================================
// HOW THIS WORKS - User Experience Flow:
// =============================================================================
//
// INITIAL STATE:
// - Filter tags are hidden (have 'hidden' class)
// - User sees clean search bar without cluttered tag buttons
//
// USER CLICKS FILTER ICON:
// 1. Click event fires
// 2. classList.toggle('hidden') runs
// 3. 'hidden' class is removed from filterTags
// 4. CSS reveals the tag buttons
// 5. User can now click tags to filter clubs
//
// USER CLICKS FILTER ICON AGAIN:
// 1. Click event fires again  
// 2. classList.toggle('hidden') runs
// 3. 'hidden' class is added back to filterTags
// 4. CSS hides the tag buttons
// 5. Interface returns to clean state
//
// =============================================================================
// CSS INTEGRATION:
// =============================================================================
// This JavaScript works with CSS like this:
//
// ```css
// .filter-tags {
//     display: flex;
//     gap: 0.5rem;
//     /* Other styling for visible state */
// }
//
// .filter-tags.hidden {
//     display: none;
//     /* Or: visibility: hidden; opacity: 0; etc. */
// }
// ```
//
// =============================================================================
// ACCESSIBILITY CONSIDERATIONS:
// =============================================================================
// For better accessibility, you could enhance this with:
//
// ```javascript
// filterIcon.addEventListener('click', () => {
//     const isHidden = filterTags.classList.contains('hidden');
//     
//     filterTags.classList.toggle('hidden');
//     
//     // Update ARIA attributes for screen readers
//     filterIcon.setAttribute('aria-expanded', !isHidden);
//     filterTags.setAttribute('aria-hidden', !isHidden);
//     
//     // Update button text or icon
//     filterIcon.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
// });
// ```
//
// =============================================================================
// FUTURE ENHANCEMENTS:
// =============================================================================
//
// 🎨 Smooth Animations:
// - CSS transitions for smooth show/hide
// - Slide down/up animations
// - Fade in/out effects
//
// 💾 State Persistence:
// - Remember user's preference (show/hide filters)
// - Save to localStorage
// - Restore state on page reload
//
// 📱 Responsive Behavior:
// - Auto-hide filters on mobile for space
// - Different toggle behavior on different screen sizes
//
// Example with animation:
// ```css
// .filter-tags {
//     max-height: 200px;
//     overflow: hidden;
//     transition: max-height 0.3s ease;
// }
//
// .filter-tags.hidden {
//     max-height: 0;
// }
// ```
//
// =============================================================================