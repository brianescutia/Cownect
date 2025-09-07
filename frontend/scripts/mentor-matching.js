// =============================================================================
// MENTOR MATCHING JAVASCRIPT WITH TAG INPUT
// Save as: frontend/scripts/mentor-matching.js
// =============================================================================

// Store user inputs
let userInputs = {
    major: [],
    career: [],
    hobbies: [],
    mentorship: [],
    industry: []
};

// Mentor profiles with profile pictures and Expresso URLs
// UPDATE THESE WITH ACTUAL PROFILE PICTURES AND EXPRESSO LINKS
const mentorProfiles = {
    'vikram-choudhry': {
        id: 'vikram-choudhry',
        name: 'Vikram Choudhry',
        year: 'Senior',
        major: 'Computer Science',
        career: 'Solutions Architect',
        hobbies: ['Hooping', 'Golfing', 'Gaming', 'Reading'],
        profilePicture: '../assets/mentors/vikram-choudhry.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'daniel-kim': {
        id: 'daniel-kim',
        name: 'Daniel Kim',
        year: 'Junior',
        major: 'Computer Science & Statistics',
        career: 'Software Engineer',
        hobbies: ['Hiking', 'Reading', 'Event Planning', 'Videography'],
        profilePicture: '../assets/mentors/daniel-kim.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'shrey-gupta': {
        id: 'shrey-gupta',
        name: 'Shrey Gupta',
        year: 'Junior',
        major: 'Computer Science',
        career: 'Building a generational company',
        hobbies: ['Hacking', 'Backpacking'],
        profilePicture: '../assets/mentors/shrey-gupta.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'anirudh-murugesan': {
        id: 'anirudh-murugesan',
        name: 'Anirudh Murugesan',
        year: 'Senior',
        major: 'Cognitive Science & Statistics',
        career: 'Product',
        hobbies: ['Basketball', 'Golf', 'Nonprofits', 'Travel', 'Food'],
        profilePicture: '../assets/mentors/anirudh-murugesan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'latisha-luu': {
        id: 'latisha-luu',
        name: 'Latisha Luu',
        year: 'Junior',
        major: 'Quantitative Psychology',
        career: 'Product Marketing',
        hobbies: ['Snowboarding'],
        profilePicture: '../assets/mentors/latisha-luu.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'mohnish-gopi': {
        id: 'mohnish-gopi',
        name: 'Mohnish Gopi',
        year: 'Junior',
        major: 'Computer Science',
        career: 'Software Engineer',
        hobbies: ['Long drives', 'Gym', 'Badminton', 'Photography', 'Movies'],
        profilePicture: '../assets/mentors/mohnish-gopi.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'sreeya-yakkala': {
        id: 'sreeya-yakkala',
        name: 'Sreeya Yakkala',
        year: 'Junior',
        major: 'Computer Science',
        career: 'Product Manager',
        hobbies: ['Hiking', 'Reading', 'Crocheting', 'Lacrosse'],
        profilePicture: '../assets/mentors/sreeya-yakkala.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'curtis-chen': {
        id: 'curtis-chen',
        name: 'Curtis Chen',
        year: 'Junior',
        major: 'Computer Science & Psychology',
        career: 'Product Manager',
        hobbies: ['Watching shows and films', 'Legos', 'Strategy games', 'Sports'],
        profilePicture: '../assets/mentors/curtis-chen.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'hanson-nguyen': {
        id: 'hanson-nguyen',
        name: 'Hanson Nguyen',
        year: 'Senior',
        major: 'Computer Engineering',
        career: 'Software Engineer',
        hobbies: ['Coding', 'Pickleball', 'Gym', 'Cooking'],
        profilePicture: '../assets/mentors/hanson-nguyen.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'aine-keenan': {
        id: 'aine-keenan',
        name: 'Aine Keenan',
        year: 'Junior',
        major: 'Computer Science',
        career: 'Software Engineer',
        hobbies: [],
        profilePicture: '../assets/mentors/aine-keenan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'yahli-hazan': {
        id: 'yahli-hazan',
        name: 'Yahli Hazan',
        year: 'Senior',
        major: 'Computer Science & Cognitive Science',
        career: 'Founder',
        hobbies: ['Reading', 'Snowboarding', 'Guitar', 'Writing', 'Building'],
        profilePicture: '../assets/mentors/yahli-hazan.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    },
    'dorothy-balkon': {
        id: 'dorothy-balkon',
        name: 'Dorothy Balkon',
        year: 'Senior',
        major: 'Cognitive Science',
        career: 'UX Design',
        hobbies: ['Gaming', 'Music', 'Eating', 'Working out'],
        profilePicture: '../assets/mentors/dorothy-balkon.jpg',
        expressoUrl: 'https://www.expressodavis.org/dashboard'
    }
};

// Handle Enter key press for tag inputs
function handleKeyPress(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTag(type);
    }
}

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
// Create mentor card HTML
// Create mentor card HTML
// Create mentor card HTML
function createMentorCard(mentor) {
    // Debug logging
    console.log('Creating card for:', mentor.name);
    console.log('Profile Picture Path:', mentor.profilePicture);
    console.log('Full mentor object:', mentor);

    // Ensure we have arrays for hobbies
    const hobbies = mentor.hobbies || [];

    // Handle career - it might be a string or an array
    let careerInterests = [];
    if (mentor.career) {
        if (Array.isArray(mentor.career)) {
            careerInterests = mentor.career;
        } else {
            careerInterests = [mentor.career];
        }
    } else if (mentor.careerInterests) {
        careerInterests = Array.isArray(mentor.careerInterests) ? mentor.careerInterests : [mentor.careerInterests];
    }

    // Build the HTML - simplified image handling
    let cardHTML = `
        <div class="mentor-card">
            <div class="mentor-avatar">`;

    // Add image with explicit path check
    if (mentor.profilePicture) {
        console.log('Adding image with path:', mentor.profilePicture);
        cardHTML += `<img src="${mentor.profilePicture}" alt="${mentor.name}" onerror="console.error('Failed to load image:', '${mentor.profilePicture}'); this.src='../assets/default-avatar.png';">`;
    } else {
        console.log('No profile picture, using default');
        cardHTML += `<img src="../assets/default-avatar.png" alt="${mentor.name}">`;
    }

    cardHTML += `</div>
            
            <h3 class="mentor-name">${mentor.name}</h3>
            
            <div class="mentor-badges">
                <span class="badge">${mentor.year}</span>
                <span class="badge">${mentor.major}</span>
            </div>`;

    // Add Career Interests if they exist
    if (careerInterests.length > 0) {
        cardHTML += `
            <p class="section-label">Career Interests:</p>
            <div class="hobby-tags">`;

        careerInterests.forEach(career => {
            cardHTML += `<span class="hobby-tag">${career}</span>`;
        });

        cardHTML += `</div>`;
    }

    // Add Hobbies if they exist
    if (hobbies.length > 0) {
        cardHTML += `
            <p class="section-label">Hobbies:</p>
            <div class="hobby-tags">`;

        hobbies.forEach(hobby => {
            cardHTML += `<span class="hobby-tag">${hobby}</span>`;
        });

        cardHTML += `</div>`;
    }

    // Add the schedule button
    cardHTML += `
            <a href="${mentor.expressoUrl}" 
               target="_blank" 
               class="schedule-btn"
               onclick="trackMentorClick('${mentor.id}', '${mentor.name}')">
                Schedule a Coffee Chat
            </a>
        </div>`;

    console.log('Generated card HTML for', mentor.name);
    return cardHTML;
}
// Display mock results for testing
function displayMockResults() {
    console.log('📋 Displaying mock results');

    // Select 3 random mentors
    const mentorIds = Object.keys(mentorProfiles);
    const selectedMentors = [];

    for (let i = 0; i < 3 && i < mentorIds.length; i++) {
        const randomIndex = Math.floor(Math.random() * mentorIds.length);
        const mentorId = mentorIds.splice(randomIndex, 1)[0];
        selectedMentors.push(mentorProfiles[mentorId]);
    }

    displayResults(selectedMentors);
}

// Track mentor click
function trackMentorClick(mentorId, mentorName) {
    console.log(`📅 User clicked to schedule with: ${mentorName}`);

    // Send tracking data to backend
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Mentor matching initialized');

    // Add event listeners for all input fields
    ['major', 'career', 'hobbies', 'mentorship', 'industry'].forEach(type => {
        const input = document.getElementById(`${type}Input`);
        if (input) {
            // Add tag on Enter key
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag(type);
                }
            });

            // Add tag when input loses focus (blur)
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    addTag(type);
                }
            });

            console.log(`✅ Event listeners added for ${type}Input`);
        } else {
            console.error(`❌ Could not find input element: ${type}Input`);
        }
    });
});

// Export functions for global access
window.handleKeyPress = handleKeyPress;
window.addTag = addTag;
window.removeTag = removeTag;
window.submitAndFindMentors = submitAndFindMentors;
window.trackMentorClick = trackMentorClick;