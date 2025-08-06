// =============================================================================
// ENHANCED CLUB DETAIL PAGE FUNCTIONALITY - Now with Real UC Davis Data
// =============================================================================

//  GLOBAL STATE
let currentClub = null;
let currentSlide = 0;
const slidesToShow = window.innerWidth > 768 ? 2 : 1;

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get club ID from URL PATH
        const pathParts = window.location.pathname.split('/');
        const clubId = pathParts[pathParts.length - 1];

        console.log(' Loading club details for ID:', clubId);

        if (!clubId || clubId === 'club') {
            showError('No club ID provided');
            return;
        }

        // Load club details
        await loadClubDetails(clubId);

        // Set up carousel and other features
        setupEventsCarousel();
        setupBookmarkButton();

        console.log(' Club detail page initialized with real data');

    } catch (error) {
        console.error(' Error initializing club detail page:', error);
        showError('Failed to load club details');
    }
});

// =============================================================================
// LOAD CLUB DETAILS FROM API
// =============================================================================

async function loadClubDetails(clubId) {
    try {
        console.log(` Loading details for club: ${clubId}`);

        const response = await fetch(`/api/clubs/${clubId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        currentClub = await response.json();
        console.log(' Real club data loaded:', currentClub);

        // Update page content with real data
        updatePageContent(currentClub);
        hideLoading();

    } catch (error) {
        console.error(' Error loading club details:', error);
        showError('Club not found');
    }
}

// =============================================================================
// UPDATE PAGE CONTENT WITH REAL DATA
// =============================================================================

function updatePageContent(club) {
    // Update page title
    document.title = `${club.name} | Cownect`;

    // Update club name and category
    updateElement('clubName', club.name);
    updateElement('clubCategory', club.category);

    // Update club description
    updateElement('clubDescription', club.description);

    // Update member count
    updateElement('memberCount', club.memberCount || '0');

    // Update tags with real data
    updateClubTags(club.tags);

    // Update focus areas with real data
    updateFocusAreas(club.focusAreas);

    // Update meeting information with real data
    updateMeetingInfo(club.meetingInfo);

    // Update contact information with real data
    updateContactInfo(club);

    updateHeroImage(club);


    console.log('✅ Page content updated with real UC Davis data');
}

// =============================================================================
// UPDATE SPECIFIC SECTIONS WITH REAL DATA
// =============================================================================

function updateClubTags(tags) {
    const clubTags = document.getElementById('clubTags');
    if (clubTags && tags && tags.length > 0) {
        clubTags.innerHTML = tags.map(tag =>
            `<span class="hero-tag">#${tag}</span>`
        ).join('');
    }
}

function updateFocusAreas(focusAreas) {
    const focusAreasList = document.querySelector('.info-box ul');
    if (focusAreasList && focusAreas && focusAreas.length > 0) {
        focusAreasList.innerHTML = focusAreas.map(area =>
            `<li>${area}</li>`
        ).join('');
    } else if (focusAreasList) {
        // Fallback if no focus areas
        focusAreasList.innerHTML = `
            <li>Programming & Development</li>
            <li>Technical Workshops</li>
            <li>Project Collaboration</li>
            <li>Career Development</li>
        `;
    }
}

function updateMeetingInfo(meetingInfo) {
    const meetingInfoDiv = document.querySelector('.meeting-info');
    if (meetingInfoDiv && meetingInfo) {
        meetingInfoDiv.innerHTML = `
            <p><strong>Frequency:</strong> ${meetingInfo.frequency || 'TBD'}</p>
            <p><strong>Day:</strong> ${meetingInfo.day || 'TBD'}</p>
            <p><strong>Time:</strong> ${meetingInfo.time || 'TBD'}</p>
            <p><strong>Location:</strong> ${meetingInfo.location || 'TBD'}</p>
        `;
    }
}

