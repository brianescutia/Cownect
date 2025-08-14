// =============================================================================
// ENHANCED PAGINATION SYSTEM - FIXED WITH DEBUG + NO AUTO-SCROLL
// =============================================================================

console.log('📄 Enhanced Pagination script loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing enhanced pagination system...');

    // GET ALL CLUB CARDS
    const cards = Array.from(document.querySelectorAll('.club-card'));
    const cardsPerPage = 6;

    console.log(`📊 Found ${cards.length} cards`);

    // Check if we have cards and pagination container
    if (cards.length === 0) {
        console.warn('⚠️ No club cards found for pagination');
        return;
    }

    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
        console.warn('⚠️ No pagination container found');
        return;
    }

    console.log('✅ Pagination container found:', paginationContainer);

    const totalPages = Math.ceil(cards.length / cardsPerPage);
    console.log(`📊 Creating ${totalPages} pages`);

    // PAGINATION STATE
    let currentPage = 0;
    let visibleCards = cards; // For filtering support

    // =============================================================================
    // GENERATE DYNAMIC PAGINATION
    // =============================================================================

    function generatePagination() {
        console.log('🔄 Generating pagination buttons...');

        paginationContainer.innerHTML = '';

        const totalVisiblePages = Math.ceil(visibleCards.length / cardsPerPage);

        if (totalVisiblePages <= 1) {
            paginationContainer.style.display = 'none';
            console.log('📄 Only 1 page - hiding pagination');
            return;
        }

        paginationContainer.style.display = 'flex';

        // PREVIOUS BUTTON
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&laquo;';
        prevBtn.setAttribute('aria-label', 'Previous page');
        prevBtn.disabled = currentPage === 0;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                showPage(currentPage - 1);
            }
        });
        paginationContainer.appendChild(prevBtn);

        // PAGE NUMBER BUTTONS - SMART ELLIPSIS SYSTEM
        createPageButtons(paginationContainer, totalVisiblePages);

        // NEXT BUTTON
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&raquo;';
        nextBtn.setAttribute('aria-label', 'Next page');
        nextBtn.disabled = currentPage >= totalVisiblePages - 1;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalVisiblePages - 1) {
                showPage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextBtn);

        console.log(`✅ Generated pagination for ${totalVisiblePages} pages`);
    }

    // =============================================================================
    // SMART PAGE BUTTONS WITH ELLIPSIS
    // =============================================================================

    function createPageButtons(container, totalPages) {
        const maxVisiblePages = 7; // Max buttons to show at once
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            startPage = 0;
            endPage = totalPages - 1;
        } else {
            // Smart ellipsis logic
            if (currentPage <= 3) {
                // Near beginning: [1][2][3][4][5]...[9]
                startPage = 0;
                endPage = 4;
                addPageButtons(container, startPage, endPage);
                addEllipsis(container);
                addPageButton(container, totalPages - 1);
                return;
            } else if (currentPage >= totalPages - 4) {
                // Near end: [1]...[5][6][7][8][9]  
                addPageButton(container, 0);
                addEllipsis(container);
                startPage = totalPages - 5;
                endPage = totalPages - 1;
                addPageButtons(container, startPage, endPage);
                return;
            } else {
                // Middle: [1]...[4][5][6]...[9]
                addPageButton(container, 0);
                addEllipsis(container);
                startPage = currentPage - 1;
                endPage = currentPage + 1;
                addPageButtons(container, startPage, endPage);
                addEllipsis(container);
                addPageButton(container, totalPages - 1);
                return;
            }
        }

        // Default case: add consecutive pages
        addPageButtons(container, startPage, endPage);
    }

    function addPageButtons(container, start, end) {
        for (let i = start; i <= end; i++) {
            addPageButton(container, i);
        }
    }

    function addPageButton(container, pageIndex) {
        const btn = document.createElement('button');
        btn.textContent = pageIndex + 1;
        btn.setAttribute('data-page', pageIndex);
        btn.setAttribute('aria-label', `Go to page ${pageIndex + 1}`);

        if (pageIndex === currentPage) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            showPage(pageIndex);
        });

        container.appendChild(btn);
    }

    function addEllipsis(container) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.style.cssText = `
            padding: 0.75rem 0.5rem;
            color: #666;
            pointer-events: none;
            user-select: none;
        `;
        container.appendChild(ellipsis);
    }

    // =============================================================================
    // SHOW PAGE FUNCTION - NO AUTO-SCROLL
    // =============================================================================

    function showPage(pageIndex) {
        console.log(`📖 Showing page ${pageIndex + 1}`);

        currentPage = pageIndex;
        const start = pageIndex * cardsPerPage;

        // HIDE ALL CARDS FIRST
        cards.forEach(card => {
            card.style.display = 'none';
        });

        // SHOW ONLY VISIBLE CARDS FOR THIS PAGE
        visibleCards.slice(start, start + cardsPerPage).forEach(card => {
            card.style.display = 'block';
        });

        // REGENERATE PAGINATION TO UPDATE ACTIVE STATE
        generatePagination();

        // NO AUTO-SCROLL - Removed to fix scroll jumping issue
        console.log(`✅ Page ${pageIndex + 1} displayed (no auto-scroll)`);
    }

    // =============================================================================
    // FILTER INTEGRATION - WORKS WITH SEARCH/FILTERS
    // =============================================================================

    function updateVisibleCards() {
        // Get all cards that are not hidden by filters
        visibleCards = cards.filter(card => {
            const style = window.getComputedStyle(card);
            return style.display !== 'none';
        });

        console.log(`🔍 Updated visible cards: ${visibleCards.length}/${cards.length}`);

        // Reset to first page when filtering
        currentPage = 0;
        showPage(0);
    }

    // =============================================================================
    // PUBLIC API FOR INTEGRATION
    // =============================================================================

    // Expose functions for other scripts to use
    window.pagination = {
        updateVisibleCards,
        showPage,
        getCurrentPage: () => currentPage,
        getTotalPages: () => Math.ceil(visibleCards.length / cardsPerPage),
        refresh: generatePagination
    };

    // =============================================================================
    // SEARCH RESULTS INTEGRATION
    // =============================================================================

    function updateSearchResults() {
        const searchResultsInfo = document.getElementById('searchResultsInfo');
        const resultsCount = document.getElementById('resultsCount');

        if (searchResultsInfo && resultsCount) {
            const totalVisible = visibleCards.length;
            const isFiltered = totalVisible < cards.length;

            if (isFiltered) {
                searchResultsInfo.style.display = 'block';
                resultsCount.textContent = `${totalVisible} club${totalVisible !== 1 ? 's' : ''} found`;
            } else {
                searchResultsInfo.style.display = 'none';
            }
        }
    }

    // =============================================================================
    // FILTER STATE CLEARING - FIXES PERSISTENT FILTER BUG
    // =============================================================================

    function clearAllFilters() {
        console.log('🧹 Clearing all filters...');

        // Clear search input
        const searchInput = document.getElementById('clubSearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Clear active filter tags
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('active-filter');
            tag.setAttribute('aria-pressed', 'false');
        });

        // Show all cards
        cards.forEach(card => {
            card.style.display = 'block';
        });

        // Update visible cards and refresh pagination
        visibleCards = cards;
        currentPage = 0;
        showPage(0);
        updateSearchResults();

        console.log('✅ All filters cleared');
    }

    // =============================================================================
    // EVENT LISTENERS FOR FILTER CLEARING
    // =============================================================================

    // Clear all button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFilters);
    }

    // Add clear button to filter tags if it doesn't exist
    const filterTags = document.getElementById('filterTags');
    if (filterTags && !document.getElementById('clearFiltersBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearFiltersBtn';
        clearBtn.textContent = 'Clear Filters';
        clearBtn.className = 'clear-filters-btn';
        clearBtn.addEventListener('click', clearAllFilters);
        filterTags.appendChild(clearBtn);
    }

    // =============================================================================
    // INTEGRATION WITH EXISTING SEARCH/FILTER SYSTEMS
    // =============================================================================

    // Listen for filter changes
    document.addEventListener('filtersChanged', updateVisibleCards);
    document.addEventListener('searchChanged', updateVisibleCards);

    // Watch for manual card visibility changes
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' &&
                mutation.attributeName === 'style' &&
                mutation.target.classList.contains('club-card')) {
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            setTimeout(() => {
                updateVisibleCards();
                updateSearchResults();
            }, 100);
        }
    });

    // Observe all club cards for style changes
    cards.forEach(card => {
        observer.observe(card, { attributes: true, attributeFilter: ['style'] });
    });

    // =============================================================================
    // INITIALIZATION WITH BETTER ERROR CHECKING
    // =============================================================================

    // Initialize pagination
    visibleCards = cards;

    try {
        generatePagination();
        showPage(0);
        console.log('✅ Enhanced pagination system initialized successfully');
    } catch (error) {
        console.error('💥 Error initializing pagination:', error);

        // Fallback: Create simple pagination
        paginationContainer.innerHTML = `
            <button onclick="alert('Pagination error - check console')">Page 1</button>
            <p style="color: red; margin: 0 1rem;">Pagination Error</p>
        `;
    }
});

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================

window.debugPagination = function () {
    console.log('🐛 Pagination Debug Info:');
    console.log('  Current page:', window.pagination?.getCurrentPage());
    console.log('  Total pages:', window.pagination?.getTotalPages());
    console.log('  Visible cards:', document.querySelectorAll('.club-card:not([style*="display: none"])').length);
    console.log('  Total cards:', document.querySelectorAll('.club-card').length);
    console.log('  Pagination container:', document.querySelector('.pagination'));
    console.log('  Container contents:', document.querySelector('.pagination')?.innerHTML);
};