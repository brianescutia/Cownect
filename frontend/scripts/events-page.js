// =============================================================================
// EVENTS PAGE FUNCTIONALITY
// Save as: frontend/scripts/events-page.js
// =============================================================================

//  GLOBAL STATE MANAGEMENT
const EventsState = {
    currentView: 'month', // 'month' or 'week'
    currentDate: new Date(),
    selectedDate: null,
    featuredEvents: [],
    calendarEvents: {},
    selectedDateEvents: [],
    carouselIndex: 0
};

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Events Page...');

    try {
        // Check authentication
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) return;

        // Initialize the page
        await initializeEventsPage();
        setupEventListeners();

        console.log(' Events page initialized successfully');
    } catch (error) {
        console.error('💥 Error initializing events page:', error);
        showError('Failed to load events page');
    }
});

// =============================================================================
// AUTHENTICATION CHECK
// =============================================================================

async function checkAuthentication() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Authentication failed');

        const userData = await response.json();
        if (!userData.isLoggedIn) {
            console.log('User not logged in, redirecting...');
            window.location.href = '/login';
            return false;
        }

        console.log(' User authenticated:', userData.email);
        return true;
    } catch (error) {
        console.error(' Authentication error:', error);
        window.location.href = '/login';
        return false;
    }
}

// =============================================================================
// PAGE INITIALIZATION
// =============================================================================

async function initializeEventsPage() {
    try {
        showLoading('Loading events...');

        // Load featured events
        await loadFeaturedEvents();

        // Load calendar data for current month
        await loadCalendarData();

        // Initialize calendar display
        renderCalendar();

        hideLoading();
    } catch (error) {
        console.error('💥 Error during initialization:', error);
        showError('Failed to load events');
    }
}

// =============================================================================
// FEATURED EVENTS FUNCTIONALITY
// =============================================================================

async function loadFeaturedEvents() {
    try {
        console.log(' Loading featured events...');

        const response = await fetch('/api/events/featured');
        if (!response.ok) throw new Error('Failed to load featured events');

        EventsState.featuredEvents = await response.json();

        console.log(` Loaded ${EventsState.featuredEvents.length} featured events`);
        renderFeaturedEvents();

    } catch (error) {
        console.error(' Error loading featured events:', error);

        // Use fallback data
        EventsState.featuredEvents = getFallbackFeaturedEvents();
        renderFeaturedEvents();
    }
}

function renderFeaturedEvents() {
    const grid = document.getElementById('featuredEventsGrid');
    const template = document.getElementById('eventCardTemplate');

    if (!grid || !template) {
        console.error(' Featured events elements not found');
        return;
    }

    grid.innerHTML = '';

    EventsState.featuredEvents.forEach(event => {
        const eventCard = template.content.cloneNode(true);

        // Update card content
        const img = eventCard.querySelector('.event-image');
        img.src = event.imageUrl || '/assets/default-event-image.jpg';
        img.alt = event.title;

        const bookmark = eventCard.querySelector('.event-bookmark');
        bookmark.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEventBookmark(event._id);
        });

        const dateMonth = eventCard.querySelector('.date-month');
        const dateDay = eventCard.querySelector('.date-day');
        const eventDate = new Date(event.date);
        dateMonth.textContent = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        dateDay.textContent = eventDate.getDate();

        eventCard.querySelector('.event-title').textContent = event.title;
        eventCard.querySelector('.event-description').textContent = event.description;
        eventCard.querySelector('.time-text').textContent = event.formattedTime;
        eventCard.querySelector('.location-text').textContent = event.location;

        // Event actions
        const joinBtn = eventCard.querySelector('.join-event-btn');
        joinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEventJoin(event._id);
        });

        const calendarBtn = eventCard.querySelector('.add-calendar-btn');
        calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToGoogleCalendar(event);
        });

        // Card click navigation
        const card = eventCard.querySelector('.event-card');
        card.addEventListener('click', () => {
            showEventDetails(event);
        });

        grid.appendChild(eventCard);
    });

    console.log(` Rendered ${EventsState.featuredEvents.length} featured event cards`);
}

