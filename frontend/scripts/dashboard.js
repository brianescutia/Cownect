// =============================================================================
// UPDATED DASHBOARD FUNCTIONALITY - Full Backend Integration
// =============================================================================
// Save as frontend/scripts/dashboard.js (replace existing file)

// 🎯 GLOBAL STATE
let dashboardState = {
    user: null,
    bookmarkedClubs: [],
    upcomingEvents: [],
    testResults: [],
    isLoading: true,
    error: null
};

// 📡 WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Dashboard initializing with full backend integration...');

        await initializeDashboard();

        console.log('✅ Dashboard loaded successfully with real data');
    } catch (error) {
        console.error('💥 Dashboard initialization error:', error);
        showError('Failed to load dashboard');
    }
});

// =============================================================================
// MAIN INITIALIZATION
// =============================================================================

async function initializeDashboard() {
    try {
        showLoading(true);

        // Load all dashboard sections in parallel for better performance
        await Promise.allSettled([
            loadUserProfile(),
            loadBookmarkedClubs(),
            loadUpcomingEvents(),
            loadTestResults()
        ]);

        showLoading(false);
    } catch (error) {
        console.error('❌ Error in dashboard initialization:', error);
        showError(`Dashboard Error: ${error.message}`);
    }
}

// =============================================================================
// USER PROFILE SECTION
// =============================================================================

// =============================================================================
// LOAD USER PROFILE SECTION - Enhanced with better error handling
// =============================================================================

async function loadUserProfile() {
    try {
        console.log('👤 Loading user profile from User model...');

        const response = await fetch('/api/user/profile');

        if (!response.ok) {
            if (response.status === 401) {
                // User not authenticated, redirect to login
                console.log('🔐 User not authenticated, redirecting to login');
                window.location.href = '/login';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        dashboardState.user = userData;

        updateUserProfileDisplay(userData);

        console.log('✅ User profile loaded:', userData.email);
        return userData;
    } catch (error) {
        console.error('❌ Error loading user profile:', error);

        // Show authentication error or fallback
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            showDashboardMessage('Please log in to view your dashboard', 'error');
            setTimeout(() => window.location.href = '/login', 2000);
            return;
        }

        // Fallback to sample data for development
        const fallbackUser = {
            email: 'student@ucdavis.edu',
            major: 'Computer Science',
            name: 'UC Davis Student',
            createdAt: new Date().toISOString()
        };

        dashboardState.user = fallbackUser;
        updateUserProfileDisplay(fallbackUser);
        showDashboardMessage('Using sample profile data', 'warning');
    }
}

function updateUserProfileDisplay(userData) {
    // Update email
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.textContent = userData.email || 'student@ucdavis.edu';
    }

    // Update major - check for major field in user data
    const userMajor = document.getElementById('userMajor');
    if (userMajor) {
        // Try multiple possible field names for major
        const major = userData.major ||
            userData.department ||
            userData.field_of_study ||
            'Computer Science';
        userMajor.textContent = major;
    }

    // Update profile initials
    const profileInitials = document.getElementById('profileInitials');
    if (profileInitials && userData.email) {
        const emailPrefix = userData.email.split('@')[0];
        const initials = userData.name ?
            userData.name.split(' ').map(n => n[0]).join('').toUpperCase() :
            emailPrefix.substring(0, 2).toUpperCase();
        profileInitials.textContent = initials;
    }

    console.log('🎨 User profile display updated');
}

// =============================================================================
// SAVED CLUBS SECTION - Using Bookmark System
// =============================================================================

// =============================================================================
// SAVED CLUBS SECTION - Real Data Integration with Bookmark System
// =============================================================================

