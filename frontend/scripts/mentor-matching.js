// =============================================================================
// ENHANCED MENTOR MATCHING WITH DROPDOWN SUGGESTIONS - COMPLETE FILE
// Save as: frontend/scripts/mentor-matching.js
// =============================================================================

// Debug: Check script loading
console.log('🚀 Mentor matching script loaded');

// Store user inputs
let userInputs = {
    major: [],
    career: [],
    hobbies: [],
    mentorship: [],
    industry: []
};

// Track current highlight index for keyboard navigation
let currentHighlight = {};

// Suggestion banks for each field
const suggestions = {
    major: [
        'Computer Science',
        'Computer Engineering',
        'Cognitive Science',
        'Data Science',
        'Statistics',
        'Mathematics',
        'Psychology',
        'Quantitative Psychology',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Economics',
        'Business Administration',
        'Design',
        'Communications',
        'Biology',
        'Chemistry',
        'Physics',
        'Political Science',
        'Sociology',
        'English',
        'History',
        'Philosophy'
    ],
    career: [
        'Software Engineering',
        'Product Management',
        'Data Science',
        'UX Design',
        'UI Design',
        'Solutions Architect',
        'Solutions Engineering',
        'DevOps',
        'Machine Learning',
        'AI Research',
        'Consulting',
        'Entrepreneurship',
        'Startups',
        'Founder',
        'Investment Banking',
        'Marketing',
        'Product Marketing',
        'Growth Marketing',
        'Business Development',
        'Technical Writing',
        'Developer Advocate',
        'Systems Engineering',
        'Research',
        'Academia',
        'Teaching',
        'Building a generational company',
        'Building Teams',
        'Strategy'
    ],
    hobbies: [
        'Coding',
        'Gaming',
        'Reading',
        'Writing',
        'Hiking',
        'Sports',
        'Basketball',
        'Soccer',
        'Tennis',
        'Golf',
        'Gym',
        'Working out',
        'Running',
        'Cycling',
        'Photography',
        'Music',
        'Guitar',
        'Piano',
        'Cooking',
        'Travel',
        'Movies',
        'Art',
        'Drawing',
        'Painting',
        'Volunteering',
        'Nonprofits',
        'Podcasts',
        'Board Games',
        'Chess',
        'Strategy games',
        'Legos',
        'Building',
        'Snowboarding',
        'Skiing',
        'Swimming',
        'Dancing',
        'Yoga',
        'Meditation',
        'Eating',
        'Food',
        'Coffee',
        'Pickleball',
        'Badminton',
        'Lacrosse',
        'Crocheting',
        'Knitting',
        'Collecting trinkets',
        'Videography',
        'Event Planning',
        'Concerts',
        'Backpacking',
        'Hooping',
        'Hacking',
        'Golfing',
        'Long drives',
        'Watching shows and films',
        'Public speaking',
        'Backend product',
        'NYC',
        'Mentorship'
    ],
    mentorship: [
        'Career guidance',
        'Interview preparation',
        'Resume review',
        'Technical skills development',
        'Networking strategies',
        'Industry insights',
        'Internship advice',
        'Graduate school guidance',
        'Work-life balance',
        'Leadership development',
        'Project management',
        'Communication skills',
        'Negotiation tactics',
        'Personal branding',
        'Portfolio review',
        'Job search strategies',
        'Salary negotiation',
        'Career transitions',
        'Skill assessment',
        'Professional development'
    ],
    industry: [
        'Big Tech (FAANG)',
        'Startups',
        'FinTech',
        'Healthcare Tech',
        'EdTech',
        'Gaming',
        'E-commerce',
        'Social Media',
        'Enterprise Software',
        'Cybersecurity',
        'Blockchain/Crypto',
        'AI/ML Companies',
        'Consulting',
        'Investment Banking',
        'Venture Capital',
        'Non-profit',
        'Government',
        'Research Labs',
        'Defense',
        'Aerospace',
        'Automotive',
        'Retail',
        'Media & Entertainment',
        'Telecommunications'
    ]
};

