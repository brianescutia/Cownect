// =============================================================================
// EVENTS CALENDAR FUNCTIONALITY
// =============================================================================
// Save as frontend/scripts/events-calendar.js

// 🎯 GLOBAL STATE MANAGEMENT
const CalendarState = {
    currentView: 'month', // 'month' or 'week'
    currentDate: new Date(),
    selectedDate: null,
    eventsData: {},
    selectedDateEvents: [],
    isLoading: false
};

// Sample events data (replace with real data later)
const SAMPLE_EVENTS = {
    '2025-01-15': [
        {
            id: '1',
            title: 'React Workshop',
            time: '6:00 PM - 8:00 PM',
            location: 'Kemper Hall 1131',
            description: 'Learn React fundamentals with hands-on coding exercises.',
            category: 'Workshop'
        }
    ],
    '2025-01-22': [
        {
            id: '2',
            title: 'AI Student Collective Meeting',
            time: '7:00 PM - 9:00 PM',
            location: 'Engineering Building',
            description: 'Weekly meeting to discuss latest AI research and projects.',
            category: 'Meeting'
        },
        {
            id: '3',
            title: 'Coding Bootcamp',
            time: '2:00 PM - 5:00 PM',
            location: 'Computer Science Building',
            description: 'Intensive coding session for beginners.',
            category: 'Workshop'
        }
    ],
    '2025-01-28': [
        {
            id: '4',
            title: 'Tech Career Fair',
            time: '10:00 AM - 4:00 PM',
            location: 'UC Center',
            description: 'Meet with top tech companies and explore career opportunities.',
            category: 'Career'
        }
    ],
    '2025-02-05': [
        {
            id: '5',
            title: 'HackDavis 2025',
            time: '9:00 AM - 9:00 PM',
            location: 'Multiple Locations',
            description: 'UC Davis\'s premier hackathon focused on social good.',
            category: 'Hackathon'
        }
    ]
};

// 🎯 WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Events Calendar...');

    try {
        await initializeCalendar();
        setupEventListeners();
        renderCalendar();

        console.log('✅ Events calendar initialized successfully');
    } catch (error) {
        console.error('💥 Error initializing calendar:', error);
        showError('Failed to load events calendar');
    }
});

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================

async function initializeCalendar() {
    try {
        showLoading(true);

        // Load events data (using sample data for now)
        CalendarState.eventsData = SAMPLE_EVENTS;

        // In the future, replace with actual API call:
        // await loadEventsData();

        showLoading(false);
    } catch (error) {
        console.error('💥 Error loading events data:', error);
        showLoading(false);
        // Continue with sample data even if API fails
        CalendarState.eventsData = SAMPLE_EVENTS;
    }
}

async function loadEventsData() {
    try {
        const year = CalendarState.currentDate.getFullYear();
        const month = CalendarState.currentDate.getMonth() + 1;

        const response = await fetch(`/api/events/calendar/${year}/${month}`);
        if (!response.ok) throw new Error('Failed to load events');

        const eventsData = await response.json();

        // Process the data into our format
        CalendarState.eventsData = {};
        eventsData.forEach(dayData => {
            CalendarState.eventsData[dayData._id] = dayData.events;
        });

        console.log(`✅ Loaded events for ${Object.keys(CalendarState.eventsData).length} days`);
    } catch (error) {
        console.error('💥 Error loading events:', error);
        // Fallback to sample data
        CalendarState.eventsData = SAMPLE_EVENTS;
    }
}

function setupEventListeners() {
    // View toggle buttons
    document.getElementById('monthViewBtn')?.addEventListener('click', () => switchView('month'));
    document.getElementById('weekViewBtn')?.addEventListener('click', () => switchView('week'));

    // Navigation buttons
    document.getElementById('prevPeriod')?.addEventListener('click', () => navigatePeriod(-1));
    document.getElementById('nextPeriod')?.addEventListener('click', () => navigatePeriod(1));

    // Sidebar close button
    document.getElementById('closeSidebar')?.addEventListener('click', closeSidebar);

    console.log('🎧 Calendar event listeners set up');
}

// =============================================================================
// CALENDAR RENDERING FUNCTIONS
// =============================================================================

function renderCalendar() {
    if (CalendarState.currentView === 'month') {
        renderMonthView();
    } else {
        renderWeekView();
    }

    updatePeriodTitle();
    updateViewButtons();
}

function renderMonthView() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    grid.innerHTML = '';
    grid.className = 'calendar-grid';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header-cell';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Calculate calendar days
    const year = CalendarState.currentDate.getFullYear();
    const month = CalendarState.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        const prevMonthDay = new Date(year, month, -(startingDayOfWeek - 1 - i));
        emptyDay.innerHTML = createDayContent(prevMonthDay, true);
        grid.appendChild(emptyDay);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const dayDate = new Date(year, month, day);

        dayElement.className = 'calendar-day';
        if (isToday(dayDate)) dayElement.classList.add('today');
        if (isSelectedDate(dayDate)) dayElement.classList.add('selected');

        dayElement.innerHTML = createDayContent(dayDate, false);
        dayElement.addEventListener('click', () => selectDate(dayDate));

        grid.appendChild(dayElement);
    }

    // Add remaining cells to complete the grid
    const totalCells = grid.children.length;
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days

    for (let i = 1; i <= remainingCells; i++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.className = 'calendar-day other-month';
        const nextDate = new Date(year, month + 1, i);
        nextMonthDay.innerHTML = createDayContent(nextDate, true);
        grid.appendChild(nextMonthDay);
    }
}

