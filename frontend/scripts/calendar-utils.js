// =============================================================================
// FIXED GOOGLE CALENDAR INTEGRATION WITH DEBUGGING
// Replace your calendar-utils.js with this version
// =============================================================================

// 📅 SIMPLIFIED AND ROBUST GOOGLE CALENDAR FUNCTION
function addToGoogleCalendar(event) {
    try {
        console.log('🐛 DEBUG: Starting addToGoogleCalendar with event:', event);

        // Validate event object
        if (!event) {
            console.error('❌ No event object provided');
            showCalendarNotification('No event data available', 'error');
            return;
        }

        // Extract and validate event data with fallbacks
        const eventData = {
            title: event.title || event.name || 'UC Davis Tech Event',
            description: event.description || 'Join us for this exciting tech event at UC Davis!',
            location: event.location || 'UC Davis Campus',
            date: event.date || new Date().toISOString(),
            time: event.time || event.formattedTime || '6:00 PM - 8:00 PM'
        };

        console.log('🐛 DEBUG: Processed event data:', eventData);

        // Parse the date
        let eventDate;
        try {
            eventDate = new Date(eventData.date);
            if (isNaN(eventDate.getTime())) {
                throw new Error('Invalid date');
            }
        } catch (dateError) {
            console.error('❌ Invalid event date:', eventData.date, dateError);
            eventDate = new Date(); // Fallback to today
        }

        console.log('🐛 DEBUG: Parsed event date:', eventDate);

        // Parse time with robust error handling
        let startTime, endTime;
        try {
            const timeResult = parseEventTimeRobust(eventData.time, eventDate);
            startTime = timeResult.start;
            endTime = timeResult.end;
        } catch (timeError) {
            console.error('⚠️ Time parsing failed:', eventData.time, timeError);
            // Fallback to default times
            startTime = new Date(eventDate);
            startTime.setHours(18, 0, 0, 0); // 6 PM
            endTime = new Date(startTime);
            endTime.setHours(20, 0, 0, 0); // 8 PM
        }

        console.log('🐛 DEBUG: Parsed times - Start:', startTime, 'End:', endTime);

        // Build Google Calendar URL
        const calendarUrl = buildGoogleCalendarUrlSimple({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startTime: startTime,
            endTime: endTime
        });

        console.log('🐛 DEBUG: Generated calendar URL:', calendarUrl);

        // Test URL validity
        try {
            new URL(calendarUrl);
        } catch (urlError) {
            console.error('❌ Invalid URL generated:', calendarUrl, urlError);
            showCalendarNotification('Failed to generate calendar link', 'error');
            return;
        }

        // Open Google Calendar
        console.log('🐛 DEBUG: Attempting to open calendar...');
        const newWindow = window.open(calendarUrl, '_blank', 'noopener,noreferrer');

        if (!newWindow) {
            console.error('❌ Failed to open new window - likely popup blocked');
            showCalendarNotification('Please allow popups to add events to calendar', 'error');
            return;
        }

        console.log('✅ Google Calendar opened successfully');
        showCalendarNotification('Event added to Google Calendar! 📅', 'success');

    } catch (error) {
        console.error('💥 Error in addToGoogleCalendar:', error);
        console.error('💥 Error stack:', error.stack);
        showCalendarNotification(`Failed to add to calendar: ${error.message}`, 'error');
    }
}

// 🕒 ROBUST TIME PARSING WITH BETTER ERROR HANDLING
function parseEventTimeRobust(timeString, eventDate) {
    console.log('🐛 DEBUG: Parsing time string:', timeString);

    if (!timeString || timeString === 'Time TBD' || timeString === 'TBD') {
        console.log('🐛 DEBUG: No valid time provided, using defaults');
        const defaultStart = new Date(eventDate);
        defaultStart.setHours(18, 0, 0, 0);
        const defaultEnd = new Date(defaultStart);
        defaultEnd.setHours(20, 0, 0, 0);
        return { start: defaultStart, end: defaultEnd };
    }

    try {
        // Clean the time string
        const cleanTime = timeString.trim().toLowerCase();
        console.log('🐛 DEBUG: Cleaned time string:', cleanTime);

        // Handle range times (e.g., "6:00 PM - 8:00 PM")
        if (cleanTime.includes('-') || cleanTime.includes('to')) {
            const separator = cleanTime.includes('-') ? '-' : 'to';
            const timeParts = cleanTime.split(separator).map(t => t.trim());

            if (timeParts.length >= 2) {
                const startTime = parseIndividualTime(timeParts[0], eventDate);
                const endTime = parseIndividualTime(timeParts[1], eventDate);
                console.log('🐛 DEBUG: Parsed range times - Start:', startTime, 'End:', endTime);
                return { start: startTime, end: endTime };
            }
        }

        // Handle single time (e.g., "6:00 PM")
        const startTime = parseIndividualTime(cleanTime, eventDate);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2); // Default 2-hour duration

        console.log('🐛 DEBUG: Parsed single time - Start:', startTime, 'End:', endTime);
        return { start: startTime, end: endTime };

    } catch (error) {
        console.error('❌ Time parsing error:', error);
        throw error;
    }
}

