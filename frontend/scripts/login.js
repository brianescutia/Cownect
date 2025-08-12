// =============================================================================
// SIMPLE LOGIN & SIGNUP JAVASCRIPT
// Adds validation and loading states, but lets forms submit normally
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔐 Login/Signup JavaScript loaded');

    // Determine which page we're on
    const isSignupPage = window.location.pathname.includes('signup');

    console.log('📍 Page detected:', isSignupPage ? 'Signup' : 'Login');

    // Get form element
    const form = document.getElementById('loginForm') || document.getElementById('signupForm');

    if (!form) {
        console.error('❌ No form found on page');
        return;
    }

    // Add form validation before submission
    form.addEventListener('submit', function (e) {
        console.log('📝 Form submitted');

        // Get form data
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;

        // Clear any existing messages
        clearMessages();

        // Basic validation
        if (!email || !password) {
            e.preventDefault();
            showMessage('❌ Please fill in all fields', 'error');
            return false;
        }

        if (!email.endsWith('@ucdavis.edu')) {
            e.preventDefault();
            showMessage('❌ Please use your UC Davis email address (@ucdavis.edu)', 'error');
            return false;
        }

        if (password.length < 6) {
            e.preventDefault();
            showMessage('❌ Password must be at least 6 characters', 'error');
            return false;
        }

        // Show loading state
        showLoading(true);

        // Let the form submit normally to your backend
        console.log('✅ Validation passed, submitting form normally');
        return true;
    });

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================

    function showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Clear existing messages
        messageContainer.innerHTML = '';
        messageContainer.appendChild(messageDiv);

        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        }
    }

    function clearMessages() {
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
    }

    function showLoading(show) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        if (show) {
            submitButton.disabled = true;
            submitButton.textContent = isSignupPage ? 'Creating Account...' : 'Signing In...';
            submitButton.style.opacity = '0.7';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = isSignupPage ? 'Sign up' : 'Sign in';
            submitButton.style.opacity = '1';
        }
    }

    // =============================================================================
    // ADDITIONAL FEATURES
    // =============================================================================

    // Auto-focus email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
    }

    // Add real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !email.endsWith('@ucdavis.edu')) {
                showMessage('⚠️ Please use your UC Davis email address', 'error');
            } else if (email && email.endsWith('@ucdavis.edu')) {
                clearMessages();
            }
        });
    }

    // Handle "Forgot Password" link (if present)
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Forgot password feature coming soon! Please contact support for assistance.');
        });
    }

    console.log('✅ Login/Signup JavaScript ready');
});

// =============================================================================
// GLOBAL ERROR HANDLER
// =============================================================================
window.addEventListener('error', function (e) {
    console.error('💥 JavaScript error:', e.error);
});