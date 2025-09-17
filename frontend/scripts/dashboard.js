// =============================================================================
// ENHANCED DASHBOARD FUNCTIONALITY - Complete Profile Management & Matching
// =============================================================================



let resultsModalInstance = null;

let dashboardState = {
    user: null,
    bookmarkedClubs: [],
    upcomingEvents: [],
    testResults: [],
    potentialMatches: [],
    isLoading: true,
    profileUnsaved: false,
    error: null
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Enhanced Dashboard initializing...');
        await initializeDashboard();
        console.log('✅ Dashboard loaded successfully');
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

        // Load all dashboard sections in parallel
        await Promise.allSettled([
            loadUserProfile(),
            loadBookmarkedClubs(),
            loadUpcomingEvents(),
            loadTestResults(),
            loadPotentialMatches()
        ]);

        // Set up profile form listeners
        setupProfileFormListeners();

        showLoading(false);
    } catch (error) {
        console.error('❌ Error in dashboard initialization:', error);
        showError(`Dashboard Error: ${error.message}`);
    }
}

// =============================================================================
// USER PROFILE MANAGEMENT
// =============================================================================

async function loadUserProfile() {
    try {
        console.log('👤 Loading user profile...');

        const response = await fetch('/api/user/profile');

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        dashboardState.user = userData;

        updateUserProfileDisplay(userData);
        populateProfileForm(userData);
        updateNavbarProfile(userData);

        console.log('✅ User profile loaded:', userData.email);
        return userData;
    } catch (error) {
        console.error('❌ Error loading user profile:', error);
        showDashboardMessage('Failed to load profile. Please refresh the page.', 'error');
    }
}

function updateUserProfileDisplay(userData) {
    // Update email
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.textContent = userData.email || 'student@ucdavis.edu';
    }

    // Update display name
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        userDisplayName.textContent = userData.displayName || 'UC Davis Student';
    }

    // Calculate profile completion based on BASIC INFO ONLY
    const completionPercentage = calculateBasicProfileCompletion(userData);
    updateProfileCompletion(completionPercentage);

    // Update profile image
    if (userData.profilePictureUrl) {
        displayProfileImage(userData.profilePictureUrl);
    } else {
        displayProfileInitials(userData);
    }

    console.log('🎨 User profile display updated');
}

// NEW FUNCTION: Calculate completion based on basic info only
function calculateBasicProfileCompletion(userData) {
    const requiredFields = [
        'name',
        'year',
        'major',
        'bio'
    ];

    const optionalFields = [
        'hobbies',
        'profilePictureUrl'
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    // Check required fields (worth 80% total)
    requiredFields.forEach(field => {
        if (userData[field] && userData[field].toString().trim() !== '') {
            completedRequired++;
        }
    });

    // Check optional fields (worth 20% total)
    optionalFields.forEach(field => {
        if (userData[field] && userData[field].toString().trim() !== '') {
            completedOptional++;
        }
    });

    // Calculate percentage
    const requiredPercentage = (completedRequired / requiredFields.length) * 80;
    const optionalPercentage = (completedOptional / optionalFields.length) * 20;

    const totalPercentage = Math.round(requiredPercentage + optionalPercentage);

    console.log(`📊 Profile completion: ${totalPercentage}% (${completedRequired}/${requiredFields.length} required, ${completedOptional}/${optionalFields.length} optional)`);

    return totalPercentage;
}


function updateProfileCompletion(percentage) {
    const completionFill = document.getElementById('completionFill');
    const completionText = document.getElementById('completionText');

    if (completionFill) {
        completionFill.style.width = `${percentage}%`;

        // Color coding for completion
        if (percentage < 30) {
            completionFill.style.background = '#e74c3c';
        } else if (percentage < 70) {
            completionFill.style.background = '#f39c12';
        } else {
            completionFill.style.background = '#27ae60';
        }
    }

    if (completionText) {
        completionText.textContent = `${percentage}% Complete`;
    }
}

function displayProfileImage(imageUrl) {
    // Update main profile image
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const profileInitials = document.getElementById('profileInitials');

    if (profileImageDisplay && profileInitials) {
        profileImageDisplay.src = imageUrl;
        profileImageDisplay.style.display = 'block';
        profileInitials.style.display = 'none';
    }
}

function displayProfileInitials(userData) {
    // Show initials instead of image
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const profileInitials = document.getElementById('profileInitials');

    if (profileImageDisplay && profileInitials) {
        profileImageDisplay.style.display = 'none';
        profileInitials.style.display = 'flex';
        profileInitials.textContent = userData.displayName
            ? userData.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            : userData.email.substring(0, 2).toUpperCase();
    }
}

function updateNavbarProfile(userData) {
    const navbarInitials = document.getElementById('navbarProfileInitials');
    const navbarImage = document.getElementById('navbarProfileImage');

    if (userData.profilePictureUrl && navbarImage) {
        // Show profile image in navbar
        navbarImage.src = userData.profilePictureUrl;
        navbarImage.style.display = 'block';
        if (navbarInitials) navbarInitials.style.display = 'none';
    } else if (navbarInitials) {
        // Show initials in navbar
        navbarImage.style.display = 'none';
        navbarInitials.style.display = 'flex';
        navbarInitials.textContent = userData.displayName
            ? userData.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            : userData.email.substring(0, 2).toUpperCase();
    }
}

function populateProfileForm(userData) {
    // Only populate BASIC fields
    const basicFields = [
        { id: 'profileName', value: userData.name || '' },
        { id: 'profileYear', value: userData.year || '' },
        { id: 'profileMajor', value: userData.major || '' },
        { id: 'profileBio', value: userData.bio || '' },
        { id: 'profileHobbies', value: userData.hobbies || '' }
    ];

    basicFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;
        }
    });

    console.log('📝 Basic profile form populated');
}

function setupProfileFormListeners() {
    // Only listen to BASIC form fields
    const basicFormFields = [
        'profileName',
        'profileYear',
        'profileMajor',
        'profileBio',
        'profileHobbies'
    ];

    // Add listeners to basic fields only
    basicFormFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', markProfileUnsaved);
            field.addEventListener('change', markProfileUnsaved);
        }
    });

    console.log('🎧 Basic profile form listeners set up');
}

function markProfileUnsaved() {
    dashboardState.profileUnsaved = true;
    updateSaveButtonState();
}

function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        if (dashboardState.profileUnsaved) {
            saveBtn.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
            saveBtn.textContent = 'Save Changes';
            saveBtn.classList.add('unsaved-changes');
        } else {
            saveBtn.style.background = 'linear-gradient(135deg, #5F96C5, #4a8bc2)';
            saveBtn.textContent = 'Save Profile';
            saveBtn.classList.remove('unsaved-changes');
        }
    }
}

// =============================================================================
// PROFILE SAVE FUNCTIONALITY
// =============================================================================

async function saveProfile() {
    try {
        console.log('💾 Saving basic profile...');

        const saveBtn = document.getElementById('saveProfileBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        // Collect ONLY basic form data
        const profileData = {
            // Basic information only
            name: document.getElementById('profileName').value.trim(),
            year: document.getElementById('profileYear').value,
            major: document.getElementById('profileMajor').value.trim(),
            bio: document.getElementById('profileBio').value.trim(),
            hobbies: document.getElementById('profileHobbies').value.trim()
        };

        console.log('📊 Basic profile data to save:', profileData);

        // Validate required fields
        if (!profileData.name || !profileData.year || !profileData.major || !profileData.bio) {
            throw new Error('Please fill in all required fields (marked with *)');
        }

        // Send to backend
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to save profile');
        }

        console.log('✅ Basic profile saved successfully:', result);

        // Update state and UI
        dashboardState.user = { ...dashboardState.user, ...result.user };
        dashboardState.profileUnsaved = false;

        // Recalculate completion percentage based on basic info only
        const completionPercentage = calculateBasicProfileCompletion(result.user);
        updateProfileCompletion(completionPercentage);

        updateNavbarProfile(result.user);
        updateSaveButtonState();

        showDashboardMessage('Profile saved successfully! 🎉', 'success');

    } catch (error) {
        console.error('❌ Error saving basic profile:', error);
        showDashboardMessage(error.message, 'error');
    } finally {
        const saveBtn = document.getElementById('saveProfileBtn');
        saveBtn.textContent = 'Save Profile';
        saveBtn.disabled = false;
    }
}


