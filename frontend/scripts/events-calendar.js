// =============================================================================
// FIXED EVENTS CALENDAR FUNCTIONALITY
// Replace your frontend/scripts/events-calendar.js with this
// =============================================================================

// 🎯 GLOBAL STATE MANAGEMENT
const CalendarState = {
    currentView: 'month',
    currentDate: new Date(),
    selectedDate: null,
    eventsData: {},
    featuredEvents: [],
    selectedDateEvents: [],
    isLoading: false,
    isAuthenticated: false,
    currentUser: null
};

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log(' Initializing Events Calendar...');

    try {
        // Check authentication
        await checkAuthentication();

        // Initialize calendar
        await initializeCalendar();
        setupEventListeners();

        // Load featured events
        await loadFeaturedEvents();

        // Render calendar
        renderCalendar();

        console.log(' Events calendar initialized successfully');
    } catch (error) {
        console.error(' Error initializing calendar:', error);
        showError('Failed to load events calendar');
    }
});

// =============================================================================
// AUTHENTICATION
// =============================================================================

async function checkAuthentication() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const userData = await response.json();
            CalendarState.isAuthenticated = userData.isLoggedIn;
            CalendarState.currentUser = userData;

            if (!userData.isLoggedIn) {
                console.log(' User not authenticated');
                window.location.href = '/login';
                return;
            }

            console.log(' User authenticated:', userData.email);
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error(' Auth check failed:', error);
        window.location.href = '/login';
    }
}

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================

async function initializeCalendar() {
    try {
        showLoading(true);

        // Load calendar events for current month
        await loadCalendarData();

        showLoading(false);
        console.log(' Calendar initialized with events data');
    } catch (error) {
        console.error(' Error loading calendar data:', error);
        showLoading(false);

        // Use fallback data if API fails
        CalendarState.eventsData = getFallbackEventsData();
        console.log(' Using fallback events data');
    }
}

