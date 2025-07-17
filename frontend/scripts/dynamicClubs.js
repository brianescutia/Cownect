// =============================================================================
// FIXED DYNAMIC CLUBS - No Gray Buttons Version
// =============================================================================
// Clean search functionality without the problematic filter UI

// 🎯 GLOBAL STATE MANAGEMENT
let searchState = {
    query: '',
    selectedTags: [],
    currentPage: 1,
    isLoading: false
};

let allClubs = [];
let filteredClubs = [];

// 🎯 DEBOUNCING - Prevent excessive searches
let searchTimeout;
const DEBOUNCE_DELAY = 300;

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing clean search system...');

    try {
        await loadClubs();
        setupEventListeners();
        performSearch(); // Initial display

        console.log('✅ Clean search system ready!');
    } catch (error) {
        console.error('💥 Initialization error:', error);
        showError('Failed to load clubs');
    }
});

// =============================================================================
// LOAD CLUBS FROM API
// =============================================================================

async function loadClubs() {
    try {
        console.log('📡 Loading clubs from API...');
        showLoadingState();

        const response = await fetch('/api/clubs');
        if (!response.ok) throw new Error('Failed to load clubs');

        allClubs = await response.json();
        filteredClubs = [...allClubs];

        console.log(`📦 Loaded ${allClubs.length} clubs`);
        hideLoadingState();

    } catch (error) {
        console.error('💥 Error loading clubs:', error);
        showError('Failed to load clubs');
    }
}

// =============================================================================
// SEARCH EXECUTION (Client-side filtering)
// =============================================================================

function performSearch() {
    console.log('🔍 Performing search:', searchState);

    let results = [...allClubs];

    // Apply text search
    if (searchState.query.trim()) {
        const query = searchState.query.toLowerCase();
        results = results.filter(club => {
            const searchText = `${club.name} ${club.description} ${club.tags.join(' ')}`.toLowerCase();
            return searchText.includes(query);
        });
    }

    // Apply tag filters
    if (searchState.selectedTags.length > 0) {
        results = results.filter(club => {
            return searchState.selectedTags.some(tag =>
                club.tags.some(clubTag => clubTag.toLowerCase().includes(tag.toLowerCase()))
            );
        });
    }

    filteredClubs = results;

    // Render results
    renderClubs(results);
    renderSearchInfo();

    console.log(`✅ Search complete: ${results.length} clubs found`);
}

// =============================================================================
// DEBOUNCED SEARCH
// =============================================================================

function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch();
    }, DEBOUNCE_DELAY);
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

function setupEventListeners() {
    // 🔍 SEARCH INPUT
    const searchInput = document.getElementById('clubSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchState.query = e.target.value;
            debouncedSearch();
        });
        console.log('✅ Search input listener added');
    }

    // 🏷️ TAG FILTERS (using your existing filter tags)
    const tagButtons = document.querySelectorAll('.filter-tags .tag');
    tagButtons.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagName = tag.dataset.filter || tag.textContent.replace('#', '').toLowerCase();
            handleTagToggle(tagName);
        });
    });
    console.log(`✅ ${tagButtons.length} tag listeners added`);

    console.log('🔗 Event listeners set up');
}

// =============================================================================
// TAG FILTERING
// =============================================================================

function handleTagToggle(tagName) {
    const index = searchState.selectedTags.indexOf(tagName);

    if (index === -1) {
        // Add tag
        searchState.selectedTags.push(tagName);
    } else {
        // Remove tag
        searchState.selectedTags.splice(index, 1);
    }

    updateTagUI();
    performSearch();

    console.log('🏷️ Active tags:', searchState.selectedTags);
}

function updateTagUI() {
    const tagButtons = document.querySelectorAll('.filter-tags .tag');
    tagButtons.forEach(button => {
        const tagName = button.dataset.filter || button.textContent.replace('#', '').toLowerCase();
        const isActive = searchState.selectedTags.includes(tagName);

        if (isActive) {
            button.classList.add('active-filter');
        } else {
            button.classList.remove('active-filter');
        }
    });
}

