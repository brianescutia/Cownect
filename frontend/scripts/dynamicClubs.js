// =============================================================================
// INTEGRATED DYNAMIC CLUBS WITH SEARCH & FILTERS
// =============================================================================
// Combines club loading with search/filter functionality

// 🎯 GLOBAL STATE: Manage all club data and filtering
let allClubs = []; // All clubs from database
let filteredClubs = []; // Current filtered results
let currentSearchQuery = ''; // Current search text
let activeFilters = {
    tags: [],
    category: null
};
let currentPage = 1;
const cardsPerPage = 6;

// 🎯 FUNCTION: Create a single club card from API data
function createClubCard(club) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'club-card';

    cardDiv.innerHTML = `
        <div class="card-top">
            <img src="${club.logoUrl}" alt="${club.name} Logo" class="club-logo" />
            <div class="bookmark-icon">
                <img src="../assets/bookmark.png" alt="Bookmark icon" class="bookmark" data-club-id="${club._id}" />
            </div>
        </div>
        <h3 class="club-name">${club.name}</h3>
        <p class="club-description">${club.description}</p>
        <p class="club-tags">${club.tags.map(tag => `#${tag}`).join(' ')}</p>
    `;

    return cardDiv;
}

// 🔍 FUNCTION: Filter clubs based on search and filters
function filterClubs() {
    console.log('🔍 Filtering clubs...');
    console.log('📊 Search query:', currentSearchQuery);
    console.log('📊 Active filters:', activeFilters);

    let results = [...allClubs]; // Start with all clubs

    // 📝 APPLY SEARCH QUERY
    if (currentSearchQuery.trim()) {
        const query = currentSearchQuery.toLowerCase();
        results = results.filter(club => {
            const nameMatch = club.name.toLowerCase().includes(query);
            const descMatch = club.description.toLowerCase().includes(query);
            const tagMatch = club.tags.some(tag => tag.toLowerCase().includes(query));

            return nameMatch || descMatch || tagMatch;
        });
        console.log(`🔍 Search "${currentSearchQuery}" found ${results.length} clubs`);
    }

    // 🏷️ APPLY TAG FILTERS
    if (activeFilters.tags.length > 0) {
        results = results.filter(club => {
            return activeFilters.tags.some(filterTag =>
                club.tags.some(clubTag => clubTag.toLowerCase() === filterTag.toLowerCase())
            );
        });
        console.log(`🏷️ Tag filter found ${results.length} clubs`);
    }

    // 💾 STORE FILTERED RESULTS
    filteredClubs = results;
    currentPage = 1; // Reset to first page when filters change

    // 🎨 RENDER RESULTS
    renderClubs();
    updateSearchResultsInfo();
}

// 🎨 FUNCTION: Render current page of filtered clubs
function renderClubs() {
    const clubsGrid = document.querySelector('.clubs-grid');

    // Calculate pagination for current filtered results
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const clubsToShow = filteredClubs.slice(startIndex, endIndex);

    // Clear existing content
    clubsGrid.innerHTML = '';

    // Handle empty results
    if (clubsToShow.length === 0 && filteredClubs.length === 0) {
        clubsGrid.innerHTML = `
            <div class="no-results">
                <h3>🔍 No clubs found</h3>
                <p>Try adjusting your search or filters</p>
                <button onclick="clearAllFilters()" class="clear-filters-btn">Clear All Filters</button>
            </div>
        `;
        updatePaginationDisplay();
        return;
    }

    // Render club cards
    clubsToShow.forEach(club => {
        const clubCard = createClubCard(club);
        clubsGrid.appendChild(clubCard);
    });

    // Update pagination
    updatePaginationDisplay();

    console.log(`✅ Rendered ${clubsToShow.length} clubs (page ${currentPage} of ${Math.ceil(filteredClubs.length / cardsPerPage)})`);
}

// 📊 FUNCTION: Update search results information
function updateSearchResultsInfo() {
    const totalResults = filteredClubs.length;

    // Create or update results info display
    let resultsInfo = document.querySelector('.search-results-info');
    if (!resultsInfo) {
        resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';

        // Insert before clubs grid
        const clubsGrid = document.querySelector('.clubs-grid');
        clubsGrid.parentNode.insertBefore(resultsInfo, clubsGrid);
    }

    // Update content based on active filters
    if (currentSearchQuery || activeFilters.tags.length > 0) {
        resultsInfo.innerHTML = `
            <div class="results-summary">
                <span class="results-count">${totalResults} clubs found</span>
                ${currentSearchQuery ? `<span class="search-term">for "${currentSearchQuery}"</span>` : ''}
                <button onclick="clearAllFilters()" class="clear-all-btn">Clear All</button>
            </div>
        `;
        resultsInfo.style.display = 'block';
    } else {
        resultsInfo.style.display = 'none';
    }
}

// 🔄 FUNCTION: Update pagination display
function updatePaginationDisplay() {
    const totalPages = Math.ceil(filteredClubs.length / cardsPerPage);
    const paginationSection = document.querySelector('.pagination');
    const paginationButtons = document.querySelectorAll('.pagination button');

    // Show/hide pagination based on results
    if (totalPages <= 1) {
        paginationSection.style.display = 'none';
    } else {
        paginationSection.style.display = 'flex';

        // Update active button
        paginationButtons.forEach(btn => btn.classList.remove('active'));
        if (paginationButtons[currentPage]) {
            paginationButtons[currentPage].classList.add('active');
        }
    }
}

// 🔍 FUNCTION: Handle search input
function handleSearch(event) {
    currentSearchQuery = event.target.value;
    console.log('🔍 Search query changed:', currentSearchQuery);

    // Debounce search for better performance
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        filterClubs();
    }, 300); // Wait 300ms after user stops typing
}

// 🏷️ FUNCTION: Handle tag filter clicks
function handleTagFilter(tagName) {
    const tag = tagName.toLowerCase().replace('#', '');

    if (activeFilters.tags.includes(tag)) {
        // Remove tag filter
        activeFilters.tags = activeFilters.tags.filter(t => t !== tag);
        console.log('🏷️ Removed tag filter:', tag);
    } else {
        // Add tag filter
        activeFilters.tags.push(tag);
        console.log('🏷️ Added tag filter:', tag);
    }

    // Update UI to show active filters
    updateActiveTagsDisplay();

    // Apply filters
    filterClubs();
}

// 🎨 FUNCTION: Update visual state of tag buttons
function updateActiveTagsDisplay() {
    const tagButtons = document.querySelectorAll('.tag');

    tagButtons.forEach(button => {
        const tagText = button.textContent.toLowerCase().replace('#', '');

        if (activeFilters.tags.includes(tagText)) {
            button.classList.add('active-filter');
        } else {
            button.classList.remove('active-filter');
        }
    });
}

// 🗑️ FUNCTION: Clear all filters
function clearAllFilters() {
    currentSearchQuery = '';
    activeFilters.tags = [];
    activeFilters.category = null;
    currentPage = 1;

    // Reset search input
    const searchInput = document.getElementById('clubSearch');
    if (searchInput) searchInput.value = '';

    // Reset tag buttons
    updateActiveTagsDisplay();

    // Show all clubs
    filteredClubs = [...allClubs];
    renderClubs();
    updateSearchResultsInfo();

    console.log('🗑️ All filters cleared');
}

// 📄 FUNCTION: Set up pagination that works with filtered results
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination button');

    // Remove old listeners by cloning buttons
    paginationButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });

    // Add new listeners to fresh buttons
    const freshButtons = document.querySelectorAll('.pagination button');
    freshButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const totalPages = Math.ceil(filteredClubs.length / cardsPerPage);
            let newPage = currentPage;

            if (index === 0) {
                newPage = 1; // « button
            } else if (index === freshButtons.length - 1) {
                newPage = totalPages; // » button
            } else {
                newPage = index; // Numbered button
            }

            // Only change page if valid
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderClubs();
            }
        });
    });

    console.log('📄 Pagination set up for filtered results');
}

// 🔗 FUNCTION: Set up search and filter event listeners
function setupSearchAndFilters() {
    // 🔍 SEARCH INPUT
    const searchInput = document.getElementById('clubSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        console.log('🔍 Search input listener set up');
    }

    // 🏷️ TAG FILTER BUTTONS
    const tagButtons = document.querySelectorAll('.tag');
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tagText = button.textContent;
            handleTagFilter(tagText);
        });
    });
    console.log(`🏷️ Set up ${tagButtons.length} tag filter listeners`);

    // 📄 PAGINATION
    setupPagination();
}

// 🎯 FUNCTION: Load clubs from API and initialize system
async function loadClubs() {
    try {
        showLoadingState();

        console.log('📡 Fetching clubs from API...');
        const response = await fetch('/api/clubs');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const clubs = await response.json();
        console.log(`📦 Received ${clubs.length} clubs from API`);

        // Initialize global state
        allClubs = clubs;
        filteredClubs = [...clubs]; // Start showing all clubs
        currentPage = 1;

        // Set up search and filters
        setupSearchAndFilters();

        // Initial render
        renderClubs();
        updateSearchResultsInfo();

        hideLoadingState();

        console.log('🚀 Dynamic clubs with search system initialized');

    } catch (error) {
        console.error('💥 Error loading clubs:', error);
        showErrorState('Failed to load clubs. Please refresh the page.');
        hideLoadingState();
    }
}

// 🎯 HELPER FUNCTIONS: Loading states
function showLoadingState() {
    const clubsGrid = document.querySelector('.clubs-grid');
    clubsGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading awesome tech clubs...</p>
        </div>
    `;
}

function hideLoadingState() {
    console.log('✅ Loading complete');
}

function showErrorState(message) {
    const clubsGrid = document.querySelector('.clubs-grid');
    clubsGrid.innerHTML = `
        <div class="error-state">
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button onclick="loadClubs()" class="retry-button">Try Again</button>
        </div>
    `;
}

// 🚀 INITIALIZE: Load clubs when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting integrated dynamic club system...');
    loadClubs();
});

// 🌐 GLOBAL FUNCTIONS (for external access)
window.clearAllFilters = clearAllFilters;
window.handleTagFilter = handleTagFilter;

// 🧪 DEBUG FUNCTIONS
window.debugSearchState = function () {
    console.log('🐛 Search System State:');
    console.log('  Total clubs:', allClubs.length);
    console.log('  Filtered clubs:', filteredClubs.length);
    console.log('  Search query:', currentSearchQuery);
    console.log('  Active filters:', activeFilters);
    console.log('  Current page:', currentPage);
    console.log('  Total pages:', Math.ceil(filteredClubs.length / cardsPerPage));
};