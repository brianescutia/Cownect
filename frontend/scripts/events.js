let eventsData = null;
let currentUser = null;

//Event Calendar Class for managing calendar
class EventsCalendar {
    constructor(eventsData) {
        this.currentDate = new Date();
        this.events = eventsData || {}; //fallback to empty object if no data
        this.selectedData = null;
    }

    render() {
        const eventContainer = document.getElementById('calendar-events');
        eventContainer.innerHTML = ''; // Clear previous content

        const monthEvents = Object.entries(this.events).filter(([date]) => {
            const eventDate = new Date(date);
            return eventDate.getMonth() === this.currentDate.getMonth() &&
                eventDate.getFullYear() === this.currentDate.getFullYear();
        });

        if (monthEvents.length === 0) {
            eventContainer.innerHTML = '<p>No events this month.</p>';
            return;
        }

        monthEvents.forEach(([date, events]) => {
            const daySection = document.createElement('div');
            daySection.innerHTML = `<h3>${date}</h3>`;

            events.forEach(event => {
                const item = document.createElement('div');
                item.innerHTML = `
                    <strong>${event.title}</strong><br>
                    ${event.time} — ${event.location}<br>
                    ${event.description}<br>
                   
                    <hr>`;

                daySection.appendChild(item);
            });

            eventContainer.appendChild(daySection);
        });
    }

}

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
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        eventsData = transformEvents(data);
        console.log('Events data loaded:', eventsData);
    }
    catch (error) {
        console.error('Error loading events data:', error);

    }
}

function transformEvents(eventArray) {
    const result = {};
    eventArray.forEach(event => {
        const dateKey = new Date(event.date).toISOString().split('T')[0];
        if (!result[dateKey]) result[dateKey] = [];
        result[dateKey].push(event);
    });
    return result;
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