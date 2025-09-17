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
    const allCards = document.querySelectorAll('.club-card');

    // FILTER STATE
    let activeFilters = new Set();
    let searchTerm = '';

    if (!filterToggle || !filterTags) {
        console.warn('⚠️ Filter elements not found');
        return;
    }

    // =============================================================================
    // FILTER CATEGORIES AND OPTIONS
    // =============================================================================
    const FILTER_CATEGORIES = {
        field: [
            "Software",
            "Hardware",
            "Data Science",
            "AI/ML",
            "Robotics",
            "Web Dev",
            "Game Dev",
            "Cybersecurity",
            "Aerospace",
            "Mechanical",
            "Electrical",
            "Civil",
            "Biomedical"
        ],
        focus: [
            "Build Projects",
            "Competitions",
            "Hackathons",
            "Research",
            "Workshops",
            "Professional Dev",
            "Networking",
            "Mentorship",
            "Beginner Friendly"
        ],
        community: [
            "Women in Tech",
            "LGBTQ+",
            "Black/African",
            "Hispanic/Latino",
            "Asian/Pacific",
            "Native American",
            "Honor Society",
            "Open to All"
        ]
    };

    // =============================================================================
    // TAG CLICK HANDLER - SINGLE DEFINITION
    // =============================================================================
    function handleTagClick(tag) {
        const filter = tag.getAttribute('data-filter');
        if (!filter) return;

        console.log(`🏷️ Tag clicked: ${filter}`);

        // Toggle filter state
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
            tag.classList.remove('active-filter', 'active');
            tag.setAttribute('aria-pressed', 'false');
            console.log(`➖ Removed filter: ${filter}`);
        } else {
            activeFilters.add(filter);
            tag.classList.add('active-filter', 'active');
            tag.setAttribute('aria-pressed', 'true');
            console.log(`➕ Added filter: ${filter}`);
        }

        // Apply filters
        applyFilters();
        updateSearchResults();
    }

    // =============================================================================
    // GENERATE FILTER UI
    // =============================================================================
    function generateFilterUI() {
        const filterContainer = document.getElementById('filterTags');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';

        // Store dropdown references
        const dropdowns = [];

        // Create filter pills for each category
        Object.entries(FILTER_CATEGORIES).forEach(([category, options]) => {
            // Create pill button
            const pill = document.createElement('button');
            pill.className = 'filter-pill';
            pill.textContent = category.charAt(0).toUpperCase() + category.slice(1);

            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'filter-dropdown';

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'filter-options';

            options.forEach(option => {
                const tag = document.createElement('div');
                tag.className = 'filter-tag tag';
                tag.setAttribute('data-filter', option);
                tag.textContent = option;

                // Add click handler for individual tags
                tag.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleTagClick(tag);
                });

                optionsContainer.appendChild(tag);
            });

            dropdown.appendChild(optionsContainer);
            dropdowns.push({ pill, dropdown });

            // Toggle dropdown on pill click
            pill.addEventListener('click', (e) => {
                e.stopPropagation();

                const isActive = dropdown.classList.contains('active');

                // Close all dropdowns
                dropdowns.forEach(({ pill: p, dropdown: d }) => {
                    p.classList.remove('active');
                    d.classList.remove('active');
                });

                // Toggle current dropdown
                if (!isActive) {
                    pill.classList.add('active');
                    dropdown.classList.add('active');
                }
            });

            filterContainer.appendChild(pill);
            filterContainer.appendChild(dropdown);
        });

        // Add Clear All button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-all-btn';
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => {
            clearAllFilters();
            // Close all dropdowns
            dropdowns.forEach(({ pill, dropdown }) => {
                pill.classList.remove('active');
                dropdown.classList.remove('active');
            });
        });
        filterContainer.appendChild(clearBtn);

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            dropdowns.forEach(({ pill, dropdown }) => {
                pill.classList.remove('active');
                dropdown.classList.remove('active');
            });
        });
    }

    // Generate the UI first
    generateFilterUI();

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
            filterTags.style.display = 'flex';
            filterToggle.setAttribute('aria-expanded', 'true');
            console.log('✅ Filters shown');
        } else {
            filterTags.classList.add('hidden');
            filterTags.style.display = 'none';
            filterToggle.setAttribute('aria-expanded', 'false');
            console.log('✅ Filters hidden');
        }
    });

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
    // APPLY FILTERS FUNCTION
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

            // CHECK ACTIVE FILTERS - Match ANY filter (OR logic)
            if (isVisible && activeFilters.size > 0) {
                const cardTags = card.querySelector('.club-tags')?.textContent || '';

                let matchesAnyFilter = false;
                for (const filter of activeFilters) {
                    // Case-insensitive partial match
                    if (cardTags.toLowerCase().includes(filter.toLowerCase())) {
                        matchesAnyFilter = true;
                        break;
                    }
                }

                if (!matchesAnyFilter) {
                    isVisible = false;
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
    // CLEAR FILTERS FUNCTIONALITY
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
        document.querySelectorAll('.tag').forEach(tag => {
            tag.classList.remove('active-filter', 'active');
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

        console.log('✅ All filters cleared successfully');
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

    // Start with filters hidden
    filterTags.classList.add('hidden');
    filterTags.style.display = 'none';

    console.log('✅ Enhanced filter system initialized');
});