// =============================================================================
// CALENDAR FUNCTIONALITY
// =============================================================================

async function loadCalendarData() {
    try {
        const year = EventsState.currentDate.getFullYear();
        const month = EventsState.currentDate.getMonth() + 1;

        console.log(` Loading calendar data for ${year}-${month}`);

        const response = await fetch(`/api/events/calendar/${year}/${month}`);
        if (!response.ok) throw new Error('Failed to load calendar data');

        const calendarData = await response.json();

        // Process calendar data
        EventsState.calendarEvents = {};
        calendarData.forEach(dayData => {
            EventsState.calendarEvents[dayData._id] = dayData.count;
        });

        console.log(` Loaded calendar data for ${Object.keys(EventsState.calendarEvents).length} days`);

    } catch (error) {
        console.error(' Error loading calendar data:', error);
        EventsState.calendarEvents = {};
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const periodTitle = document.getElementById('currentPeriod');

    if (!grid || !periodTitle) return;

    // Update period title
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (EventsState.currentView === 'month') {
        periodTitle.textContent = `${monthNames[EventsState.currentDate.getMonth()]} ${EventsState.currentDate.getFullYear()}`;
        renderMonthView(grid);
    } else {
        periodTitle.textContent = getWeekTitle();
        renderWeekView(grid);
    }
}

function renderMonthView(grid) {
    grid.innerHTML = '';
    grid.className = 'calendar-grid';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Calculate calendar days
    const year = EventsState.currentDate.getFullYear();
    const month = EventsState.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayNumber = prevMonth.getDate() - i;
        const dayElement = createCalendarDay(dayNumber, true, new Date(year, month - 1, dayNumber));
        grid.appendChild(dayElement);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createCalendarDay(day, false, new Date(year, month, day));
        grid.appendChild(dayElement);
    }

    // Add days from next month
    const totalCells = grid.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days - headers

    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(day, true, new Date(year, month + 1, day));
        grid.appendChild(dayElement);
    }
}

function renderWeekView(grid) {
    grid.innerHTML = '';
    grid.className = 'calendar-grid week-view';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Get week dates
    const weekDates = getWeekDates(EventsState.currentDate);

    weekDates.forEach(date => {
        const dayElement = createCalendarDay(date.getDate(), false, date);
        grid.appendChild(dayElement);
    });
}

function createCalendarDay(dayNumber, isOtherMonth, fullDate) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';

    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }

    // Check if it's today
    const today = new Date();
    if (fullDate.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
    }

    // Check if it's selected
    if (EventsState.selectedDate &&
        fullDate.toDateString() === EventsState.selectedDate.toDateString()) {
        dayElement.classList.add('selected');
    }

    // Add day number
    const dayNumberElement = document.createElement('span');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    dayElement.appendChild(dayNumberElement);

    // Check for events
    const dateKey = fullDate.toISOString().split('T')[0];
    const eventCount = EventsState.calendarEvents[dateKey];

    if (eventCount && eventCount > 0) {
        const indicator = document.createElement('div');
        indicator.className = 'event-indicator';
        indicator.textContent = eventCount;
        dayElement.appendChild(indicator);
    }

    // Add click listener
    dayElement.addEventListener('click', () => {
        selectDate(fullDate);
    });

    return dayElement;
}

// =============================================================================
// DATE SELECTION & EVENT DISPLAY
// =============================================================================

async function selectDate(date) {
    try {
        console.log(`📅 Selected date: ${date.toDateString()}`);

        // Update selected date
        EventsState.selectedDate = date;
        EventsState.carouselIndex = 0;

        // Update visual selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });

        event.target.closest('.calendar-day')?.classList.add('selected');

        // Load events for selected date
        await loadEventsForDate(date);

        // Update events display
        updateEventsDisplay();

    } catch (error) {
        console.error('💥 Error selecting date:', error);
    }
}