// 🕐 PARSE INDIVIDUAL TIME WITH MULTIPLE FORMAT SUPPORT
function parseIndividualTime(timeStr, baseDate) {
    console.log('🐛 DEBUG: Parsing individual time:', timeStr);

    const date = new Date(baseDate);
    const cleanTimeStr = timeStr.trim().toLowerCase();

    // Common patterns to match:
    // "6:00 pm", "6pm", "18:00", "6:30 am", etc.
    const timePatterns = [
        /(\d{1,2}):(\d{2})\s*(am|pm)/,  // 6:00 PM, 12:30 AM
        /(\d{1,2})\s*(am|pm)/,          // 6 PM, 12 AM
        /(\d{1,2}):(\d{2})/,            // 18:00, 06:30 (24-hour)
        /(\d{1,2})/                     // 6, 18 (just hour)
    ];

    for (const pattern of timePatterns) {
        const match = cleanTimeStr.match(pattern);
        if (match) {
            console.log('🐛 DEBUG: Time pattern matched:', match);

            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2] || '0');
            const isPM = match[3] === 'pm';
            const isAM = match[3] === 'am';

            // Convert to 24-hour format
            if (isPM && hours !== 12) {
                hours += 12;
            } else if (isAM && hours === 12) {
                hours = 0;
            }

            // Validate hours and minutes
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                date.setHours(hours, minutes, 0, 0);
                console.log('🐛 DEBUG: Successfully parsed time:', date);
                return date;
            }
        }
    }

    throw new Error(`Unable to parse time: ${timeStr}`);
}

// 🔗 SIMPLIFIED GOOGLE CALENDAR URL BUILDER
function buildGoogleCalendarUrlSimple({ title, description, location, startTime, endTime }) {
    try {
        console.log('🐛 DEBUG: Building calendar URL with params:', { title, location, startTime, endTime });

        const baseUrl = 'https://calendar.google.com/calendar/render';
        const params = new URLSearchParams();

        // Required parameters
        params.set('action', 'TEMPLATE');
        params.set('text', title);

        // Format dates (YYYYMMDDTHHMMSSZ in UTC)
        const startUTC = formatDateForCalendarUTC(startTime);
        const endUTC = formatDateForCalendarUTC(endTime);
        params.set('dates', `${startUTC}/${endUTC}`);

        console.log('🐛 DEBUG: Formatted dates:', `${startUTC}/${endUTC}`);

        // Optional parameters
        if (description) {
            const fullDescription = `${description}\n\n📍 ${location}\n🎓 UC Davis Cownect`;
            params.set('details', fullDescription);
        }

        if (location) {
            params.set('location', location);
        }

        // Set timezone
        params.set('ctz', 'America/Los_Angeles');

        const finalUrl = `${baseUrl}?${params.toString()}`;
        console.log('🐛 DEBUG: Final calendar URL:', finalUrl);

        return finalUrl;

    } catch (error) {
        console.error('❌ Error building calendar URL:', error);
        throw error;
    }
}

// 📆 FORMAT DATE FOR GOOGLE CALENDAR (UTC)
function formatDateForCalendarUTC(date) {
    try {
        // Convert to UTC and format as YYYYMMDDTHHMMSSZ
        const utcString = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        console.log('🐛 DEBUG: Formatted date for calendar:', date, '->', utcString);
        return utcString;
    } catch (error) {
        console.error('❌ Error formatting date:', date, error);
        throw error;
    }
}

// 🔔 ENHANCED NOTIFICATION SYSTEM
function showCalendarNotification(message, type = 'info') {
    console.log(`🔔 Notification: ${message} (${type})`);

    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.calendar-notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `calendar-notification ${type}`;

    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#5F96C5',
        warning: '#f39c12'
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 1002;
        font-weight: 500;
        font-size: 0.9rem;
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        line-height: 1.4;
    `;

    notification.innerHTML = `
        <span style="flex-shrink: 0;">${icons[type]}</span>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: 0.5rem; flex-shrink: 0;">×</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove based on type
    const autoRemoveDelay = type === 'error' ? 8000 : 4000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, autoRemoveDelay);
}

