// =============================================================================
// CLUB DETAIL PAGE FUNCTIONALITY
// =============================================================================

// 🎯 GLOBAL STATE
let currentClub = null;
let currentSlide = 0;
const slidesToShow = window.innerWidth > 768 ? 2 : 1;

// 🎯 WAIT FOR PAGE TO LOAD
// 🎯 WAIT FOR PAGE TO LOAD - FIXED VERSION
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get club ID from URL PATH (not query parameters)
        const pathParts = window.location.pathname.split('/');
        const clubId = pathParts[pathParts.length - 1]; // Gets the last part of the path

        console.log('🔍 URL pathname:', window.location.pathname);
        console.log('🔍 Path parts:', pathParts);
        console.log('🔍 Extracted club ID:', clubId);

        if (!clubId || clubId === 'club') {
            showError('No club ID provided');
            return;
        }

        // Load club details
        await loadClubDetails(clubId);

        // Set up carousel
        setupEventsCarousel();

        // Set up bookmark functionality
        setupBookmarkButton();

        console.log('✅ Club detail page initialized');

    } catch (error) {
        console.error('💥 Error initializing club detail page:', error);
        showError('Failed to load club details');
    }
});

// =============================================================================
// LOAD CLUB DETAILS FROM API
// =============================================================================

async function loadClubDetails(clubId) {
    try {
        console.log(`📡 Loading details for club: ${clubId}`);

        const response = await fetch(`/api/clubs/${clubId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        currentClub = await response.json();
        console.log('📦 Club data loaded:', currentClub);

        // Update page content
        updatePageContent(currentClub);
        hideLoading();

    } catch (error) {
        console.error('💥 Error loading club details:', error);
        showError('Club not found');
    }
}

// =============================================================================
// UPDATE PAGE CONTENT
// =============================================================================

function updatePageContent(club) {
    // Update page title
    document.title = `${club.name} | Cownect`;

    // Update club logo
    const clubLogo = document.getElementById('clubLogo');
    if (clubLogo) {
        clubLogo.src = club.logoUrl;
        clubLogo.alt = `${club.name} Logo`;
    }

    // Update club name
    const clubName = document.getElementById('clubName');
    if (clubName) {
        clubName.textContent = club.name;
    }

    // Update club category
    const clubCategory = document.getElementById('clubCategory');
    if (clubCategory) {
        clubCategory.textContent = club.category;
    }

    // Update club description
    const clubDescription = document.getElementById('clubDescription');
    if (clubDescription) {
        clubDescription.textContent = club.description;
    }

    // Update member count
    const memberCount = document.getElementById('memberCount');
    if (memberCount) {
        memberCount.textContent = club.memberCount || '0';
    }

    // Update tags
    const clubTags = document.getElementById('clubTags');
    if (clubTags && club.tags) {
        clubTags.innerHTML = club.tags.map(tag =>
            `<span class="hero-tag">#${tag}</span>`
        ).join('');
    }

    console.log('✅ Page content updated');
}

// =============================================================================
// BOOKMARK FUNCTIONALITY
// =============================================================================

function setupBookmarkButton() {
    const bookmarkBtn = document.getElementById('heroBookmarkBtn');

    if (bookmarkBtn && currentClub) {
        // Add club ID to bookmark button
        const bookmarkIcon = bookmarkBtn.querySelector('.bookmark-icon');
        if (bookmarkIcon) {
            bookmarkIcon.setAttribute('data-club-id', currentClub._id);
        }

        // Update bookmark state
        updateBookmarkState();
    }
}

