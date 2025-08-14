// =============================================================================
// ENHANCED FILTER TOGGLE SYSTEM - FIXES PERSISTENT FILTER BUG
// =============================================================================

console.log('🔍 Enhanced Filter Toggle script loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing enhanced filter system...');

    // GET FILTER ELEMENTS
    const filterToggle = document.getElementById('filterToggle');
    const filterTags = document.getElementById('filterTags');
    const clubSearch = document.getElementById('clubSearch');
    const allTags = document.querySelectorAll('.tag');
    const allCards = document.querySelectorAll('.club-card');

    // FILTER STATE
    let activeFilters = new Set();
    let searchTerm = '';

    if (!filterToggle || !filterTags) {
        console.warn('⚠️ Filter elements not found');
        return;
    }

    // =============================================================================
    // TOGGLE FILTER VISIBILITY
    // =============================================================================

    filterToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🔄 Toggling filter visibility');

        const isHidden = filterTags.classList.contains('hidden');

        if (isHidden) {
            filterTags.classList.remove('hidden');
            filterTags.setAttribute('aria-hidden', 'false');
            filterToggle.setAttribute('aria-expanded', 'true');
            console.log('✅ Filters shown');
        } else {
            filterTags.classList.add('hidden');
            filterTags.setAttribute('aria-hidden', 'true');
            filterToggle.setAttribute('aria-expanded', 'false');
            console.log('✅ Filters hidden');
        }
    });

    // =============================================================================
    // TAG CLICK HANDLERS
    // =============================================================================

    allTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            handleTagClick(tag);
        });

        // Keyboard support
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTagClick(tag);
            }
        });
    });

    function handleTagClick(tag) {
        const filter = tag.getAttribute('data-filter');
        if (!filter) return;

        console.log(`🏷️ Tag clicked: ${filter}`);

        // Toggle filter state
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
            tag.classList.remove('active-filter');
            tag.setAttribute('aria-pressed', 'false');
            console.log(`➖ Removed filter: ${filter}`);
        } else {
            activeFilters.add(filter);
            tag.classList.add('active-filter');
            tag.setAttribute('aria-pressed', 'true');
            console.log(`➕ Added filter: ${filter}`);
        }

        // Apply filters
        applyFilters();
        updateSearchResults();
    }

    // =============================================================================
    // SEARCH FUNCTIONALITY
    // =============================================================================

    if (clubSearch) {
        clubSearch.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            console.log(`🔍 Search term: "${searchTerm}"`);

            applyFilters();
            updateSearchResults();

            // Dispatch custom event for pagination
            document.dispatchEvent(new CustomEvent('searchChanged'));
        });
    }

    // =============================================================================
    // APPLY FILTERS FUNCTION - ENHANCED
    // =============================================================================

    function applyFilters() {
        console.log(`🔄 Applying filters: [${Array.from(activeFilters).join(', ')}] search: "${searchTerm}"`);

        let visibleCount = 0;

        allCards.forEach(card => {
            let isVisible = true;

            // CHECK SEARCH TERM
            if (searchTerm) {
                const cardText = (
                    card.querySelector('.club-name')?.textContent?.toLowerCase() + ' ' +
                    card.querySelector('.club-description')?.textContent?.toLowerCase() + ' ' +
                    card.querySelector('.club-tags')?.textContent?.toLowerCase()
                ) || '';

                if (!cardText.includes(searchTerm)) {
                    isVisible = false;
                }
            }

            // CHECK ACTIVE FILTERS
            if (isVisible && activeFilters.size > 0) {
                const cardTags = card.querySelector('.club-tags')?.textContent?.toLowerCase() || '';

                // Card must match ALL active filters (AND logic)
                for (const filter of activeFilters) {
                    if (!cardTags.includes(filter.toLowerCase())) {
                        isVisible = false;
                        break;
                    }
                }
            }

            // SHOW/HIDE CARD
            if (isVisible) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`✅ ${visibleCount}/${allCards.length} cards visible`);

        // Update pagination if it exists
        if (window.pagination) {
            window.pagination.updateVisibleCards();
        }

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('filtersChanged', {
            detail: { visibleCount, totalCount: allCards.length }
        }));
    }

    // =============================================================================
    // UPDATE SEARCH RESULTS INFO
    // =============================================================================

    function updateSearchResults() {
        const searchResultsInfo = document.getElementById('searchResultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        const searchTermElement = document.getElementById('searchTerm');

        if (!searchResultsInfo || !resultsCount) return;

        const visibleCards = Array.from(allCards).filter(card =>
            window.getComputedStyle(card).display !== 'none'
        );

        const hasActiveFilters = activeFilters.size > 0 || searchTerm;

        if (hasActiveFilters) {
            searchResultsInfo.style.display = 'block';
            resultsCount.textContent = `${visibleCards.length} club${visibleCards.length !== 1 ? 's' : ''} found`;

            if (searchTermElement && searchTerm) {
                searchTermElement.textContent = `for "${searchTerm}"`;
                searchTermElement.style.display = 'inline';
            } else if (searchTermElement) {
                searchTermElement.style.display = 'none';
            }
        } else {
            searchResultsInfo.style.display = 'none';
        }
    }

    // =============================================================================
    // CLEAR FILTERS FUNCTIONALITY - FIXES PERSISTENT BUG
    // =============================================================================

    function clearAllFilters() {
        console.log('🧹 Clearing all filters and search...');

        // Clear search input
        if (clubSearch) {
            clubSearch.value = '';
            searchTerm = '';
        }

        // Clear active filters
        activeFilters.clear();

        // Reset all tags
        allTags.forEach(tag => {
            tag.classList.remove('active-filter');
            tag.setAttribute('aria-pressed', 'false');
        });

        // Show all cards
        allCards.forEach(card => {
            card.style.display = 'block';
        });

        // Update search results
        updateSearchResults();

        // Update pagination
        if (window.pagination) {
            window.pagination.updateVisibleCards();
        }

        // Hide filter tags
        filterTags.classList.add('hidden');
        filterTags.setAttribute('aria-hidden', 'true');
        filterToggle.setAttribute('aria-expanded', 'false');

        console.log('✅ All filters cleared successfully');
    }

    // =============================================================================
    // CLEAR BUTTONS SETUP
    // =============================================================================

    // Add clear button to search results if it doesn't exist
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFilters);
    }

    // Add clear button to filter tags if it doesn't exist
    if (!document.getElementById('clearFiltersBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearFiltersBtn';
        clearBtn.textContent = 'Clear All';
        clearBtn.className = 'clear-filters-btn';
        clearBtn.style.cssText = `
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.4rem 0.8rem;
            border-radius: 12px;
            font-size: 0.9rem;
            cursor: pointer;
            margin-left: 1rem;
            transition: all 0.2s ease;
        `;

        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.background = '#c0392b';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.background = '#e74c3c';
        });

        clearBtn.addEventListener('click', clearAllFilters);
        filterTags.appendChild(clearBtn);

        console.log('✅ Added clear filters button');
    }

    // =============================================================================
    // KEYBOARD SHORTCUTS
    // =============================================================================

    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (clubSearch) {
                clubSearch.focus();
            }
        }

        // Escape to clear filters
        if (e.key === 'Escape') {
            if (activeFilters.size > 0 || searchTerm) {
                clearAllFilters();
            }
        }
    });

    // =============================================================================
    // URL PARAMETER SUPPORT - BONUS FEATURE
    // =============================================================================

    function updateURLParams() {
        const url = new URL(window.location);

        if (searchTerm) {
            url.searchParams.set('search', searchTerm);
        } else {
            url.searchParams.delete('search');
        }

        if (activeFilters.size > 0) {
            url.searchParams.set('filters', Array.from(activeFilters).join(','));
        } else {
            url.searchParams.delete('filters');
        }

        // Update URL without page reload
        window.history.replaceState({}, '', url.toString());
    }

    function loadFromURLParams() {
        const url = new URL(window.location);

        // Load search term
        const urlSearch = url.searchParams.get('search');
        if (urlSearch && clubSearch) {
            clubSearch.value = urlSearch;
            searchTerm = urlSearch.toLowerCase().trim();
        }

        // Load filters
        const urlFilters = url.searchParams.get('filters');
        if (urlFilters) {
            const filters = urlFilters.split(',');
            filters.forEach(filter => {
                const tag = document.querySelector(`[data-filter="${filter}"]`);
                if (tag) {
                    activeFilters.add(filter);
                    tag.classList.add('active-filter');
                    tag.setAttribute('aria-pressed', 'true');
                }
            });
        }

        // Apply loaded filters
        if (activeFilters.size > 0 || searchTerm) {
            applyFilters();
            updateSearchResults();
        }
    }

    // Add listeners for URL updates
    document.addEventListener('filtersChanged', updateURLParams);
    document.addEventListener('searchChanged', updateURLParams);

    // Load filters from URL on page load
    loadFromURLParams();

    // =============================================================================
    // PUBLIC API
    // =============================================================================

    window.filterSystem = {
        clearAll: clearAllFilters,
        addFilter: (filter) => {
            const tag = document.querySelector(`[data-filter="${filter}"]`);
            if (tag) handleTagClick(tag);
        },
        removeFilter: (filter) => {
            if (activeFilters.has(filter)) {
                const tag = document.querySelector(`[data-filter="${filter}"]`);
                if (tag) handleTagClick(tag);
            }
        },
        search: (term) => {
            if (clubSearch) {
                clubSearch.value = term;
                searchTerm = term.toLowerCase().trim();
                applyFilters();
                updateSearchResults();
            }
        },
        getActiveFilters: () => Array.from(activeFilters),
        getSearchTerm: () => searchTerm
    };

    console.log('✅ Enhanced filter system initialized');
});

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================

window.debugFilters = function () {
    console.log('🐛 Filter Debug Info:');
    console.log('  Active filters:', window.filterSystem?.getActiveFilters());
    console.log('  Search term:', window.filterSystem?.getSearchTerm());
    console.log('  Visible cards:', document.querySelectorAll('.club-card:not([style*="display: none"])').length);
    console.log('  Total cards:', document.querySelectorAll('.club-card').length);
};