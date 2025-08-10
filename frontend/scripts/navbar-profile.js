// =============================================================================
// NAVBAR PROFILE FUNCTIONALITY
// =============================================================================
// Save as frontend/scripts/navbar-profile.js

// Function to navigate to dashboard
function goToDashboard() {
    window.location.href = '/dashboard';
}

// Load user profile data for navbar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🔄 Loading user data for navbar profile...');

        const response = await fetch('/api/user');
        if (response.ok) {
            const userData = await response.json();

            if (userData.isLoggedIn) {
                console.log('✅ User is logged in:', userData.email);
                updateNavbarProfile(userData);
            } else {
                console.log('❌ User is not logged in');
                handleLoggedOutState();
            }
        } else {
            console.warn('⚠️ Failed to fetch user data:', response.status);
            handleLoggedOutState();
        }
    } catch (error) {
        console.error('💥 Error loading user data for navbar:', error);
        handleLoggedOutState();
    }
});

// Update navbar profile with user data
function updateNavbarProfile(userData) {
    const navbarInitials = document.getElementById('navbarProfileInitials');
    if (navbarInitials && userData.email) {
        // Extract initials from email
        const emailPrefix = userData.email.split('@')[0];

        // Try to create meaningful initials
        let initials;
        if (userData.name) {
            // If we have a full name, use first letters of first and last name
            const nameParts = userData.name.split(' ');
            initials = nameParts.map(part => part[0]).join('').substring(0, 2).toUpperCase();
        } else {
            // Otherwise, use first 2 characters of email prefix
            initials = emailPrefix.substring(0, 2).toUpperCase();
        }

        navbarInitials.textContent = initials;

        // Update tooltip
        const profileCircle = document.getElementById('navbarProfileCircle');
        if (profileCircle) {
            profileCircle.title = `${userData.email} - Go to Dashboard`;
        }

        console.log(`🎨 Updated navbar profile: ${initials} for ${userData.email}`);
    }
}

// Handle logged out state
function handleLoggedOutState() {
    const navbarInitials = document.getElementById('navbarProfileInitials');
    if (navbarInitials) {
        navbarInitials.textContent = '?';
    }

    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        profileCircle.title = 'Please log in';
        profileCircle.style.opacity = '0.6';
        profileCircle.onclick = () => {
            window.location.href = '/login';
        };
    }

    console.log('👤 Set navbar to logged out state');
}

// Add hover effects and animations
document.addEventListener('DOMContentLoaded', () => {
    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        // Add keyboard accessibility
        profileCircle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToDashboard();
            }
        });

        // Add focus styles
        profileCircle.addEventListener('focus', () => {
            profileCircle.style.outline = '3px solid rgba(95, 150, 197, 0.5)';
            profileCircle.style.outlineOffset = '2px';
        });

        profileCircle.addEventListener('blur', () => {
            profileCircle.style.outline = 'none';
        });
    }
});

// Export functions for global access
window.goToDashboard = goToDashboard;
window.updateNavbarProfile = updateNavbarProfile;