// Mentor profiles
const mentorProfiles = {
    'vikram-choudhry': {
        id: 'vikram-choudhry',
        name: 'Vikram Choudhry',
        year: 'Senior',
        major: 'Computer Science',
        careerInterests: ['Solutions Architect', 'Solutions Engineering', 'Software Engineering', 'Consulting'],
        hobbies: ['Hooping', 'Golfing', 'Gaming', 'Reading'],
        companies: ['NVIDIA', 'Lavu', 'Stanford Health Care'],
        profilePicture: '../assets/mentors/vikram-choudhry.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'daniel-kim': {
        id: 'daniel-kim',
        name: 'Daniel Kim',
        year: 'Junior',
        major: 'Computer Science & Statistics',
        careerInterests: ['Software Engineering', 'Data Science'],
        hobbies: ['Hiking', 'Reading', 'Event Planning', 'Videography', 'Concerts'],
        companies: ['LinkedIn'],
        profilePicture: '../assets/mentors/daniel-kim.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'shrey-gupta': {
        id: 'shrey-gupta',
        name: 'Shrey Gupta',
        year: 'Junior',
        major: 'Computer Science',
        careerInterests: ['Entrepreneurship', 'Product Management', 'Startups', 'Building a generational company'],
        hobbies: ['Hacking', 'Backpacking'],
        companies: ['Y Combinator', 'Capital One', 'NASA', 'Notion'],
        profilePicture: '../assets/mentors/shrey-gupta.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'anirudh-murugesan': {
        id: 'anirudh-murugesan',
        name: 'Anirudh Murugesan',
        year: 'Senior',
        major: 'Cognitive Science & Statistics',
        careerInterests: ['Product Management', 'Startups', 'Building Teams', 'Strategy'],
        hobbies: ['Basketball', 'Golf', 'Nonprofits', 'Mentorship', 'Travel', 'Food'],
        companies: ['Visa'],
        profilePicture: '../assets/mentors/anirudh-murugesan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'latisha-luu': {
        id: 'latisha-luu',
        name: 'Latisha Luu',
        year: 'Junior',
        major: 'Quantitative Psychology',
        careerInterests: ['Product Marketing', 'Growth Marketing'],
        hobbies: ['Snowboarding', 'Coffee', 'Collecting trinkets'],
        companies: ['Amazon'],
        profilePicture: '../assets/mentors/latisha-luu.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'mohnish-gopi': {
        id: 'mohnish-gopi',
        name: 'Mohnish Gopi',
        year: 'Junior',
        major: 'Computer Science',
        careerInterests: ['Software Engineering', 'Product Management', 'Research', 'Startups'],
        hobbies: ['Long drives', 'Gym', 'Badminton', 'Photography', 'Movies'],
        companies: ['Microsoft'],
        profilePicture: '../assets/mentors/mohnish-gopi.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'sreeya-yakkala': {
        id: 'sreeya-yakkala',
        name: 'Sreeya Yakkala',
        year: 'Junior',
        major: 'Computer Science',
        careerInterests: ['Product Management', 'Software Engineering'],
        hobbies: ['Hiking', 'Reading', 'Crocheting', 'Lacrosse'],
        companies: ['Microsoft', 'Mercedes-Benz R&D'],
        profilePicture: '../assets/mentors/sreeya-yakkala.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'curtis-chen': {
        id: 'curtis-chen',
        name: 'Curtis Chen',
        year: 'Junior',
        major: 'Computer Science & Psychology',
        careerInterests: ['Product Management'],
        hobbies: ['Watching shows and films', 'Legos', 'Strategy games', 'Sports'],
        companies: ['Amazon'],
        profilePicture: '../assets/mentors/curtis-chen.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'hanson-nguyen': {
        id: 'hanson-nguyen',
        name: 'Hanson Nguyen',
        year: 'Senior',
        major: 'Computer Engineering',
        careerInterests: ['Software Engineering'],
        hobbies: ['Coding', 'Pickleball', 'Gym', 'Cooking'],
        companies: ['Dolby Laboratories', 'Capital One'],
        profilePicture: '../assets/mentors/hanson-nguyen.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'aine-keenan': {
        id: 'aine-keenan',
        name: 'Aine Keenan',
        year: 'Junior',
        major: 'Computer Science',
        careerInterests: ['Software Engineering', 'Developer Advocate'],
        hobbies: ['NYC', 'Backend product', 'Public speaking'],
        companies: ['Chevron', 'Red Hat'],
        profilePicture: '../assets/mentors/aine-keenan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'yahli-hazan': {
        id: 'yahli-hazan',
        name: 'Yahli Hazan',
        year: 'Senior',
        major: 'Computer Science & Cognitive Science',
        careerInterests: ['Founder', 'Software Engineering', 'Builder'],
        hobbies: ['Reading', 'Snowboarding', 'Guitar', 'Writing', 'Building'],
        companies: ['Robust Intelligence'],
        profilePicture: '../assets/mentors/yahli-hazan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'dorothy-balkon': {
        id: 'dorothy-balkon',
        name: 'Dorothy Balkon',
        year: 'Senior',
        major: 'Cognitive Science',
        careerInterests: ['UX Design'],
        hobbies: ['Gaming', 'Music', 'Eating', 'Working out'],
        companies: ['Verizon'],
        profilePicture: '../assets/mentors/dorothy-balkon.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    }
};

// =============================================================================
// DROPDOWN FUNCTIONALITY
// =============================================================================

// Set up enhanced input with dropdown
function setupEnhancedInput(type) {
    const input = document.getElementById(`${type}Input`);
    if (!input) {
        console.log(`Could not find input: ${type}Input`);
        return;
    }

    console.log(`Setting up dropdown for ${type}`);

    // Create dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-suggestions';
    dropdownContainer.id = `${type}Dropdown`;
    dropdownContainer.style.display = 'none';

    // Insert dropdown after the input container
    const inputContainer = input.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(dropdownContainer);

    // Add event listeners for dropdown
    input.addEventListener('focus', () => {
        console.log(`Focus on ${type} input`);
        showSuggestions(type);
    });

    input.addEventListener('input', (e) => {
        filterSuggestions(type, e.target.value);
    });

    input.addEventListener('keydown', (e) => {
        handleKeyNavigation(e, type);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!inputContainer.contains(e.target)) {
            hideDropdown(type);
        }
    });

    console.log(`✅ Dropdown setup complete for ${type}`);
}

