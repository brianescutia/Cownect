// =============================================================================
// SIMPLIFIED NAVBAR PROFILE SCRIPT - For pages that need basic profile sync
// =============================================================================

console.log('🔧 Simplified Navbar Profile script loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing simple navbar profile...');
    await initializeSimpleNavbarProfile();
});

async function initializeSimpleNavbarProfile() {
    try {
        console.log('📡 Fetching user data for simple navbar...');
        const response = await fetch('/api/user');

        if (!response.ok) {
            console.warn('⚠️ User API response not OK:', response.status);
            setSimpleDefaultProfile();
            return;
        }

        const userData = await response.json();
        console.log('📊 User data received:', userData);

        if (userData.isLoggedIn && userData.email) {
            updateSimpleProfile(userData);
        } else {
            console.log('👤 User not logged in');
            setSimpleDefaultProfile();
        }

    } catch (error) {
        console.error('💥 Error fetching user data:', error);
        setSimpleDefaultProfile();
    }
}

function updateSimpleProfile(userData) {
    const emailPrefix = userData.email.split('@')[0];
    const initials = emailPrefix.substring(0, 2).toUpperCase();

    // Update navbar profile circle
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');
    const navbarProfileImage = document.getElementById('navbarProfileImage');

    if (navbarProfileInitials) {
        if (userData.profilePictureUrl && navbarProfileImage) {
            navbarProfileImage.src = userData.profilePictureUrl;
            navbarProfileImage.style.display = 'block';
            navbarProfileInitials.style.display = 'none';
            console.log(`🖼️ Simple navbar image updated: ${userData.profilePictureUrl}`);
        } else {
            navbarProfileInitials.textContent = initials;
            navbarProfileInitials.style.display = 'block';
            if (navbarProfileImage) {
                navbarProfileImage.style.display = 'none';
            }
            console.log(`🎯 Simple navbar initials updated: ${initials}`);
        }
    }

    // Add click handler for navigation
    const profileCircle = document.getElementById('navbarProfileCircle');
    if (profileCircle) {
        profileCircle.style.cursor = 'pointer';
        profileCircle.addEventListener('click', () => {
            window.location.href = '/dashboard';
        });
    }

    console.log('✅ Simple profile updated successfully');
}

function setSimpleDefaultProfile() {
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');
    if (navbarProfileInitials) {
        navbarProfileInitials.textContent = 'UC';
        navbarProfileInitials.style.display = 'block';
    }

    const navbarProfileImage = document.getElementById('navbarProfileImage');
    if (navbarProfileImage) {
        navbarProfileImage.style.display = 'none';
    }

    console.log('🎯 Set simple default profile');
}

// Global function to update profile image on this page
window.updateSimpleProfileImage = function (imageUrl) {
    const navbarProfileImage = document.getElementById('navbarProfileImage');
    const navbarProfileInitials = document.getElementById('navbarProfileInitials');

    if (navbarProfileImage && imageUrl) {
        navbarProfileImage.src = imageUrl;
        navbarProfileImage.style.display = 'block';
        if (navbarProfileInitials) {
            navbarProfileInitials.style.display = 'none';
        }
        console.log('🖼️ Simple profile image updated');
    }
};