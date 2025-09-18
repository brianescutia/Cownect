// =============================================================================
// DYNAMIC NAVBAR COMPONENT - WITH MENTOR MATCHING
// Replace your existing navbar-component.js with this version
// =============================================================================

console.log('🔧 Dynamic Navbar Component loaded');

// =============================================================================
// NAVBAR CONFIGURATION
// =============================================================================

const NAVBAR_CONFIG = {
    logo: {
        src: "../assets/cowLogo.png",
        alt: "Cownect Logo",
        text: "Cownect",
        href: "/dashboard"
    },

    navLinks: [
        {
            text: "Tech Clubs",
            href: "/tech-clubs",
            id: "tech-clubs"
        },
        {
            text: "Events",
            href: "/events",
            id: "events"
        },
        {
            text: "Niche Test",
            href: "/niche-landing",
            id: "niche-test"
        },
        {
            text: "Mentor Matching",
            href: "/mentor-matching",
            id: "mentor-matching"
        }
    ]
};

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

function getScreenSize() {
    const width = window.innerWidth;
    if (width <= 360) return 'xs';
    if (width <= 480) return 'sm';
    if (width <= 768) return 'md';
    if (width <= 992) return 'lg';
    if (width <= 1200) return 'xl';
    return 'xxl';
}

function isMobileView() {
    return window.innerWidth <= 480;
}

function shouldUseHamburger() {
    return window.innerWidth <= 360;
}

// =============================================================================
// GENERATE NAVBAR HTML - RESPONSIVE DESIGN
// =============================================================================