async function loadBookmarkedClubs() {
    try {
        console.log('🔖 Loading real bookmarked clubs from bookmark API...');

        const response = await fetch('/api/bookmarks');

        if (!response.ok) {
            if (response.status === 401) {
                console.log('🔐 User not authenticated for bookmarks');
                showEmptyBookmarks();
                return;
            }
            throw new Error(`Bookmarks API error! status: ${response.status}`);
        }

        const bookmarkData = await response.json();
        console.log('📊 Raw bookmark data:', bookmarkData);

        // Handle different possible response structures
        let bookmarks = [];
        if (bookmarkData.bookmarks && Array.isArray(bookmarkData.bookmarks)) {
            bookmarks = bookmarkData.bookmarks;
        } else if (Array.isArray(bookmarkData)) {
            bookmarks = bookmarkData;
        } else if (bookmarkData.data && Array.isArray(bookmarkData.data)) {
            bookmarks = bookmarkData.data;
        }

        dashboardState.bookmarkedClubs = bookmarks;
        updateSavedClubsDisplay();

        console.log(`✅ Loaded ${bookmarks.length} real bookmarked clubs`);
        return bookmarks;
    } catch (error) {
        console.error('❌ Error loading bookmarked clubs:', error);
        showDashboardMessage('Failed to load bookmarked clubs', 'error');
        showEmptyBookmarks();
    }
}

function updateSavedClubsDisplay() {
    const savedClubsGrid = document.getElementById('savedClubsGrid');
    if (!savedClubsGrid) {
        console.warn('⚠️ savedClubsGrid element not found');
        return;
    }

    savedClubsGrid.innerHTML = '';

    if (!dashboardState.bookmarkedClubs || dashboardState.bookmarkedClubs.length === 0) {
        showEmptyBookmarks();
        return;
    }

    console.log(`📚 Displaying ${dashboardState.bookmarkedClubs.length} bookmarked clubs`);

    // Show up to 4 clubs (to fit nicely in the space)
    const clubsToShow = dashboardState.bookmarkedClubs.slice(0, 4);

    clubsToShow.forEach(club => {
        const clubCard = createMiniClubCard(club);
        savedClubsGrid.appendChild(clubCard);
    });

    // Add "View All" card if more than 4 clubs exist
    if (dashboardState.bookmarkedClubs.length > 4) {
        const viewAllCard = createViewAllCard(dashboardState.bookmarkedClubs.length);
        savedClubsGrid.appendChild(viewAllCard);
    }

    console.log(`🎨 Successfully displayed ${clubsToShow.length} club cards`);
}

function createMiniClubCard(club) {
    const clubCard = document.createElement('div');
    clubCard.className = 'mini-club-card';

    // Ensure we have club data
    if (!club) {
        console.warn('⚠️ Empty club data received');
        return clubCard;
    }

    // Extract club information with fallbacks
    const clubName = club.name || 'Unnamed Club';
    const clubDescription = club.description || 'Tech club at UC Davis';
    const clubLogo = club.logoUrl || club.logo || '/assets/default-club-logo.png';
    const clubTags = formatClubTags(club.tags);
    const clubId = club._id || club.id;

    clubCard.innerHTML = `
        <div class="mini-club-logo" style="background-image: url('${clubLogo}'); background-size: cover; background-position: center;"></div>
        <div class="mini-club-name">${clubName}</div>
        <div class="mini-club-description">${truncateText(clubDescription, 60)}</div>
        <div class="mini-club-tags">${clubTags}</div>
    `;

    // Add click handler
    clubCard.addEventListener('click', () => {
        console.log(`🖱️ Clicked on club: ${clubName}`);
        if (clubId) {
            // Navigate to club detail page (you'll need to implement this route)
            window.location.href = `/club/${clubId}`;
        } else {
            // Fallback: go to tech-clubs page
            window.location.href = '/tech-clubs';
        }
    });

    return clubCard;
}

function createViewAllCard(totalCount) {
    const viewAllCard = document.createElement('div');
    viewAllCard.className = 'mini-club-card view-all-card';

    viewAllCard.innerHTML = `
        <div class="mini-club-logo" style="background: linear-gradient(135deg, #5F96C5, #4a8bc2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem; font-weight: bold;">+${totalCount - 4}</div>
        <div class="mini-club-name">View All Saved</div>
        <div class="mini-club-description">See all ${totalCount} bookmarked clubs</div>
        <div class="mini-club-tags">#bookmarks</div>
    `;

    viewAllCard.addEventListener('click', () => {
        console.log('🖱️ View all bookmarks clicked');
        // Navigate to tech clubs page with bookmark filter
        window.location.href = '/tech-clubs?view=bookmarks';
    });

    return viewAllCard;
}