// =============================================================================
// PROFILE PICTURE UPLOAD
// =============================================================================

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }

    try {
        // Show loading state
        const profileImage = document.getElementById('profileImage');
        const originalContent = profileImage.innerHTML;
        profileImage.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><div style="width: 20px; height: 20px; border: 2px solid #5F96C5; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div></div>';

        // Convert file to base64 (as expected by backend)
        const base64 = await fileToBase64(file);

        console.log('📷 Uploading profile image...');

        // Send to correct backend endpoint with correct data format
        const response = await fetch('/api/user/profile-picture', {  // ✅ CORRECTED URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // ✅ JSON instead of FormData
            },
            body: JSON.stringify({
                imageData: base64  // ✅ Send as base64 string as backend expects
            })
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();

        if (result.success && result.profilePictureUrl) {
            console.log('✅ Profile image uploaded successfully!');

            // Update dashboard profile image
            const profileImageDisplay = document.getElementById('profileImageDisplay');
            const profileInitials = document.getElementById('profileInitials');

            if (profileImageDisplay) {
                profileImageDisplay.src = result.profilePictureUrl;
                profileImageDisplay.style.display = 'block';
            }

            if (profileInitials) {
                profileInitials.style.display = 'none';
            }

            // Update navbar profile image
            const navbarProfileImage = document.getElementById('navbarProfileImage');
            const navbarProfileInitials = document.getElementById('navbarProfileInitials');

            if (navbarProfileImage) {
                navbarProfileImage.src = result.profilePictureUrl;
                navbarProfileImage.style.display = 'block';
                console.log('✅ Navbar image updated with:', result.profilePictureUrl);
            }

            if (navbarProfileInitials) {
                navbarProfileInitials.style.display = 'none';
                console.log('✅ Navbar initials hidden');
            }

            // 🔥 IMPORTANT: Refresh the navbar on other pages
            if (window.refreshNavbarProfile) {
                await window.refreshNavbarProfile();
            }

            console.log('✅ Profile image updated across all elements!');
            showNotification('Profile image updated successfully!', 'success');

        } else {
            throw new Error(result.error || 'Upload failed');
        }

    } catch (error) {
        console.error('💥 Error uploading image:', error);

        // Restore original content
        profileImage.innerHTML = originalContent;

        // Show error message
        showNotification('Failed to upload image. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6B7280'};
    `;
    notification.textContent = message;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// =============================================================================
// LOAD OTHER DASHBOARD SECTIONS
// =============================================================================

async function loadBookmarkedClubs() {
    try {
        const response = await fetch('/api/bookmarks');
        if (!response.ok) return;

        const bookmarkData = await response.json();
        const bookmarks = bookmarkData.bookmarks || bookmarkData || [];

        dashboardState.bookmarkedClubs = bookmarks;
        updateSavedClubsDisplay();

    } catch (error) {
        console.error('❌ Error loading bookmarked clubs:', error);
    }
}

async function loadUpcomingEvents() {
    try {
        const response = await fetch('/api/events?upcoming=true&limit=5');
        if (!response.ok) return;

        const eventsData = await response.json();
        const events = Array.isArray(eventsData) ? eventsData : eventsData.events || [];

        dashboardState.upcomingEvents = events;
        updateUpcomingEventsDisplay();

    } catch (error) {
        console.error('❌ Error loading upcoming events:', error);
    }
}

async function loadTestResults() {
    try {
        const response = await fetch('/api/quiz/results?limit=5');
        if (!response.ok) return;

        const resultsData = await response.json();
        const results = Array.isArray(resultsData) ? resultsData : resultsData.results || [];

        dashboardState.testResults = results;
        updateTestResultsDisplay();

    } catch (error) {
        console.error('❌ Error loading test results:', error);
    }
}

async function loadPotentialMatches() {
    try {
        const response = await fetch('/api/user/smart-matches?limit=3');
        if (!response.ok) return;

        const matchData = await response.json();
        const matches = matchData.matches || [];

        dashboardState.potentialMatches = matches;
        updatePotentialMatchesDisplay();

    } catch (error) {
        console.error('❌ Error loading potential matches:', error);
    }
}

// =============================================================================
// UPDATE DISPLAY FUNCTIONS
// =============================================================================
function updateSavedClubsDisplay() {
    const savedClubsGrid = document.getElementById('savedClubsGrid');
    if (!savedClubsGrid) return;

    if (!dashboardState.bookmarkedClubs || dashboardState.bookmarkedClubs.length === 0) {
        savedClubsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔖</div>
                <div class="empty-state-text">No saved clubs yet</div>
                <div class="empty-state-subtext">Explore tech clubs and bookmark your favorites!</div>
            </div>
        `;
        return;
    }

    // ✅ CLEAN SCROLLING - 2 cards side by side
    savedClubsGrid.innerHTML = '';

    // Create container for scrollable clubs - exactly 2 columns
    const clubsContainer = document.createElement('div');
    clubsContainer.className = 'saved-clubs-container';
    clubsContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 8px;
    `;

    // ✅ SHOW ALL BOOKMARKED CLUBS
    dashboardState.bookmarkedClubs.forEach(club => {
        const clubCard = createMiniClubCard(club);
        clubsContainer.appendChild(clubCard);
    });

    savedClubsGrid.appendChild(clubsContainer);
}

function updateUpcomingEventsDisplay() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;

    if (!dashboardState.upcomingEvents || dashboardState.upcomingEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-text">No upcoming events</div>
                <div class="empty-state-subtext">Check back later for new tech events!</div>
            </div>
        `;
        return;
    }

    eventsList.innerHTML = '';
    dashboardState.upcomingEvents.forEach(event => {
        const eventItem = createEventItem(event);
        eventsList.appendChild(eventItem);
    });
}

function updateTestResultsDisplay() {
    const testResultsList = document.getElementById('testResultsList');
    if (!testResultsList) return;

    if (!dashboardState.testResults || dashboardState.testResults.length === 0) {
        testResultsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🧪</div>
                <div class="empty-state-text">No test results yet</div>
                <div class="empty-state-subtext">Take a niche quiz to discover your ideal career path!</div>
            </div>
        `;
        return;
    }

    testResultsList.innerHTML = '';
    dashboardState.testResults.forEach(result => {
        const resultItem = createTestResultItem(result);
        testResultsList.appendChild(resultItem);
    });
}

function updatePotentialMatchesDisplay() {
    const matchesList = document.getElementById('matchesList');
    const viewAllBtn = document.querySelector('.view-all-matches-btn');

    if (!matchesList) return;

    if (!dashboardState.potentialMatches || dashboardState.potentialMatches.length === 0) {
        matchesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🤝</div>
                <div class="empty-state-text">Complete your profile to find matches</div>
                <div class="empty-state-subtext">Add your interests and goals to connect with similar students!</div>
            </div>
        `;
        if (viewAllBtn) viewAllBtn.style.display = 'none';
        return;
    }

    matchesList.innerHTML = '';
    dashboardState.potentialMatches.forEach(match => {
        const matchItem = createMatchItem(match);
        matchesList.appendChild(matchItem);
    });

    if (viewAllBtn) viewAllBtn.style.display = 'block';
}

// =============================================================================
// HELPER FUNCTIONS FOR CREATING ELEMENTS
// =============================================================================

function createMiniClubCard(club) {
    const clubCard = document.createElement('div');
    clubCard.className = 'mini-club-card';
    clubCard.innerHTML = `
        <div class="mini-club-logo" style="background-image: url('${club.logoUrl || '/assets/default-club-logo.png'}');"></div>
        <div class="mini-club-name">${club.name}</div>
    `;

    // Make it clickable to go to club page
    clubCard.style.cursor = 'pointer';
    clubCard.onclick = () => {
        window.location.href = `/club/${club._id}`;
    };

    return clubCard;
}

function createEventItem(event) {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';

    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    eventItem.innerHTML = `
        <div class="event-date">
            <div class="event-date-day">${day}</div>
            <div class="event-date-month">${month}</div>
        </div>
        <div class="event-details">
            <div class="event-name">${event.title}</div>
            <div class="event-club">${event.location} - ${event.time || 'Time TBD'}</div>
        </div>
    `;
    return eventItem;
}

function createTestResultItem(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'test-result-item enhanced-clickable';

    const testDate = new Date(result.createdAt || result.date || Date.now());
    const formattedDate = testDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    let testName = 'Career Assessment';
    let percentage = 75;
    let confidenceLevel = 'Medium';

    if (result.topMatch) {
        testName = result.topMatch.careerName || result.topMatch.career || 'Career Assessment';
        percentage = Math.round(result.topMatch.percentage || 75);

        if (percentage >= 80) confidenceLevel = 'High';
        else if (percentage >= 60) confidenceLevel = 'Medium';
        else confidenceLevel = 'Low';
    }

    // Store the actual result data in the element for reference
    resultItem.dataset.resultData = JSON.stringify({
        id: result.id || result._id,
        topMatch: result.topMatch,
        allMatches: result.allMatches,
        quizLevel: result.quizLevel,
        createdAt: result.createdAt
    });

    resultItem.innerHTML = `
        <div class="test-info">
            <div class="test-name-row">
                <div class="test-name">${testName}</div>
                <div class="test-confidence ${confidenceLevel.toLowerCase()}-confidence">
                    ${confidenceLevel} Confidence
                </div>
            </div>
            <div class="test-meta">
                <span class="test-date">${formattedDate}</span>
                ${result.quizLevel ? `<span class="test-level">${result.quizLevel} level</span>` : ''}
            </div>
        </div>
        <div class="test-score-container">
            <div class="test-score">${percentage}%</div>
            <div class="view-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m9 18 6-6-6-6"/>
                </svg>
            </div>
        </div>
    `;

    // Add click handler with proper result ID
    resultItem.addEventListener('click', () => {
        const resultId = result.id || result._id || `result-${Date.now()}`;
        console.log('🎯 Clicked test result:', testName, 'with ID:', resultId);
        console.log('📊 Full result data:', result);

        resultItem.classList.add('opening-modal');

        setTimeout(() => {
            openResultsModal(resultId);
            resultItem.classList.remove('opening-modal');
        }, 150);
    });

    // Rest of the hover effects and accessibility code remains the same...
    let hoverTimeout;
    resultItem.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        resultItem.style.transform = 'translateX(8px)';
        resultItem.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.04))';
        resultItem.style.borderColor = 'rgba(59, 130, 246, 0.3)';
    });

    resultItem.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
            resultItem.style.transform = 'translateX(0)';
            resultItem.style.background = 'rgba(255, 255, 255, 0.9)';
            resultItem.style.borderColor = 'transparent';
        }, 50);
    });

    resultItem.setAttribute('tabindex', '0');
    resultItem.setAttribute('role', 'button');
    resultItem.setAttribute('aria-label', `View detailed results for ${testName} (${percentage}% match)`);

    resultItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            resultItem.click();
        }
    });

    return resultItem;
}