async function loadCalendarData() {
    try {
        const year = CalendarState.currentDate.getFullYear();
        const month = CalendarState.currentDate.getMonth() + 1;

        console.log(` Loading calendar data for ${year}-${month}`);

        const response = await fetch(`/api/events/calendar/${year}/${month}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const calendarData = await response.json();
        console.log(' Raw calendar data:', calendarData);

        // Process the calendar data
        CalendarState.eventsData = {};

        if (Array.isArray(calendarData)) {
            calendarData.forEach(dayData => {
                if (dayData._id && dayData.events) {
                    CalendarState.eventsData[dayData._id] = dayData.events;
                }
            });
        }

        console.log(` Processed calendar data for ${Object.keys(CalendarState.eventsData).length} days`);
        console.log(' Events data:', CalendarState.eventsData);

    } catch (error) {
        console.error(' Error loading calendar data:', error);

        // If calendar API fails, try to load all events and group them by date
        await loadAllEventsAsFallback();
    }
}

async function loadAllEventsAsFallback() {
    try {
        console.log(' Attempting to load all events as fallback...');

        const response = await fetch('/api/events?upcoming=false&limit=100');
        if (!response.ok) throw new Error('Events API failed');

        const events = await response.json();
        console.log(' Loaded events for fallback:', events);

        // Group events by date
        CalendarState.eventsData = {};
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const dateKey = eventDate.toISOString().split('T')[0];

            if (!CalendarState.eventsData[dateKey]) {
                CalendarState.eventsData[dateKey] = [];
            }

            CalendarState.eventsData[dateKey].push({
                id: event._id || event.id,
                title: event.title,
                time: event.time || event.formattedTime || 'Time TBD',
                location: event.location,
                description: event.description,
                category: event.category || 'Event'
            });
        });

        console.log(' Fallback events grouped by date:', Object.keys(CalendarState.eventsData).length, 'days');

    } catch (error) {
        console.error(' Fallback events loading failed:', error);
        CalendarState.eventsData = getFallbackEventsData();
    }
}

async function loadFeaturedEvents() {
    try {
        console.log(' Loading featured events...');

        const response = await fetch('/api/events/featured');

        if (response.ok) {
            CalendarState.featuredEvents = await response.json();
            console.log(` Loaded ${CalendarState.featuredEvents.length} featured events`);
        } else {
            throw new Error('Featured events API failed');
        }

        renderFeaturedEvents();

    } catch (error) {
        console.error('💥 Error loading featured events:', error);

        // Use fallback featured events
        CalendarState.featuredEvents = getFallbackFeaturedEvents();
        renderFeaturedEvents();
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

    console.log(' Calendar event listeners set up');
}

// =============================================================================
// CALENDAR RENDERING FUNCTIONS
// =============================================================================

function renderCalendar() {
    console.log(' Rendering calendar...');

    if (CalendarState.currentView === 'month') {
        renderMonthView();
    } else {
        renderWeekView();
    }

    updatePeriodTitle();
    updateViewButtons();

    console.log(' Calendar rendered');
}

function renderMonthView() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) {
        console.error(' Calendar grid element not found');
        return;
    }

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

    console.log(' Month view rendered with events');
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

    // Add event indicators (blue dots) if there are events
    if (events.length > 0 && !isOtherMonth) {
        content += '<div class="event-indicators">';

        // Show up to 4 dots, representing events
        for (let i = 0; i < Math.min(events.length, 4); i++) {
            content += '<div class="event-dot"></div>';
        }

        // If more than 4 events, show a count
        if (events.length > 4) {
            content += `<div class="event-count">+${events.length - 4}</div>`;
        }

        content += '</div>';

        console.log(` Day ${dayNumber} has ${events.length} events`);
    }

    return content;
}

// =============================================================================
// FEATURED EVENTS RENDERING
// =============================================================================

function renderFeaturedEvents() {
    const grid = document.getElementById('featuredEventsGrid');
    const template = document.getElementById('eventCardTemplate');

    if (!grid) {
        console.error(' Featured events grid not found');
        return;
    }

    if (!template) {
        console.error(' Event card template not found');
        return;
    }

    grid.innerHTML = '';

    if (CalendarState.featuredEvents.length === 0) {
        grid.innerHTML = '<div class="no-events">No featured events available</div>';
        return;
    }

    CalendarState.featuredEvents.forEach(event => {
        const eventCard = template.content.cloneNode(true);
        eventCard.querySelector('.event-card').setAttribute('data-event-id', event._id || event.id);


        // Update card content
        const img = eventCard.querySelector('.event-image');
        img.src = event.imageUrl || '/assets/default-event-image.jpg';
        img.alt = event.title;

        const bookmark = eventCard.querySelector('.event-bookmark');
        bookmark.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEventBookmark(event._id || event.id);
        });

        const dateMonth = eventCard.querySelector('.date-month');
        const dateDay = eventCard.querySelector('.date-day');
        const eventDate = new Date(event.date);
        dateMonth.textContent = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        dateDay.textContent = eventDate.getDate();

        eventCard.querySelector('.event-title').textContent = event.title;
        eventCard.querySelector('.event-description').textContent = event.description;
        eventCard.querySelector('.time-text').textContent = event.formattedTime || event.time;
        eventCard.querySelector('.location-text').textContent = event.location;

        // Event actions
        const joinBtn = eventCard.querySelector('.join-event-btn');
        joinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEventJoin(event._id || event.id);
        });

        const calendarBtn = eventCard.querySelector('.add-calendar-btn');
        calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToGoogleCalendar(event);
        });

        grid.appendChild(eventCard);
    });

    console.log(` Rendered ${CalendarState.featuredEvents.length} featured event cards`);
}

// =============================================================================
// DATE SELECTION AND SIDEBAR FUNCTIONS
// =============================================================================

async function selectDate(date) {
    console.log(` Selected date: ${date.toDateString()}`);

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
        console.log(`📡 Loading events for ${dateKey}`);

        // First try to get from our loaded data
        CalendarState.selectedDateEvents = CalendarState.eventsData[dateKey] || [];

        // If no events in loaded data, try API
        if (CalendarState.selectedDateEvents.length === 0) {
            try {
                const response = await fetch(`/api/events/date/${dateKey}`);
                if (response.ok) {
                    const apiEvents = await response.json();
                    CalendarState.selectedDateEvents = apiEvents;
                    console.log(` Loaded ${apiEvents.length} events from API for ${dateKey}`);
                }
            } catch (apiError) {
                console.log(' API call failed, using loaded data');
            }
        }

        console.log(` Final events for ${dateKey}:`, CalendarState.selectedDateEvents.length);

    } catch (error) {
        console.error(' Error loading events for date:', error);
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
        setupSidebarEventListeners();
    }

    // Show sidebar
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
    const eventCards = document.querySelectorAll('.sidebar-event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('event-action-btn')) {
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

async function handleEventJoin(eventId) {
    try {
        console.log(` Joining event: ${eventId}`);

        const response = await fetch(`/api/events/${eventId}/join`, {
            method: 'POST'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to join event');
        }

        const result = await response.json();
        console.log(' Successfully joined event:', result);

        alert(` Successfully joined the event!\n\nYou'll receive more details via email.`);

    } catch (error) {
        console.error(' Error joining event:', error);
        alert(` Failed to join event: ${error.message}`);
    }
}

async function handleEventBookmark(eventId) {
    try {
        console.log(` Bookmarking event: ${eventId}`);
        alert('Event bookmarked! (Feature coming soon)');
    } catch (error) {
        console.error(' Error bookmarking event:', error);
        alert('Failed to bookmark event');
    }
}

function addToGoogleCalendar(event) {
    try {
        console.log(` Adding to Google Calendar: ${event.title}`);

        // Validate event object
        if (!event || !event.title) {
            console.error(' Invalid event object:', event);
            showNotification('Invalid event data', 'error');
            return;
        }

        // Parse event date with better error handling
        let eventDate;
        try {
            if (event.date) {
                eventDate = new Date(event.date);
                // Check if date is valid
                if (isNaN(eventDate.getTime())) {
                    throw new Error('Invalid date');
                }
            } else {
                // Default to today if no date
                eventDate = new Date();
            }
        } catch (dateError) {
            console.error(' Date parsing error:', dateError);
            eventDate = new Date(); // Fallback to today
        }

        console.log(' Parsed event date:', eventDate);

        // Parse time with fallback
        let startTime, endTime;
        try {
            if (event.time && event.time !== 'Time TBD') {
                const timeResult = parseEventTimeCalendar(event.time, eventDate);
                startTime = timeResult.start;
                endTime = timeResult.end;
            } else {
                // Default times
                startTime = new Date(eventDate);
                startTime.setHours(18, 0, 0, 0); // 6 PM
                endTime = new Date(startTime);
                endTime.setHours(20, 0, 0, 0); // 8 PM
            }
        } catch (timeError) {
            console.error(' Time parsing error:', timeError);
            // Fallback times
            startTime = new Date(eventDate);
            startTime.setHours(18, 0, 0, 0);
            endTime = new Date(startTime);
            endTime.setHours(20, 0, 0, 0);
        }

        console.log(' Start time:', startTime, 'End time:', endTime);

        // Validate times before proceeding
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.error(' Invalid times generated');
            showNotification('Failed to parse event time', 'error');
            return;
        }

        // Build Google Calendar URL
        const calendarUrl = buildCalendarUrl({
            title: event.title,
            description: event.description || 'UC Davis Tech Event',
            location: event.location || 'UC Davis Campus',
            startTime: startTime,
            endTime: endTime
        });

        console.log('🔗 Calendar URL:', calendarUrl);

        // Open Google Calendar
        const newWindow = window.open(calendarUrl, '_blank', 'noopener,noreferrer');

        if (newWindow) {
            console.log(' Opened Google Calendar');
            showNotification('Event added to Google Calendar! 📅', 'success');
        } else {
            console.error(' Failed to open new window');
            showNotification('Please allow popups to add events', 'error');
        }

    } catch (error) {
        console.error(' Error adding to Google Calendar:', error);
        showNotification(`Calendar error: ${error.message}`, 'error');
    }
}