function generateNavbarHTML() {
    const currentPage = getCurrentPageId();
    const isHamburger = shouldUseHamburger();
    const screenSize = getScreenSize();

    return `
        <nav class="navbar" data-screen-size="${screenSize}">
            <div class="navbar-container">
                <a href="${NAVBAR_CONFIG.logo.href}" class="logo-title">
                    <img src="${NAVBAR_CONFIG.logo.src}" alt="${NAVBAR_CONFIG.logo.alt}" class="logo" />
                    <span class="logo-text">${NAVBAR_CONFIG.logo.text}</span>
                </a>
                
                ${isHamburger ? generateHamburgerButton() : ''}
                
                <ul class="nav-links${isHamburger ? ' hamburger-menu' : ''}" id="navLinks">
                    ${NAVBAR_CONFIG.navLinks.map(link => `
                        <li>
                            <a href="${link.href}" 
                               class="nav-link${currentPage === link.id ? ' active' : ''}"
                               data-page="${link.id}"
                               ${link.onclick ? `onclick="${link.onclick}; return false;"` : ''}
                               ${isHamburger ? `onclick="closeHamburgerMenu()"` : ''}>
                                ${getResponsiveLinkText(link.text, screenSize)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="navbar-profile-circle" id="navbarProfileCircle" onclick="goToDashboard()" title="Go to Dashboard">
                <img id="navbarProfileImage" 
                     src="" 
                     alt="Profile" 
                     style="display: none; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; position: absolute; top: 0; left: 0;">
                <span id="navbarProfileInitials">--</span>
            </div>
        </nav>
    `;
}

function generateHamburgerButton() {
    return `
        <button class="hamburger-toggle" onclick="toggleHamburgerMenu()" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
        </button>
    `;
}

function getResponsiveLinkText(text, screenSize) {
    const width = window.innerWidth;

    // Progressive text shortening based on actual screen width
    if (width <= 320) {
        // Ultra-tiny: Show only icons or single letters
        const ultraShortTexts = {
            'Tech Clubs': 'TC',
            'Events': 'E',
            'Niche Test': 'N',
            'Mentor Matching': 'M'
        };
        return ultraShortTexts[text] || text.charAt(0);
    } else if (width <= 400) {
        // Very small: Shortened versions
        const shortTexts = {
            'Tech Clubs': 'Tech',
            'Events': 'Events',
            'Niche Test': 'Niche',
            'Mentor Matching': 'Mentor'
        };
        return shortTexts[text] || text;
    } else if (width <= 600) {
        // Small: Slightly shorter
        const mediumTexts = {
            'Tech Clubs': 'Tech Clubs',
            'Events': 'Events',
            'Niche Test': 'Niche Test',
            'Mentor Matching': 'Mentor Match'
        };
        return mediumTexts[text] || text;
    }

    return text; // Full text for larger screens
}

// =============================================================================
// HAMBURGER MENU FUNCTIONALITY
// =============================================================================

function toggleHamburgerMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger-toggle');

    if (navLinks && hamburger) {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Add animation classes to hamburger lines
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    }
}

function closeHamburgerMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger-toggle');

    if (navLinks && hamburger) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');

        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('active'));
    }
}

// =============================================================================
// RESPONSIVE RESIZE HANDLER
// =============================================================================

function handleResize() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const screenSize = getScreenSize();
        const width = window.innerWidth;
        navbar.setAttribute('data-screen-size', screenSize);
        navbar.setAttribute('data-width', width);

        // Progressive text updates
        updateNavbarText();

        // Close hamburger menu if screen becomes larger
        if (!shouldUseHamburger()) {
            closeHamburgerMenu();
        }

        // Update navbar if layout needs to change significantly
        const wasHamburger = document.querySelector('.hamburger-toggle') !== null;
        const shouldBeHamburger = shouldUseHamburger();

        if (wasHamburger !== shouldBeHamburger) {
            injectNavbar();
        }
    }

    // Update profile circle size based on screen
    updateProfileCircleSize();
}

function updateNavbarText() {
    const width = window.innerWidth;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const originalText = link.getAttribute('data-original-text') || link.textContent;
        if (!link.getAttribute('data-original-text')) {
            link.setAttribute('data-original-text', originalText);
        }

        const newText = getResponsiveLinkText(originalText, getScreenSize());
        link.textContent = newText;
    });
}

function updateProfileCircleSize() {
    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        const screenSize = getScreenSize();
        profileCircle.setAttribute('data-screen-size', screenSize);
    }
}

// =============================================================================
// DETECT CURRENT PAGE
// =============================================================================

function getCurrentPageId() {
    const path = window.location.pathname;

    const pageMap = {
        '/tech-clubs': 'tech-clubs',
        '/events': 'events',
        '/niche-landing': 'niche-test',
        '/niche-quiz': 'niche-test',
        '/mentor-matching': 'mentor-matching',
        '/dashboard': 'dashboard'
    };

    if (pageMap[path]) {
        return pageMap[path];
    }

    // Check for partial matches
    if (path.includes('tech-clubs') || path.includes('club-detail')) {
        return 'tech-clubs';
    }
    if (path.includes('events')) {
        return 'events';
    }
    if (path.includes('niche')) {
        return 'niche-test';
    }
    if (path.includes('mentor')) {
        return 'mentor-matching';
    }

    return null;
}

// =============================================================================
// INJECT NAVBAR INTO PAGE
// =============================================================================

function injectNavbar() {
    console.log('🔄 Injecting responsive navbar...');

    let navbarContainer = document.querySelector('.navbar');

    if (!navbarContainer) {
        navbarContainer = document.createElement('div');
        navbarContainer.id = 'dynamic-navbar-container';
        document.body.insertBefore(navbarContainer, document.body.firstChild);
    } else {
        navbarContainer.outerHTML = generateNavbarHTML();
        return;
    }

    navbarContainer.innerHTML = generateNavbarHTML();

    // Set initial screen size
    handleResize();

    console.log('✅ Responsive navbar injected');

    setTimeout(() => {
        if (window.initializeNavbarProfile) {
            window.initializeNavbarProfile();
        }
    }, 100);
}

// =============================================================================
// UPDATE ACTIVE STATE
// =============================================================================

function updateNavbarActiveState() {
    const currentPage = getCurrentPageId();

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    if (currentPage) {
        const currentLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    console.log(`🎯 Active state updated for page: ${currentPage}`);
}

// =============================================================================
// NAVBAR REFRESH FUNCTION
// =============================================================================

function refreshNavbar() {
    console.log('🔄 Refreshing navbar...');
    injectNavbar();
    updateNavbarActiveState();
    setupResponsiveListeners();
}

// =============================================================================
// RESPONSIVE EVENT LISTENERS
// =============================================================================

function setupResponsiveListeners() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });

    // Orientation change handler
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 300); // Delay for orientation change
    });

    // Close hamburger menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger-toggle');
        const navLinks = document.getElementById('navLinks');

        if (navbar && hamburger && navLinks &&
            !navbar.contains(e.target) &&
            navLinks.classList.contains('active')) {
            closeHamburgerMenu();
        }
    });

    // Handle escape key to close hamburger menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHamburgerMenu();
        }
    });
}

// =============================================================================
// GLOBAL NAVIGATION FUNCTIONS
// =============================================================================

function goToDashboard() {
    window.location.href = '/dashboard';
}

// =============================================================================
// INTERSECTION OBSERVER FOR PERFORMANCE
// =============================================================================

function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('navbar-visible');
                } else {
                    entry.target.classList.remove('navbar-visible');
                }
            });
        });

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            observer.observe(navbar);
        }
    }
}

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM loaded, initializing responsive navbar...');
    injectNavbar();
    setupNavigationListeners();
    setupResponsiveListeners();
    setupIntersectionObserver();
    console.log('✅ Responsive navbar initialization complete');
});

// =============================================================================
// NAVIGATION EVENT LISTENERS
// =============================================================================

function setupNavigationListeners() {
    window.addEventListener('popstate', () => {
        updateNavbarActiveState();
    });

    window.addEventListener('hashchange', () => {
        updateNavbarActiveState();
    });
}

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

// Preload critical resources
function preloadCriticalResources() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Preload logo if not already loaded
            const logo = new Image();
            logo.src = NAVBAR_CONFIG.logo.src;
        });
    }
}

// =============================================================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// =============================================================================

window.generateNavbarHTML = generateNavbarHTML;
window.injectNavbar = injectNavbar;
window.updateNavbarActiveState = updateNavbarActiveState;
window.refreshNavbar = refreshNavbar;
window.goToDashboard = goToDashboard;
window.toggleHamburgerMenu = toggleHamburgerMenu;
window.closeHamburgerMenu = closeHamburgerMenu;
window.handleResize = handleResize;
window.getScreenSize = getScreenSize;

// Initialize performance optimizations
preloadCriticalResources();

console.log('✅ Enhanced Responsive Navbar Component ready');