async function loadEventsForDate(date) {
    try {
        const dateString = date.toISOString().split('T')[0];
        console.log(` Loading events for ${dateString}`);

        const response = await fetch(`/api/events/date/${dateString}`);
        if (!response.ok) throw new Error('Failed to load events for date');

        EventsState.selectedDateEvents = await response.json();

        console.log(` Loaded ${EventsState.selectedDateEvents.length} events for ${dateString}`);

    } catch (error) {
        console.error(' Error loading events for date:', error);
        EventsState.selectedDateEvents = [];
    }
}

function updateEventsDisplay() {
    const titleElement = document.getElementById('selectedDateTitle');
    const carouselElement = document.getElementById('eventsCarousel');
    const addCalendarBtn = document.getElementById('addToCalendarBtn');

    if (!titleElement || !carouselElement) return;

    // Update title
    if (EventsState.selectedDate) {
        const formattedDate = EventsState.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        titleElement.textContent = `Events on ${formattedDate}`;
    }

    // Show/hide add to calendar button
    if (addCalendarBtn) {
        addCalendarBtn.style.display = EventsState.selectedDateEvents.length > 0 ? 'block' : 'none';
    }

    // Render events
    if (EventsState.selectedDateEvents.length === 0) {
        carouselElement.innerHTML = `
            <div class="no-events-message">
                <p> No events scheduled for this date</p>
            </div>
        `;
    } else {
        renderEventCarousel();
    }

    // Update carousel controls
    updateCarouselControls();
}

function renderEventCarousel() {
    const carousel = document.getElementById('eventsCarousel');
    const template = document.getElementById('carouselEventTemplate');

    if (!carousel || !template) return;

    carousel.innerHTML = '';

    EventsState.selectedDateEvents.forEach((event, index) => {
        const eventCard = template.content.cloneNode(true);

        eventCard.querySelector('.carousel-event-title').textContent = event.title;
        eventCard.querySelector('.carousel-event-time').textContent = event.formattedTime;
        eventCard.querySelector('.carousel-event-description').textContent = event.description;
        eventCard.querySelector('.location-text').textContent = event.location;

        // Event actions
        const joinBtn = eventCard.querySelector('.join-event-btn');
        joinBtn.addEventListener('click', () => handleEventJoin(event._id));

        const calendarBtn = eventCard.querySelector('.add-calendar-btn');
        calendarBtn.addEventListener('click', () => addToGoogleCalendar(event));

        carousel.appendChild(eventCard);
    });

    console.log(` Rendered ${EventsState.selectedDateEvents.length} events in carousel`);
}

// =============================================================================
// CALENDAR NAVIGATION
// =============================================================================

function navigateCalendar(direction) {
    if (EventsState.currentView === 'month') {
        EventsState.currentDate.setMonth(EventsState.currentDate.getMonth() + direction);
    } else {
        EventsState.currentDate.setDate(EventsState.currentDate.getDate() + (direction * 7));
    }

    loadCalendarData().then(() => {
        renderCalendar();
    });
}

function switchView(view) {
    EventsState.currentView = view;

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = view === 'month' ?
        document.getElementById('monthViewBtn') :
        document.getElementById('weekViewBtn');

    activeBtn?.classList.add('active');

    // Re-render calendar
    renderCalendar();
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

        // Show success feedback
        showNotification('Successfully joined event!', 'success');

        // Refresh events if needed
        if (EventsState.selectedDate) {
            await loadEventsForDate(EventsState.selectedDate);
            updateEventsDisplay();
        }

    } catch (error) {
        console.error('💥 Error joining event:', error);
        showNotification(error.message, 'error');
    }
}

async function handleEventBookmark(eventId) {
    try {
        console.log(`🔖 Bookmarking event: ${eventId}`);

        // Note: You might need to implement event bookmarking in your backend
        // For now, we'll show a placeholder message
        showNotification('Event bookmarked! (Feature coming soon)', 'info');

    } catch (error) {
        console.error('💥 Error bookmarking event:', error);
        showNotification('Failed to bookmark event', 'error');
    }
}