function renderWeekView() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    grid.innerHTML = '';
    grid.className = 'calendar-grid week-view';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header-cell';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Get week dates
    const weekDates = getWeekDates(CalendarState.currentDate);

    weekDates.forEach(date => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (isToday(date)) dayElement.classList.add('today');
        if (isSelectedDate(date)) dayElement.classList.add('selected');
        if (date.getMonth() !== CalendarState.currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }

        dayElement.innerHTML = createDayContent(date, false);
        dayElement.addEventListener('click', () => selectDate(date));

        grid.appendChild(dayElement);
    });
}

function createDayContent(date, isOtherMonth) {
    const dateKey = formatDateKey(date);
    const events = CalendarState.eventsData[dateKey] || [];
    const dayNumber = date.getDate();

    let content = `<span class="day-number">${dayNumber}</span>`;

    if (events.length > 0 && !isOtherMonth) {
        content += '<div class="event-indicators">';
        // Show up to 4 dots, representing events
        for (let i = 0; i < Math.min(events.length, 4); i++) {
            content += '<div class="event-dot"></div>';
        }
        content += '</div>';
    }

    return content;
}

// =============================================================================
// DATE SELECTION AND SIDEBAR FUNCTIONS
// =============================================================================

async function selectDate(date) {
    console.log(`📅 Selected date: ${date.toDateString()}`);

    CalendarState.selectedDate = date;

    // Update visual selection
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });

    // Find and highlight the selected day
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(dayEl => {
        const dayNumber = dayEl.querySelector('.day-number');
        if (dayNumber &&
            parseInt(dayNumber.textContent) === date.getDate() &&
            !dayEl.classList.contains('other-month')) {
            dayEl.classList.add('selected');
        }
    });

    // Load events for selected date
    await loadEventsForDate(date);

    // Update sidebar
    updateSidebar();
}

async function loadEventsForDate(date) {
    try {
        const dateKey = formatDateKey(date);
        CalendarState.selectedDateEvents = CalendarState.eventsData[dateKey] || [];

        // In the future, you could load from API:
        // const response = await fetch(`/api/events/date/${dateKey}`);
        // const events = await response.json();
        // CalendarState.selectedDateEvents = events;

        console.log(`✅ Loaded ${CalendarState.selectedDateEvents.length} events for ${dateKey}`);
    } catch (error) {
        console.error('💥 Error loading events for date:', error);
        CalendarState.selectedDateEvents = [];
    }
}

function updateSidebar() {
    const sidebar = document.getElementById('eventSidebar');
    const titleElement = document.getElementById('selectedDateTitle');
    const contentElement = document.getElementById('sidebarContent');

    if (!sidebar || !titleElement || !contentElement) return;

    // Update title
    if (CalendarState.selectedDate) {
        const formattedDate = CalendarState.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        titleElement.textContent = formattedDate;
    }

    // Update content
    if (CalendarState.selectedDateEvents.length === 0) {
        contentElement.innerHTML = `
            <div class="no-events">
                <div class="no-events-icon">📅</div>
                <p>No events scheduled for this date</p>
            </div>
        `;
    } else {
        const eventsHTML = CalendarState.selectedDateEvents.map(event =>
            createSidebarEventCard(event)
        ).join('');

        contentElement.innerHTML = eventsHTML;

        // Add event listeners to action buttons
        setupSidebarEventListeners();
    }

    // Show sidebar (it might be hidden on mobile)
    sidebar.style.display = 'flex';
}

function createSidebarEventCard(event) {
    return `
        <div class="sidebar-event-card" data-event-id="${event.id}">
            <div class="event-time-badge">${event.time}</div>
            <h4 class="sidebar-event-title">${event.title}</h4>
            <p class="sidebar-event-description">${event.description}</p>
            <div class="sidebar-event-location">${event.location}</div>
            <div class="event-actions">
                <button class="event-action-btn btn-join" onclick="joinEvent('${event.id}')">
                    Join Event
                </button>
                <button class="event-action-btn btn-calendar" onclick="addToCalendar('${event.id}')">
                    Add to Calendar
                </button>
            </div>
        </div>
    `;
}

function setupSidebarEventListeners() {
    // Add any additional event listeners for sidebar interactions
    const eventCards = document.querySelectorAll('.sidebar-event-card');

    eventCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('event-action-btn')) {
                // Handle card click (maybe show more details)
                console.log('Event card clicked:', card.dataset.eventId);
            }
        });
    });
}