// Show all suggestions when input is focused
function showSuggestions(type) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    const availableSuggestions = getAvailableSuggestions(type);

    console.log(`Showing ${availableSuggestions.length} suggestions for ${type}`);

    if (availableSuggestions.length > 0) {
        updateDropdown(type, availableSuggestions);
        dropdown.style.display = 'block';
    }
}

// Filter suggestions based on input
function filterSuggestions(type, query) {
    const availableSuggestions = getAvailableSuggestions(type);

    if (query) {
        const filtered = availableSuggestions.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        updateDropdown(type, filtered);
    } else {
        updateDropdown(type, availableSuggestions);
    }
}

// Get available suggestions (exclude already selected ones)
function getAvailableSuggestions(type) {
    return suggestions[type].filter(item => !userInputs[type].includes(item));
}

// Update dropdown content
function updateDropdown(type, items) {
    const dropdown = document.getElementById(`${type}Dropdown`);

    if (items.length === 0) {
        dropdown.innerHTML = '<div class="dropdown-empty">No suggestions available</div>';
        dropdown.style.display = 'block';
        return;
    }

    dropdown.innerHTML = items.map((item, index) => `
        <div class="dropdown-item" 
             data-index="${index}"
             data-value="${item}"
             onclick="selectSuggestion('${type}', '${item.replace(/'/g, "\\'")}')"
             onmouseover="highlightItem('${type}', ${index})">
            ${item}
        </div>
    `).join('');

    dropdown.style.display = 'block';
    currentHighlight[type] = -1;
}