function addToGoogleCalendar(event) {
    try {
        console.log(`📅 Adding to Google Calendar: ${event.title}`);

        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later

        const calendarUrl = new URL('https://calendar.google.com/calendar/render');
        calendarUrl.searchParams.set('action', 'TEMPLATE');
        calendarUrl.searchParams.set('text', event.title);
        calendarUrl.searchParams.set('dates',
            `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
        );
        calendarUrl.searchParams.set('details', event.description);
        calendarUrl.searchParams.set('location', event.location);

        window.open(calendarUrl.toString(), '_blank');

        console.log('✅ Opened Google Calendar');

    } catch (error) {
        console.error('💥 Error adding to Google Calendar:', error);
        showNotification('Failed to open Google Calendar', 'error');
    }
}

function formatDateForCalendar(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// =============================================================================
// EVENT LISTENERS SETUP
// =============================================================================

function setupEventListeners() {
    // Calendar navigation
    document.getElementById('prevPeriod')?.addEventListener('click', () => {
        navigateCalendar(-1);
    });

    document.getElementById('nextPeriod')?.addEventListener('click', () => {
        navigateCalendar(1);
    });

    // View toggle
    document.getElementById('monthViewBtn')?.addEventListener('click', () => {
        switchView('month');
    });

    document.getElementById('weekViewBtn')?.addEventListener('click', () => {
        switchView('week');
    });

    // Carousel controls
    document.getElementById('prevEvent')?.addEventListener('click', () => {
        navigateCarousel(-1);
    });

    document.getElementById('nextEvent')?.addEventListener('click', () => {
        navigateCarousel(1);
    });

    // Add all events to calendar
    document.getElementById('addToCalendarBtn')?.addEventListener('click', () => {
        if (EventsState.selectedDateEvents.length > 0) {
            EventsState.selectedDateEvents.forEach(event => {
                addToGoogleCalendar(event);
            });
        }
    });

    console.log('🎧 Event listeners set up');
}

// =============================================================================
// CAROUSEL NAVIGATION
// =============================================================================

function navigateCarousel(direction) {
    const carousel = document.getElementById('eventsCarousel');
    if (!carousel) return;

    EventsState.carouselIndex += direction;

    // Keep within bounds
    const maxIndex = Math.max(0, EventsState.selectedDateEvents.length - 1);
    EventsState.carouselIndex = Math.max(0, Math.min(EventsState.carouselIndex, maxIndex));

    // Scroll to event
    const eventCards = carousel.querySelectorAll('.carousel-event-card');
    if (eventCards[EventsState.carouselIndex]) {
        eventCards[EventsState.carouselIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    updateCarouselControls();
}

function updateCarouselControls() {
    const prevBtn = document.getElementById('prevEvent');
    const nextBtn = document.getElementById('nextEvent');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = EventsState.carouselIndex <= 0;
        nextBtn.disabled = EventsState.carouselIndex >= EventsState.selectedDateEvents.length - 1;
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
    const weekDates = getWeekDates(EventsState.currentDate);
    const start = weekDates[0];
    const end = weekDates[6];

    if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
    }
}

function showEventDetails(event) {
    // This could open a modal or navigate to a detailed event page
    console.log('📖 Showing event details:', event);

    // For now, just select the date
    const eventDate = new Date(event.date);
    selectDate(eventDate);
}

// =============================================================================
// UI STATE MANAGEMENT
// =============================================================================

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const container = document.getElementById('eventsContainer');

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.querySelector('p').textContent = message;
    }

    if (container) {
        container.style.display = 'none';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    const container = document.getElementById('eventsContainer');

    if (overlay) {
        overlay.style.display = 'none';
    }

    if (container) {
        container.style.display = 'block';
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const eventsContainer = document.getElementById('eventsContainer');
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    if (eventsContainer) {
        eventsContainer.style.display = 'none';
    }

    if (errorContainer) {
        errorContainer.style.display = 'flex';
        errorContainer.querySelector('#errorMessage').textContent = message;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#5F96C5'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// =============================================================================
// FALLBACK DATA
// =============================================================================

function getFallbackFeaturedEvents() {
    return [
        {
            _id: 'fallback1',
            title: 'HackDavis 2025',
            description: 'UC Davis\'s premier hackathon focused on social good and environmental sustainability.',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            time: '9:00 AM - 11:59 PM',
            location: 'UC Davis Campus',
            imageUrl: '/assets/hackdavis-placeholder.jpg',
            formattedTime: '9:00 AM - 11:59 PM',
            attendees: []
        },
        {
            _id: 'fallback2',
            title: 'Tech Career Fair',
            description: 'Meet with top tech companies and explore internship and full-time opportunities.',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            time: '10:00 AM - 4:00 PM',
            location: 'UC Center Ballroom',
            imageUrl: '/assets/career-fair-placeholder.jpg',
            formattedTime: '10:00 AM - 4:00 PM',
            attendees: []
        },
        {
            _id: 'fallback3',
            title: 'AI Research Expo',
            description: 'Showcase of cutting-edge AI research from UC Davis faculty and students.',
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
            time: '2:00 PM - 6:00 PM',
            location: 'Engineering Building',
            imageUrl: '/assets/ai-expo-placeholder.jpg',
            formattedTime: '2:00 PM - 6:00 PM',
            attendees: []
        }
    ];
}

// =============================================================================
// GLOBAL FUNCTIONS (for debugging)
// =============================================================================

window.debugEvents = function () {
    console.log('🐛 Events Debug Info:');
    console.log('  Current view:', EventsState.currentView);
    console.log('  Current date:', EventsState.currentDate);
    console.log('  Selected date:', EventsState.selectedDate);
    console.log('  Featured events:', EventsState.featuredEvents.length);
    console.log('  Calendar events:', Object.keys(EventsState.calendarEvents).length);
    console.log('  Selected date events:', EventsState.selectedDateEvents.length);
    console.log('  Full state:', EventsState);
};

console.log('✅ Events page script loaded successfully');

// =============================================================================
// IMAGE ERROR HANDLING FOR EVENTS
// Add this to your events-page.js file after the existing code
// =============================================================================

// 🖼️ FUNCTION: Handle image loading errors with fallbacks
function setupImageErrorHandling() {
    console.log('🖼️ Setting up image error handling...');

    // Handle all event images on the page
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('event-image')) {
            handleImageError(e.target);
        }
    }, true);

    // Also handle images that are added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const images = node.querySelectorAll ? node.querySelectorAll('img.event-image') : [];
                    images.forEach(setupImageFallback);

                    // Also check if the node itself is an image
                    if (node.tagName === 'IMG' && node.classList.contains('event-image')) {
                        setupImageFallback(node);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Setup existing images
    document.querySelectorAll('img.event-image').forEach(setupImageFallback);
}

function setupImageFallback(img) {
    // Add loading state
    img.classList.add('event-image-loading');

    img.addEventListener('load', () => {
        img.classList.remove('event-image-loading');
        console.log('✅ Image loaded successfully:', img.src);
    });

    img.addEventListener('error', () => {
        handleImageError(img);
    });
}

function handleImageError(img) {
    console.log('⚠️ Image failed to load:', img.src);

    img.classList.remove('event-image-loading');
    img.setAttribute('data-error', 'true');

    // Try to determine category from context
    const eventCard = img.closest('.event-card, .carousel-event-card');
    if (eventCard) {
        const title = eventCard.querySelector('.event-title, .carousel-event-title')?.textContent?.toLowerCase() || '';
        const category = determineCategoryFromTitle(title);
        img.setAttribute('data-category', category);
    }

    // Create fallback placeholder
    createImagePlaceholder(img);
}

function determineCategoryFromTitle(title) {
    const categoryKeywords = {
        'hackathon': ['hack', 'hackathon', 'coding competition'],
        'workshop': ['workshop', 'bootcamp', 'training', 'tutorial'],
        'career': ['career', 'job fair', 'recruiting', 'employment'],
        'tech-talk': ['tech talk', 'speaker', 'presentation', 'seminar'],
        'networking': ['networking', 'meetup', 'social', 'mixer'],
        'research': ['research', 'expo', 'showcase', 'innovation'],
        'competition': ['competition', 'contest', 'challenge', 'ctf']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => title.includes(keyword))) {
            return category;
        }
    }

    return 'event'; // default
}

function createImagePlaceholder(img) {
    const container = img.parentElement;
    if (!container) return;

    // Create placeholder div
    const placeholder = document.createElement('div');
    placeholder.className = 'event-placeholder';

    const category = img.getAttribute('data-category') || 'event';
    const categoryConfig = getCategoryConfig(category);

    placeholder.style.background = categoryConfig.gradient;
    placeholder.innerHTML = `
        <div class="event-placeholder-icon">${categoryConfig.icon}</div>
        <div class="event-placeholder-text">${categoryConfig.text}</div>
    `;

    // Replace image with placeholder
    container.replaceChild(placeholder, img);
}

function getCategoryConfig(category) {
    const configs = {
        'hackathon': {
            gradient: 'linear-gradient(135deg, #e74c3c, #f39c12)',
            icon: '💻',
            text: 'Hackathon Event'
        },
        'workshop': {
            gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            icon: '🛠️',
            text: 'Workshop'
        },
        'career': {
            gradient: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
            icon: '💼',
            text: 'Career Fair'
        },
        'tech-talk': {
            gradient: 'linear-gradient(135deg, #34495e, #2c3e50)',
            icon: '🎤',
            text: 'Tech Talk'
        },
        'networking': {
            gradient: 'linear-gradient(135deg, #f39c12, #f1c40f)',
            icon: '🤝',
            text: 'Networking'
        },
        'research': {
            gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
            icon: '🔬',
            text: 'Research Event'
        },
        'competition': {
            gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
            icon: '🏆',
            text: 'Competition'
        },
        'event': {
            gradient: 'linear-gradient(135deg, #5F96C5, #4a8bc2)',
            icon: '🎉',
            text: 'Tech Event'
        }
    };

    return configs[category] || configs['event'];
}

// 🎨 FUNCTION: Generate placeholder image URLs
function generatePlaceholderUrl(width = 450, height = 300, text = 'Event Image') {
    const bgColor = '5F96C5';
    const textColor = 'FFFFFF';
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
}

// 🔄 FUNCTION: Update event cards with fallback images
function updateEventImagesWithFallbacks() {
    const eventImages = document.querySelectorAll('.event-image');

    eventImages.forEach((img, index) => {
        // If no src or src is placeholder, set a better fallback
        if (!img.src || img.src.includes('placeholder')) {
            const eventCard = img.closest('.event-card');
            const title = eventCard?.querySelector('.event-title')?.textContent || `Event ${index + 1}`;
            const category = determineCategoryFromTitle(title.toLowerCase());

            // Use placeholder service as fallback
            img.src = generatePlaceholderUrl(450, 300, title);
            img.setAttribute('data-category', category);
        }
    });
}

// =============================================================================
// INTEGRATION WITH EXISTING EVENTS CODE
// =============================================================================

// Add this to your existing setupEventListeners function:
function enhanceEventListeners() {
    // Call existing setup
    setupEventListeners();

    // Add image error handling
    setupImageErrorHandling();

    // Update any existing images
    updateEventImagesWithFallbacks();

    console.log('🖼️ Enhanced event listeners with image handling');
}

// =============================================================================
// CALL THIS DURING INITIALIZATION
// =============================================================================

// Update your DOMContentLoaded event listener to include:
// document.addEventListener('DOMContentLoaded', async () => {
//     // ... your existing initialization code ...
//     
//     enhanceEventListeners(); // Add this line
//     
//     // ... rest of your code ...
// });

// Export functions for external use
window.setupImageErrorHandling = setupImageErrorHandling;
window.generatePlaceholderUrl = generatePlaceholderUrl;
window.updateEventImagesWithFallbacks = updateEventImagesWithFallbacks;