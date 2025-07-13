// =============================================================================
// FILTER TOGGLE FUNCTIONALITY
// =============================================================================
// This file controls the visibility of the filter tags section
// Users click the filter icon to show/hide tag buttons for a cleaner interface

// 🎯 WAIT FOR PAGE TO LOAD - Ensure DOM elements are ready
document.addEventListener('DOMContentLoaded', () => {

    // 🔍 FIND FILTER CONTROLS
    // The filter icon/button that users click (usually next to search bar)
    const filterIcon = document.getElementById('filterToggle');

    // The container holding all the filter tag buttons
    // This is what gets shown/hidden when user clicks the filter icon
    const filterTags = document.getElementById('filterTags');

    // 🎧 ADD CLICK LISTENER to filter icon
    filterIcon.addEventListener('click', () => {

        // 🎨 TOGGLE VISIBILITY using CSS classes
        // .toggle() method adds class if it's missing, removes if it's present
        // 
        // CSS class 'hidden' typically has: display: none; or visibility: hidden;
        // 
        // State transitions:
        // - Click 1: filterTags has no 'hidden' class -> Add 'hidden' -> Hide tags
        // - Click 2: filterTags has 'hidden' class -> Remove 'hidden' -> Show tags
        filterTags.classList.toggle('hidden');

        // 💡 ALTERNATIVE IMPLEMENTATION using direct style manipulation:
        // if (filterTags.style.display === 'none' || filterTags.style.display === '') {
        //     filterTags.style.display = 'flex';  // Show filter tags
        // } else {
        //     filterTags.style.display = 'none';  // Hide filter tags  
        // }
    });
});

// =============================================================================
// HOW THIS WORKS - User Experience Flow:
// =============================================================================
//
// INITIAL STATE:
// - Filter tags are hidden (have 'hidden' class)
// - User sees clean search bar without cluttered tag buttons
//
// USER CLICKS FILTER ICON:
// 1. Click event fires
// 2. classList.toggle('hidden') runs
// 3. 'hidden' class is removed from filterTags
// 4. CSS reveals the tag buttons
// 5. User can now click tags to filter clubs
//
// USER CLICKS FILTER ICON AGAIN:
// 1. Click event fires again  
// 2. classList.toggle('hidden') runs
// 3. 'hidden' class is added back to filterTags
// 4. CSS hides the tag buttons
// 5. Interface returns to clean state
//
// =============================================================================
// CSS INTEGRATION:
// =============================================================================
// This JavaScript works with CSS like this:
//
// ```css
// .filter-tags {
//     display: flex;
//     gap: 0.5rem;
//     /* Other styling for visible state */
// }
//
// .filter-tags.hidden {
//     display: none;
//     /* Or: visibility: hidden; opacity: 0; etc. */
// }
// ```
//
// =============================================================================
// ACCESSIBILITY CONSIDERATIONS:
// =============================================================================
// For better accessibility, you could enhance this with:
//
// ```javascript
// filterIcon.addEventListener('click', () => {
//     const isHidden = filterTags.classList.contains('hidden');
//     
//     filterTags.classList.toggle('hidden');
//     
//     // Update ARIA attributes for screen readers
//     filterIcon.setAttribute('aria-expanded', !isHidden);
//     filterTags.setAttribute('aria-hidden', !isHidden);
//     
//     // Update button text or icon
//     filterIcon.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
// });
// ```
//
// =============================================================================
// FUTURE ENHANCEMENTS:
// =============================================================================
//
// 🎨 Smooth Animations:
// - CSS transitions for smooth show/hide
// - Slide down/up animations
// - Fade in/out effects
//
// 💾 State Persistence:
// - Remember user's preference (show/hide filters)
// - Save to localStorage
// - Restore state on page reload
//
// 📱 Responsive Behavior:
// - Auto-hide filters on mobile for space
// - Different toggle behavior on different screen sizes
//
// Example with animation:
// ```css
// .filter-tags {
//     max-height: 200px;
//     overflow: hidden;
//     transition: max-height 0.3s ease;
// }
//
// .filter-tags.hidden {
//     max-height: 0;
// }
// ```
//
// =============================================================================