function createMatchItem(match) {
    const matchItem = document.createElement('div');
    matchItem.className = 'match-item';

    const displayName = match.displayName || match.name || 'UC Davis Student';
    const year = match.year || 'Student';
    const major = match.major || 'Technology';
    const matchScore = match.matchScore || 0;

    matchItem.innerHTML = `
        <div class="match-avatar">
            ${match.profilePictureUrl ?
            `<img src="${match.profilePictureUrl}" alt="${displayName}">` :
            `<span class="match-initials">${displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>`
        }
        </div>
        <div class="match-info">
            <div class="match-name">${displayName}</div>
            <div class="match-details">${year} • ${major}</div>
            <div class="match-score">${matchScore}% match</div>
        </div>
        <button class="quick-connect-btn" 
            onclick="connectWithUser('${match._id}', '${displayName}', this)" 
            style="...">
        Connect
    </button>
    `;
    return matchItem;
}

// Add this function to dashboard.js
function showMatchingModal() {
    // Create the modal if it doesn't exist
    let modal = document.getElementById('matchingModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'matchingModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎯 Your Potential Matches</h3>
                    <button class="modal-close" onclick="closeMatchingModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="text-align: center; padding: 2rem; color: #666;">
                        <strong>Coming Soon!</strong><br><br>
                        We're building an amazing matching experience with:<br><br>
                        • Smart filters by major, year, and interests<br>
                        • Swipe mode for quick connections<br>
                        • Study group formation<br>
                        • Direct messaging<br><br>
                        For now, you can see potential matches below!
                    </p>
                    <div id="allMatchesList" style="padding: 1rem;">
                        <!-- Matches will load here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    loadAllMatches(); // Load all matches
}

function closeMatchingModal() {
    const modal = document.getElementById('matchingModal');
    if (modal) modal.style.display = 'none';
}

async function loadAllMatches() {
    try {
        const response = await fetch('/api/user/smart-matches?limit=20');
        const data = await response.json();

        const matchesList = document.getElementById('allMatchesList');
        if (!matchesList) return;

        if (data.matches && data.matches.length > 0) {
            matchesList.innerHTML = data.matches.map(match => `
                <div style="padding: 1rem; margin: 0.5rem 0; background: #f9fafb; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${match.displayName || match.name || 'UC Davis Student'}</strong><br>
                        <span style="color: #666;">${match.year || 'Student'} • ${match.major || 'Technology'}</span><br>
                        <span style="color: #5F96C5;">${match.matchScore || 0}% match</span>
                    </div>
                    <button onclick="connectWithUser('${match._id}', '${match.displayName || match.name}')" 
                            style="padding: 0.5rem 1rem; background: #5F96C5; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Connect
                    </button>
                </div>
            `).join('');
        } else {
            matchesList.innerHTML = '<p style="text-align: center; color: #666;">No matches found. Try updating your profile!</p>';
        }
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// Add this function to dashboard.js
// Fix the connectWithUser function
async function connectWithUser(userId, userName, buttonElement) {
    if (!userId) {
        alert('Unable to connect - user ID missing');
        return;
    }

    // Show confirmation
    const message = prompt(`Send a connection message to ${userName}:`,
        `Hi! I found you through Cownect's matching system. Would love to connect about our shared interests at UC Davis!`);

    if (!message) return; // User cancelled

    try {
        const response = await fetch('/api/user/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                targetUserId: userId,
                message: message
            })
        });

        if (response.ok) {
            alert(`Connection request sent to ${userName}! 🎉\n\nThey'll be notified of your interest.`);

            // Update button to show "Requested" - FIX: use buttonElement parameter
            if (buttonElement) {
                buttonElement.textContent = 'Request Sent ✓';
                buttonElement.disabled = true;
                buttonElement.style.background = '#10B981';
            }
        } else {
            alert('Failed to send connection request. Please try again.');
        }
    } catch (error) {
        console.error('Error connecting:', error);
        alert('Error sending connection request');
    }
}

// Make it global
window.connectWithUser = connectWithUser;

// Initialize the enhanced matching system
document.addEventListener('DOMContentLoaded', async () => {
    // Your existing initialization code...

    // Add the enhanced matching UI
    if (typeof StudentMatchingSystem !== 'undefined') {
        window.matchingSystem = new StudentMatchingSystem();
    }
});

// Add to dashboard.js
async function loadConnections() {
    try {
        const response = await fetch('/api/user/connections');
        const data = await response.json();

        const connectionsList = document.getElementById('connectionsList');
        if (!connectionsList) return;

        if (data.sent.length === 0 && data.received.length === 0) {
            // Keep empty state
            return;
        }

        connectionsList.innerHTML = `
            <div class="connections-tabs">
                <h4>Sent Requests (${data.sent.length})</h4>
                ${data.sent.map(conn => `
                    <div class="connection-item sent">
                        <div class="connection-info">
                            <p>To: User ${conn.to.substring(0, 8)}...</p>
                            <p class="connection-message">"${conn.message}"</p>
                            <span class="connection-time">${new Date(conn.sentAt).toLocaleDateString()}</span>
                        </div>
                        <span class="connection-status pending">Pending</span>
                    </div>
                `).join('')}
                
                <h4 style="margin-top: 1rem;">Received Requests (${data.received.length})</h4>
                ${data.received.length > 0 ? data.received.map(conn => `
                    <div class="connection-item received">
                        <div class="connection-info">
                            <p>From: ${conn.from}</p>
                            <p class="connection-message">"${conn.message}"</p>
                        </div>
                        <div class="connection-actions">
                            <button onclick="acceptConnection('${conn.from}')">Accept</button>
                            <button onclick="rejectConnection('${conn.from}')">Decline</button>
                        </div>
                    </div>
                `).join('') : '<p style="color: #999;">No requests received yet</p>'}
            </div>
        `;

    } catch (error) {
        console.error('Error loading connections:', error);
    }
}

// Call this when dashboard loads
document.addEventListener('DOMContentLoaded', async () => {
    // ... your existing code ...
    await loadConnections(); // Add this line
});


function createResultsModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'results-modal-overlay';
    modalOverlay.id = 'resultsModalOverlay';
    modalOverlay.style.display = 'none';

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'results-modal-container';

    // Create modal header with close button
    const modalHeader = document.createElement('div');
    modalHeader.className = 'results-modal-header';
    modalHeader.innerHTML = `
        <h3>Your Career Assessment Results</h3>
        <button class="results-modal-close" onclick="closeResultsModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'results-modal-content';
    modalContent.id = 'resultsModalContent';

    // Assemble modal
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalOverlay.appendChild(modalContainer);

    // Add to body
    document.body.appendChild(modalOverlay);

    return modalOverlay;
}

async function openResultsModal(resultId) {
    try {
        console.log('🎯 Opening results modal for result ID:', resultId);
        console.log('📊 Available test results:', dashboardState.testResults);

        // Create modal if it doesn't exist
        if (!resultsModalInstance) {
            resultsModalInstance = createResultsModal();
        }

        // Show loading state
        showResultsModalLoading();

        // Show modal
        resultsModalInstance.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Load results data (this now uses the fixed loading logic)
        await loadResultsInModal(resultId);

        console.log('✅ Results modal opened successfully with correct data');

    } catch (error) {
        console.error('💥 Error opening results modal:', error);
        showResultsModalError('Failed to load results. Please try again.');
    }
}

function closeResultsModal() {
    if (resultsModalInstance) {
        resultsModalInstance.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling

        // Clear content to prevent memory leaks
        const content = document.getElementById('resultsModalContent');
        if (content) {
            content.innerHTML = '';
        }

        console.log('📎 Results modal closed');
    }
}

// =============================================================================
// RESULTS LOADING IN MODAL
// =============================================================================

async function loadResultsInModal(resultId) {
    try {
        console.log('📊 Loading results data for modal, resultId:', resultId);

        let resultData = null;

        // FIRST: Try to get the result from the dashboard state (if available)
        if (dashboardState.testResults && dashboardState.testResults.length > 0) {
            const cachedResult = dashboardState.testResults.find(r =>
                (r.id || r._id) === resultId
            );

            if (cachedResult) {
                console.log('✅ Found cached result data:', cachedResult);
                resultData = formatCachedResultForModal(cachedResult);
            }
        }

        // SECOND: Try enhanced results API
        if (!resultData) {
            try {
                console.log('🔍 Trying enhanced results API...');
                const enhancedResponse = await fetch(`/api/enhanced-results/${resultId}/data`);
                if (enhancedResponse.ok) {
                    const enhancedData = await enhancedResponse.json();
                    resultData = enhancedData.results;
                    console.log('✅ Loaded enhanced results data:', resultData);
                }
            } catch (enhancedError) {
                console.log('⚠️ Enhanced results API failed:', enhancedError.message);
            }
        }

        // THIRD: Try legacy quiz results API
        if (!resultData) {
            try {
                console.log('🔍 Trying legacy quiz results API...');
                const legacyResponse = await fetch(`/api/quiz/results?limit=50`);
                if (legacyResponse.ok) {
                    const legacyData = await legacyResponse.json();
                    const results = Array.isArray(legacyData) ? legacyData : legacyData.results || [];

                    const targetResult = results.find(r => (r.id || r._id) === resultId);
                    if (targetResult) {
                        console.log('✅ Found result in legacy API:', targetResult);
                        resultData = formatLegacyResultForModal(targetResult);
                    }
                }
            } catch (legacyError) {
                console.log('⚠️ Legacy results API failed:', legacyError.message);
            }
        }

        // FOURTH: Try to reconstruct from dashboard test results
        if (!resultData && dashboardState.testResults) {
            const dashboardResult = dashboardState.testResults.find(r =>
                (r.id || r._id) === resultId
            );

            if (dashboardResult) {
                console.log('✅ Reconstructing from dashboard result:', dashboardResult);
                resultData = formatCachedResultForModal(dashboardResult);
            }
        }

        // LAST RESORT: Use sample data but with correct information from the clicked item
        if (!resultData) {
            console.warn('⚠️ No API data found, using sample data for resultId:', resultId);
            resultData = generateContextualSampleData(resultId);
        }

        console.log('🎯 Final result data for modal:', resultData);

        // Initialize the results in modal
        initializeResultsInModal(resultData);

    } catch (error) {
        console.error('💥 Error loading results in modal:', error);
        showResultsModalError('Failed to load results data.');
    }
}


// Add these helper functions to dashboard.js (around line 1200, before formatCachedResultForModal)

// =============================================================================
// HELPER FUNCTIONS FOR CAREER DATA (Missing from dashboard.js)
// =============================================================================

function getCareerSpecificProgression(careerName) {
    const progressions = {
        'Technical Writing': [
            {
                level: 'Entry',
                roles: ['Junior Technical Writer', 'Documentation Specialist', 'Content Developer'],
                timeline: '0-2 years',
                salary: { min: 60, max: 85 }
            },
            {
                level: 'Mid',
                roles: ['Technical Writer', 'Documentation Lead', 'Senior Content Developer'],
                timeline: '2-5 years',
                salary: { min: 85, max: 115 }
            },
            {
                level: 'Senior',
                roles: ['Senior Technical Writer', 'Documentation Manager', 'Content Strategy Lead'],
                timeline: '5+ years',
                salary: { min: 115, max: 150 }
            }
        ],
        'Software Engineering': [
            {
                level: 'Entry',
                roles: ['Junior Developer', 'Software Engineer I', 'Associate Engineer'],
                timeline: '0-2 years',
                salary: { min: 85, max: 110 }
            },
            {
                level: 'Mid',
                roles: ['Software Engineer II', 'Senior Developer', 'Full Stack Engineer'],
                timeline: '2-5 years',
                salary: { min: 110, max: 150 }
            },
            {
                level: 'Senior',
                roles: ['Staff Engineer', 'Principal Engineer', 'Engineering Lead'],
                timeline: '5+ years',
                salary: { min: 150, max: 220 }
            }
        ],
        'Data Science': [
            {
                level: 'Entry',
                roles: ['Data Analyst', 'Junior Data Scientist', 'Analytics Associate'],
                timeline: '0-2 years',
                salary: { min: 75, max: 100 }
            },
            {
                level: 'Mid',
                roles: ['Data Scientist', 'ML Engineer', 'Senior Analyst'],
                timeline: '2-5 years',
                salary: { min: 100, max: 140 }
            },
            {
                level: 'Senior',
                roles: ['Senior Data Scientist', 'Data Science Manager', 'ML Lead'],
                timeline: '5+ years',
                salary: { min: 140, max: 200 }
            }
        ],
        'UX/UI Design': [
            {
                level: 'Entry',
                roles: ['Junior UX Designer', 'UI Designer', 'UX Researcher'],
                timeline: '0-2 years',
                salary: { min: 70, max: 95 }
            },
            {
                level: 'Mid',
                roles: ['UX Designer', 'Senior UI Designer', 'Product Designer'],
                timeline: '2-5 years',
                salary: { min: 95, max: 130 }
            },
            {
                level: 'Senior',
                roles: ['Lead UX Designer', 'Design Manager', 'Principal Designer'],
                timeline: '5+ years',
                salary: { min: 130, max: 180 }
            }
        ],
        'Product Management': [
            {
                level: 'Entry',
                roles: ['Associate Product Manager', 'Product Analyst', 'Junior PM'],
                timeline: '0-2 years',
                salary: { min: 90, max: 120 }
            },
            {
                level: 'Mid',
                roles: ['Product Manager', 'Senior Product Manager', 'Technical PM'],
                timeline: '2-5 years',
                salary: { min: 120, max: 160 }
            },
            {
                level: 'Senior',
                roles: ['Principal PM', 'Group Product Manager', 'VP Product'],
                timeline: '5+ years',
                salary: { min: 160, max: 250 }
            }
        ],
        'DevOps Engineering': [
            {
                level: 'Entry',
                roles: ['Junior DevOps Engineer', 'Cloud Engineer', 'Build Engineer'],
                timeline: '0-2 years',
                salary: { min: 80, max: 125 }
            },
            {
                level: 'Mid',
                roles: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
                timeline: '2-5 years',
                salary: { min: 125, max: 175 }
            },
            {
                level: 'Senior',
                roles: ['Senior DevOps Engineer', 'Principal SRE', 'Infrastructure Architect'],
                timeline: '5+ years',
                salary: { min: 175, max: 275 }
            }
        ],
        'Cybersecurity': [
            {
                level: 'Entry',
                roles: ['Security Analyst', 'SOC Analyst', 'Junior Security Engineer'],
                timeline: '0-2 years',
                salary: { min: 75, max: 105 }
            },
            {
                level: 'Mid',
                roles: ['Security Engineer', 'Incident Response Specialist', 'Security Architect'],
                timeline: '2-5 years',
                salary: { min: 105, max: 145 }
            },
            {
                level: 'Senior',
                roles: ['Senior Security Engineer', 'Security Lead', 'CISO'],
                timeline: '5+ years',
                salary: { min: 145, max: 210 }
            }
        ],
        'Machine Learning Engineering': [
            {
                level: 'Entry',
                roles: ['Junior ML Engineer', 'AI Developer', 'ML Analyst'],
                timeline: '0-2 years',
                salary: { min: 95, max: 125 }
            },
            {
                level: 'Mid',
                roles: ['ML Engineer', 'AI Engineer', 'Computer Vision Engineer'],
                timeline: '2-5 years',
                salary: { min: 125, max: 165 }
            },
            {
                level: 'Senior',
                roles: ['Senior ML Engineer', 'ML Architect', 'AI Research Lead'],
                timeline: '5+ years',
                salary: { min: 165, max: 230 }
            }
        ],
        'Web Development': [
            {
                level: 'Entry',
                roles: ['Junior Web Developer', 'Frontend Developer', 'WordPress Developer'],
                timeline: '0-2 years',
                salary: { min: 65, max: 90 }
            },
            {
                level: 'Mid',
                roles: ['Web Developer', 'Full-Stack Developer', 'React Developer'],
                timeline: '2-5 years',
                salary: { min: 90, max: 125 }
            },
            {
                level: 'Senior',
                roles: ['Senior Web Developer', 'Lead Frontend Engineer', 'Web Architect'],
                timeline: '5+ years',
                salary: { min: 125, max: 170 }
            }
        ]
    };

    return progressions[careerName] || progressions['Software Engineering'];
}

function getCareerSpecificSteps(careerName) {
    const stepsMap = {
        'Technical Writing': [
            'Build a portfolio of technical documentation samples',
            'Learn markup languages (Markdown, XML) and documentation tools',
            'Join writing clubs and contribute to open-source documentation'
        ],
        'Software Engineering': [
            'Master data structures and algorithms fundamentals',
            'Build 3-5 full-stack projects for your GitHub portfolio',
            'Participate in hackathons and contribute to open source'
        ],
        'Data Science': [
            'Learn Python/R and SQL for data manipulation',
            'Complete machine learning projects with real datasets',
            'Join AI Student Collective and participate in Kaggle competitions'
        ],
        'UX/UI Design': [
            'Create a design portfolio with 3-5 case studies',
            'Master Figma/Sketch and user research methods',
            'Join Design Interactive club for hands-on projects'
        ],
        'Product Management': [
            'Build product specs and roadmaps for practice projects',
            'Learn analytics tools and A/B testing methodologies',
            'Join Product Space @ UC Davis for mentorship'
        ],
        'DevOps Engineering': [
            'Learn Docker, Kubernetes, and CI/CD pipelines',
            'Get AWS/Azure certifications',
            'Contribute to infrastructure automation projects'
        ],
        'Cybersecurity': [
            'Practice on CTF platforms and ethical hacking labs',
            'Get Security+ certification as a starting point',
            'Join Cyber Security Club for hands-on learning'
        ],
        'Machine Learning Engineering': [
            'Master deep learning frameworks (TensorFlow/PyTorch)',
            'Build end-to-end ML projects with deployment',
            'Participate in research projects with faculty'
        ],
        'Web Development': [
            'Master HTML/CSS/JavaScript and modern frameworks',
            'Build responsive websites and progressive web apps',
            'Deploy projects to cloud platforms'
        ]
    };

    return stepsMap[careerName] || stepsMap['Software Engineering'];
}

function getCareerSpecificMarketData(careerName) {
    const marketDataMap = {
        'Technical Writing': {
            avgSalary: '$75k - $125k',
            jobGrowthRate: '+12%',
            annualOpenings: 5800,
            workLifeBalance: '8.5/10'
        },
        'Software Engineering': {
            avgSalary: '$110k - $180k',
            jobGrowthRate: '+22%',
            annualOpenings: 189200,
            workLifeBalance: '7.5/10'
        },
        'Data Science': {
            avgSalary: '$95k - $165k',
            jobGrowthRate: '+35%',
            annualOpenings: 13500,
            workLifeBalance: '7.8/10'
        },
        'UX/UI Design': {
            avgSalary: '$85k - $140k',
            jobGrowthRate: '+13%',
            annualOpenings: 23900,
            workLifeBalance: '8.2/10'
        },
        'Product Management': {
            avgSalary: '$120k - $200k',
            jobGrowthRate: '+19%',
            annualOpenings: 31200,
            workLifeBalance: '7.0/10'
        },
        'DevOps Engineering': {
            avgSalary: '$125k - $200k',
            jobGrowthRate: '+25%',
            annualOpenings: 15200,
            workLifeBalance: '7.5/10'
        },
        'Cybersecurity': {
            avgSalary: '$105k - $175k',
            jobGrowthRate: '+32%',
            annualOpenings: 165200,
            workLifeBalance: '7.2/10'
        },
        'Machine Learning Engineering': {
            avgSalary: '$130k - $195k',
            jobGrowthRate: '+40%',
            annualOpenings: 8900,
            workLifeBalance: '7.6/10'
        },
        'Web Development': {
            avgSalary: '$85k - $140k',
            jobGrowthRate: '+13%',
            annualOpenings: 28900,
            workLifeBalance: '7.8/10'
        }

    };

    return marketDataMap[careerName] || marketDataMap['Software Engineering'];
}

function getClubRecommendationsForCareer(careerName) {
    const clubMap = {
        'Software Engineering': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'software'] },
            { _id: 'hackdavis', name: 'HackDavis', logoUrl: '/assets/hackdavis.png', tags: ['hackathon', 'innovation'] },
            { _id: 'aggieworks', name: 'AggieWorks', logoUrl: '/assets/aggieworks.png', tags: ['startups', 'development'] }
        ],
        'Data Science': [
            { _id: 'ai-collective', name: 'AI Student Collective', logoUrl: '/assets/aiStudentCollective.png', tags: ['ai', 'machine-learning'] },
            { _id: 'data-science-club', name: 'Davis Data Science Club', logoUrl: '/assets/data-science.png', tags: ['data', 'analytics'] },
            { _id: 'aggie-sports-analytics', name: 'Aggie Sports Analytics', logoUrl: '/assets/sports-analytics.png', tags: ['sports', 'data'] }
        ],
        'UX/UI Design': [
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'ux-ui'] },
            { _id: 'product-space', name: 'Product Space @ UC Davis', logoUrl: '/assets/product-space.png', tags: ['product', 'design'] },
            { _id: 'gdsc', name: 'Google Developer Student Club', logoUrl: '/assets/gdsc.png', tags: ['development', 'design'] }
        ],
        'Product Management': [
            { _id: 'product-space', name: 'Product Space @ UC Davis', logoUrl: '/assets/product-space.png', tags: ['product', 'management'] },
            { _id: 'davis-consulting', name: 'The Davis Consulting Group', logoUrl: '/assets/consulting.png', tags: ['consulting', 'business'] },
            { _id: 'aggieworks', name: 'AggieWorks', logoUrl: '/assets/aggieworks.png', tags: ['startups', 'product'] }
        ],
        'Technical Writing': [
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'content'] },
            { _id: 'cs-tutoring', name: 'Computer Science Tutoring Lab', logoUrl: '/assets/cs-tutoring.png', tags: ['tutoring', 'communication'] },
            { _id: 'gdsc', name: 'Google Developer Student Club', logoUrl: '/assets/gdsc.png', tags: ['development', 'documentation'] }
        ],
        'DevOps Engineering': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'infrastructure'] },
            { _id: 'cybersecurity-club', name: 'Cyber Security Club', logoUrl: '/assets/cybersecurity.png', tags: ['security', 'systems'] },
            { _id: 'hardware-club', name: 'The Hardware Club', logoUrl: '/assets/hardware.png', tags: ['hardware', 'systems'] }
        ],
        'Cybersecurity': [
            { _id: 'cybersecurity-club', name: 'Cyber Security Club at UC Davis', logoUrl: '/assets/cybersecurity.png', tags: ['security', 'hacking'] },
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'security'] },
            { _id: 'hardware-club', name: 'The Hardware Club', logoUrl: '/assets/hardware.png', tags: ['hardware', 'security'] }
        ],
        'Machine Learning Engineering': [
            { _id: 'ai-collective', name: 'AI Student Collective', logoUrl: '/assets/aiStudentCollective.png', tags: ['ai', 'machine-learning'] },
            { _id: 'data-science-club', name: 'Davis Data Science Club', logoUrl: '/assets/data-science.png', tags: ['data', 'ml'] },
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'ai'] }
        ],
        'Web Development': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'web'] },
            { _id: 'codelab', name: 'CodeLab', logoUrl: '/assets/codelab.png', tags: ['web', 'development'] },
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'web'] }
        ]
    };

    return clubMap[careerName] || clubMap['Software Engineering'];
}




function formatCachedResultForModal(cachedResult) {
    console.log('🔄 Formatting cached result for modal:', cachedResult);

    const careerName = cachedResult.topMatch?.careerName ||
        cachedResult.topMatch?.career ||
        'Career Assessment';
    const percentage = cachedResult.topMatch?.percentage || 75;

    return {
        topMatch: {
            career: careerName,
            percentage: percentage,
            confidence: percentage >= 80 ? 'High' : percentage >= 60 ? 'Medium' : 'Low',
            reasoning: cachedResult.topMatch?.reasoning ||
                `Based on your assessment, ${careerName} aligns well with your interests and skills.`,
            careerProgression: getCareerSpecificProgression(careerName),
            nextSteps: getCareerSpecificSteps(careerName),
            marketData: getCareerSpecificMarketData(careerName)
        },
        allMatches: cachedResult.allMatches || generateMatchesForCareer(careerName, percentage),
        clubRecommendations: getClubRecommendationsForCareer(careerName),
        metadata: {
            resultId: cachedResult.id || cachedResult._id,
            quizLevel: cachedResult.quizLevel || 'assessment',
            createdAt: cachedResult.createdAt || new Date()
        }
    };
}


function formatLegacyResultForModal(legacyResult) {
    console.log('🔄 Formatting legacy result for modal:', legacyResult);

    const careerName = legacyResult.topMatch?.careerName ||
        legacyResult.aiAnalysis?.topMatch?.career ||
        'Career Assessment';
    const percentage = legacyResult.topMatch?.percentage ||
        legacyResult.aiAnalysis?.topMatch?.percentage || 75;

    return {
        topMatch: {
            career: careerName,
            percentage: percentage,
            confidence: percentage >= 80 ? 'High' : percentage >= 60 ? 'Medium' : 'Low',
            reasoning: legacyResult.topMatch?.reasoning ||
                legacyResult.aiAnalysis?.topMatch?.reasoning ||
                `Based on your assessment, ${careerName} aligns with your profile.`,
            careerProgression: getCareerSpecificProgression(careerName),
            nextSteps: getCareerSpecificSteps(careerName),
            marketData: getCareerSpecificMarketData(careerName)
        },
        allMatches: legacyResult.allMatches ||
            legacyResult.aiAnalysis?.allMatches ||
            generateMatchesForCareer(careerName, percentage),
        clubRecommendations: getClubRecommendationsForCareer(careerName),
        metadata: {
            resultId: legacyResult.id || legacyResult._id,
            quizLevel: legacyResult.quizLevel || 'assessment',
            createdAt: legacyResult.createdAt || new Date()
        }
    };
}

function generateContextualSampleData(resultId) {
    console.log('🎯 Generating contextual sample data for resultId:', resultId);

    // Try to extract context from the clicked test result in the dashboard
    let contextCareer = 'Software Engineering';
    let contextPercentage = 85;

    // Look for the specific result that was clicked
    if (dashboardState.testResults) {
        const clickedResult = dashboardState.testResults.find(r =>
            (r.id || r._id) === resultId
        );

        if (clickedResult && clickedResult.topMatch) {
            contextCareer = clickedResult.topMatch.careerName || clickedResult.topMatch.career || contextCareer;
            contextPercentage = clickedResult.topMatch.percentage || contextPercentage;
            console.log('📋 Using context from clicked result:', contextCareer, contextPercentage);
        }
    }

    return {
        topMatch: {
            career: contextCareer,
            percentage: contextPercentage,
            confidence: contextPercentage >= 80 ? 'High' : contextPercentage >= 60 ? 'Medium' : 'Low',
            reasoning: `Based on your assessment responses, ${contextCareer} shows strong alignment with your interests, skills, and career goals.`,
            careerProgression: getCareerSpecificProgression(contextCareer),
            nextSteps: getCareerSpecificSteps(contextCareer),
            marketData: getCareerSpecificMarketData(contextCareer)
        },
        allMatches: generateMatchesForCareer(contextCareer, contextPercentage),
        clubRecommendations: getClubRecommendationsForCareer(contextCareer),
        metadata: {
            resultId: resultId,
            generated: true,
            timestamp: new Date()
        }
    };
}


function initializeResultsInModal(resultData) {
    const modalContent = document.getElementById('resultsModalContent');
    if (!modalContent) return;

    // Load the enhanced results HTML structure into modal
    modalContent.innerHTML = getResultsPageHTML();

    // Store data globally for the results page to use
    window.modalResultsData = resultData;

    // Initialize the enhanced results page logic
    setTimeout(() => {
        // Create a new instance of the results page for modal context
        const modalResultsPage = new ModalEnhancedResultsPage(resultData);
        modalResultsPage.init();
    }, 100);
}

// =============================================================================
// MODAL ENHANCED RESULTS PAGE CLASS
// =============================================================================

class ModalEnhancedResultsPage {
    constructor(resultData) {
        this.resultData = resultData;
        this.bookmarkedClubs = new Set();
        this.isModalContext = true;
    }

    async init() {
        console.log('🎯 Initializing Modal Enhanced Results Page...');

        try {
            this.setupEventListeners();
            this.populateResults();
            this.startAnimations();
        } catch (error) {
            console.error('💥 Error initializing modal results:', error);
        }
    }

    populateResults() {
        if (!this.resultData) {
            console.error('No result data available for modal');
            return;
        }

        console.log('🎨 Populating modal results with data:', this.resultData);

        this.populateTopMatch();
        this.populateClubs();
        this.populateCareerProgression();
        this.populateCareerMatches();
        this.populateNextSteps();
        this.populateMarketInsights();
    }

    populateTopMatch() {
        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        if (!topMatch) return;

        console.log('🥇 Populating top match in modal:', topMatch);

        const careerName = topMatch.career || topMatch.careerName || 'Career Assessment';
        const modalContent = document.getElementById('resultsModalContent');

        const topCareerName = modalContent.querySelector('#topCareerName');
        const topCareerDescription = modalContent.querySelector('#topCareerDescription');
        const matchPercentage = modalContent.querySelector('#matchPercentage');
        const confidenceBadge = modalContent.querySelector('#confidenceBadge');

        if (topCareerName) topCareerName.textContent = careerName;
        if (topCareerDescription) {
            topCareerDescription.textContent = topMatch.reasoning || topMatch.description ||
                `Based on your responses, ${careerName} aligns perfectly with your interests and skills.`;
        }

        const percentage = topMatch.percentage || 85;
        if (matchPercentage) matchPercentage.textContent = `${percentage}%`;

        const confidence = topMatch.confidence || percentage;
        const confidenceLevel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';
        if (confidenceBadge) confidenceBadge.textContent = `${confidenceLevel} Confidence`;

        this.animatePercentageCircle(percentage);
    }

    populateClubs() {
        const modalContent = document.getElementById('resultsModalContent');
        const clubsContainer = modalContent.querySelector('#clubsRow');
        if (!clubsContainer) return;

        const clubs = this.resultData.clubRecommendations ||
            this.resultData.results?.clubRecommendations ||
            this.getDefaultClubs();

        console.log('🏛️ Populating clubs in modal:', clubs);

        clubsContainer.innerHTML = '';

        clubs.slice(0, 3).forEach((club, index) => {
            const clubCard = this.createClubCard(club, index);
            clubsContainer.appendChild(clubCard);
        });
    }

    createClubCard(club, index) {
        const card = document.createElement('div');
        card.className = 'club-card';
        card.dataset.clubId = club._id || club.id || `club-${index}`;

        const isBookmarked = this.bookmarkedClubs.has(club._id || club.id);
        const clubTags = club.tags || ['technology', 'programming'];
        const displayTags = clubTags.slice(0, 2);

        card.innerHTML = `
            <div class="club-logo">
                <img src="${club.logoUrl || '/assets/default-club-logo.png'}" 
                     alt="${club.name || 'Club'}" 
                     onerror="this.src='/assets/default-club-logo.png'">
            </div>
            <div class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" 
                 data-club-id="${club._id || club.id}" 
                 title="Bookmark this club">
                ${isBookmarked ? '★' : '☆'}
            </div>
            <h3 class="club-name">${club.name || 'Tech Club'}</h3>
            <div class="club-tags">
                ${displayTags.map(tag =>
            `<span class="tag">${tag.toUpperCase()}</span>`
        ).join('')}
            </div>
        `;

        // Add click handler for the card (excluding bookmark icon)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('bookmark-icon')) {
                // In modal context, you might want to handle this differently
                // For now, we'll open in the same tab but close the modal first
                closeResultsModal();
                setTimeout(() => {
                    window.location.href = `/club/${club._id || club.id}`;
                }, 300);
            }
        });

        return card;
    }

    // Include the same methods from enhanced-results.js
    populateCareerProgression() {
        const modalContent = document.getElementById('resultsModalContent');
        const container = modalContent.querySelector('#progressionSteps');
        if (!container) return;

        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        const progression = topMatch?.careerProgression || this.getCareerSpecificProgression(careerName);

        console.log('📈 Populating career progression in modal for:', careerName);

        container.innerHTML = '';

        progression.forEach((step) => {
            const stepElement = this.createProgressionStep(step, careerName);
            container.appendChild(stepElement);
        });
    }

    createProgressionStep(step) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'progression-item';

        const roles = Array.isArray(step.roles) ? step.roles.join(', ') : step.roles;
        const salary = step.salary ? `${step.salary.min}k - ${step.salary.max}k` : '';
        const levelClass = step.level.toLowerCase();

        stepDiv.innerHTML = `
            <div class="level-badge ${levelClass}">${step.level || 'Entry'}</div>
            <div class="progression-content">
                <h4>${roles || 'Various roles available'}</h4>
                <p>${step.timeline || step.timeframe || '0-2 years'} ${salary ? '• ' + salary : ''}</p>
            </div>
        `;

        return stepDiv;
    }

    populateCareerMatches() {
        const modalContent = document.getElementById('resultsModalContent');
        const matchesContainer = modalContent.querySelector('#matchesList');
        if (!matchesContainer) return;

        const matches = this.resultData.allMatches ||
            this.resultData.results?.allMatches ||
            this.getDefaultMatches();

        console.log('🎯 Populating career matches in modal:', matches);

        matchesContainer.innerHTML = '';

        matches.slice(0, 5).forEach((match, index) => {
            const matchItem = this.createMatchItem(match, index);
            matchesContainer.appendChild(matchItem);
        });

        // Animate progress bars after a delay
        setTimeout(() => this.animateProgressBars(), 500);
    }

    createMatchItem(match, index) {
        const item = document.createElement('div');
        item.className = 'match-item';

        const percentage = match.percentage || 75;

        item.innerHTML = `
            <div class="match-info">
                <h4>${match.career || 'Tech Career'}</h4>
                <p>${match.category || 'Technology'}</p>
            </div>
            <div class="match-score">
                <div class="progress-bar">
                    <div class="progress-fill" data-width="${percentage}"></div>
                </div>
                <span class="percentage">${percentage}%</span>
            </div>
        `;

        return item;
    }

    populateNextSteps() {
        const modalContent = document.getElementById('resultsModalContent');
        const container = modalContent.querySelector('#stepsList');
        if (!container) return;

        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        const steps = topMatch?.nextSteps || this.getCareerSpecificSteps(careerName);

        console.log('✅ Populating next steps in modal for:', careerName);

        container.innerHTML = '';

        steps.slice(0, 3).forEach((step, index) => {
            const stepElement = this.createStepItem(step, index + 1, careerName);
            container.appendChild(stepElement);
        });
    }

    createStepItem(step, number) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';

        const stepText = typeof step === 'string' ? step : step.step || step.text;
        const description = step.description || 'Recommended action for your career development';

        stepDiv.innerHTML = `
            <div class="step-number">${number}</div>
            <div class="step-content">
                <h4>${stepText}</h4>
                <p>${description}</p>
            </div>
        `;

        return stepDiv;
    }

    populateMarketInsights() {
        const modalContent = document.getElementById('resultsModalContent');
        const container = modalContent.querySelector('#insightsGrid');
        if (!container) return;

        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        const marketData = topMatch?.marketData || this.getCareerSpecificMarketData(careerName);

        console.log('📊 Populating market insights in modal for:', careerName);

        const insights = [
            {
                label: 'Average Salary',
                value: marketData.avgSalary || this.formatSalaryRange(careerName)
            },
            {
                label: 'Job Growth',
                value: marketData.jobGrowthRate || marketData.jobGrowth || this.getGrowthRate(careerName)
            },
            {
                label: 'Annual Openings',
                value: marketData.annualOpenings ?
                    marketData.annualOpenings.toLocaleString() :
                    this.getDefaultAnnualOpenings(careerName)
            },
            {
                label: 'Work-Life Balance',
                value: marketData.workLifeBalance || this.getWorkLifeBalance(careerName)
            }
        ];

        container.innerHTML = '';
        insights.forEach(insight => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.innerHTML = `
                <h3>${insight.label}</h3>
                <p class="insight-value">${insight.value}</p>
            `;
            container.appendChild(item);
        });
    }

    // Animation methods
    animatePercentageCircle(percentage) {
        const modalContent = document.getElementById('resultsModalContent');
        const circle = modalContent.querySelector('#progressCircle');
        if (!circle) return;

        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 500);
    }

    animateProgressBars() {
        const modalContent = document.getElementById('resultsModalContent');
        const progressBars = modalContent.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.dataset.width + '%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 200);
        });
    }

    startAnimations() {
        const modalContent = document.getElementById('resultsModalContent');
        const sections = modalContent.querySelectorAll('.content-section, .clubs-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    setupEventListeners() {
        const modalContent = document.getElementById('resultsModalContent');

        // Bookmark buttons
        modalContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('bookmark-icon') || e.target.closest('.bookmark-icon')) {
                const button = e.target.classList.contains('bookmark-icon') ? e.target : e.target.closest('.bookmark-icon');
                this.handleBookmarkClick(button);
            }
        });

        // Action buttons - modify for modal context
        const tryAnotherBtn = modalContent.querySelector('#tryAnotherLevelBtn');
        if (tryAnotherBtn) {
            tryAnotherBtn.addEventListener('click', () => {
                closeResultsModal();
                setTimeout(() => {
                    window.location.href = '/enhanced-quiz';
                }, 300);
            });
        }
    }

    handleBookmarkClick(button) {
        const clubId = button.dataset.clubId;
        const isCurrentlyBookmarked = this.bookmarkedClubs.has(clubId);

        if (isCurrentlyBookmarked) {
            this.bookmarkedClubs.delete(clubId);
            button.textContent = '☆';
            button.classList.remove('bookmarked');
            this.removeBookmark(clubId);
        } else {
            this.bookmarkedClubs.add(clubId);
            button.textContent = '★';
            button.classList.add('bookmarked');
            this.addBookmark(clubId);
        }
    }

    async addBookmark(clubId) {
        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clubId })
            });
            if (!response.ok) console.warn('Failed to save bookmark to server');
        } catch (error) {
            console.warn('Error saving bookmark:', error);
        }
    }

    async removeBookmark(clubId) {
        try {
            const response = await fetch(`/api/bookmarks/${clubId}`, { method: 'DELETE' });
            if (!response.ok) console.warn('Failed to remove bookmark from server');
        } catch (error) {
            console.warn('Error removing bookmark:', error);
        }
    }

    // Helper methods (same as enhanced-results.js)
    getDefaultClubs() {
        return [
            {
                _id: 'ai-collective',
                name: 'AI Student Collective',
                logoUrl: '/assets/aiStudentCollective.png',
                tags: ['artificial-intelligence', 'machine-learning']
            },
            {
                _id: 'code-lab',
                name: '/code lab',
                logoUrl: '/assets/codelab.png',
                tags: ['programming', 'web-development']
            },
            {
                _id: 'cs-tutoring',
                name: 'Computer Science Tutoring Lab',
                logoUrl: '/assets/cs-tutoring.png',
                tags: ['tutoring', 'computer-science']
            }
        ];
    }

    getDefaultMatches() {
        return [
            { career: 'Software Engineering', category: 'Engineering', percentage: 85 },
            { career: 'Data Science', category: 'Data', percentage: 78 },
            { career: 'Web Development', category: 'Engineering', percentage: 72 },
            { career: 'UX Design', category: 'Design', percentage: 65 }
        ];
    }

    getCareerSpecificProgression(careerName) {
        const progressions = {
            'Software Engineering': [
                { level: 'Entry', roles: ['Junior Developer', 'Software Engineer I'], timeline: '0-2 years', salary: { min: 85, max: 110 } },
                { level: 'Mid', roles: ['Software Engineer II', 'Senior Developer'], timeline: '2-5 years', salary: { min: 110, max: 150 } },
                { level: 'Senior', roles: ['Staff Engineer', 'Principal Engineer'], timeline: '5+ years', salary: { min: 150, max: 220 } }
            ]
        };
        return progressions[careerName] || progressions['Software Engineering'];
    }

    getCareerSpecificSteps(careerName) {
        const stepsMap = {
            'Software Engineering': [
                'Master data structures and algorithms fundamentals',
                'Build 3-5 full-stack projects for your GitHub portfolio',
                'Participate in hackathons and contribute to open source'
            ]
        };
        return stepsMap[careerName] || stepsMap['Software Engineering'];
    }

    getCareerSpecificMarketData(careerName) {
        return {
            avgSalary: '$110k - $180k',
            jobGrowthRate: '+22%',
            annualOpenings: 189200,
            workLifeBalance: '7.5/10'
        };
    }

    formatSalaryRange(careerName) {
        return '$85k - $140k';
    }

    getGrowthRate(careerName) {
        return '+15%';
    }

    getDefaultAnnualOpenings(careerName) {
        return '12,500';
    }

    getWorkLifeBalance(careerName) {
        return '8.0/10';
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function truncateText(text, maxLength) {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function formatTags(tags) {
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
}

function showDashboardMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.dashboard-message');
    if (existingMessage) existingMessage.remove();

    const colors = { success: '#27ae60', error: '#e74c3c', info: '#5F96C5', warning: '#f39c12' };

    const messageEl = document.createElement('div');
    messageEl.className = 'dashboard-message';
    messageEl.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: ${colors[type]};
        color: white; padding: 1rem 1.5rem; border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 1000;
        font-weight: 500; max-width: 350px; opacity: 0;
        transform: translateX(100%); transition: all 0.3s ease;
    `;

    messageEl.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, type === 'error' ? 6000 : 4000);
}