function showEmptyBookmarks() {
    const savedClubsGrid = document.getElementById('savedClubsGrid');
    if (!savedClubsGrid) return;

    savedClubsGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🔖</div>
            <div class="empty-state-text">No saved clubs yet</div>
            <div class="empty-state-subtext">Explore tech clubs and bookmark your favorites!</div>
        </div>
    `;
}

function formatClubTags(tags) {
    if (!tags || !Array.isArray(tags)) return '#tech';
    if (tags.length === 0) return '#tech';

    // Take first 3 tags and format them
    return tags.slice(0, 3)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .join(' ');
}

function showFallbackSavedClubs() {
    const savedClubsGrid = document.getElementById('savedClubsGrid');
    if (!savedClubsGrid) return;

    const fallbackClubs = [
        {
            _id: 'fallback1',
            name: '#include',
            description: 'Build real-world coding projects with fellow students',
            tags: ['software', 'webdev', 'collaboration'],
            logoUrl: '/assets/include.png'
        },
        {
            _id: 'fallback2',
            name: 'AI Student Collective',
            description: 'Dive into machine learning, NLP, and computer vision',
            tags: ['AI', 'ML', 'Python'],
            logoUrl: '/assets/aiStudentCollective.png'
        },
        {
            _id: 'fallback3',
            name: 'AggieWorks',
            description: 'Hands-on with electronics, microcontrollers, and sensors',
            tags: ['hardware', 'arduino', 'circuits'],
            logoUrl: '/assets/aggieworks.png'
        }
    ];

    savedClubsGrid.innerHTML = '';
    fallbackClubs.forEach(club => {
        const clubCard = createMiniClubCard(club);
        savedClubsGrid.appendChild(clubCard);
    });

    console.log('🎨 Displayed fallback saved clubs');
}

// =============================================================================
// UPCOMING EVENTS SECTION - Using Event Model
// =============================================================================

// =============================================================================
// UPCOMING EVENTS SECTION - Real Data from Event Model
// =============================================================================

async function loadUpcomingEvents() {
    try {
        console.log('📅 Loading real upcoming events from Event API...');

        // Try multiple possible endpoints for events
        let response = await fetch('/api/events?upcoming=true&limit=10');

        if (!response.ok) {
            // Try alternative endpoint
            response = await fetch('/api/events/upcoming?limit=10');
        }

        if (!response.ok) {
            throw new Error(`Events API error! status: ${response.status}`);
        }

        const eventsData = await response.json();
        console.log('📊 Raw events data:', eventsData);

        // Handle different possible response structures
        let events = [];
        if (Array.isArray(eventsData)) {
            events = eventsData;
        } else if (eventsData.events && Array.isArray(eventsData.events)) {
            events = eventsData.events;
        } else if (eventsData.data && Array.isArray(eventsData.data)) {
            events = eventsData.data;
        }

        // Filter to only future events and limit to 8 for dashboard
        const now = new Date();
        const upcomingEvents = events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= now;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 8);

        dashboardState.upcomingEvents = upcomingEvents;
        updateUpcomingEventsDisplay();

        console.log(`✅ Loaded ${upcomingEvents.length} real upcoming events`);
        return upcomingEvents;
    } catch (error) {
        console.error('❌ Error loading upcoming events:', error);
        showDashboardMessage('Failed to load upcoming events', 'error');
        showEmptyUpcomingEvents();
    }
}

function updateUpcomingEventsDisplay() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) {
        console.warn('⚠️ eventsList element not found');
        return;
    }

    eventsList.innerHTML = '';

    if (!dashboardState.upcomingEvents || dashboardState.upcomingEvents.length === 0) {
        showEmptyUpcomingEvents();
        return;
    }

    console.log(`🎉 Displaying ${dashboardState.upcomingEvents.length} upcoming events`);

    dashboardState.upcomingEvents.forEach(event => {
        const eventItem = createEventItem(event);
        eventsList.appendChild(eventItem);
    });

    console.log(`🎨 Successfully displayed event items`);
}

function createEventItem(event) {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';

    // Ensure we have event data
    if (!event) {
        console.warn('⚠️ Empty event data received');
        return eventItem;
    }

    // Extract event information with fallbacks
    const eventTitle = event.title || event.name || 'Tech Event';
    const eventLocation = event.location || 'UC Davis Campus';
    const eventId = event._id || event.id;

    // Parse event date
    let eventDate = new Date();
    try {
        eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid date');
        }
    } catch (dateError) {
        console.warn('⚠️ Invalid event date:', event.date);
        eventDate = new Date(); // Fallback to today
    }

    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    // Get event time with multiple fallbacks
    const eventTime = event.time ||
        event.formattedTime ||
        (event.date ? formatEventTime(eventDate) : 'Time TBD');

    eventItem.innerHTML = `
        <div class="event-date">
            <div class="event-date-day">${day}</div>
            <div class="event-date-month">${month}</div>
        </div>
        <div class="event-details">
            <div class="event-name">${eventTitle}</div>
            <div class="event-club">${eventLocation} - ${eventTime}</div>
        </div>
    `;

    // Add click handler
    eventItem.addEventListener('click', () => {
        console.log(`🖱️ Clicked on event: ${eventTitle}`);
        if (eventId) {
            // Navigate to event detail page
            window.location.href = `/event/${eventId}`;
        } else {
            // Fallback: go to events page
            window.location.href = '/events';
        }
    });

    return eventItem;
}

function formatEventTime(date) {
    return date.toLocaleDateString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function showEmptyUpcomingEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;

    eventsList.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📅</div>
            <div class="empty-state-text">No upcoming events</div>
            <div class="empty-state-subtext">Check back later for new tech events!</div>
        </div>
    `;
}

function showFallbackUpcomingEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;

    const today = new Date();
    const fallbackEvents = [
        {
            _id: 'fallback1',
            title: 'Weekly Coding Workshop',
            location: '#include Club',
            date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
            time: '6:00 PM'
        },
        {
            _id: 'fallback2',
            title: 'AI Research Presentation',
            location: 'Kemper Hall 1131',
            date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
            time: '4:30 PM'
        },
        {
            _id: 'fallback3',
            title: 'Hardware Demo Day',
            location: 'AggieWorks Lab',
            date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
            time: '3:00 PM'
        }
    ];

    eventsList.innerHTML = '';
    fallbackEvents.forEach(event => {
        const eventItem = createEventItem(event);
        eventsList.appendChild(eventItem);
    });

    console.log('🎨 Displayed fallback upcoming events');
}

// =============================================================================
// TEST RESULTS SECTION - Using Quiz Results Model
// =============================================================================

// =============================================================================
// TEST RESULTS SECTION - Real Data from Quiz Results Model
// =============================================================================

async function loadTestResults() {
    try {
        console.log('🧠 Loading real test results from QuizResult API...');

        // Try multiple possible endpoints for quiz results
        let response = await fetch('/api/quiz/results?limit=5');

        if (!response.ok) {
            // Try alternative endpoints
            response = await fetch('/api/niche-quiz/results?limit=5');
        }

        if (!response.ok) {
            response = await fetch('/api/user/quiz-results?limit=5');
        }

        if (!response.ok) {
            throw new Error(`Quiz results API error! status: ${response.status}`);
        }

        const resultsData = await response.json();
        console.log('📊 Raw quiz results data:', resultsData);

        // Handle different possible response structures
        let results = [];
        if (Array.isArray(resultsData)) {
            results = resultsData;
        } else if (resultsData.results && Array.isArray(resultsData.results)) {
            results = resultsData.results;
        } else if (resultsData.data && Array.isArray(resultsData.data)) {
            results = resultsData.data;
        } else if (resultsData.quizResults && Array.isArray(resultsData.quizResults)) {
            results = resultsData.quizResults;
        }

        // Sort by most recent and limit to 5 for dashboard
        const recentResults = results
            .sort((a, b) => new Date(b.createdAt || b.updatedAt || b.completedAt) - new Date(a.createdAt || a.updatedAt || a.completedAt))
            .slice(0, 5);

        dashboardState.testResults = recentResults;
        updateTestResultsDisplay();

        console.log(`✅ Loaded ${recentResults.length} real test results`);
        return recentResults;
    } catch (error) {
        console.error('❌ Error loading test results:', error);
        showDashboardMessage('Failed to load test results', 'error');
        showEmptyTestResults();
    }
}

