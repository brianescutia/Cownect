// =============================================================================
// UPDATED DYNAMIC CLUBS WITH WORKING PAGINATION & FIXED NAVIGATION
// =============================================================================

//  GLOBAL STATE MANAGEMENT
let searchState = {
    query: '',
    selectedTags: [],
    currentPage: 1,
    isLoading: false
};

let allClubs = [];
let filteredClubs = [];

//  PAGINATION SETTINGS
const CLUBS_PER_PAGE = 6;

//  DEBOUNCING - Prevent excessive searches
let searchTimeout;
const DEBOUNCE_DELAY = 300;

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log(' Initializing dynamic clubs with pagination...');

    try {
        await loadClubs();
        setupEventListeners();
        setupPaginationListeners(); // New pagination setup
        performSearch(); // Initial display

        console.log(' Dynamic clubs system ready!');
    } catch (error) {
        console.error(' Initialization error:', error);
        showError('Failed to load clubs');
    }
});

// =============================================================================
// LOAD CLUBS FROM API
// =============================================================================

async function loadClubs() {
    try {
        console.log(' Loading clubs from API...');
        showLoadingState();

        const response = await fetch('/api/clubs');
        if (!response.ok) throw new Error('Failed to load clubs');

        allClubs = await response.json();
        filteredClubs = [...allClubs];

        console.log(` Loaded ${allClubs.length} clubs`);
        hideLoadingState();

    } catch (error) {
        console.error(' Error loading clubs:', error);
        showError('Failed to load clubs');
    }
}

// =============================================================================
// SEARCH EXECUTION (Client-side filtering)
// =============================================================================

function performSearch() {
    console.log(' Performing search:', searchState);

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

    // Reset to page 1 when search changes
    if (searchState.currentPage > Math.ceil(results.length / CLUBS_PER_PAGE)) {
        searchState.currentPage = 1;
    }

    // Render results with pagination
    renderClubsWithPagination(results);
    renderSearchInfo();
    updatePaginationButtons();

    console.log(` Search complete: ${results.length} clubs found, showing page ${searchState.currentPage}`);
}

// =============================================================================
// RENDER CLUBS WITH PAGINATION
// =============================================================================

