let eventsData = null;
let currentUser = null;

//Event Calendar Class for managing calendar
class EventsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = {
            //Example for now must replace with API data in future
            '2025-09-10': [
                {
                    id: 1,
                    title: 'HackDavis Hackathon',
                    time: '12:00pm – 3:00pm',
                    location: 'TLC 3203',
                    description: 'Join UC Davis\'s premier hackathon focused on social good!'
                }
            ],
            '2025-10-22': [
                {
                    id: 2,
                    title: 'Tech Career Fair',
                    time: '10:00am – 1:00pm',
                    location: 'UC Center',
                    description: 'Explore internships and job opportunities at UC Davis\'s Tech Career Fair.'
                }
            ],
            '2025-12-07': [
                {
                    id: 3,
                    title: 'UC Davis Research Expo',
                    time: '10:00am – 3:00pm',
                    location: 'UC Center',
                    description: 'Showcasing insight and resources to help researchers succeed.'
                }
            ]
        }
        this.selectedDate = null;
    }
    //In progress 
}
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