function showResultsModalLoading() {
    const modalContent = document.getElementById('resultsModalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <p>Loading your career assessment results...</p>
            </div>
        `;
    }
}

function showResultsModalError(message) {
    const modalContent = document.getElementById('resultsModalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="modal-error">
                <div class="error-icon">⚠️</div>
                <h3>Unable to Load Results</h3>
                <p>${message}</p>
                <button onclick="closeResultsModal()" class="error-close-btn">Close</button>
            </div>
        `;
    }
}

function generateSampleResultData(resultId) {
    return {
        topMatch: {
            career: 'Software Engineering',
            percentage: 85,
            confidence: 'High',
            reasoning: 'Based on your responses, you show strong analytical thinking and problem-solving skills.',
            careerProgression: [
                { level: 'Entry', roles: ['Junior Developer'], timeline: '0-2 years', salary: { min: 85, max: 110 } },
                { level: 'Mid', roles: ['Software Engineer'], timeline: '2-5 years', salary: { min: 110, max: 150 } },
                { level: 'Senior', roles: ['Staff Engineer'], timeline: '5+ years', salary: { min: 150, max: 220 } }
            ],
            nextSteps: [
                'Master programming fundamentals',
                'Build portfolio projects',
                'Join UC Davis tech clubs'
            ],
            marketData: {
                avgSalary: '$110k - $180k',
                jobGrowthRate: '+22%',
                annualOpenings: 189200,
                workLifeBalance: '7.5/10'
            }
        },
        allMatches: [
            { career: 'Software Engineering', category: 'Engineering', percentage: 85 },
            { career: 'Data Science', category: 'Data', percentage: 78 },
            { career: 'Web Development', category: 'Engineering', percentage: 72 }
        ],
        clubRecommendations: [
            { _id: 'ai-collective', name: 'AI Student Collective', logoUrl: '/assets/aiStudentCollective.png', tags: ['ai', 'ml'] },
            { _id: 'code-lab', name: '/code lab', logoUrl: '/assets/codelab.png', tags: ['programming', 'web'] },
            { _id: 'cs-tutoring', name: 'CS Tutoring Lab', logoUrl: '/assets/cs-tutoring.png', tags: ['tutoring', 'cs'] }
        ]
    };
}

