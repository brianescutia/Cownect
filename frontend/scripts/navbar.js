// =============================================================================
// ENHANCED NAVBAR FUNCTIONALITY - RESTORED NAVIGATION, NO AUTO-SCROLL
// =============================================================================

console.log('🔧 Enhanced Navbar script loaded successfully!');

// WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing navbar...');

    try {
        // Initialize navbar profile
        await initializeNavbarProfile();

        // Set up navbar interactions (restored navigation, no auto-scroll)
        setupNavbarInteractions();

        console.log('✅ Navbar initialization complete');

    } catch (error) {
        console.error('💥 Navbar initialization error:', error);
    }
});

// =============================================================================
// INITIALIZE NAVBAR PROFILE
// =============================================================================

async function initializeNavbarProfile() {
    console.log('🔄 Initializing navbar profile...');

    try {
        // Get user data from API
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

    // Generate initials from email
    const emailPrefix = userData.email.split('@')[0];
    const initials = emailPrefix.substring(0, 2).toUpperCase();

    console.log(`📝 Generated initials: ${initials} from email: ${userData.email}`);

    // Update navbar profile circle
    updateNavbarProfileCircle(initials);

    // Update dashboard profile elements if they exist
    updateDashboardProfile(userData, initials);

    // Update any account buttons
    updateAccountButtons(userData);

    console.log('✅ Profile updated successfully');
}

// =============================================================================
// UPDATE NAVBAR PROFILE CIRCLE
// =============================================================================

function updateNavbarProfileCircle(initials) {
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');

    if (navbarProfileInitials) {
        navbarProfileInitials.textContent = initials;
        console.log(`🎯 Navbar profile circle updated: ${initials}`);

        // Add a subtle animation to show it updated
        navbarProfileInitials.style.transform = 'scale(1.1)';
        setTimeout(() => {
            navbarProfileInitials.style.transform = 'scale(1)';
        }, 200);
    } else {
        console.warn('⚠️ Navbar profile initials element not found');
    }
}

// =============================================================================
// UPDATE DASHBOARD PROFILE (if on dashboard page)
// =============================================================================

function updateDashboardProfile(userData, initials) {
    // Update dashboard profile initials
    const profileInitials = document.getElementById('profileInitials');
    if (profileInitials) {
        profileInitials.textContent = initials;
        console.log(`🎯 Dashboard profile initials updated: ${initials}`);
    }

    // Update email display
    const userEmail = document.getElementById('userEmail');
    if (userEmail && userData.email) {
        userEmail.textContent = userData.email;
        console.log(`📧 Email updated: ${userData.email}`);
    }

    // Update major display (use provided major or default)
    const userMajor = document.getElementById('userMajor');
    if (userMajor) {
        const major = userData.major || 'Computer Science';
        userMajor.textContent = major;
        console.log(`🎓 Major updated: ${major}`);
    }
}

// =============================================================================
// UPDATE ACCOUNT BUTTONS (for other pages)
// =============================================================================

function updateAccountButtons(userData) {
    const accountBtn = document.querySelector('.account-btn');

    if (accountBtn && userData.email) {
        const userName = userData.email.split('@')[0];

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
        console.log('🎯 Set default navbar initials: UC');
    }

    const profileInitials = document.getElementById('profileInitials');
    if (profileInitials) {
        profileInitials.textContent = 'UC';
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
// SETUP NAVBAR INTERACTIONS - RESTORED NAVIGATION WITHOUT AUTO-SCROLL
// =============================================================================

function setupNavbarInteractions() {
    console.log('🔧 Setting up navbar interactions (navigation restored, no auto-scroll)...');

    // LOGO CLICK NAVIGATION (without auto-scroll)
    const logoTitle = document.querySelector('.logo-title');
    if (logoTitle && !logoTitle.href && !logoTitle.closest('a')) {
        // Only add click handler if it's not already wrapped in an <a> tag
        logoTitle.style.cursor = 'pointer';
        logoTitle.addEventListener('click', () => {
            // Simple navigation without auto-scroll
            window.location.href = '/dashboard';
        });
        console.log('🎯 Logo click handler added (no auto-scroll)');
    }

    // PROFILE CIRCLE NAVIGATION (without auto-scroll) - RESTORED
    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        // Remove any existing onclick attributes
        profileCircle.removeAttribute('onclick');

        // Add click handler for navigation without auto-scroll
        profileCircle.style.cursor = 'pointer'; // RESTORED clickable cursor
        profileCircle.addEventListener('click', () => {
            console.log('🎯 Profile circle clicked - navigating to dashboard');
            window.location.href = '/dashboard';
        });

        console.log('🎯 Profile circle navigation restored (no auto-scroll)');
    }

    console.log('✅ Navbar interactions set up without auto-scroll');
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Function to refresh navbar profile (can be called from other scripts)
window.refreshNavbarProfile = async function () {
    console.log('🔄 Refreshing navbar profile...');
    await initializeNavbarProfile();
};

// Manual test function for debugging
window.testNavbar = function () {
    const btn = document.querySelector('.account-btn');
    const initials = document.getElementById('navbarProfileInitials');

    if (btn) {
        btn.innerHTML = 'TEST WORKED!';
        btn.style.backgroundColor = 'red';
        console.log('🧪 Account button test successful!');
    }

    if (initials) {
        initials.textContent = 'TEST';
        initials.style.backgroundColor = 'red';
        console.log('🧪 Profile initials test successful!');
    } else {
        console.log('❌ Button or initials not found');
    }
};

// Debug function
window.debugNavbar = function () {
    console.log('🔍 Navbar Debug Information:');
    console.log('  Current URL:', window.location.href);
    console.log('  Navbar profile circle:', document.getElementById('navbarProfileCircle'));
    console.log('  Profile initials:', document.getElementById('navbarProfileInitials'));
    console.log('  Account button:', document.querySelector('.account-btn'));
    console.log('  Logo title:', document.querySelector('.logo-title'));
    console.log('  Auto-scroll behaviors: DISABLED');
};

// Export for other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavbarProfile,
        updateProfileWithUserData,
        setDefaultProfile
    };
}