function closeSidebar() {
    const sidebar = document.getElementById('eventSidebar');
    const contentElement = document.getElementById('sidebarContent');
    const titleElement = document.getElementById('selectedDateTitle');

    if (sidebar && contentElement && titleElement) {
        titleElement.textContent = 'Select a date';
        contentElement.innerHTML = `
            <div class="no-date-selected">
                <div class="calendar-icon">📅</div>
                <p>Click on a calendar date to view events for that day</p>
            </div>
        `;
    }

    // Clear selection
    CalendarState.selectedDate = null;
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
}

// =============================================================================
// EVENT ACTIONS
// =============================================================================

function joinEvent(eventId) {
    console.log(`🎟️ Joining event: ${eventId}`);

    // Find the event
    const event = findEventById(eventId);
    if (!event) {
        alert('Event not found');
        return;
    }

    // In the future, make API call:
    // await fetch(`/api/events/${eventId}/join`, { method: 'POST' });

    alert(`✅ Successfully joined "${event.title}"!\n\nYou'll receive more details via email soon.`);
}

function addToCalendar(eventId) {
    console.log(`📅 Adding to calendar: ${eventId}`);

    const event = findEventById(eventId);
    if (!event) {
        alert('Event not found');
        return;
    }

    // Create Google Calendar link
    const startDate = CalendarState.selectedDate;
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', event.title);
    calendarUrl.searchParams.set('dates',
        `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
    );
    calendarUrl.searchParams.set('details', event.description);
    calendarUrl.searchParams.set('location', event.location);

    // Open Google Calendar
    window.open(calendarUrl.toString(), '_blank');

    console.log('✅ Opened Google Calendar');
}

function findEventById(eventId) {
    for (const dateKey in CalendarState.eventsData) {
        const events = CalendarState.eventsData[dateKey];
        const event = events.find(e => e.id === eventId);
        if (event) return event;
    }
    return null;
}

// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

function switchView(view) {
    CalendarState.currentView = view;
    renderCalendar();
    updateViewButtons();

    console.log(`🔄 Switched to ${view} view`);
}

function navigatePeriod(direction) {
    if (CalendarState.currentView === 'month') {
        CalendarState.currentDate.setMonth(CalendarState.currentDate.getMonth() + direction);
    } else {
        CalendarState.currentDate.setDate(CalendarState.currentDate.getDate() + (direction * 7));
    }

    // Load new events data if needed
    loadEventsData().then(() => {
        renderCalendar();

        // Clear selection if moving to different period
        if (CalendarState.selectedDate) {
            closeSidebar();
        }
    });
}

function updatePeriodTitle() {
    const titleElement = document.getElementById('currentPeriod');
    if (!titleElement) return;

    if (CalendarState.currentView === 'month') {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[CalendarState.currentDate.getMonth()];
        const year = CalendarState.currentDate.getFullYear();
        titleElement.textContent = `${month} ${year}`;
    } else {
        titleElement.textContent = getWeekTitle();
    }
}

function updateViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = CalendarState.currentView === 'month' ?
        document.getElementById('monthViewBtn') :
        document.getElementById('weekViewBtn');

    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getWeekDates(date) {
    const week = [];
    const startDate = new Date(date);

    // Get to Sunday of this week
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Add 7 days
    for (let i = 0; i < 7; i++) {
        week.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }

    return week;
}

function getWeekTitle() {
    const weekDates = getWeekDates(CalendarState.currentDate);
    const start = weekDates[0];
    const end = weekDates[6];

    if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
    }
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function isSelectedDate(date) {
    return CalendarState.selectedDate &&
        date.toDateString() === CalendarState.selectedDate.toDateString();
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateForCalendar(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// =============================================================================
// UI STATE MANAGEMENT
// =============================================================================

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');

    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'flex';
    }

    console.error('💥 Calendar Error:', message);
}

// =============================================================================
// GLOBAL FUNCTIONS (for debugging and external access)
// =============================================================================

window.debugCalendar = function () {
    console.log('🐛 Calendar Debug Info:');
    console.log('  Current view:', CalendarState.currentView);
    console.log('  Current date:', CalendarState.currentDate);
    console.log('  Selected date:', CalendarState.selectedDate);
    console.log('  Events data:', Object.keys(CalendarState.eventsData).length, 'days');
    console.log('  Selected date events:', CalendarState.selectedDateEvents.length);
    console.log('  Full state:', CalendarState);
};

// Add sample events function for testing
window.addSampleEvent = function (dateStr, eventData) {
    if (!CalendarState.eventsData[dateStr]) {
        CalendarState.eventsData[dateStr] = [];
    }
    CalendarState.eventsData[dateStr].push({
        id: Date.now().toString(),
        ...eventData
    });
    renderCalendar();
    console.log(`✅ Added sample event for ${dateStr}`);
};

// Export for external use
window.CalendarState = CalendarState;
window.renderCalendar = renderCalendar;
window.selectDate = selectDate;

console.log('✅ Events Calendar script loaded successfully');