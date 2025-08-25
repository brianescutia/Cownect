// =============================================================================
// ENHANCED NAVBAR FUNCTIONALITY - WORKS WITH DYNAMIC NAVBAR
// =============================================================================

console.log('🔧 Enhanced Navbar script loaded successfully!');

// WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing navbar...');

    try {
        // Wait a bit for dynamic navbar to be injected
        await waitForNavbarInjection();

        // Initialize navbar profile
        await initializeNavbarProfile();

        // Set up navbar interactions
        setupNavbarInteractions();

        console.log('✅ Navbar initialization complete');

    } catch (error) {
        console.error('💥 Navbar initialization error:', error);
    }
});

// =============================================================================
// WAIT FOR DYNAMIC NAVBAR INJECTION
// =============================================================================

function waitForNavbarInjection(maxAttempts = 10) {
    return new Promise((resolve) => {
        let attempts = 0;

        const checkNavbar = () => {
            const navbar = document.querySelector('.navbar');
            const profileCircle = document.getElementById('navbarProfileCircle');

            if (navbar && profileCircle) {
                console.log('✅ Dynamic navbar detected');
                resolve();
            } else if (attempts < maxAttempts) {
                attempts++;
                console.log(`🔄 Waiting for navbar injection... (${attempts}/${maxAttempts})`);
                setTimeout(checkNavbar, 50);
            } else {
                console.warn('⚠️ Navbar injection timeout, proceeding anyway');
                resolve();
            }
        };

        checkNavbar();
    });
}

// =============================================================================
// INITIALIZE NAVBAR PROFILE
// =============================================================================

async function initializeNavbarProfile() {
    console.log('🔄 Initializing navbar profile...');

    try {
        console.log('📡 Fetching user data...');
        const response = await fetch('/api/user');

        if (!response.ok) {
            console.warn('⚠️ User API response not OK:', response.status);
            setDefaultProfile();
            return;
        }

        const userData = await response.json();
        console.log('📊 User data received:', userData);

        if (userData.isLoggedIn && userData.email) {
            updateProfileWithUserData(userData);
        } else {
            console.log('👤 User not logged in or no email');
            setDefaultProfile();
        }

    } catch (error) {
        console.error('💥 Error fetching user data:', error);
        setDefaultProfile();
    }
}

// =============================================================================
// UPDATE PROFILE WITH USER DATA
// =============================================================================

function updateProfileWithUserData(userData) {
    console.log('🔄 Updating profile with user data...');
    console.log('🖼️ Profile picture URL from API:', userData.profilePictureUrl);

    // Generate initials from email
    const emailPrefix = userData.email.split('@')[0];
    const initials = emailPrefix.substring(0, 2).toUpperCase();

    console.log(`📝 Generated initials: ${initials} from email: ${userData.email}`);

    // Update navbar profile circle with enhanced image support
    updateNavbarProfileCircle(initials, userData.profilePictureUrl);

    // Update dashboard profile elements if they exist
    updateDashboardProfile(userData, initials);

    // Update any account buttons
    updateAccountButtons(userData);

    console.log('✅ Profile updated successfully');
}

// =============================================================================
// UPDATE NAVBAR PROFILE CIRCLE
// =============================================================================

