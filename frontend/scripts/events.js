let eventsData = null;
let currentUser = null;

//Functions 
async function checkAuthentication() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('Invalid Authenication');
        }

        currentUser = await response.json();
        if (!currentUser.isLoggedIn) {
            console.log('User not logged in, redirecting to login page...');
            window.location.href = '/login';
            return;
        }
        console.log('User authenticated:', currentUser.email);
    }
    catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/login';
    }
}

async function loadEventsData() {
    //Temporary static events from HTML (Must replace with api call later)
    try {
        console.log('Events Succefully Loaded!')
    }
    catch (error) {
        console.error('Error loading events data:', error);
        throw error;
    }
}

//Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Checking user authentication');
        await checkAuthentication();

        console.log('Loading events data');
        await loadEventsData();

    }
    catch (error) {
        console.error('Error during initialization:', error);
        return "Something went wrong, Please try and refresh the page!";
    }
});