function parseEventTimeCalendar(timeString, eventDate) {
    const baseDate = new Date(eventDate);

    // Handle "6:00 PM - 8:00 PM" format
    if (timeString.includes('-')) {
        const parts = timeString.split('-').map(t => t.trim());
        const startTime = parseTimeString(parts[0], baseDate);
        const endTime = parts[1] ? parseTimeString(parts[1], baseDate) : new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
        return { start: startTime, end: endTime };
    } else {
        // Single time like "6:00 PM"
        const startTime = parseTimeString(timeString, baseDate);
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
        return { start: startTime, end: endTime };
    }
}

function parseTimeString(timeStr, baseDate) {
    const date = new Date(baseDate);
    const cleanTime = timeStr.trim().toLowerCase();

    // Match "6:00 pm" or "6 pm" or "18:00"
    const match = cleanTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (!match) {
        throw new Error(`Cannot parse time: ${timeStr}`);
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2] || '0');
    const period = match[3];

    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period === 'am' && hours === 12) {
        hours = 0;
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
}

function buildCalendarUrl({ title, description, location, startTime, endTime }) {
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams();

    params.set('action', 'TEMPLATE');
    params.set('text', title);

    // Format dates safely
    try {
        const startUTC = startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endUTC = endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        params.set('dates', `${startUTC}/${endUTC}`);
    } catch (error) {
        console.error(' Error formatting dates:', error);
        throw new Error('Failed to format dates for calendar');
    }

    if (description) {
        params.set('details', description);
    }

    if (location) {
        params.set('location', location);
    }

    params.set('ctz', 'America/Los_Angeles');

    return `${baseUrl}?${params.toString()}`;
}
// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