// =============================================================================
// RENDERING FUNCTIONS (Clean versions)
// =============================================================================

function renderClubs(clubs) {
    const clubsGrid = document.querySelector('.clubs-grid');
    if (!clubsGrid) return;

    if (clubs.length === 0) {
        clubsGrid.innerHTML = `
            <div class="no-results">
                <h3>🔍 No clubs found</h3>
                <p>Try adjusting your search or clearing filters</p>
                <button onclick="clearAllFilters()" class="clear-btn">Clear All Filters</button>
            </div>
        `;
        return;
    }

    const clubsHTML = clubs.map(club => `
        <div class="club-card clickable-card" data-club-id="${club._id}" onclick="navigateToClub('${club._id}')">
            <div class="card-top">
                <img src="${club.logoUrl}" alt="${club.name} Logo" class="club-logo" />
                <div class="bookmark-icon" onclick="handleBookmarkClick(event)">
                    <img src="../assets/bookmark.png" alt="Bookmark" 
                         class="bookmark" data-club-id="${club._id}" />
                </div>
            </div>
            <h3 class="club-name">${club.name}</h3>
            <p class="club-description">${club.description}</p>
            <p class="club-tags">${club.tags.map(tag => `#${tag}`).join(' ')}</p>
            <div class="club-card-overlay">
                <span class="view-details">View Details →</span>
            </div>
        </div>
    `).join('');

    clubsGrid.innerHTML = clubsHTML;
}

function renderSearchInfo() {
    // Remove any existing search info
    const existingInfo = document.querySelector('.search-info');
    if (existingInfo) {
        existingInfo.remove();
    }

    // Only show search info if there are active filters
    if (searchState.query || searchState.selectedTags.length > 0) {
        const infoContainer = document.createElement('div');
        infoContainer.className = 'search-info';

        let infoHTML = `
            <div class="search-summary">
                <span class="result-count">${filteredClubs.length} clubs found</span>
        `;

        if (searchState.query) {
            infoHTML += `<span class="search-term">for "${searchState.query}"</span>`;
        }

        if (searchState.selectedTags.length > 0) {
            infoHTML += `<span class="active-tags">Tags: ${searchState.selectedTags.join(', ')}</span>`;
        }

        infoHTML += `
                <button onclick="clearAllFilters()" class="clear-filters-btn">Clear All</button>
            </div>
        `;

        infoContainer.innerHTML = infoHTML;

        // Insert before clubs grid
        const clubsGrid = document.querySelector('.clubs-grid');
        clubsGrid.parentNode.insertBefore(infoContainer, clubsGrid);
    }
}


// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function clearAllFilters() {
    searchState = {
        query: '',
        selectedTags: [],
        currentPage: 1,
        isLoading: false
    };

    // Reset UI
    const searchInput = document.getElementById('clubSearch');
    if (searchInput) searchInput.value = '';

    updateTagUI();
    performSearch();

    console.log('🗑️ All filters cleared');
}

function showLoadingState() {
    const clubsGrid = document.querySelector('.clubs-grid');
    if (clubsGrid) {
        clubsGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading clubs...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Loading state gets replaced when clubs render
}

function showError(message) {
    const clubsGrid = document.querySelector('.clubs-grid');
    if (clubsGrid) {
        clubsGrid.innerHTML = `
            <div class="error-state">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Reload Page</button>
            </div>
        `;
    }
}
function navigateToClub(clubId) {
    console.log(`🔗 Navigating to club: ${clubId}`);
    window.location.href = `/club/${clubId}`;
}

function handleBookmarkClick(event) {
    // Prevent card click when bookmark is clicked
    event.stopPropagation();
    console.log('📌 Bookmark clicked, preventing navigation');
}

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.navigateToClub = navigateToClub;
window.handleBookmarkClick = handleBookmarkClick;

// Debug function
window.debugSearch = () => {
    console.log('🐛 Search Debug:');
    console.log('  State:', searchState);
    console.log('  All clubs:', allClubs.length);
    console.log('  Filtered clubs:', filteredClubs.length);
};