function updateNavbarProfileCircle(initials, profileImageUrl = null) {
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');
    const navbarProfileImage = document.getElementById('navbarProfileImage');

    console.log('🔄 Updating navbar profile circle...');
    console.log('📝 Initials:', initials);
    console.log('🖼️ Image URL:', profileImageUrl);

    if (!navbarProfileInitials) {
        console.error('❌ Navbar profile initials element not found');
        return;
    }

    // If we have a profile image URL and it's not null/empty, try to load it
    if (profileImageUrl && profileImageUrl.trim() !== '' && navbarProfileImage) {
        console.log('🔄 Loading profile image...');

        // Create a test image to verify the URL loads
        const testImage = new Image();

        testImage.onload = function () {
            console.log('✅ Profile image loaded successfully');
            // Image loaded successfully, show it
            navbarProfileImage.src = profileImageUrl;
            navbarProfileImage.style.display = 'block';
            navbarProfileInitials.style.display = 'none';

            // Add success animation
            const profileCircle = document.getElementById('navbarProfileCircle');
            if (profileCircle) {
                profileCircle.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    profileCircle.style.transform = 'scale(1)';
                }, 200);
            }
        };

        testImage.onerror = function () {
            console.warn('⚠️ Profile image failed to load, showing initials instead');
            console.warn('⚠️ Failed URL:', profileImageUrl);
            // Image failed to load, show initials
            showInitials();
        };

        // Start loading the image
        testImage.src = profileImageUrl;

    } else {
        console.log('📝 No valid profile image URL, showing initials');
        // No image URL provided or it's empty, show initials
        showInitials();
    }

    function showInitials() {
        navbarProfileInitials.textContent = initials;
        navbarProfileInitials.style.display = 'block';

        if (navbarProfileImage) {
            navbarProfileImage.style.display = 'none';
        }

        console.log(`🎯 Navbar profile initials updated: ${initials}`);

        // Add update animation
        const profileCircle = document.getElementById('navbarProfileCircle');
        if (profileCircle) {
            profileCircle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                profileCircle.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// =============================================================================
// UPDATE DASHBOARD PROFILE (if on dashboard page)
// =============================================================================

function updateDashboardProfile(userData, initials) {
    // Update dashboard profile initials/image
    const profileInitials = document.getElementById('profileInitials');
    const profileImageDisplay = document.getElementById('profileImageDisplay');

    if (profileInitials) {
        if (userData.profilePictureUrl && profileImageDisplay) {
            profileImageDisplay.src = userData.profilePictureUrl;
            profileImageDisplay.style.display = 'block';
            profileInitials.style.display = 'none';
            console.log(`🎯 Dashboard profile image updated`);
        } else {
            profileInitials.textContent = initials;
            profileInitials.style.display = 'block';
            if (profileImageDisplay) {
                profileImageDisplay.style.display = 'none';
            }
            console.log(`🎯 Dashboard profile initials updated: ${initials}`);
        }
    }

    // Update email display
    const userEmail = document.getElementById('userEmail');
    if (userEmail && userData.email) {
        userEmail.textContent = userData.email;
        console.log(`📧 Email updated: ${userData.email}`);
    }

    // Update display name
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        const displayName = userData.displayName || userData.name || userData.email.split('@')[0];
        userDisplayName.textContent = displayName;
        console.log(`👤 Display name updated: ${displayName}`);
    }
}

// =============================================================================
// UPDATE ACCOUNT BUTTONS (for other pages)
// =============================================================================

function updateAccountButtons(userData) {
    const accountBtn = document.querySelector('.account-btn');

    if (accountBtn && userData.email) {
        const userName = userData.displayName || userData.name || userData.email.split('@')[0];

        accountBtn.innerHTML = `
            <span style="color: white; margin-right: 10px;">Hi, ${userName}!</span>
            <a href="/dashboard" style="color: white; margin-right: 10px; text-decoration: none;">Dashboard</a>
            <a href="/logout" style="color: white; text-decoration: none;">Logout</a>
        `;
        accountBtn.style.display = 'flex';
        accountBtn.style.alignItems = 'center';

        console.log(`🎯 Account button updated for: ${userName}`);
    }
}

// =============================================================================
// SET DEFAULT PROFILE (fallback)
// =============================================================================

function setDefaultProfile() {
    console.log('🔄 Setting default profile...');

    // Set default initials
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');
    if (navbarProfileInitials) {
        navbarProfileInitials.textContent = 'UC';
        navbarProfileInitials.style.display = 'block';
        console.log('🎯 Set default navbar initials: UC');
    }

    // Hide profile image if it exists
    const navbarProfileImage = document.getElementById('navbarProfileImage');
    if (navbarProfileImage) {
        navbarProfileImage.style.display = 'none';
    }

    const profileInitials = document.getElementById('profileInitials');
    if (profileInitials) {
        profileInitials.textContent = 'UC';
        profileInitials.style.display = 'block';
        console.log('🎯 Set default dashboard initials: UC');
    }

    // Set default account button
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn) {
        accountBtn.innerHTML = 'Login';
        accountBtn.href = '/login';
        console.log('🎯 Set default account button');
    }
}

// =============================================================================
// SETUP NAVBAR INTERACTIONS - ENHANCED FOR DYNAMIC NAVBAR
// =============================================================================

function setupNavbarInteractions() {
    console.log('🔧 Setting up navbar interactions...');

    // LOGO CLICK NAVIGATION - Works with dynamic navbar
    setupLogoClickHandler();

    // PROFILE CIRCLE NAVIGATION - Works with dynamic navbar
    setupProfileClickHandler();

    // NAV LINKS CLICK HANDLERS - Optional enhancement
    setupNavLinksHandlers();

    console.log('✅ Navbar interactions set up');
}

