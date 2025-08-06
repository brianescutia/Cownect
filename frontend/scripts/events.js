// =============================================================================
// FIXED EVENTS PAGE SCRIPT - Replace frontend/scripts/events.js with this
// =============================================================================

let currentUser = null;
let eventsData = [];

// Simple authentication check that doesn't redirect
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        const userData = await response.json();

        if (userData.isLoggedIn) {
            currentUser = userData;
            console.log(' User authenticated:', userData.email);
            return true;
        } else {
            console.log(' User not authenticated');
            return false;
        }
    } catch (error) {
        console.error(' Auth check failed:', error);
        return false;
    }
}

// Load events data
async function loadEvents() {
    try {
        console.log(' Loading events...');

        // For now, use the static events from your HTML
        // Later you can replace this with API calls
        eventsData = [
            {
                id: 'hackdavis2025',
                title: 'HackDavis Hackathon',
                date: '2025-09-10',
                time: '12:00pm – 3:00pm',
                location: 'TLC 3203',
                description: 'Join UC Davis\'s premier hackathon focused on social good! Build innovative projects, collaborate with peers, and have fun learning.',
                joinUrl: '#'
            },
            {
                id: 'techcareerfair',
                title: 'Tech Career Fair',
                date: '2025-10-22',
                time: '10:00am – 1:00pm',
                location: 'UC Center',
                description: 'Explore internships and job opportunities at UC Davis\'s Tech Career Fair. Network with employers, attend workshops, and learn about various tech industry roles.',
                joinUrl: '#'
            },
            {
                id: 'researchexpo',
                title: 'UC Davis Research Expo',
                date: '2025-12-07',
                time: '10:00am – 3:00pm',
                location: 'UC Center',
                description: 'Showcasing insight and resources to help researchers succeed, this expo highlights student research, faculty innovations, and industry partnerships.',
                joinUrl: '#'
            }
        ];

        console.log(` Loaded ${eventsData.length} events`);
        return true;
    } catch (error) {
        console.error(' Error loading events:', error);
        return false;
    }
}

// Simple calendar generator
function generateSimpleCalendar() {
    const calendarDiv = document.getElementById('calendar');
    if (!calendarDiv) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let calendarHTML = `
        <div class="calendar-header">
            <h3>${monthNames[currentMonth]} ${currentYear}</h3>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-names">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
                <div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div class="calendar-days">
    `;

    // Get first day of month and days in month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = eventsData.some(event => event.date === dateStr);

        calendarHTML += `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}" data-date="${dateStr}">
                <span class="day-number">${day}</span>
                ${hasEvent ? '<div class="event-dot"></div>' : ''}
            </div>
        `;
    }

    calendarHTML += `
            </div>
        </div>
        <div class="calendar-legend">
            <div class="legend-item">
                <div class="event-dot"></div>
                <span>Has Events</span>
            </div>
        </div>
    `;

    calendarDiv.innerHTML = calendarHTML;

    // Add click listeners to calendar days
    document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
        day.addEventListener('click', () => {
            const date = day.dataset.date;
            const dayEvents = eventsData.filter(event => event.date === date);

            if (dayEvents.length > 0) {
                alert(`Events on ${date}:\n\n${dayEvents.map(e => `• ${e.title} at ${e.time}`).join('\n')}`);
            }
        });
    });
}

// Set up event join buttons
function setupEventButtons() {
    document.querySelectorAll('.join-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventId = btn.dataset.eventId || 'unknown';

            if (currentUser) {
                alert(`You've joined the event! 🎉\n\nEvent details will be sent to ${currentUser.email}`);
                btn.textContent = 'Joined ✓';
                btn.style.backgroundColor = '#27ae60';
                btn.disabled = true;
            } else {
                alert('Please log in to join events.');
                window.location.href = '/login';
            }
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log(' Initializing Events Page...');

    try {
        // Check authentication (but don't redirect)
        await checkAuth();

        // Load events data
        await loadEvents();

        // Generate calendar
        generateSimpleCalendar();

        // Setup event buttons
        setupEventButtons();

        console.log(' Events page loaded successfully!');

    } catch (error) {
        console.error(' Error initializing events page:', error);

        // Show user-friendly error
        const calendar = document.getElementById('calendar');
        if (calendar) {
            calendar.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>📅 Events Calendar</h3>
                    <p>Calendar will load here once connected to database.</p>
                </div>
            `;
        }
    }
});

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
    .calendar-header {
        text-align: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: linear-gradient(135deg, #5F96C5, #4a8bc2);
        color: white;
        border-radius: 10px;
    }

    .calendar-grid {
        border: 1px solid #ddd;
        border-radius: 10px;
        overflow: hidden;
        background: white;
    }

    .calendar-day-names {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background: #f8f9fa;
    }

    .calendar-day-names > div {
        padding: 0.75rem;
        text-align: center;
        font-weight: 600;
        border-right: 1px solid #ddd;
    }

    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .calendar-day {
        min-height: 60px;
        padding: 0.5rem;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .calendar-day:hover {
        background-color: #f8f9fa;
    }

    .calendar-day.has-event {
        background-color: #e3f2fd;
    }

    .calendar-day.has-event:hover {
        background-color: #bbdefb;
    }

    .calendar-day.empty {
        background-color: #f5f5f5;
        cursor: default;
    }

    .day-number {
        font-weight: 500;
    }

    .event-dot {
        width: 8px;
        height: 8px;
        background: #5F96C5;
        border-radius: 50%;
        position: absolute;
        bottom: 5px;
        right: 5px;
    }

    .calendar-legend {
        padding: 1rem;
        text-align: center;
        background: #f8f9fa;
        border-top: 1px solid #ddd;
    }

    .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #666;
    }

    .join-event-btn {
        background: #5F96C5;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .join-event-btn:hover {
        background: #4a8bc2;
        transform: translateY(-1px);
    }

    .join-event-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
`;
document.head.appendChild(style);

console.log(' Events script loaded!');