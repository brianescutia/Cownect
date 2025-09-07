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
// GENERATE NAVBAR HTML - NO INJECTED CSS
// =============================================================================

function generateNavbarHTML() {
    const currentPage = getCurrentPageId();

    return `
        <nav class="navbar">
            <div class="navbar-container">
                <a href="${NAVBAR_CONFIG.logo.href}" class="logo-title">
                    <img src="${NAVBAR_CONFIG.logo.src}" alt="${NAVBAR_CONFIG.logo.alt}" class="logo" />
                    <span class="logo-text">${NAVBAR_CONFIG.logo.text}</span>
                </a>
                
                <ul class="nav-links">
                    ${NAVBAR_CONFIG.navLinks.map(link => `
                        <li>
                            <a href="${link.href}" 
                               class="nav-link${currentPage === link.id ? ' active' : ''}"
                               ${link.onclick ? `onclick="${link.onclick}; return false;"` : ''}>
                                ${link.text}
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
    console.log('🔄 Injecting clean navbar...');

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

    console.log('✅ Clean navbar injected');

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
        const currentLink = document.querySelector(`.nav-link[href*="${currentPage}"]`);
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
}

// =============================================================================
// GLOBAL NAVIGATION FUNCTIONS
// =============================================================================

function goToDashboard() {
    window.location.href = '/dashboard';
}

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM loaded, initializing clean navbar...');
    injectNavbar();
    setupNavigationListeners();
    console.log('✅ Clean navbar initialization complete');
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
// EXPORT FUNCTIONS FOR GLOBAL USE
// =============================================================================

window.generateNavbarHTML = generateNavbarHTML;
window.injectNavbar = injectNavbar;
window.updateNavbarActiveState = updateNavbarActiveState;
window.refreshNavbar = refreshNavbar;
window.goToDashboard = goToDashboard;

console.log('✅ Clean Navbar Component ready');