// Select a suggestion from dropdown
function selectSuggestion(type, value) {
    if (!userInputs[type].includes(value)) {
        userInputs[type].push(value);
        renderTags(type);
        document.getElementById(`${type}Input`).value = '';
        hideDropdown(type);
        console.log(`Added ${type} tag from suggestion:`, value);
    }
}

// Hide dropdown
function hideDropdown(type) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    currentHighlight[type] = -1;
}

// Keyboard navigation for dropdown
function handleKeyNavigation(event, type) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    const items = dropdown.querySelectorAll('.dropdown-item');

    if (dropdown.style.display === 'none' || items.length === 0) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag(type);
        }
        return;
    }

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            currentHighlight[type] = Math.min(currentHighlight[type] + 1, items.length - 1);
            highlightItem(type, currentHighlight[type]);
            break;

        case 'ArrowUp':
            event.preventDefault();
            currentHighlight[type] = Math.max(currentHighlight[type] - 1, 0);
            highlightItem(type, currentHighlight[type]);
            break;

        case 'Enter':
            event.preventDefault();
            if (currentHighlight[type] >= 0 && items[currentHighlight[type]]) {
                const value = items[currentHighlight[type]].getAttribute('data-value');
                selectSuggestion(type, value);
            } else {
                addTag(type);
            }
            break;

        case 'Escape':
            hideDropdown(type);
            break;
    }
}

// Highlight dropdown item
function highlightItem(type, index) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    const items = dropdown.querySelectorAll('.dropdown-item');

    items.forEach(item => item.classList.remove('highlighted'));
    if (items[index]) {
        items[index].classList.add('highlighted');
        currentHighlight[type] = index;
    }
}

// =============================================================================
// ORIGINAL TAG FUNCTIONALITY
// =============================================================================

// Add a tag
function addTag(type) {
    const input = document.getElementById(`${type}Input`);
    const value = input.value.trim();

    if (value && !userInputs[type].includes(value)) {
        userInputs[type].push(value);
        renderTags(type);
        input.value = '';
        console.log(`Added ${type} tag:`, value);
    }
}

// Remove a tag
function removeTag(type, index) {
    userInputs[type].splice(index, 1);
    renderTags(type);
    console.log(`Removed ${type} tag at index:`, index);
}

