// =============================================================================
// LOGIN & SIGNUP JAVASCRIPT
// Handles form submissions for both login and signup pages
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔐 Login/Signup JavaScript loaded');

    // Determine which page we're on
    const isSignupPage = window.location.pathname.includes('signup');
    const isLoginPage = window.location.pathname.includes('login');

    console.log('📍 Page detected:', isSignupPage ? 'Signup' : 'Login');

    // Get form element
    const form = document.getElementById('loginForm') || document.getElementById('signupForm');

    if (!form) {
        console.error('❌ No form found on page');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        console.log('📝 Form submitted');

        // Get form data
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validation
        if (!email || !password) {
            showMessage('❌ Please fill in all fields', 'error');
            return;
        }

        if (!email.endsWith('@ucdavis.edu')) {
            showMessage('❌ Please use your UC Davis email address', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('❌ Password must be at least 6 characters', 'error');
            return;
        }

        // Show loading state
        showLoading(true);
        clearMessages();

        try {
            // Determine endpoint based on page
            const endpoint = isSignupPage ? '/signup' : '/login';
            console.log('🌐 Submitting to:', endpoint);

            // Submit form data
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('📡 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Success response:', data);

                if (isSignupPage) {
                    // Signup success - show message and redirect to verification
                    showMessage('✅ Account created! Please check your email for verification.', 'success');

                    // Redirect to verification page after 2 seconds
                    setTimeout(() => {
                        if (data.redirectTo) {
                            window.location.href = data.redirectTo;
                        } else {
                            window.location.href = `/verify-email-prompt?email=${encodeURIComponent(email)}`;
                        }
                    }, 2000);
                } else {
                    // Login success - redirect to main app
                    showMessage('✅ Login successful! Redirecting...', 'success');

                    setTimeout(() => {
                        window.location.href = '/tech-clubs';
                    }, 1000);
                }
            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('❌ Error response:', errorData);

                let errorMessage = errorData.error || 'An error occurred';

                // Handle specific error cases
                if (response.status === 409 && isSignupPage) {
                    errorMessage = 'An account with this email already exists';
                    // Optionally redirect to login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else if (response.status === 400) {
                    // Validation errors
                    if (errorMessage.includes('UC Davis')) {
                        errorMessage = 'Please use your UC Davis email address (@ucdavis.edu)';
                    }
                }

                showMessage('❌ ' + errorMessage, 'error');
            }
        } catch (error) {
            console.error('💥 Network error:', error);
            showMessage('❌ Network error. Please check your connection and try again.', 'error');
        } finally {
            showLoading(false);
        }
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

        // Auto-hide after 5 seconds for non-critical messages
        if (type === 'error' && !message.includes('check your email')) {
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

    // Handle "Forgot Password" link (if present)
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Forgot password feature coming soon! Please contact support for now.');
        });
    }

    // Auto-focus email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
    }

    // Add UC Davis email validation on blur
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !email.endsWith('@ucdavis.edu')) {
                showMessage('⚠️ Please use your UC Davis email address', 'error');
            }
        });
    }
});

// =============================================================================
// GLOBAL ERROR HANDLER
// =============================================================================
window.addEventListener('error', function (e) {
    console.error('💥 JavaScript error:', e.error);
});

console.log('✅ Login/Signup JavaScript fully loaded');