function renderClubsWithPagination(clubs) {
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

    // Calculate pagination
    const startIndex = (searchState.currentPage - 1) * CLUBS_PER_PAGE;
    const endIndex = startIndex + CLUBS_PER_PAGE;
    const clubsToShow = clubs.slice(startIndex, endIndex);

    console.log(` Showing clubs ${startIndex + 1}-${Math.min(endIndex, clubs.length)} of ${clubs.length}`);

    const clubsHTML = clubsToShow.map(club => `
        <div class="club-card clickable-card" data-club-id="${club._id}">
            <div class="card-top">
                <img src="${club.logoUrl}" alt="${club.name} Logo" class="club-logo" />
                <div class="bookmark-icon">
                    <img src="../assets/bookmark.png" alt="Bookmark" 
                         class="bookmark" data-club-id="${club._id}" />
                </div>
            </div>
            <h3 class="club-name">${club.name}</h3>
            <p class="club-description">${club.description}</p>
            <p class="club-tags">${club.tags.map(tag => `#${tag}`).join(' ')}</p>
        </div>
    `).join('');

    clubsGrid.innerHTML = clubsHTML;

    // Add click listeners after rendering - FIXED VERSION
    addClubCardListeners();
}

// =============================================================================
// PAGINATION FUNCTIONS
// =============================================================================

function setupPaginationListeners() {
    const paginationButtons = document.querySelectorAll('.pagination button');

    paginationButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const totalPages = Math.ceil(filteredClubs.length / CLUBS_PER_PAGE);
            const buttonText = btn.textContent;

            if (buttonText === '«') {
                // Previous button
                if (searchState.currentPage > 1) {
                    searchState.currentPage--;
                    performSearch();
                }
            } else if (buttonText === '»') {
                // Next button
                if (searchState.currentPage < totalPages) {
                    searchState.currentPage++;
                    performSearch();
                }
            } else {
                // Numbered page button
                const pageNum = parseInt(buttonText);
                if (pageNum && pageNum !== searchState.currentPage) {
                    searchState.currentPage = pageNum;
                    performSearch();
                }
            }
        });
    });

    console.log(`✅ Set up ${paginationButtons.length} pagination buttons`);
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredClubs.length / CLUBS_PER_PAGE);
    const paginationContainer = document.querySelector('.pagination');

    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    // Generate pagination HTML
    let paginationHTML = '';

    // Previous button
    paginationHTML += `<button ${searchState.currentPage === 1 ? 'disabled' : ''}>«</button>`;

    // Smart pagination logic
    const current = searchState.currentPage;

    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="${i === current ? 'active' : ''}">${i}</button>`;
        }
    } else {
        // Complex pagination for 8+ pages
        if (current <= 4) {
            // Show: 1 2 3 4 5 ... last
            for (let i = 1; i <= 5; i++) {
                paginationHTML += `<button class="${i === current ? 'active' : ''}">${i}</button>`;
            }
            paginationHTML += `<span>...</span>`;
            paginationHTML += `<button class="${totalPages === current ? 'active' : ''}">${totalPages}</button>`;
        } else if (current >= totalPages - 3) {
            // Show: 1 ... (last-4) (last-3) (last-2) (last-1) last
            paginationHTML += `<button class="${1 === current ? 'active' : ''}">1</button>`;
            paginationHTML += `<span>...</span>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                paginationHTML += `<button class="${i === current ? 'active' : ''}">${i}</button>`;
            }
        } else {
            // Show: 1 ... (current-1) current (current+1) ... last
            paginationHTML += `<button class="${1 === current ? 'active' : ''}">1</button>`;
            paginationHTML += `<span>...</span>`;
            for (let i = current - 1; i <= current + 1; i++) {
                paginationHTML += `<button class="${i === current ? 'active' : ''}">${i}</button>`;
            }
            paginationHTML += `<span>...</span>`;
            paginationHTML += `<button class="${totalPages === current ? 'active' : ''}">${totalPages}</button>`;
        }
    }

    // Next button
    paginationHTML += `<button ${searchState.currentPage === totalPages ? 'disabled' : ''}>»</button>`;

    paginationContainer.innerHTML = paginationHTML;

    // Re-attach event listeners
    setupPaginationListeners();
}

// =============================================================================
// CLUB CARD CLICK LISTENERS - FIXED VERSION
// =============================================================================

function addClubCardListeners() {
    const clubCards = document.querySelectorAll('.club-card');

    clubCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if the click is on the bookmark icon or its children
            const isBookmarkClick = e.target.closest('.bookmark-icon');

            if (isBookmarkClick) {
                console.log(' Bookmark clicked, not navigating to club');
                // Let the bookmark handler deal with this
                return;
            }

            // This is a card click, navigate to the club
            const clubId = card.dataset.clubId;
            console.log(` Club card clicked! Club ID: ${clubId}`);

            if (clubId) {
                navigateToClub(clubId);
            } else {
                console.error(' No club ID found on card');
            }
        });
    });

    console.log(` Added click listeners to ${clubCards.length} club cards`);
}

// =============================================================================
// EXISTING FUNCTIONS (Updated)
// =============================================================================

function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchState.currentPage = 1; // Reset to page 1 on new search
        performSearch();
    }, DEBOUNCE_DELAY);
}

function setupEventListeners() {
    //  SEARCH INPUT
    const searchInput = document.getElementById('clubSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchState.query = e.target.value;
            debouncedSearch();
        });
        console.log(' Search input listener added');
    }

    //  TAG FILTERS
    const tagButtons = document.querySelectorAll('.filter-tags .tag');
    tagButtons.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagName = tag.dataset.filter || tag.textContent.replace('#', '').toLowerCase();
            handleTagToggle(tagName);
        });
    });
    console.log(` ${tagButtons.length} tag listeners added`);
}

function handleTagToggle(tagName) {
    const index = searchState.selectedTags.indexOf(tagName);

    if (index === -1) {
        searchState.selectedTags.push(tagName);
    } else {
        searchState.selectedTags.splice(index, 1);
    }

    searchState.currentPage = 1; // Reset to page 1 when filters change
    updateTagUI();
    performSearch();

    console.log(' Active tags:', searchState.selectedTags);
}

function clearAllFilters() {
    searchState = {
        query: '',
        selectedTags: [],
        currentPage: 1,
        isLoading: false
    };

    const searchInput = document.getElementById('clubSearch');
    if (searchInput) searchInput.value = '';

    updateTagUI();
    performSearch();

    console.log(' All filters cleared');
}

// Keep all your existing utility functions...
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

function renderSearchInfo() {
    const existingInfo = document.querySelector('.search-info');
    if (existingInfo) {
        existingInfo.remove();
    }

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

        const clubsGrid = document.querySelector('.clubs-grid');
        clubsGrid.parentNode.insertBefore(infoContainer, clubsGrid);
    }
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
                <h3> Error</h3>
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

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.clearAllFilters = clearAllFilters;
window.navigateToClub = navigateToClub;

// Debug function
window.debugPagination = () => {
    console.log(' Pagination Debug:');
    console.log('  Current page:', searchState.currentPage);
    console.log('  Clubs per page:', CLUBS_PER_PAGE);
    console.log('  Total clubs:', filteredClubs.length);
    console.log('  Total pages:', Math.ceil(filteredClubs.length / CLUBS_PER_PAGE));
};