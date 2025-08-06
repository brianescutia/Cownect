// =============================================================================
// DYNAMIC NAVBAR FUNCTIONALITY - Clean Version
// =============================================================================

console.log(' Navbar script loaded successfully!');

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, starting navbar update...');

    //  FIND NAVBAR ELEMENTS
    const accountBtn = document.querySelector('.account-btn');

    if (!accountBtn) {
        console.error(' Account button not found!');
        return;
    }

    console.log(' Account button found:', accountBtn);

    try {
        console.log(' Calling /api/user...');

        const response = await fetch('/api/user');
        const userData = await response.json();

        console.log(' User data:', userData);

        if (userData.isLoggedIn) {
            console.log(' Updating for logged-in user...');
            const userName = userData.email.split('@')[0];

            accountBtn.innerHTML = `
                <span style="color: white; margin-right: 10px;">Hi, ${userName}!</span>
                <a href="/dashboard" style="color: white; margin-right: 10px; text-decoration: none;">Dashboard</a>
                <a href="/logout" style="color: white; text-decoration: none;">Logout</a>
            `;
            accountBtn.style.display = 'flex';
            accountBtn.style.alignItems = 'center';

            console.log(' Navbar updated successfully!');
        } else {
            console.log(' User not logged in');
            accountBtn.innerHTML = 'Login';
            accountBtn.href = '/login';
        }

    } catch (error) {
        console.error(' Navbar error:', error);
    }
});

// Manual test function
window.testNavbar = function () {
    const btn = document.querySelector('.account-btn');
    if (btn) {
        btn.innerHTML = 'TEST WORKED!';
        btn.style.backgroundColor = 'red';
        console.log(' Test successful!');
    } else {
        console.log(' Button not found');
    }
};