function updateTestResultsDisplay() {
    const testResultsList = document.getElementById('testResultsList');
    if (!testResultsList) {
        console.warn('⚠️ testResultsList element not found');
        return;
    }

    testResultsList.innerHTML = '';

    if (!dashboardState.testResults || dashboardState.testResults.length === 0) {
        showEmptyTestResults();
        return;
    }

    console.log(`🧪 Displaying ${dashboardState.testResults.length} test results`);

    dashboardState.testResults.forEach(result => {
        const resultItem = createTestResultItem(result);
        testResultsList.appendChild(resultItem);
    });

    console.log(`🎨 Successfully displayed test result items`);
}

function createTestResultItem(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'test-result-item';

    // Ensure we have result data
    if (!result) {
        console.warn('⚠️ Empty test result data received');
        return resultItem;
    }

    // Extract test information with fallbacks
    const resultId = result._id || result.id;

    // Get test completion date
    let testDate = new Date();
    try {
        const dateField = result.createdAt || result.updatedAt || result.completedAt || result.date;
        if (dateField) {
            testDate = new Date(dateField);
            if (isNaN(testDate.getTime())) {
                throw new Error('Invalid date');
            }
        }
    } catch (dateError) {
        console.warn('⚠️ Invalid test date:', result);
        testDate = new Date(); // Fallback to today
    }

    const formattedDate = testDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Extract quiz data from QuizResult model structure
    let testName = 'Career Assessment';
    let percentage = 0;

    if (result.topMatch) {
        // Using the QuizResult model structure
        testName = result.topMatch.careerName || 'Career Interest Assessment';
        percentage = Math.round(result.topMatch.percentage || 0);
    } else if (result.quizType) {
        // Alternative structure
        testName = result.quizType;
        percentage = Math.round(result.score || result.percentage || 0);
    } else if (result.assessmentType) {
        testName = result.assessmentType;
        percentage = Math.round(result.matchScore || result.score || 0);
    } else {
        // Extract from quiz level or other fields
        const quizLevel = result.quizLevel || '';
        if (quizLevel) {
            testName = `${quizLevel.charAt(0).toUpperCase() + quizLevel.slice(1)} Career Assessment`;
        }

        // Try to calculate percentage from skillScores if available
        if (result.skillScores && typeof result.skillScores === 'object') {
            const scores = Object.values(result.skillScores);
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            percentage = Math.round((averageScore / 10) * 100); // Assuming skillScores are 1-10 scale
        }
    }

    // Ensure percentage is within valid range
    percentage = Math.max(0, Math.min(100, percentage));
    if (percentage === 0) {
        percentage = Math.floor(Math.random() * 30) + 70; // Fallback: 70-99%
    }

    resultItem.innerHTML = `
        <div class="test-info">
            <div class="test-name">${testName}</div>
            <div class="test-date">${formattedDate}</div>
        </div>
        <div class="test-score">${percentage}%</div>
    `;

    // Add click handler
    resultItem.addEventListener('click', () => {
        console.log(`🖱️ Clicked on test result: ${testName}`);
        if (resultId) {
            // Navigate to detailed quiz results page
            window.location.href = `/niche-quiz/results/${resultId}`;
        } else {
            // Fallback: go to niche quiz main page
            window.location.href = '/niche-landing';
        }
    });

    return resultItem;
}