async function updateBookmarkState() {
    if (!currentClub) return;

    try {
        // Check if club is bookmarked
        const response = await fetch(`/api/bookmarks/check/${currentClub._id}`);
        const data = await response.json();

        const bookmarkBtn = document.getElementById('heroBookmarkBtn');
        const bookmarkText = bookmarkBtn.querySelector('span');

        if (data.isBookmarked) {
            bookmarkBtn.classList.add('bookmarked');
            bookmarkText.textContent = 'Saved';
            bookmarkBtn.style.background = 'rgba(39, 174, 96, 0.2)';
            bookmarkBtn.style.color = '#27ae60';
        } else {
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkText.textContent = 'Save Club';
            bookmarkBtn.style.background = '';
            bookmarkBtn.style.color = '';
        }

    } catch (error) {
        console.error('💥 Error checking bookmark status:', error);
    }
}

// =============================================================================
// EVENTS CAROUSEL FUNCTIONALITY
// =============================================================================

function setupEventsCarousel() {
    const carousel = document.getElementById('eventsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel || !prevBtn || !nextBtn) {
        console.warn('⚠️ Carousel elements not found');
        return;
    }

    // Set up navigation buttons
    prevBtn.addEventListener('click', () => {
        slideCarousel('prev');
    });

    nextBtn.addEventListener('click', () => {
        slideCarousel('next');
    });

    // Set up touch/swipe support for mobile
    let startX = 0;
    let scrollLeft = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('touchend', () => {
        startX = 0;
    });

    console.log('✅ Events carousel set up');
}

function slideCarousel(direction) {
    const carousel = document.getElementById('eventsCarousel');
    const cardWidth = 350 + 24; // card width + gap

    if (direction === 'next') {
        carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function hideLoading() {
    console.log('🔄 Hiding loading overlay...');

    const loadingOverlay = document.getElementById('loadingOverlay');
    const clubContainer = document.getElementById('clubDetailContainer');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        console.log('✅ Loading overlay hidden');
    } else {
        console.warn('⚠️ Loading overlay not found');
    }

    if (clubContainer) {
        clubContainer.style.display = 'block';
        console.log('✅ Club container shown');
    } else {
        console.warn('⚠️ Club container not found');
    }
}

// =============================================================================
// EVENT LISTENERS FOR DYNAMIC CONTENT
// =============================================================================

// Listen for bookmark changes from the bookmark system
document.addEventListener('bookmarkChanged', () => {
    updateBookmarkState();
});

// Handle window resize for carousel
window.addEventListener('resize', () => {
    // Recalculate slides to show based on screen size
    const newSlidesToShow = window.innerWidth > 768 ? 2 : 1;
    if (newSlidesToShow !== slidesToShow) {
        location.reload(); // Simple solution - could be enhanced
    }
});

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.slideCarousel = slideCarousel;

// Debug function
window.debugClubDetail = () => {
    console.log('🐛 Club Detail Debug:');
    console.log('  Current club:', currentClub);
    console.log('  Current slide:', currentSlide);
    console.log('  URL params:', new URLSearchParams(window.location.search).get('id'));
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function hideLoading() {
    console.log('🔄 Hiding loading overlay...');

    const loadingOverlay = document.getElementById('loadingOverlay');
    const clubContainer = document.getElementById('clubDetailContainer');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        console.log('✅ Loading overlay hidden');
    } else {
        console.warn('⚠️ Loading overlay not found');
    }

    if (clubContainer) {
        clubContainer.style.display = 'block';
        console.log('✅ Club container shown');
    } else {
        console.warn('⚠️ Club container not found');
    }
}

function showError(message) {
    console.log('❌ Showing error:', message);

    const loadingOverlay = document.getElementById('loadingOverlay');
    const clubContainer = document.getElementById('clubDetailContainer');
    const errorContainer = document.getElementById('errorContainer');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    if (clubContainer) {
        clubContainer.style.display = 'none';
    }

    if (errorContainer) {
        errorContainer.style.display = 'flex';
        const errorText = errorContainer.querySelector('p');
        if (errorText) {
            errorText.textContent = message;
        }
        console.log('✅ Error container shown');
    } else {
        console.warn('⚠️ Error container not found');
        // Fallback: show alert if error container doesn't exist
        alert(`Error: ${message}`);
    }
}