function getResultsPageHTML() {
    // Return the HTML structure from enhanced-results.html (without navbar)
    return `
        <!-- Top Match Card -->
        <div class="top-match-card" id="topMatchCard">
            <div class="confidence-badge" id="confidenceBadge">High Confidence</div>
            <div class="match-layout">
                <div class="match-content">
                    <h3>Your closest match is</h3>
                    <h1 id="topCareerName">Software Engineering</h1>
                    <p id="topCareerDescription">
                        Based on your responses, you show strong analytical thinking and problem-solving skills.
                    </p>
                </div>
                <div class="percentage-display">
                    <div class="percentage-circle">
                        <svg viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="transparent" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
                            <circle id="progressCircle" cx="60" cy="60" r="54" fill="transparent" stroke="white" stroke-width="8" 
                                    stroke-dasharray="339.29" stroke-dashoffset="67.86" stroke-linecap="round"/>
                        </svg>
                        <div class="percentage-text" id="matchPercentage">85%</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommended Clubs Section -->
        <section class="clubs-section">
            <div class="section-header">
                <h2 class="section-title">Recommended Clubs</h2>
                <span class="section-icon">🏛️</span>
            </div>
            <div class="clubs-row" id="clubsRow">
                <!-- Clubs will be populated dynamically -->
            </div>
        </section>

        <!-- Two Column Layout -->
        <div class="two-column-layout">
            <!-- Left Column -->
            <div class="left-column">
                <!-- Career Progression -->
                <section class="career-progression">
                    <div class="section-header">
                        <h2>Career Progression</h2>
                        <span class="section-icon">📈</span>
                    </div>
                    <div class="progression-steps" id="progressionSteps">
                        <!-- Will be populated dynamically -->
                    </div>
                </section>

                <!-- Your Next Steps -->
                <section class="next-steps">
                    <div class="section-header">
                        <h2>Your Next Steps</h2>
                        <span class="section-icon">✅</span>
                    </div>
                    <div class="steps-list" id="stepsList">
                        <!-- Will be populated dynamically -->
                    </div>
                </section>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Career Matches -->
                <section class="career-matches">
                    <div class="section-header">
                        <h2>Career Matches</h2>
                        <span class="section-icon">🎯</span>
                    </div>
                    <div class="matches-list" id="matchesList">
                        <!-- Will be populated dynamically -->
                    </div>
                </section>

                <!-- Market Insights -->
                <section class="market-insights">
                    <div class="section-header">
                        <h2>Market Insights</h2>
                        <span class="section-icon">📊</span>
                    </div>
                    <div class="insights-grid" id="insightsGrid">
                        <!-- Will be populated dynamically -->
                    </div>
                </section>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button id="tryAnotherLevelBtn" class="btn btn-primary">
                🚀 Try Another Level
            </button>
            <button onclick="closeResultsModal()" class="btn btn-secondary">
                📎 Close Results
            </button>
        </div>
    `;
}

