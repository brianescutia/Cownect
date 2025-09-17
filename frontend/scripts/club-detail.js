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

        console.log('🔄 Loading club details for ID:', clubId);

        if (!clubId || clubId === 'club') {
            showError('No club ID provided');
            return;
        }

        // Load club details
        await loadClubDetails(clubId);

        // Set up carousel and other features
        setupEventsCarousel();
        setupBookmarkButton();

        console.log('✅ Club detail page initialized with real data');

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
        console.log(`🔄 Loading details for club: ${clubId}`);

        const response = await fetch(`/api/clubs/${clubId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        currentClub = await response.json();
        console.log('📊 Real club data loaded:', currentClub);

        // Update page content with real data
        updatePageContent(currentClub);
        hideLoading();

    } catch (error) {
        console.error('💥 Error loading club details:', error);
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

    // Update contact information with clickable social links
    updateContactInfo(club);

    // Update hero image
    updateHeroImage(club);

    console.log('✅ Page content updated with functional social links');
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
    let contactHTML = '<h2>📧 Contact & Links</h2><div class="contact-info">';

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

    // Close the contact box
    contactsBox.innerHTML = contactHTML;

    // Create social links underneath the contact box
    createSocialLinks(club);

    // Add click tracking for analytics and handle no-link scenarios
    setupSocialLinkTracking();
}

function createSocialLinks(club) {
    // Remove any existing social links
    const existingSocialLinks = document.querySelector('.social-links');
    if (existingSocialLinks) {
        existingSocialLinks.remove();
    }

    // Create new social links container
    const socialLinksContainer = document.createElement('div');
    socialLinksContainer.className = 'social-links';

    // Website link
    if (club.websiteUrl) {
        const websiteLink = document.createElement('a');
        websiteLink.href = club.websiteUrl;
        websiteLink.target = '_blank';
        websiteLink.className = 'social-link';
        websiteLink.setAttribute('data-club-link', 'website');

        // Add icon image
        const websiteIcon = document.createElement('img');
        websiteIcon.src = '/assets/social-icons/website-icon.png';
        websiteIcon.alt = 'Website';
        websiteLink.appendChild(websiteIcon);

        socialLinksContainer.appendChild(websiteLink);
    }

    // Instagram link with PNG icon
    if (club.instagramUrl) {
        const instagramLink = document.createElement('a');
        instagramLink.href = club.instagramUrl;
        instagramLink.target = '_blank';
        instagramLink.className = 'social-link';
        instagramLink.setAttribute('data-club-link', 'instagram');

        // Add Instagram PNG icon
        const instagramIcon = document.createElement('img');
        instagramIcon.src = '/assets/social-icons/instagram-icon.png';
        instagramIcon.alt = 'Instagram';
        instagramLink.appendChild(instagramIcon);

        socialLinksContainer.appendChild(instagramLink);
    }

    // Discord link with PNG icon
    if (club.discordUrl) {
        const discordLink = document.createElement('a');
        discordLink.href = club.discordUrl;
        discordLink.target = '_blank';
        discordLink.className = 'social-link';
        discordLink.setAttribute('data-club-link', 'discord');

        // Add Discord PNG icon
        const discordIcon = document.createElement('img');
        discordIcon.src = '/assets/social-icons/discord-icon.png';
        discordIcon.alt = 'Discord';
        discordLink.appendChild(discordIcon);

        socialLinksContainer.appendChild(discordLink);
    }

    // Twitter link with PNG icon
    if (club.twitterUrl) {
        const twitterLink = document.createElement('a');
        twitterLink.href = club.twitterUrl;
        twitterLink.target = '_blank';
        twitterLink.className = 'social-link';
        twitterLink.setAttribute('data-club-link', 'twitter');

        // Add Twitter PNG icon
        const twitterIcon = document.createElement('img');
        twitterIcon.src = '/assets/social-icons/twitter-icon.png';
        twitterIcon.alt = 'Twitter';
        twitterLink.appendChild(twitterIcon);

        socialLinksContainer.appendChild(twitterLink);
    }

    // Add default links if no club links are available
    if (!club.websiteUrl && !club.instagramUrl && !club.discordUrl && !club.twitterUrl) {
        const defaultWebsite = document.createElement('a');
        defaultWebsite.href = '#';
        defaultWebsite.className = 'social-link';
        defaultWebsite.setAttribute('data-club-link', 'website');
        const websiteIcon = document.createElement('img');
        websiteIcon.src = '/assets/website-icon.png';
        websiteIcon.alt = 'Website';
        defaultWebsite.appendChild(websiteIcon);
        socialLinksContainer.appendChild(defaultWebsite);

        const defaultInstagram = document.createElement('a');
        defaultInstagram.href = '#';
        defaultInstagram.className = 'social-link';
        defaultInstagram.setAttribute('data-club-link', 'instagram');
        const instagramIcon = document.createElement('img');
        instagramIcon.src = '/assets/instagram-icon.png';
        instagramIcon.alt = 'Instagram';
        defaultInstagram.appendChild(instagramIcon);
        socialLinksContainer.appendChild(defaultInstagram);
    }

    // Add the social links container to the right column
    const rightColumn = document.querySelector('.right-column');
    if (rightColumn && socialLinksContainer.children.length > 0) {
        rightColumn.appendChild(socialLinksContainer);
        console.log('✅ Social links created:', socialLinksContainer.children.length, 'links');
    }
}

function setupSocialLinkTracking() {
    const socialLinks = document.querySelectorAll('.social-link[data-club-link]');

    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.getAttribute('data-club-link');
            const clubName = document.getElementById('clubName')?.textContent || 'Unknown Club';

            // Analytics tracking (replace with your analytics service)
            console.log(`📊 Social link clicked: ${platform} for ${clubName}`);

            // If link has no href or href="#", prevent default and show message
            if (!link.href || link.href.endsWith('#')) {
                e.preventDefault();
                showNoLinkMessage(platform);
            }
        });
    });
}

function showNoLinkMessage(platform) {
    const message = `${platform.charAt(0).toUpperCase() + platform.slice(1)} link not available for this club.`;

    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
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
    }

    if (clubContainer) {
        clubContainer.style.display = 'block';
        console.log('✅ Club container shown');
    }
}

function showError(message) {
    console.log('💥 Showing error:', message);

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
        alert(`Error: ${message}`);
    }
}

// =============================================================================
// UPDATE THE BIG HERO IMAGE AT TOP OF PAGE
// =============================================================================

function updateHeroImage(club) {
    const heroImage = document.getElementById('clubHeroImage');
    if (heroImage) {
        // Use heroImageUrl if available, otherwise fall back to logoUrl
        const imageUrl = club.heroImageUrl || club.logoUrl || '../assets/default-club-hero.jpg';
        const imagePosition = club.heroImagePosition || 'center center';

        heroImage.style.backgroundImage = `url('${imageUrl}')`;
        heroImage.style.backgroundPosition = imagePosition;
        heroImage.style.backgroundSize = 'cover';
        heroImage.style.backgroundRepeat = 'no-repeat';
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
    console.log('🐛 Club Detail Debug:');
    console.log('  Current club:', currentClub);
    console.log('  Officers:', currentClub?.officers);
    console.log('  Meeting info:', currentClub?.meetingInfo);
    console.log('  Focus areas:', currentClub?.focusAreas);
};