function switchView(view) {
    CalendarState.currentView = view;
    renderCalendar();
    updateViewButtons();
    console.log(` Switched to ${view} view`);
}

function navigatePeriod(direction) {
    if (CalendarState.currentView === 'month') {
        CalendarState.currentDate.setMonth(CalendarState.currentDate.getMonth() + direction);
    } else {
        CalendarState.currentDate.setDate(CalendarState.currentDate.getDate() + (direction * 7));
    }

    // Load new events data
    loadCalendarData().then(() => {
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
    const eventsContainer = document.getElementById('eventsContainer');

    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'flex';
    }

    if (eventsContainer) {
        eventsContainer.style.display = 'none';
    }

    console.error(' Calendar Error:', message);
}

// =============================================================================
// FALLBACK DATA
// =============================================================================

function getFallbackEventsData() {
    console.log(' Using fallback events data');

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
        [formatDateKey(nextWeek)]: [
            {
                id: 'fallback1',
                title: 'React Workshop',
                time: '6:00 PM - 8:00 PM',
                location: 'Kemper Hall 1131',
                description: 'Learn React fundamentals with hands-on coding exercises.',
                category: 'Workshop'
            }
        ],
        [formatDateKey(nextMonth)]: [
            {
                id: 'fallback2',
                title: 'Tech Career Fair',
                time: '10:00 AM - 4:00 PM',
                location: 'UC Center',
                description: 'Meet with top tech companies and explore career opportunities.',
                category: 'Career'
            }
        ]
    };
}

function getFallbackFeaturedEvents() {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return [
        {
            _id: 'fallback1',
            title: 'HackDavis 2025',
            description: 'UC Davis\'s premier hackathon focused on social good and environmental sustainability.',
            date: nextWeek,
            time: '9:00 AM - 11:59 PM',
            location: 'UC Davis Campus',
            imageUrl: '/assets/hackdavis-placeholder.jpg',
            formattedTime: '9:00 AM - 11:59 PM'
        },
        {
            _id: 'fallback2',
            title: 'Tech Career Fair',
            description: 'Meet with top tech companies and explore internship and full-time opportunities.',
            date: nextMonth,
            time: '10:00 AM - 4:00 PM',
            location: 'UC Center Ballroom',
            imageUrl: '/assets/career-fair-placeholder.jpg',
            formattedTime: '10:00 AM - 4:00 PM'
        }
    ];
}
// =============================================================================
// UPDATED EVENTS CALENDAR FOR NEW DESIGN
// Replace the renderFeaturedEvents function in your events-calendar.js
// =============================================================================

// =============================================================================
// UPDATED EVENTS CALENDAR FOR NEW DESIGN
// Replace the renderFeaturedEvents function in your events-calendar.js
// =============================================================================

