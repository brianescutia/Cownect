// =============================================================================
// REAL-TIME CLUB SEARCH FUNCTIONALITY
// =============================================================================
// This file enables users to search through tech clubs in real-time
// As they type, results are filtered instantly without page reload

//  WAIT FOR PAGE TO LOAD - Ensure all HTML elements exist before we try to use them
document.addEventListener('DOMContentLoaded', () => {

    //  GET SEARCH ELEMENTS
    // Find the search input box in the HTML
    const searchInput = document.getElementById('clubSearch');

    // Find all club cards on the page - these are what we'll show/hide
    const clubCards = document.querySelectorAll('.club-card');

    //  LISTEN FOR USER TYPING - 'input' event fires every time user types/deletes
    searchInput.addEventListener('input', () => {

        //  GET SEARCH QUERY
        // Convert to lowercase for case-insensitive searching
        // "AI Student" becomes "ai student"
        const query = searchInput.value.toLowerCase();

        // LOOP THROUGH EACH CLUB CARD
        clubCards.forEach(card => {

            // EXTRACT SEARCHABLE TEXT from each card
            // Get club name: "#include" -> "#include"
            const name = card.querySelector('.club-name').textContent.toLowerCase();

            // Get description: "Build real-world coding projects..." -> "build real-world coding projects..."
            const description = card.querySelector('.club-description').textContent.toLowerCase();

            // Get tags: "#software #webdev #collaboration" -> "#software #webdev #collaboration"
            const tags = card.querySelector('.club-tags').textContent.toLowerCase();

            // CHECK IF QUERY MATCHES ANY SEARCHABLE CONTENT
            // Uses .includes() to check if search term appears anywhere in the text
            // Example: searching "ai" will match:
            // - Name: "AI Student Collective" ✅
            // - Description: "machine learning and AI" ✅  
            // - Tags: "#AI #ML" ✅
            const matches = name.includes(query) ||
                description.includes(query) ||
                tags.includes(query);

            // SHOW OR HIDE THE CARD based on search results
            // If matches = true: show the card (display: 'flex' maintains card layout)
            // If matches = false: hide the card (display: 'none' removes from view)
            card.style.display = matches ? 'flex' : 'none';
        });
    });
});

// =============================================================================
// HOW THIS WORKS - Step by Step Example:
// =============================================================================
//
// 1. User loads page -> DOMContentLoaded fires
// 2. We find the search box and all club cards
// 3. User types "web" in search box -> 'input' event fires
// 4. We convert "web" to lowercase -> "web"
// 5. For each club card:
//    - Check name: "#include" -> doesn't contain "web"
//    - Check description: "build real-world coding projects" -> doesn't contain "web"  
//    - Check tags: "#software #webdev #collaboration" -> contains "web"! ✅
//    - Result: Show this card
// 6. Cards that don't match get hidden
// 7. User sees only relevant results instantly!
//
// =============================================================================