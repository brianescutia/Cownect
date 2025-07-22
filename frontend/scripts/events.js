let eventsData = [];
let currentUser = null;

// Event Calendar Class for managing calendar
class EventsCalendar {
    constructor(eventsData) {
        this.currentDate = new Date();
        this.events = eventsData || [];
        this.selectedDate = null;
    }

    // Generate calendar HTML
    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

        let calendarHTML = `
            <div class="calendar-header">
                <button id="prev-month">&lt;</button>
                <h3>${this.getMonthName(month)} ${year}</h3>
                <button id="next-month">&gt;</button>
            </div>
            <table class="calendar-table">
                <thead>
                    <tr>
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let date = 1;

        // Generate 6 weeks (6 rows)
        for (let week = 0; week < 6; week++) {
            calendarHTML += '<tr>';

            // Generate 7 days for each week
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < startingDayOfWeek) {
                    // Empty cells before month starts
                    calendarHTML += '<td></td>';
                } else if (date > daysInMonth) {
                    // Empty cells after month ends
                    calendarHTML += '<td></td>';
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const dayEvents = this.getEventsForDate(dateStr);
                    const hasEvents = dayEvents.length > 0;

                    calendarHTML += `
                        <td class="${hasEvents ? 'has-event' : ''}" data-date="${dateStr}">
                            <span class="date-number">${date}</span>
                            ${hasEvents ? `<div class="event-indicator">${dayEvents.length}</div>` : ''}
                            ${this.generateEventPopover(dayEvents)}
                        </td>
                    `;
                    date++;
                }
            }

            calendarHTML += '</tr>';

            // Break if we've filled all days
            if (date > daysInMonth) break;
        }

        calendarHTML += '</tbody></table>';
        return calendarHTML;
    }

    getEventsForDate(dateStr) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    }

    generateEventPopover(events) {
        if (events.length === 0) return '';

        let popoverHTML = '<div class="event-popover">';
        events.forEach(event => {
            popoverHTML += `
                <div class="event-item">
                    <strong>${event.title}</strong><br>
                    <small>${event.time} • ${event.location}</small>
                </div>
            `;
        });
        popoverHTML += '</div>';
        return popoverHTML;
    }

    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }

    render() {
        const calendarElement = document.getElementById('calendar');
        if (!calendarElement) {
            console.error('Calendar element not found!');
            return;
        }

        calendarElement.innerHTML = this.generateCalendar();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Month navigation
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }

        // Calendar cell clicks
        document.querySelectorAll('[data-date]').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = cell.getAttribute('data-date');
                this.showDayEvents(date);
            });
        });
    }

    showDayEvents(dateStr) {
        const events = this.getEventsForDate(dateStr);
        if (events.length === 0) return;

        console.log(`Events for ${dateStr}:`, events);
        // You can add a modal or detailed view here
    }
}

// Authentication check
// async function checkAuthentication() {
//     try {
//         const response = await fetch('/api/user');
//         if (!response.ok) {
//             throw new Error('Authentication failed');
//         }

//         currentUser = await response.json();
//         if (!currentUser.isLoggedIn) {
//             console.log('User not logged in, redirecting...');
//             window.location.href = '/login';
//             return false;
//         }

//         console.log('✅ User authenticated:', currentUser.email);
//         return true;
//     } catch (error) {
//         console.error('❌ Authentication error:', error);
//         window.location.href = '/login';
//         return false;
//     }
// }

// Load events from API
async function loadEventsData() {
    try {
        console.log('📅 Loading events data...');

        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        eventsData = await response.json();
        console.log('✅ Events data loaded:', eventsData.length, 'events');

        return eventsData;
    } catch (error) {
        console.error('❌ Error loading events:', error);

        // Fallback to sample data if API fails
        eventsData = [
            {
                _id: 'sample1',
                title: 'HackDavis Hackathon',
                date: '2025-09-10T00:00:00.000Z',
                time: '12:00 PM - 3:00 PM',
                location: 'TLC 3203',
                description: 'Join UC Davis\'s premier hackathon focused on social good!',
                isActive: true
            },
            {
                _id: 'sample2',
                title: 'Tech Career Fair',
                date: '2025-10-22T00:00:00.000Z',
                time: '10:00 AM - 1:00 PM',
                location: 'UC Center',
                description: 'Explore internships and job opportunities.',
                isActive: true
            }
        ];

        console.log('📅 Using fallback sample data');
        return eventsData;
    }
}

// Update event cards in the HTML
function updateEventCards() {
    if (!eventsData || eventsData.length === 0) {
        console.log('No events to display');
        return;
    }

    // Update the existing event cards with real data
    console.log('📅 Updating event cards with', eventsData.length, 'events');

    // This would update your existing HTML event cards
    // You might want to make this more dynamic
}

// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initializing events page...');

        // Check authentication first
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) return;

        // Load events data
        await loadEventsData();

        // Initialize calendar
        const calendar = new EventsCalendar(eventsData);
        calendar.render();

        // Update event cards
        updateEventCards();

        console.log('✅ Events page initialized successfully!');

    } catch (error) {
        console.error('❌ Error during initialization:', error);

        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div class="error-message">
                <h3>Oops! Something went wrong</h3>
                <p>We're having trouble loading the events. Please refresh the page or try again later.</p>
                <button onclick="window.location.reload()">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
});
