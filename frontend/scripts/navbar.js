// =============================================================================
// DYNAMIC NAVBAR FUNCTIONALITY
// =============================================================================
// This file makes the navbar respond to user login status
// Shows different content for logged-in vs logged-out users

// 🎯 WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {

    // 🔍 FIND NAVBAR ELEMENTS
    // The account button that we'll modify based on login status
    const accountBtn = document.querySelector('.account-btn');

    if (!accountBtn) {
        console.log('Account button not found - might be on a page without navbar');
        return;
    }

    try {
        // 📡 CHECK USER STATUS - Call our API endpoint
        const response = await fetch('/api/user');
        const userData = await response.json();

        // 🎭 UPDATE NAVBAR based on login status
        if (userData.isLoggedIn) {
            // ✅ USER IS LOGGED IN - Show user info and logout option
            updateNavbarForLoggedInUser(userData, accountBtn);
        } else {
            // ❌ USER IS NOT LOGGED IN - Show login button
            updateNavbarForLoggedOutUser(accountBtn);
        }

    } catch (error) {
        console.error('Error checking user status:', error);
        // If API fails, assume user is logged out
        updateNavbarForLoggedOutUser(accountBtn);
    }
});

// =============================================================================
// UPDATE NAVBAR FOR LOGGED-IN USER
// =============================================================================
function updateNavbarForLoggedInUser(userData, accountBtn) {
    // 📧 EXTRACT USER EMAIL - Get just the name part for display
    // "john@ucdavis.edu" becomes "john"
    const userName = userData.email.split('@')[0];

    // 🎨 CREATE NEW NAVBAR CONTENT
    // Replace the simple "Account" button with user info + logout
    accountBtn.innerHTML = `
        <span class="user-greeting">Hi, ${userName}!</span>
        <a href="/logout" class="logout-link">Logout</a>
    `;

    // 🎨 UPDATE STYLING for logged-in state
    accountBtn.style.display = 'flex';
    accountBtn.style.alignItems = 'center';
    accountBtn.style.gap = '1rem';
    accountBtn.style.padding = '0.4rem 1.2rem';
    accountBtn.style.backgroundColor = '#4a8bc2'; // Slightly different blue

    // 🎭 STYLE THE USER GREETING
    const userGreeting = accountBtn.querySelector('.user-greeting');
    if (userGreeting) {
        userGreeting.style.fontWeight = '500';
        userGreeting.style.fontSize = '0.9rem';
    }

    // 🚪 STYLE THE LOGOUT LINK
    const logoutLink = accountBtn.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.style.color = 'white';
        logoutLink.style.textDecoration = 'none';
        logoutLink.style.fontSize = '0.9rem';
        logoutLink.style.fontWeight = '500';
        logoutLink.style.padding = '0.2rem 0.6rem';
        logoutLink.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        logoutLink.style.borderRadius = '12px';
        logoutLink.style.transition = 'background-color 0.2s ease';

        // Add hover effect
        logoutLink.addEventListener('mouseenter', () => {
            logoutLink.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });

        logoutLink.addEventListener('mouseleave', () => {
            logoutLink.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
    }

    console.log(`Navbar updated for logged-in user: ${userData.email}`);
}

// =============================================================================
// UPDATE NAVBAR FOR LOGGED-OUT USER  
// =============================================================================
function updateNavbarForLoggedOutUser(accountBtn) {
    // 🔑 SIMPLE LOGIN BUTTON
    accountBtn.innerHTML = '<a href="/login">Login</a>';
    accountBtn.style.backgroundColor = '#5F96C5'; // Original blue
    accountBtn.style.padding = '0.4rem 0.9rem';   // Original padding

    // 🎨 STYLE THE LOGIN LINK
    const loginLink = accountBtn.querySelector('a');
    if (loginLink) {
        loginLink.style.color = 'white';
        loginLink.style.textDecoration = 'none';
        loginLink.style.fontWeight = '500';
    }

    console.log('Navbar updated for logged-out user');
}

// =============================================================================
// HOW THIS WORKS - Step by Step:
// =============================================================================
//
// 1. Page loads (tech-clubs.html, index.html, etc.)
// 2. This script runs and finds the .account-btn element
// 3. Script calls /api/user to check if someone is logged in
// 4. Based on the response:
//    
//    LOGGED IN:
//    - Shows "Hi, john! | Logout" 
//    - Logout link goes to /logout route
//    - Different styling to indicate active session
//    
//    LOGGED OUT:
//    - Shows simple "Login" button
//    - Login link goes to /login route
//    - Standard button styling
//
// 5. User sees appropriate navbar content immediately
//
// =============================================================================
// FUTURE ENHANCEMENTS:
// =============================================================================
//
// 🔄 Real-time Updates:
// - Listen for login/logout events
// - Update navbar without page refresh
// - Show loading states during authentication
//
// 📱 Mobile Responsive:
// - Hamburger menu for mobile
// - Collapsed user info on small screens
// - Touch-friendly logout button
//
// 🎨 Enhanced Styling:
// - User avatar/profile picture
// - Dropdown menu with more options
// - Notification badges
//
// Example enhanced version:
// ```javascript
// function createUserDropdown(userData) {
//     return `
//         <div class="user-dropdown">
//             <span class="user-name">${userData.email.split('@')[0]}</span>
//             <div class="dropdown-menu">
//                 <a href="/dashboard">Profile</a>
//                 <a href="/bookmarks">My Bookmarks</a>
//                 <a href="/settings">Settings</a>
//                 <hr>
//                 <a href="/logout">Logout</a>
//             </div>
//         </div>
//     `;
// }
// ```
//
// =============================================================================