function setupLogoClickHandler() {
    const logoTitle = document.querySelector('.logo-title');
    if (logoTitle) {
        // Remove any existing handlers and onclick attributes
        logoTitle.removeAttribute('onclick');

        // Add event listener (this won't duplicate if called multiple times)
        logoTitle.addEventListener('click', (e) => {
            // Allow normal link behavior, but log it
            console.log('🎯 Logo clicked - navigating to dashboard');
        });

        console.log('🎯 Logo click handler added');
    }
}

function setupProfileClickHandler() {
    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        // Remove any existing onclick attributes
        profileCircle.removeAttribute('onclick');

        // Add event listener
        profileCircle.addEventListener('click', () => {
            console.log('🎯 Profile circle clicked - navigating to dashboard');
            window.location.href = '/dashboard';
        });

        // Ensure it looks clickable
        profileCircle.style.cursor = 'pointer';

        console.log('🎯 Profile circle navigation set up');
    }
}

function setupNavLinksHandlers() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Log navigation for debugging
            console.log(`🔗 Navigating to: ${link.href}`);

            // Update active state immediately (before page loads)
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    if (navLinks.length > 0) {
        console.log(`🎯 Set up handlers for ${navLinks.length} nav links`);
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

window.refreshProfileImage = async function () {
    console.log('🔄 Manually refreshing profile image...');

    try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        console.log('📊 Fresh user data:', userData);

        if (userData.isLoggedIn && userData.email) {
            const emailPrefix = userData.email.split('@')[0];
            const initials = emailPrefix.substring(0, 2).toUpperCase();
            updateNavbarProfileCircle(initials, userData.profilePictureUrl);
        }

    } catch (error) {
        console.error('💥 Error refreshing profile image:', error);
    }
};

// Function to refresh navbar profile (can be called from other scripts)
window.refreshNavbarProfile = async function () {
    console.log('🔄 Refreshing navbar profile...');
    await initializeNavbarProfile();
};

// Manual test function for debugging
window.updateProfileImage = function (imageUrl) {
    console.log('🖼️ Updating profile image across all pages...');

    // Update navbar profile image
    const navbarProfileImage = document.getElementById('navbarProfileImage');
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');

    if (navbarProfileImage && imageUrl) {
        navbarProfileImage.src = imageUrl;
        navbarProfileImage.style.display = 'block';
        if (navbarProfileInitials) {
            navbarProfileInitials.style.display = 'none';
        }
    }

    // Update dashboard profile image if on dashboard
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const profileInitials = document.getElementById('profileInitials');

    if (profileImageDisplay && imageUrl) {
        profileImageDisplay.src = imageUrl;
        profileImageDisplay.style.display = 'block';
        if (profileInitials) {
            profileInitials.style.display = 'none';
        }
    }

    console.log('✅ Profile image updated across all pages');
};

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================

window.debugProfile = function () {
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');
    const navbarProfileImage = document.getElementById('navbarProfileImage');

    console.log('🔍 Profile Debug Information:');
    console.log('  Initials element:', navbarProfileInitials);
    console.log('  Initials display:', navbarProfileInitials?.style.display);
    console.log('  Initials text:', navbarProfileInitials?.textContent);
    console.log('  Image element:', navbarProfileImage);
    console.log('  Image display:', navbarProfileImage?.style.display);
    console.log('  Image src:', navbarProfileImage?.src);

    // Test API call
    fetch('/api/user').then(r => r.json()).then(data => {
        console.log('  API response:', data);
        console.log('  Profile picture URL:', data.profilePictureUrl);
    });
};

window.debugNavbar = function () {
    console.log('🔍 Navbar Debug Information:');
    console.log('  Current URL:', window.location.href);
    console.log('  Navbar element:', document.querySelector('.navbar'));
    console.log('  Profile circle:', document.getElementById('navbarProfileCircle'));
    console.log('  Profile initials:', document.getElementById('navbarProfileInitials'));
    console.log('  Profile image:', document.getElementById('navbarProfileImage'));
    console.log('  Nav links:', document.querySelectorAll('.nav-link'));
    console.log('  Active links:', document.querySelectorAll('.nav-link.active'));
};

// Export for other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavbarProfile,
        updateProfileWithUserData,
        setDefaultProfile,
        updateProfileImage
    };
}

console.log('✅ Enhanced Navbar with Dynamic Support ready');