//  REMAINING HELPER FUNCTIONS
// =============================================================================

function generateMatchesForCareer(primaryCareer, primaryPercentage) {
    const careerFamilies = {
        'Software Engineering': [
            { career: 'Software Engineering', category: 'Engineering', percentage: primaryPercentage },
            { career: 'Web Development', category: 'Engineering', percentage: Math.max(30, primaryPercentage - 8) },
            { career: 'Mobile Development', category: 'Engineering', percentage: Math.max(25, primaryPercentage - 12) },
            { career: 'DevOps Engineering', category: 'Engineering', percentage: Math.max(20, primaryPercentage - 18) },
            { career: 'Data Engineering', category: 'Data', percentage: Math.max(15, primaryPercentage - 25) }
        ],
        'Data Science': [
            { career: 'Data Science', category: 'Data', percentage: primaryPercentage },
            { career: 'Machine Learning Engineering', category: 'AI', percentage: Math.max(30, primaryPercentage - 5) },
            { career: 'Data Engineering', category: 'Data', percentage: Math.max(25, primaryPercentage - 10) },
            { career: 'Research Scientist', category: 'Research', percentage: Math.max(20, primaryPercentage - 15) },
            { career: 'Business Intelligence', category: 'Analytics', percentage: Math.max(15, primaryPercentage - 20) }
        ],
        'UX/UI Design': [
            { career: 'UX/UI Design', category: 'Design', percentage: primaryPercentage },
            { career: 'Product Design', category: 'Design', percentage: Math.max(30, primaryPercentage - 6) },
            { career: 'Graphic Design', category: 'Design', percentage: Math.max(25, primaryPercentage - 12) },
            { career: 'Interaction Design', category: 'Design', percentage: Math.max(20, primaryPercentage - 18) },
            { career: 'Design Research', category: 'Research', percentage: Math.max(15, primaryPercentage - 25) }
        ],
        'Product Management': [
            { career: 'Product Management', category: 'Product', percentage: primaryPercentage },
            { career: 'Project Management', category: 'Management', percentage: Math.max(30, primaryPercentage - 8) },
            { career: 'Business Analysis', category: 'Business', percentage: Math.max(25, primaryPercentage - 12) },
            { career: 'Marketing', category: 'Marketing', percentage: Math.max(20, primaryPercentage - 18) },
            { career: 'Consulting', category: 'Business', percentage: Math.max(15, primaryPercentage - 25) }
        ],
        'Technical Writing': [
            { career: 'Technical Writing', category: 'Writing', percentage: primaryPercentage },
            { career: 'Content Strategy', category: 'Content', percentage: Math.max(30, primaryPercentage - 6) },
            { career: 'Documentation', category: 'Writing', percentage: Math.max(25, primaryPercentage - 10) },
            { career: 'UX Writing', category: 'Design', percentage: Math.max(20, primaryPercentage - 15) },
            { career: 'Communications', category: 'Marketing', percentage: Math.max(15, primaryPercentage - 20) }
        ],
        'DevOps Engineering': [
            { career: 'DevOps Engineering', category: 'Engineering', percentage: primaryPercentage },
            { career: 'Site Reliability Engineering', category: 'Engineering', percentage: Math.max(30, primaryPercentage - 5) },
            { career: 'Cloud Engineering', category: 'Engineering', percentage: Math.max(25, primaryPercentage - 8) },
            { career: 'Infrastructure Engineering', category: 'Engineering', percentage: Math.max(20, primaryPercentage - 12) },
            { career: 'Platform Engineering', category: 'Engineering', percentage: Math.max(15, primaryPercentage - 18) }
        ],
        'Cybersecurity': [
            { career: 'Cybersecurity', category: 'Security', percentage: primaryPercentage },
            { career: 'Information Security', category: 'Security', percentage: Math.max(30, primaryPercentage - 5) },
            { career: 'Network Security', category: 'Security', percentage: Math.max(25, primaryPercentage - 8) },
            { career: 'Security Analysis', category: 'Security', percentage: Math.max(20, primaryPercentage - 12) },
            { career: 'Ethical Hacking', category: 'Security', percentage: Math.max(15, primaryPercentage - 18) }
        ]
    };

    // Find the best match or use Software Engineering as default
    const matches = careerFamilies[primaryCareer] || careerFamilies['Software Engineering'];

    // Ensure the primary career is first and has the correct percentage
    matches[0].percentage = primaryPercentage;

    return matches.slice(0, 5);
}

