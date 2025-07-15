// =============================================================================
// FIXED PAGINATION SYSTEM - Complete Solution
// =============================================================================

// 🎯 GLOBAL VARIABLES: Store current state
let allClubs = []; // Store all clubs for pagination
let currentPage = 1;
const cardsPerPage = 6;

// 🎯 FUNCTION: Create a single club card from API data (same as before)
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

// 🎯 FUNCTION: Render specific page of clubs
function renderClubsPage(page = 1) {
    const clubsGrid = document.querySelector('.clubs-grid');

    // Clear existing content
    clubsGrid.innerHTML = '';

    // Calculate which clubs to show
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const clubsToShow = allClubs.slice(startIndex, endIndex);

    console.log(`📄 Rendering page ${page}: showing clubs ${startIndex + 1}-${Math.min(endIndex, allClubs.length)} of ${allClubs.length}`);

    // Create and add cards
    clubsToShow.forEach(club => {
        const clubCard = createClubCard(club);
        clubsGrid.appendChild(clubCard);
    });

    // Update pagination buttons
    updatePaginationButtons(page);

    console.log(`✅ Rendered ${clubsToShow.length} clubs for page ${page}`);
}

// 🎯 FUNCTION: Update pagination button appearance
function updatePaginationButtons(activePage) {
    const paginationButtons = document.querySelectorAll('.pagination button');

    // Remove active class from all buttons
    paginationButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to current page button
    // Button index: [«, 1, 2, 3, »] so page 1 = button index 1
    if (paginationButtons[activePage]) {
        paginationButtons[activePage].classList.add('active');
    }
}

// 🎯 FUNCTION: Handle pagination button clicks
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination button');
    const totalPages = Math.ceil(allClubs.length / cardsPerPage);

    console.log(`🔗 Setting up pagination: ${totalPages} pages, ${allClubs.length} clubs`);

    paginationButtons.forEach((button, index) => {
        // Remove any existing click listeners
        button.replaceWith(button.cloneNode(true));
    });

    // Re-select buttons after cloning (to remove old listeners)
    const freshButtons = document.querySelectorAll('.pagination button');

    freshButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            console.log(`🖱️ Pagination button ${index} clicked`);

            let newPage = currentPage;

            if (index === 0) {
                // « button - go to first page
                newPage = 1;
                console.log('📄 Going to first page');
            } else if (index === freshButtons.length - 1) {
                // » button - go to last page  
                newPage = totalPages;
                console.log(`📄 Going to last page (${totalPages})`);
            } else {
                // Numbered button - go to that page
                newPage = index;
                console.log(`📄 Going to page ${newPage}`);
            }

            // Update current page and render
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderClubsPage(currentPage);
            }
        });
    });

    console.log('✅ Pagination event listeners set up');
}

// 🎯 FUNCTION: Load clubs from API (updated)
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

        // Store clubs globally
        allClubs = clubs;
        currentPage = 1;

        // Render first page
        renderClubsPage(1);

        // Set up pagination after rendering
        setupPagination();

        hideLoadingState();

    } catch (error) {
        console.error('💥 Error loading clubs:', error);
        showErrorState('Failed to load clubs. Please refresh the page.');
        hideLoadingState();
    }
}

// 🎯 HELPER FUNCTIONS: Loading states (same as before)
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
    console.log('🚀 Starting dynamic club loading with pagination...');
    loadClubs();
});

// =============================================================================
// DEBUGGING FUNCTIONS - Add these for testing
// =============================================================================

// Test function to manually change pages
window.testPagination = function (page) {
    console.log(`🧪 Testing pagination: going to page ${page}`);
    currentPage = page;
    renderClubsPage(page);
};

// Check current state
window.checkPaginationState = function () {
    console.log('📊 Current pagination state:');
    console.log(`  - Total clubs: ${allClubs.length}`);
    console.log(`  - Current page: ${currentPage}`);
    console.log(`  - Cards per page: ${cardsPerPage}`);
    console.log(`  - Total pages: ${Math.ceil(allClubs.length / cardsPerPage)}`);
};