function updateContactInfo(club) {
    const contactsBox = document.querySelector('.contacts-box');
    if (!contactsBox) return;

    // Build contact info HTML
    let contactHTML = '<h2> Contact & Links</h2><div class="contact-info">';

    // Add officers if available
    if (club.officers && club.officers.length > 0) {
        club.officers.forEach(officer => {
            contactHTML += `
                <div class="contact-item">
                    <strong>${officer.position}:</strong>
                    <p>${officer.name}</p>
                    <p>${officer.email}</p>
                </div>
            `;
        });
    }

    // Add general email if available
    if (club.contactEmail) {
        contactHTML += `
            <div class="contact-item">
                <strong>General Email:</strong>
                <p>${club.contactEmail}</p>
            </div>
        `;
    }

    contactHTML += '</div>';

    // Add social links
    contactHTML += '<div class="social-links">';

    if (club.websiteUrl) {
        contactHTML += `<a href="${club.websiteUrl}" target="_blank" class="social-link">🌐 Website</a>`;
    }

    if (club.instagramUrl) {
        contactHTML += `<a href="${club.instagramUrl}" target="_blank" class="social-link">📱 Instagram</a>`;
    }

    // Add default links if none available
    if (!club.websiteUrl && !club.instagramUrl) {
        contactHTML += `
            <a href="#" class="social-link">🌐 Website</a>
            <a href="#" class="social-link">💬 Discord</a>
            <a href="#" class="social-link">📱 Instagram</a>
        `;
    }

    contactHTML += '</div>';

    // Add action buttons
    contactHTML += `
        <div class="action-buttons">
            <button class="bookmark-btn" id="heroBookmarkBtn">
                <img src="../assets/bookmark.png" alt="Bookmark" class="bookmark-icon" />
                <span>Save Club</span>
            </button>
            <button class="join-btn">
                <span>Join Club</span>
            </button>
        </div>
    `;

    contactsBox.innerHTML = contactHTML;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content !== undefined && content !== null) {
        element.textContent = content;
    }
}

// =============================================================================
// BOOKMARK FUNCTIONALITY (Enhanced)
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

    console.log(' Events carousel set up');
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
    console.log(' Hiding loading overlay...');

    const loadingOverlay = document.getElementById('loadingOverlay');
    const clubContainer = document.getElementById('clubDetailContainer');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        console.log(' Loading overlay hidden');
    }

    if (clubContainer) {
        clubContainer.style.display = 'block';
        console.log(' Club container shown');
    }
}

function showError(message) {
    console.log(' Showing error:', message);

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
        console.log(' Error container shown');
    } else {
        console.warn(' Error container not found');
        alert(`Error: ${message}`);
    }
}
// =============================================================================
// UPDATE THE BIG HERO IMAGE AT TOP OF PAGE
// =============================================================================

function updateHeroImage(club) {
    const heroImage = document.getElementById('clubHeroImage');
    if (heroImage) {
        // Use heroImageUrl if available, otherwise use logoUrl, otherwise default
        const imageUrl = club.heroImageUrl || club.logoUrl || '../assets/default-club-hero.jpg';

        heroImage.src = imageUrl;
        heroImage.onerror = function () {
            // If image fails to load, use default
            this.src = '../assets/default-club-hero.jpg';
        };

        console.log(' Updated big hero image for:', club.name);
    }
}

// =============================================================================
// EVENT LISTENERS FOR DYNAMIC CONTENT
// =============================================================================

// Listen for bookmark changes
document.addEventListener('bookmarkChanged', () => {
    updateBookmarkState();
});

// Handle window resize for carousel
window.addEventListener('resize', () => {
    const newSlidesToShow = window.innerWidth > 768 ? 2 : 1;
    if (newSlidesToShow !== slidesToShow) {
        location.reload();
    }
});

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.slideCarousel = slideCarousel;

// Debug function
window.debugClubDetail = () => {
    console.log(' Club Detail Debug:');
    console.log('  Current club:', currentClub);
    console.log('  Officers:', currentClub?.officers);
    console.log('  Meeting info:', currentClub?.meetingInfo);
    console.log('  Focus areas:', currentClub?.focusAreas);
};