function getClubRecommendationsForCareer(careerName) {
    const clubMap = {
        'Software Engineering': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'software'] },
            { _id: 'hackdavis', name: 'HackDavis', logoUrl: '/assets/hackdavis.png', tags: ['hackathon', 'innovation'] },
            { _id: 'aggieworks', name: 'AggieWorks', logoUrl: '/assets/aggieworks.png', tags: ['startups', 'development'] }
        ],
        'Data Science': [
            { _id: 'ai-collective', name: 'AI Student Collective', logoUrl: '/assets/aiStudentCollective.png', tags: ['ai', 'machine-learning'] },
            { _id: 'data-science-club', name: 'Davis Data Science Club', logoUrl: '/assets/data-science.png', tags: ['data', 'analytics'] },
            { _id: 'aggie-sports-analytics', name: 'Aggie Sports Analytics', logoUrl: '/assets/sports-analytics.png', tags: ['sports', 'data'] }
        ],
        'UX/UI Design': [
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'ux-ui'] },
            { _id: 'product-space', name: 'Product Space @ UC Davis', logoUrl: '/assets/product-space.png', tags: ['product', 'design'] },
            { _id: 'gdsc', name: 'Google Developer Student Club', logoUrl: '/assets/gdsc.png', tags: ['development', 'design'] }
        ],
        'Product Management': [
            { _id: 'product-space', name: 'Product Space @ UC Davis', logoUrl: '/assets/product-space.png', tags: ['product', 'management'] },
            { _id: 'davis-consulting', name: 'The Davis Consulting Group', logoUrl: '/assets/consulting.png', tags: ['consulting', 'business'] },
            { _id: 'aggieworks', name: 'AggieWorks', logoUrl: '/assets/aggieworks.png', tags: ['startups', 'product'] }
        ],
        'Technical Writing': [
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'content'] },
            { _id: 'cs-tutoring', name: 'Computer Science Tutoring Lab', logoUrl: '/assets/cs-tutoring.png', tags: ['tutoring', 'communication'] },
            { _id: 'gdsc', name: 'Google Developer Student Club', logoUrl: '/assets/gdsc.png', tags: ['development', 'documentation'] }
        ],
        'DevOps Engineering': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'infrastructure'] },
            { _id: 'cybersecurity-club', name: 'Cyber Security Club', logoUrl: '/assets/cybersecurity.png', tags: ['security', 'systems'] },
            { _id: 'hardware-club', name: 'The Hardware Club', logoUrl: '/assets/hardware.png', tags: ['hardware', 'systems'] }
        ],
        'Cybersecurity': [
            { _id: 'cybersecurity-club', name: 'Cyber Security Club at UC Davis', logoUrl: '/assets/cybersecurity.png', tags: ['security', 'hacking'] },
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'security'] },
            { _id: 'hardware-club', name: 'The Hardware Club', logoUrl: '/assets/hardware.png', tags: ['hardware', 'security'] }
        ],
        'Machine Learning Engineering': [
            { _id: 'ai-collective', name: 'AI Student Collective', logoUrl: '/assets/aiStudentCollective.png', tags: ['ai', 'machine-learning'] },
            { _id: 'data-science-club', name: 'Davis Data Science Club', logoUrl: '/assets/data-science.png', tags: ['data', 'ml'] },
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'ai'] }
        ],
        'Web Development': [
            { _id: 'include-club', name: '#include', logoUrl: '/assets/include.png', tags: ['programming', 'web'] },
            { _id: 'codelab', name: 'CodeLab', logoUrl: '/assets/codelab.png', tags: ['web', 'development'] },
            { _id: 'design-interactive', name: 'Design Interactive', logoUrl: '/assets/design-interactive.png', tags: ['design', 'web'] }
        ]
    };

    return clubMap[careerName] || clubMap['Software Engineering'];
}

console.log('✅ All global helper functions for modal data loading defined successfully!');

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.handleImageUpload = handleImageUpload;
window.saveProfile = saveProfile;
window.showMatchingModal = showMatchingModal;
window.closeMatchingModal = closeMatchingModal;

window.openResultsModal = openResultsModal;
window.closeResultsModal = closeResultsModal;

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.id === 'resultsModalOverlay') {
        closeResultsModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resultsModalInstance && resultsModalInstance.style.display === 'flex') {
        closeResultsModal();
    }
});

console.log('✅ Dashboard Results Modal Integration loaded successfully!');

console.log('✅ Enhanced Dashboard with full profile management and matching loaded!');