// 🧪 SIMPLE TEST FUNCTION - Call this from browser console to test
window.testCalendar = function () {
    console.log('🧪 Testing calendar integration...');

    const testEvent = {
        title: 'Test Event',
        description: 'This is a test event from UC Davis Cownect',
        location: 'Kemper Hall 1131',
        date: new Date().toISOString(),
        time: '6:00 PM - 8:00 PM'
    };

    console.log('🧪 Test event:', testEvent);
    addToGoogleCalendar(testEvent);
};

// 🎯 ENHANCED EVENT CARD INTEGRATION
function setupCalendarButtons() {
    console.log('🔧 Setting up calendar button handlers...');

    // Remove existing handlers to prevent duplicates
    document.removeEventListener('click', handleCalendarClick);

    // Add new handler
    document.addEventListener('click', handleCalendarClick);

    console.log('✅ Calendar button handlers ready');
}

function handleCalendarClick(e) {
    // Check if clicked element or its parent is a calendar button
    const calendarBtn = e.target.closest('.add-calendar-btn, .add-to-calendar');

    if (!calendarBtn) return;

    e.preventDefault();
    e.stopPropagation();

    console.log('🖱️ Calendar button clicked');

    // Find the parent event card
    const eventCard = calendarBtn.closest('.event-card, .carousel-event-card, .sidebar-event-card, .featured-event-card');

    if (!eventCard) {
        console.error('❌ No event card found for calendar button');
        showCalendarNotification('Unable to find event information', 'error');
        return;
    }

    console.log('🎴 Found event card:', eventCard);

    // Extract event data
    const eventData = extractEventDataFromCard(eventCard);

    if (!eventData) {
        console.error('❌ Failed to extract event data');
        showCalendarNotification('Unable to extract event information', 'error');
        return;
    }

    console.log('📊 Extracted event data:', eventData);

    // Add to Google Calendar
    addToGoogleCalendar(eventData);
}

// 📊 ROBUST EVENT DATA EXTRACTION
function extractEventDataFromCard(eventCard) {
    try {
        console.log('📊 Extracting event data from card...');

        // Helper function to safely get text content
        const getTextContent = (selector, fallback = '') => {
            const element = eventCard.querySelector(selector);
            const text = element ? element.textContent.trim() : fallback;
            console.log(`🔍 ${selector}: "${text}"`);
            return text;
        };

        // Get event data with multiple selector fallbacks
        const eventData = {
            title: getTextContent('.event-title, .carousel-event-title, .sidebar-event-title, h3, h4') || 'UC Davis Tech Event',
            description: getTextContent('.event-description, .carousel-event-description, .sidebar-event-description, p') || 'Join us for this exciting tech event at UC Davis!',
            location: getTextContent('.location-text, .event-location, .carousel-event-location') || 'UC Davis Campus',
            time: getTextContent('.time-text, .event-time, .carousel-event-time') || '6:00 PM - 8:00 PM',
            date: eventCard.dataset.eventDate || eventCard.dataset.date || new Date().toISOString(),
            id: eventCard.dataset.eventId || eventCard.dataset.id || Date.now()
        };

        console.log('📊 Successfully extracted event data:', eventData);
        return eventData;

    } catch (error) {
        console.error('❌ Error extracting event data:', error);
        return null;
    }
}

// 🚀 INITIALIZE EVERYTHING
function initializeCalendarIntegration() {
    console.log('🚀 Initializing enhanced calendar integration...');

    try {
        setupCalendarButtons();

        // Add test function to window for debugging
        window.debugCalendar = () => {
            console.log('🐛 Calendar Debug Info:');
            console.log('- Calendar buttons found:', document.querySelectorAll('.add-calendar-btn, .add-to-calendar').length);
            console.log('- Event cards found:', document.querySelectorAll('.event-card, .carousel-event-card, .sidebar-event-card').length);
        };

        console.log('✅ Calendar integration ready!');
        console.log('💡 Test with: window.testCalendar() or window.debugCalendar()');

    } catch (error) {
        console.error('💥 Failed to initialize calendar integration:', error);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalendarIntegration);
} else {
    initializeCalendarIntegration();
}

console.log('✅ Fixed Google Calendar integration loaded');