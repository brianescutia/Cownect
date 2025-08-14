// =============================================================================
// ENHANCED PROFILE PAGE FUNCTIONALITY
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Enhanced profile page loaded');

    // Check for pending updates from modal
    handlePendingModalUpdates();

    initializeProfileForm();
    loadUserProfile();
    setupEventListeners();
});

// =============================================================================
// FORM INITIALIZATION
// =============================================================================

function initializeProfileForm() {
    // Character counter for bio
    const bioTextarea = document.getElementById('bio');
    const bioCounter = document.getElementById('bioCount');

    if (bioTextarea && bioCounter) {
        bioTextarea.addEventListener('input', () => {
            const count = bioTextarea.value.length;
            bioCounter.textContent = count;

            // Change color when approaching limit
            if (count > 450) {
                bioCounter.style.color = '#e74c3c';
            } else if (count > 400) {
                bioCounter.style.color = '#f39c12';
            } else {
                bioCounter.style.color = '#6c757d';
            }
        });
    }

    // Update profile initials when name changes
    const nameInput = document.getElementById('fullName');
    const profileInitials = document.getElementById('profileInitials');
    const navbarInitials = document.getElementById('navbarProfileInitials');

    if (nameInput && profileInitials) {
        nameInput.addEventListener('input', () => {
            const initials = getInitials(nameInput.value);
            profileInitials.textContent = initials;
            if (navbarInitials) {
                navbarInitials.textContent = initials;
            }
        });
    }
}

// =============================================================================
// LOAD USER PROFILE DATA
// =============================================================================

async function loadUserProfile() {
    try {
        console.log('📥 Loading user profile...');

        // Replace with actual API call
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            populateForm(userData);
        } else {
            console.log('ℹ️ No existing profile found, using defaults');
            setDefaultValues();
        }
    } catch (error) {
        console.error('❌ Error loading profile:', error);
        setDefaultValues();
    }
}

function populateForm(userData) {
    // Populate form fields with user data
    const fields = {
        'fullName': userData.fullName || '',
        'year': userData.year || '',
        'major': userData.major || '',
        'bio': userData.bio || '',
        'hobbies': userData.hobbies || '',
        'linkedinUrl': userData.linkedinUrl || ''
    };

    Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value;
        }
    });

    // Update initials
    updateProfileInitials(userData.fullName || 'John Doe');

    // Update bio counter
    const bioTextarea = document.getElementById('bio');
    const bioCounter = document.getElementById('bioCount');
    if (bioTextarea && bioCounter) {
        bioCounter.textContent = bioTextarea.value.length;
    }

    console.log('✅ Profile data loaded');
}

function setDefaultValues() {
    // Set default values for new users
    updateProfileInitials('John Doe');
    document.getElementById('fullName').value = '';
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

function setupEventListeners() {
    // Form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleFormSubmit);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }

    // Profile picture change
    const changePictureBtn = document.getElementById('changePictureBtn');
    const pictureInput = document.getElementById('profilePictureInput');

    if (changePictureBtn && pictureInput) {
        changePictureBtn.addEventListener('click', () => {
            pictureInput.click();
        });

        pictureInput.addEventListener('change', handleProfilePictureChange);
    }

    // Real-time validation
    setupFormValidation();
}

// =============================================================================
// FORM SUBMISSION
// =============================================================================

async function handleFormSubmit(e) {
    e.preventDefault();

    console.log('💾 Saving profile...');

    const formData = new FormData(e.target);
    const profileData = Object.fromEntries(formData.entries());

    // Validate form
    if (!validateForm(profileData)) {
        console.log('❌ Form validation failed');
        return;
    }

    try {
        showSaveButton('Saving...', true);

        // Replace with actual API call
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            showSuccessMessage('Profile updated successfully!');
            console.log('✅ Profile saved successfully');
        } else {
            throw new Error('Failed to save profile');
        }
    } catch (error) {
        console.error('❌ Error saving profile:', error);
        showErrorMessage('Failed to save profile. Please try again.');
    } finally {
        showSaveButton('Save Changes', false);
    }
}

// =============================================================================
// FORM VALIDATION
// =============================================================================

function validateForm(data) {
    let isValid = true;

    // Clear previous errors
    clearValidationErrors();

    // Required fields
    const requiredFields = {
        'fullName': 'Full name is required',
        'year': 'Please select your year',
        'major': 'Please select your major'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, message);
            isValid = false;
        }
    });

    // LinkedIn URL validation
    if (data.linkedinUrl && !isValidLinkedInUrl(data.linkedinUrl)) {
        showFieldError('linkedinUrl', 'Please enter a valid LinkedIn URL');
        isValid = false;
    }

    // Bio length validation
    if (data.bio && data.bio.length > 500) {
        showFieldError('bio', 'Bio must be 500 characters or less');
        isValid = false;
    }

    return isValid;
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            clearFieldError(input.id);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field.id, `${field.labels[0].textContent} is required`);
        return false;
    }

    // Specific field validations
    if (field.id === 'linkedinUrl' && value && !isValidLinkedInUrl(value)) {
        showFieldError(field.id, 'Please enter a valid LinkedIn URL');
        return false;
    }

    // Mark as valid
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getInitials(name) {
    if (!name) return 'JD';

    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function updateProfileInitials(name) {
    const initials = getInitials(name);
    const profileInitials = document.getElementById('profileInitials');
    const navbarInitials = document.getElementById('navbarProfileInitials');

    if (profileInitials) profileInitials.textContent = initials;
    if (navbarInitials) navbarInitials.textContent = initials;
}

function isValidLinkedInUrl(url) {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedinPattern.test(url);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');
    field.classList.remove('success');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement('small');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearValidationErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showSaveButton(text, disabled) {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.textContent = text;
        saveBtn.disabled = disabled;
    }
}

function showSuccessMessage(message) {
    // Create and show success toast
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showErrorMessage(message) {
    // Create and show error toast
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
    `;

    return toast;
}

// =============================================================================
// OTHER HANDLERS
// =============================================================================

function handleCancel() {
    if (confirm('Are you sure you want to discard your changes?')) {
        loadUserProfile(); // Reload original data
    }
}

function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
        const profileCircle = document.getElementById('profileCircle');
        profileCircle.style.backgroundImage = `url(${e.target.result})`;
        profileCircle.style.backgroundSize = 'cover';
        profileCircle.style.backgroundPosition = 'center';
        profileCircle.innerHTML = ''; // Hide initials
    };
    reader.readAsDataURL(file);

    console.log('📸 Profile picture updated');
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);