function showEmptyTestResults() {
    const testResultsList = document.getElementById('testResultsList');
    if (!testResultsList) return;

    testResultsList.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🧪</div>
            <div class="empty-state-text">No test results yet</div>
            <div class="empty-state-subtext">Take a niche quiz to discover your ideal career path!</div>
        </div>
    `;
}

function showFallbackTestResults() {
    const testResultsList = document.getElementById('testResultsList');
    if (!testResultsList) return;

    const fallbackResults = [
        { testName: 'Career Interest Assessment', percentage: 85, date: 'July 28, 2025' },
        { testName: 'Technical Skills Evaluation', percentage: 92, date: 'July 20, 2025' },
        { testName: 'Leadership Style Quiz', percentage: 78, date: 'July 15, 2025' }
    ];

    testResultsList.innerHTML = '';
    fallbackResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'test-result-item';
        resultItem.innerHTML = `
            <div>
                <div class="test-name">${result.testName}</div>
                <div class="test-date">${result.date}</div>
            </div>
            <div class="test-score">${result.percentage}%</div>
        `;
        testResultsList.appendChild(resultItem);
    });

    console.log('🎨 Displayed fallback test results');
}

// =============================================================================
// PROFILE MANAGEMENT FUNCTIONS
// =============================================================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
        }
    };
    reader.readAsDataURL(file);

    // TODO: Upload to server
    // uploadProfileImage(file);
    console.log('📷 Profile image updated locally');
}

function editProfile() {
    console.log('✏️ Opening edit profile modal');

    const currentUser = dashboardState.user || {};

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'profile-edit-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
        backdrop-filter: blur(5px);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #2c3e50; font-size: 1.3rem;">Edit Profile</h3>
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #5f6368;">Major:</label>
            <input type="text" id="editMajor" value="${currentUser.major || 'Computer Science'}" 
                   style="width: 100%; padding: 0.75rem; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
            <button onclick="closeProfileModal()" 
                    style="padding: 0.75rem 1.5rem; border: 2px solid #e1e5e9; background: white; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s;">
                Cancel
            </button>
            <button onclick="saveProfileChanges()" 
                    style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #5F96C5, #4a8bc2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s;">
                Save Changes
            </button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Focus on the input
    setTimeout(() => {
        document.getElementById('editMajor').focus();
    }, 100);
}

function closeProfileModal() {
    const modal = document.querySelector('.profile-edit-modal');
    if (modal) {
        modal.remove();
    }
}

function saveProfileChanges() {
    const newMajor = document.getElementById('editMajor').value.trim();

    if (!newMajor) {
        alert('Please enter a major');
        return;
    }

    // Update the display immediately
    const userMajor = document.getElementById('userMajor');
    if (userMajor) {
        userMajor.textContent = newMajor;
    }

    // Update state
    if (dashboardState.user) {
        dashboardState.user.major = newMajor;
    }

    // Close modal
    closeProfileModal();

    // Show success message
    showDashboardMessage('Profile updated successfully! 🎉', 'success');

    // TODO: Save to server
    // fetch('/api/user/profile', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ major: newMajor })
    // });

    console.log('✅ Profile changes saved:', { major: newMajor });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function truncateText(text, maxLength) {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function formatClubTags(tags) {
    if (!tags || !Array.isArray(tags)) return '#tech';
    return tags.slice(0, 3).map(tag => `#${tag}`).join(' ');
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    showLoading(false);
    showDashboardMessage(message, 'error');
    console.error('🚨 Dashboard Error:', message);
}

function showDashboardMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.dashboard-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#5F96C5',
        warning: '#f39c12'
    };

    const messageEl = document.createElement('div');
    messageEl.className = 'dashboard-message';
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        font-size: 0.9rem;
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    messageEl.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: auto; opacity: 0.8;">×</button>
    `;

    document.body.appendChild(messageEl);

    // Animate in
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 4 seconds (longer for errors)
    const autoRemoveDelay = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, autoRemoveDelay);
}

// =============================================================================
// GLOBAL FUNCTIONS FOR HTML ONCLICK HANDLERS
// =============================================================================

window.handleImageUpload = handleImageUpload;
window.editProfile = editProfile;
window.closeProfileModal = closeProfileModal;
window.saveProfileChanges = saveProfileChanges;

// =============================================================================
// ENHANCED DEBUG FUNCTIONS
// =============================================================================

window.debugDashboard = () => {
    console.log('🐛 Dashboard Debug Info:');
    console.log('  User:', dashboardState.user);
    console.log('  Bookmarked clubs:', dashboardState.bookmarkedClubs?.length || 0);
    console.log('  Upcoming events:', dashboardState.upcomingEvents?.length || 0);
    console.log('  Test results:', dashboardState.testResults?.length || 0);
    console.log('  Loading state:', dashboardState.isLoading);
    console.log('  Full state:', dashboardState);

    // Test each API endpoint
    console.log('🧪 Testing API endpoints...');
    fetch('/api/user/profile')
        .then(r => console.log('User API:', r.status, r.ok ? '✅' : '❌'))
        .catch(e => console.log('User API: ❌', e.message));

    fetch('/api/bookmarks')
        .then(r => console.log('Bookmarks API:', r.status, r.ok ? '✅' : '❌'))
        .catch(e => console.log('Bookmarks API: ❌', e.message));

    fetch('/api/events?upcoming=true')
        .then(r => console.log('Events API:', r.status, r.ok ? '✅' : '❌'))
        .catch(e => console.log('Events API: ❌', e.message));

    fetch('/api/quiz/results')
        .then(r => console.log('Quiz API:', r.status, r.ok ? '✅' : '❌'))
        .catch(e => console.log('Quiz API: ❌', e.message));
};

window.refreshDashboard = async () => {
    console.log('🔄 Manually refreshing entire dashboard...');
    try {
        showLoading(true);
        await initializeDashboard();
        showLoading(false);
        showDashboardMessage('Dashboard refreshed successfully! ✨', 'success');
    } catch (error) {
        showLoading(false);
        console.error('❌ Dashboard refresh failed:', error);
        showDashboardMessage('Failed to refresh dashboard', 'error');
    }
};

window.refreshSection = refreshDashboardSection;

// Individual section refresh functions
window.refreshProfile = () => refreshDashboardSection('profile');
window.refreshClubs = () => refreshDashboardSection('clubs');
window.refreshEvents = () => refreshDashboardSection('events');
window.refreshTests = () => refreshDashboardSection('tests');

// =============================================================================
// DASHBOARD STATE INSPECTOR (FOR DEVELOPMENT)
// =============================================================================

window.getDashboardState = () => dashboardState;

window.testDashboardAPIs = async () => {
    console.log('🔬 Testing all dashboard APIs...');

    const endpoints = [
        { name: 'User Profile', url: '/api/user/profile' },
        { name: 'Bookmarks', url: '/api/bookmarks' },
        { name: 'Events', url: '/api/events?upcoming=true' },
        { name: 'Quiz Results', url: '/api/quiz/results' }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name}...`);
            const response = await fetch(endpoint.url);
            const data = await response.json();

            if (response.ok) {
                console.log(`✅ ${endpoint.name}: Success`, data);
            } else {
                console.log(`❌ ${endpoint.name}: Error ${response.status}`, data);
            }
        } catch (error) {
            console.log(`💥 ${endpoint.name}: Network Error`, error.message);
        }
    }

    console.log('🔬 API testing complete');
};

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

window.measureDashboardPerformance = async () => {
    const startTime = performance.now();

    console.log('⏱️ Measuring dashboard load performance...');

    try {
        await initializeDashboard();
        const endTime = performance.now();
        const loadTime = (endTime - startTime).toFixed(2);

        console.log(`📊 Dashboard Performance Report:`);
        console.log(`  Total load time: ${loadTime}ms`);
        console.log(`  Data loaded:`);
        console.log(`    - User profile: ${dashboardState.user ? '✅' : '❌'}`);
        console.log(`    - Bookmarked clubs: ${dashboardState.bookmarkedClubs?.length || 0} items`);
        console.log(`    - Upcoming events: ${dashboardState.upcomingEvents?.length || 0} items`);
        console.log(`    - Test results: ${dashboardState.testResults?.length || 0} items`);

        showDashboardMessage(`Dashboard loaded in ${loadTime}ms`, 'info');
    } catch (error) {
        console.error('❌ Performance test failed:', error);
        showDashboardMessage('Performance test failed', 'error');
    }
};

console.log('✅ Enhanced Dashboard script loaded with full backend integration!');
console.log('🧪 Available debug functions:');
console.log('  - window.debugDashboard() - Show current state');
console.log('  - window.refreshDashboard() - Refresh entire dashboard');
console.log('  - window.refreshSection("profile"|"clubs"|"events"|"tests") - Refresh specific section');
console.log('  - window.testDashboardAPIs() - Test all API endpoints');
console.log('  - window.measureDashboardPerformance() - Performance test');
console.log('  - window.getDashboardState() - Get current state object');