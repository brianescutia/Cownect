// =============================================================================
// CLUB BOOKMARKING SYSTEM
// =============================================================================
// This file handles the "bookmark" functionality for tech clubs
// Users can click bookmark icons to save/unsave clubs they're interested in
// Note: Currently saves to browser only - Week 4 will connect to database!

// 🎯 WAIT FOR PAGE TO LOAD - Ensure bookmark icons exist before adding click handlers
document.addEventListener('DOMContentLoaded', () => {

    // 🔖 FIND ALL BOOKMARK ICONS on the page
    // Each club card has a bookmark icon that users can click
    const bookmarks = document.querySelectorAll('.bookmark');

    // 🎧 ADD CLICK LISTENERS to each bookmark icon
    bookmarks.forEach((icon) => {
        icon.addEventListener('click', () => {

            // 🎨 TOGGLE VISUAL STATE - Add or remove "bookmarked" styling
            // This changes the bookmark's appearance to show it's been saved
            // CSS class 'bookmarked' might change color, add border, etc.
            icon.classList.toggle('bookmarked');

            // 💾 FUTURE ENHANCEMENT - Database Storage
            // TODO: In Week 4, we'll add code here to:
            // 1. Send bookmark status to our backend API
            // 2. Save to user's profile in MongoDB
            // 3. Sync bookmarks across devices
            //
            // For now, bookmarks only persist during current browser session

            // 🎯 OPTIONAL: Local Storage Implementation
            // Uncomment the code below if you want bookmarks to persist between browser sessions
            // You would need to give each club a unique ID for this to work properly

            /*
            // Get the club name or ID to use as storage key
            const clubCard = icon.closest('.club-card');
            const clubName = clubCard.querySelector('.club-name').textContent;
            
            // Check current bookmark status
            const isBookmarked = icon.classList.contains('bookmarked');
            
            // Save to localStorage (survives browser restarts)
            if (isBookmarked) {
                localStorage.setItem(`bookmark_${clubName}`, 'true');
                console.log(`Bookmarked: ${clubName}`);
            } else {
                localStorage.removeItem(`bookmark_${clubName}`);
                console.log(`Removed bookmark: ${clubName}`);
            }
            */
        });
    });

    // 🔄 OPTIONAL: Restore Bookmarks from Local Storage
    // This would run on page load to restore previously saved bookmarks
    /*
    bookmarks.forEach((icon) => {
        const clubCard = icon.closest('.club-card');
        const clubName = clubCard.querySelector('.club-name').textContent;
        
        // Check if this club was previously bookmarked
        const wasBookmarked = localStorage.getItem(`bookmark_${clubName}`) === 'true';
        
        if (wasBookmarked) {
            icon.classList.add('bookmarked');
        }
    });
    */
});

// =============================================================================
// HOW THIS WORKS - User Interaction Flow:
// =============================================================================
//
// 1. Page loads -> Find all bookmark icons
// 2. User clicks bookmark icon on "AI Student Collective" card
// 3. Toggle 'bookmarked' class -> Changes visual appearance
// 4. (Future) Send API request to save in user's profile
// 5. User navigates away and comes back -> Bookmarks restored from database
//
// =============================================================================
// WEEK 4 ENHANCEMENT PREVIEW:
// =============================================================================
// When we connect this to the backend, the click handler will become:
//
// icon.addEventListener('click', async () => {
//     const clubId = icon.dataset.clubId;
//     const isBookmarked = icon.classList.contains('bookmarked');
//     
//     try {
//         const response = await fetch('/api/bookmarks', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ clubId, bookmarked: !isBookmarked })
//         });
//         
//         if (response.ok) {
//             icon.classList.toggle('bookmarked');
//         }
//     } catch (error) {
//         console.error('Bookmark error:', error);
//     }
// });
//
// =============================================================================