function renderFeaturedEvents() {
    const grid = document.getElementById('featuredEventsGrid');
    const template = document.getElementById('eventCardTemplate');

    if (!grid) {
        console.error(' Featured events grid not found');
        return;
    }

    if (!template) {
        console.error(' Event card template not found');
        return;
    }

    // Clear all existing content including loading cards
    grid.innerHTML = '';

    if (CalendarState.featuredEvents.length === 0) {
        grid.innerHTML = '<div class="no-events" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">No featured events available</div>';
        return;
    }

    CalendarState.featuredEvents.forEach((event, index) => {
        const eventCard = template.content.cloneNode(true);
        eventCard.querySelector('.event-card').setAttribute('data-event-id', event._id || event.id);


        // Update event image
        const img = eventCard.querySelector('.event-image');
        img.src = event.imageUrl || generatePlaceholderImage(event.title);
        img.alt = event.title;

        // Handle image loading errors
        img.addEventListener('error', () => {
            img.style.background = getEventCategoryGradient(event.category);
            img.style.position = 'relative';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.color = 'white';
            img.style.fontWeight = '600';
            img.setAttribute('data-error', 'true');

            // Create fallback content
            const fallback = document.createElement('div');
            fallback.style.position = 'absolute';
            fallback.style.top = '50%';
            fallback.style.left = '50%';
            fallback.style.transform = 'translate(-50%, -50%)';
            fallback.style.textAlign = 'center';
            fallback.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${getEventIcon(event.category)}</div>
                <div style="font-size: 0.9rem;">Tech Event</div>
            `;
            img.parentElement.appendChild(fallback);
        });

        // Update date badge
        const eventDate = new Date(event.date);
        const dateDay = eventCard.querySelector('.date-day');
        const dateMonth = eventCard.querySelector('.date-month');

        dateDay.textContent = eventDate.getDate();
        dateMonth.textContent = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

        // Update bookmark button

        // Update event content
        eventCard.querySelector('.event-title').textContent = event.title;
        eventCard.querySelector('.event-description').textContent = truncateText(event.description, 80);
        eventCard.querySelector('.time-text').textContent = event.formattedTime || event.time;
        eventCard.querySelector('.location-text').textContent = truncateText(event.location, 25);

        // Update action buttons
        const joinBtn = eventCard.querySelector('.join-event-btn');
        joinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEventJoin(event._id || event.id, joinBtn);
        });

        const calendarBtn = eventCard.querySelector('.add-calendar-btn');
        calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToGoogleCalendar(event);
        });

        // Add click handler for entire card
        const card = eventCard.querySelector('.event-card');
        card.addEventListener('click', () => {
            selectEventDate(event);
        });

        grid.appendChild(eventCard);
    });

    console.log(` Rendered ${CalendarState.featuredEvents.length} featured event cards with responsive design`);
}

// =============================================================================
// ENHANCED EVENT ACTIONS FOR NEW DESIGN
// =============================================================================

async function handleEventJoin(eventId, buttonElement) {
    try {
        console.log(` Joining event: ${eventId}`);

        // Update button to loading state
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Joining...';
        buttonElement.disabled = true;

        const response = await fetch(`/api/events/${eventId}/join`, {
            method: 'POST'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to join event');
        }

        const result = await response.json();
        console.log(' Successfully joined event:', result);

        // Update button to success state
        buttonElement.textContent = 'Joined ✓';
        buttonElement.style.background = '#27ae60';

        // Show success notification
        showNotification('Successfully joined event! 🎉', 'success');

    } catch (error) {
        console.error(' Error joining event:', error);

        // Reset button
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;

        showNotification(`Failed to join event: ${error.message}`, 'error');
    }
}

async function handleEventBookmark(eventId, bookmarkElement) {
    try {
        console.log(` Toggling bookmark for event: ${eventId}`);

        const isBookmarked = bookmarkElement.classList.contains('bookmarked');

        // Optimistic update
        if (isBookmarked) {
            bookmarkElement.classList.remove('bookmarked');
            bookmarkElement.style.background = 'rgba(255, 255, 255, 0.95)';
            bookmarkElement.style.color = '#666';
        } else {
            bookmarkElement.classList.add('bookmarked');
            bookmarkElement.style.background = '#5F96C5';
            bookmarkElement.style.color = 'white';
        }

        // In the future, make actual API call here:
        // const response = await fetch(`/api/events/${eventId}/bookmark`, { method: 'POST' });

        const message = isBookmarked ? 'Event removed from bookmarks' : 'Event bookmarked!';
        showNotification(message, 'info');

    } catch (error) {
        console.error(' Error bookmarking event:', error);

        // Revert optimistic update
        if (bookmarkElement.classList.contains('bookmarked')) {
            bookmarkElement.classList.remove('bookmarked');
        } else {
            bookmarkElement.classList.add('bookmarked');
        }

        showNotification('Failed to bookmark event', 'error');
    }
}

function selectEventDate(event) {
    const eventDate = new Date(event.date);
    console.log(` Selecting date from featured event: ${eventDate.toDateString()}`);

    // Update the calendar to show this date
    CalendarState.currentDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);

    // Re-render calendar and select the date
    loadCalendarData().then(() => {
        renderCalendar();
        selectDate(eventDate);

        // Scroll to calendar section
        document.querySelector('.calendar-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// =============================================================================
// UTILITY FUNCTIONS FOR NEW DESIGN
// =============================================================================

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function generatePlaceholderImage(title) {
    const width = 450;
    const height = 180; // 60% of 300px card height
    const bgColor = '5F96C5';
    const textColor = 'FFFFFF';
    const encodedTitle = encodeURIComponent(title || 'Tech Event');

    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedTitle}`;
}

function getEventCategoryGradient(category) {
    const gradients = {
        'hackathon': 'linear-gradient(135deg, #e74c3c, #f39c12)',
        'workshop': 'linear-gradient(135deg, #27ae60, #2ecc71)',
        'career': 'linear-gradient(135deg, #8e44ad, #9b59b6)',
        'tech-talk': 'linear-gradient(135deg, #34495e, #2c3e50)',
        'networking': 'linear-gradient(135deg, #f39c12, #f1c40f)',
        'research': 'linear-gradient(135deg, #3498db, #2980b9)',
        'social': 'linear-gradient(135deg, #e67e22, #d35400)',
        'default': 'linear-gradient(135deg, #5F96C5, #4a8bc2)'
    };

    return gradients[category] || gradients.default;
}

function getEventIcon(category) {
    const icons = {
        'hackathon': '💻',
        'workshop': '🛠️',
        'career': '💼',
        'tech-talk': '🎤',
        'networking': '🤝',
        'research': '🔬',
        'social': '🎉',
        'default': '🎉'
    };

    return icons[category] || icons.default;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const bgColors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#5F96C5'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 1001;
        font-weight: 500;
        font-size: 0.9rem;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: auto;">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// =============================================================================
// ADD TO EXISTING CALENDAR SCRIPT
// =============================================================================

// Add this to your existing events-calendar.js file after the existing functions
// or replace the renderFeaturedEvents function with the one above

console.log(' Updated Events Calendar script for new design loaded');
// =============================================================================
// GLOBAL FUNCTIONS (for window scope)
// =============================================================================

window.joinEvent = function (eventId) {
    const event = findEventById(eventId);
    if (event) {
        handleEventJoin(eventId);
    }
};

window.addToCalendar = function (eventId) {
    const event = findEventById(eventId);
    if (event) {
        addToGoogleCalendar(event);
    }
};

function findEventById(eventId) {
    for (const dateKey in CalendarState.eventsData) {
        const events = CalendarState.eventsData[dateKey];
        const event = events.find(e => e.id === eventId);
        if (event) return event;
    }
    return null;
}

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================

window.debugCalendar = function () {
    console.log('🐛 Calendar Debug Info:');
    console.log('  Current view:', CalendarState.currentView);
    console.log('  Current date:', CalendarState.currentDate);
    console.log('  Selected date:', CalendarState.selectedDate);
    console.log('  Events data keys:', Object.keys(CalendarState.eventsData));
    console.log('  Events data:', CalendarState.eventsData);
    console.log('  Featured events:', CalendarState.featuredEvents.length);
    console.log('  Selected date events:', CalendarState.selectedDateEvents.length);
    console.log('  Full state:', CalendarState);
};

console.log('✅ Fixed Events Calendar script loaded successfully');