// Render tags for a specific input
function renderTags(type) {
    const container = document.getElementById(`${type}Tags`);
    container.innerHTML = userInputs[type].map((tag, index) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeTag('${type}', ${index})">×</button>
        </span>
    `).join('');
}

// =============================================================================
// FORM SUBMISSION AND RESULTS
// =============================================================================

// Submit form and find mentors
async function submitAndFindMentors() {
    console.log('📤 Submitting user inputs:', userInputs);

    // Validate that at least some inputs are provided
    const hasInputs = Object.values(userInputs).some(arr => arr.length > 0);

    if (!hasInputs) {
        alert('Please add at least one tag to help us find the best mentors for you.');
        return;
    }

    // Hide form and show loading
    document.getElementById('formContainer').style.display = 'none';

    try {
        // Send to backend API
        const response = await fetch('/api/mentor-matching/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers: userInputs
            })
        });

        if (response.ok) {
            const data = await response.json();
            displayResults(data.mentors);
        } else {
            // Fallback to mock data if API fails
            displayMockResults();
        }
    } catch (error) {
        console.error('Error submitting:', error);
        displayMockResults();
    }
}

// Display results
function displayResults(mentors) {
    document.getElementById('resultsContainer').style.display = 'block';

    const mentorCards = document.getElementById('mentorCards');
    mentorCards.innerHTML = mentors.map(mentor => createMentorCard(mentor)).join('');
}

// Create mentor card HTML
function createMentorCard(mentor) {
    console.log('Creating card for:', mentor.name);

    const hobbies = mentor.hobbies || [];
    let careerInterests = mentor.careerInterests || [];
    if (!Array.isArray(careerInterests)) {
        careerInterests = [careerInterests];
    }

    let cardHTML = `
        <div class="mentor-card">
            <div class="mentor-avatar">`;

    if (mentor.profilePicture) {
        cardHTML += `<img src="${mentor.profilePicture}" alt="${mentor.name}" onerror="this.src='../assets/default-avatar.png';">`;
    } else {
        cardHTML += `<img src="../assets/default-avatar.png" alt="${mentor.name}">`;
    }

    cardHTML += `</div>
            
            <h3 class="mentor-name">${mentor.name}</h3>
            
            <div class="mentor-badges">
                <span class="badge">${mentor.year}</span>
                <span class="badge">${mentor.major}</span>
            </div>`;

    if (careerInterests.length > 0) {
        cardHTML += `
            <p class="section-label">Career Interests:</p>
            <div class="hobby-tags">`;
        careerInterests.forEach(career => {
            cardHTML += `<span class="hobby-tag">${career}</span>`;
        });
        cardHTML += `</div>`;
    }

    if (hobbies.length > 0) {
        cardHTML += `
            <p class="section-label">Hobbies:</p>
            <div class="hobby-tags">`;
        hobbies.forEach(hobby => {
            cardHTML += `<span class="hobby-tag">${hobby}</span>`;
        });
        cardHTML += `</div>`;
    }

    if (mentor.matchScore) {
        cardHTML += `
            <div class="match-score">
                <span class="score-label">Match Score: </span>
                <span class="score-value">${mentor.matchScore}%</span>
            </div>`;
    }

    cardHTML += `
            <a href="${mentor.expressoUrl}" 
               target="_blank" 
               class="schedule-btn"
               onclick="trackMentorClick('${mentor.id}', '${mentor.name}')">
                Schedule a Coffee Chat
            </a>
        </div>`;

    return cardHTML;
}

// Display mock results for testing
function displayMockResults() {
    console.log('📋 Displaying mock results');

    const mentorIds = Object.keys(mentorProfiles);
    const selectedMentors = [];

    for (let i = 0; i < 3 && i < mentorIds.length; i++) {
        const randomIndex = Math.floor(Math.random() * mentorIds.length);
        const mentorId = mentorIds.splice(randomIndex, 1)[0];
        const mentor = mentorProfiles[mentorId];
        mentor.matchScore = Math.floor(Math.random() * 30) + 70;
        selectedMentors.push(mentor);
    }

    displayResults(selectedMentors);
}

// Track mentor click
function trackMentorClick(mentorId, mentorName) {
    console.log(`📅 User clicked to schedule with: ${mentorName}`);

    fetch('/api/mentor-matching/track-click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mentorId: mentorId,
            mentorName: mentorName
        })
    }).catch(error => {
        console.error('Error tracking click:', error);
    });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, initializing mentor matching...');

    // Initialize current highlight tracking
    ['major', 'career', 'hobbies', 'mentorship', 'industry'].forEach(type => {
        currentHighlight[type] = -1;
    });

    // Set up original event listeners for tag input
    ['major', 'career', 'hobbies', 'mentorship', 'industry'].forEach(type => {
        const input = document.getElementById(`${type}Input`);
        if (input) {
            // Add tag on Enter key
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.target.closest('.dropdown-suggestions')) {
                    event.preventDefault();
                    addTag(type);
                }
            });

            // Add tag when input loses focus
            input.addEventListener('blur', () => {
                // Delay to allow dropdown click
                setTimeout(() => {
                    if (input.value.trim() && !document.activeElement.closest('.dropdown-suggestions')) {
                        addTag(type);
                    }
                }, 200);
            });

            console.log(`✅ Basic event listeners added for ${type}Input`);
        } else {
            console.error(`❌ Could not find input element: ${type}Input`);
        }
    });

    // Set up enhanced dropdown functionality
    console.log('📋 Setting up dropdown functionality...');
    ['major', 'career', 'hobbies', 'mentorship', 'industry'].forEach(type => {
        setupEnhancedInput(type);
    });

    console.log('✅ Mentor matching fully initialized');
});

// Export functions for global access
window.selectSuggestion = selectSuggestion;
window.highlightItem = highlightItem;
window.removeTag = removeTag;
window.submitAndFindMentors = submitAndFindMentors;
window.trackMentorClick = trackMentorClick;