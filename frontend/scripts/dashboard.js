// =============================================================================
// ENHANCED DASHBOARD FUNCTIONALITY - Complete Profile Management & Matching
// =============================================================================

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
        console.log('👤 Loading enhanced user profile...');

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

        console.log('✅ Enhanced user profile loaded:', userData.email);
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

    // Update profile completion
    updateProfileCompletion(userData.profileCompleteness || 0);

    // Update profile image
    if (userData.profilePictureUrl) {
        displayProfileImage(userData.profilePictureUrl);
    } else {
        displayProfileInitials(userData);
    }

    console.log('🎨 User profile display updated');
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
    // Basic fields
    const basicFields = [
        { id: 'profileName', value: userData.name || '' },
        { id: 'profileYear', value: userData.year || '' },
        { id: 'profileMajor', value: userData.major || '' },
        { id: 'profileBio', value: userData.bio || '' },
        { id: 'profileHobbies', value: userData.hobbies || '' },
        { id: 'profileLinkedin', value: userData.linkedinUrl || '' },
        { id: 'profileSkills', value: (userData.skills || []).join(', ') },
        { id: 'profileLearningGoals', value: (userData.learningGoals || []).join(', ') },
        { id: 'profileAvailability', value: userData.availability || '' }
    ];

    basicFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;
        }
    });

    // Checkboxes for lookingFor
    const lookingForContainer = document.getElementById('profileLookingFor');
    if (lookingForContainer && userData.lookingFor) {
        const checkboxes = lookingForContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = userData.lookingFor.includes(checkbox.value);
        });
    }

    // Checkboxes for contact preferences
    const contactContainer = document.getElementById('profileContactPreferences');
    if (contactContainer && userData.contactPreferences) {
        const checkboxes = contactContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = userData.contactPreferences.includes(checkbox.value);
        });
    }

    console.log('📝 Enhanced profile form populated');
}

function setupProfileFormListeners() {
    // Get all form fields
    const formFields = [
        'profileName', 'profileYear', 'profileMajor', 'profileBio',
        'profileHobbies', 'profileLinkedin', 'profileSkills',
        'profileLearningGoals', 'profileAvailability'
    ];

    // Add listeners to basic fields
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', markProfileUnsaved);
            field.addEventListener('change', markProfileUnsaved);
        }
    });

    // Add listeners to checkboxes
    const checkboxContainers = ['profileLookingFor', 'profileContactPreferences'];
    checkboxContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', markProfileUnsaved);
            });
        }
    });

    console.log('🎧 Enhanced profile form listeners set up');
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
        console.log('💾 Saving enhanced profile...');

        const saveBtn = document.getElementById('saveProfileBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        // Collect all form data
        const profileData = {
            // Basic information
            name: document.getElementById('profileName').value.trim(),
            year: document.getElementById('profileYear').value,
            major: document.getElementById('profileMajor').value.trim(),
            bio: document.getElementById('profileBio').value.trim(),
            hobbies: document.getElementById('profileHobbies').value.trim(),
            linkedinUrl: document.getElementById('profileLinkedin').value.trim(),

            // Skills and learning
            skills: document.getElementById('profileSkills').value
                .split(',').map(s => s.trim()).filter(s => s),
            learningGoals: document.getElementById('profileLearningGoals').value
                .split(',').map(s => s.trim()).filter(s => s),
            availability: document.getElementById('profileAvailability').value,

            // Looking for (checkboxes)
            lookingFor: Array.from(document.querySelectorAll('#profileLookingFor input:checked'))
                .map(checkbox => checkbox.value),

            // Contact preferences (checkboxes)
            contactPreferences: Array.from(document.querySelectorAll('#profileContactPreferences input:checked'))
                .map(checkbox => checkbox.value)
        };

        console.log('📊 Enhanced profile data to save:', profileData);

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

        console.log('✅ Enhanced profile saved successfully:', result);

        // Update state and UI
        dashboardState.user = { ...dashboardState.user, ...result.user };
        dashboardState.profileUnsaved = false;

        updateUserProfileDisplay(result.user);
        updateNavbarProfile(result.user);
        updateSaveButtonState();

        // Reload potential matches since profile changed
        await loadPotentialMatches();

        showDashboardMessage('Profile saved successfully! 🎉', 'success');

    } catch (error) {
        console.error('❌ Error saving enhanced profile:', error);
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
        const response = await fetch('/api/user/matches?limit=3');
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

    savedClubsGrid.innerHTML = '';
    dashboardState.bookmarkedClubs.slice(0, 3).forEach(club => {
        const clubCard = createMiniClubCard(club);
        savedClubsGrid.appendChild(clubCard);
    });
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
        <div class="mini-club-logo" style="background-image: url('${club.logoUrl || '/assets/default-club-logo.png'}'); background-size: cover;"></div>
        <div class="mini-club-name">${club.name}</div>
        <div class="mini-club-description">${truncateText(club.description, 60)}</div>
        <div class="mini-club-tags">${formatTags(club.tags)}</div>
    `;
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
    resultItem.className = 'test-result-item';

    const testDate = new Date(result.createdAt || result.date || Date.now());
    const formattedDate = testDate.toLocaleDateString();

    let testName = 'Career Assessment';
    let percentage = 75;

    if (result.topMatch) {
        testName = result.topMatch.careerName || 'Career Assessment';
        percentage = Math.round(result.topMatch.percentage || 75);
    }

    resultItem.innerHTML = `
        <div class="test-info">
            <div class="test-name">${testName}</div>
            <div class="test-date">${formattedDate}</div>
        </div>
        <div class="test-score">${percentage}%</div>
    `;
    return resultItem;
}

function createMatchItem(match) {
    const matchItem = document.createElement('div');
    matchItem.className = 'match-item';

    matchItem.innerHTML = `
        <div class="match-avatar">
            ${match.profilePictureUrl ?
            `<img src="${match.profilePictureUrl}" alt="${match.displayName}">` :
            `<span class="match-initials">${match.displayName.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>`
        }
        </div>
        <div class="match-info">
            <div class="match-name">${match.displayName}</div>
            <div class="match-details">${match.year} • ${match.major}</div>
            <div class="match-score">${match.matchScore}% match</div>
        </div>
    `;
    return matchItem;
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

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

window.handleImageUpload = handleImageUpload;
window.saveProfile = saveProfile;

console.log('✅ Enhanced Dashboard with full profile management and matching loaded!');