// =============================================================================
// THEME TOGGLE FUNCTIONALITY
// Handles light/dark theme switching (optional feature)
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎨 Theme toggle JavaScript loaded');

    // Check if theme toggle button exists
    const themeToggle = document.getElementById('themeToggle');

    if (!themeToggle) {
        // If no theme toggle button, just exit silently
        console.log('ℹ️ No theme toggle button found - theme switching disabled');
        return;
    }

    // Get saved theme from localStorage or default to 'light'
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on page load
    applyTheme(currentTheme);
    updateToggleButton(currentTheme);

    // Handle theme toggle button click
    themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        updateToggleButton(currentTheme);
        localStorage.setItem('theme', currentTheme);

        console.log('🎨 Theme switched to:', currentTheme);
    });

    function applyTheme(theme) {
        const root = document.documentElement;

        if (theme === 'dark') {
            // Dark theme colors
            root.style.setProperty('--bg-color', '#1a1a1a');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--card-bg', '#2d2d2d');
            root.style.setProperty('--border-color', '#404040');

            document.body.classList.add('dark-theme');
        } else {
            // Light theme colors (default)
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--border-color', '#e5e5e5');

            document.body.classList.remove('dark-theme');
        }
    }

    function updateToggleButton(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
            themeToggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        }
    }

    // Optional: Respect user's system theme preference
    function respectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Optional: Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) {
                // Only auto-switch if user hasn't manually set a theme
                const newTheme = e.matches ? 'dark' : 'light';
                applyTheme(newTheme);
                updateToggleButton(newTheme);
                currentTheme = newTheme;
            }
        });
    }

    console.log('✅ Theme toggle functionality ready');
});