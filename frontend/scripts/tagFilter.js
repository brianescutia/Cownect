// =============================================================================
// TAG-BASED CLUB FILTERING SYSTEM
// =============================================================================
// This file enables users to filter tech clubs by clicking on tag buttons
// Example: Click "#AI" tag -> Show only clubs that have AI-related content

// 🎯 WAIT FOR PAGE TO LOAD - Ensure all HTML elements are ready
document.addEventListener('DOMContentLoaded', () => {

    // 🏷️ FIND ALL FILTER TAGS - These are the clickable tag buttons
    // Example tags: "#AI", "#hardware", "#design", "#software", "#webdev"
    const tags = document.querySelectorAll('.tag');

    // 🎴 FIND ALL CLUB CARDS - These are what we'll show/hide based on tag selection
    const clubCards = document.querySelectorAll('.club-card');

    // 🎧 ADD CLICK LISTENERS to each tag button
    tags.forEach(tag => {
        tag.addEventListener('click', () => {

            // 📝 GET THE CLICKED TAG TEXT
            // Extract tag name and convert to lowercase for comparison
            // "#AI" becomes "#ai", "#WebDev" becomes "#webdev"
            const clickedTag = tag.textContent.toLowerCase();

            // 🔄 LOOP THROUGH EACH CLUB CARD to check if it matches the filter
            clubCards.forEach(card => {

                // 🏷️ GET THIS CARD'S TAGS
                // Find the tags section in each club card
                // Example: "#software #webdev #collaboration" -> "#software #webdev #collaboration"
                const cardTags = card.querySelector('.club-tags').textContent.toLowerCase();

                // 🎯 CHECK IF CARD'S TAGS INCLUDE THE CLICKED TAG
                // Uses .includes() to see if the clicked tag appears in the card's tag list
                // Example: 
                // - Clicked tag: "#ai"
                // - Card tags: "#ai #ml #python" 
                // - Result: true ✅ (show this card)
                if (cardTags.includes(clickedTag)) {
                    card.style.display = 'flex';  // Show the card (maintains layout)
                } else {
                    card.style.display = 'none';  // Hide the card completely
                }
            });
        });
    });
});

// =============================================================================
// HOW THIS WORKS - Example User Flow:
// =============================================================================
//
// 1. Page loads showing all clubs
// 2. User clicks "#AI" tag button
// 3. clickedTag becomes "#ai"
// 4. For each club card:
//    
//    Card 1: "AI Student Collective"
//    - Tags: "#ai #ml #python" 
//    - Contains "#ai"? YES ✅
//    - Action: Show card
//    
//    Card 2: "#include"  
//    - Tags: "#software #webdev #collaboration"
//    - Contains "#ai"? NO ❌
//    - Action: Hide card
//    
//    Card 3: "Aggie Sports Analytics"
//    - Tags: "#design #ux #figma"
//    - Contains "#ai"? NO ❌  
//    - Action: Hide card
//
// 5. Result: Only AI-related clubs are visible!
//
// =============================================================================
// FUTURE ENHANCEMENTS (Week 3-4):
// =============================================================================
//
// 🔄 Multiple Tag Selection:
// - Allow users to select multiple tags simultaneously
// - Show clubs that match ANY selected tag (OR logic)
// - Or show clubs that match ALL selected tags (AND logic)
//
// 🎨 Visual Feedback:
// - Highlight selected tag buttons
// - Show count of filtered results
// - Add "Clear Filters" button
//
// 💾 State Persistence:
// - Remember selected filters when user navigates away
// - URL parameters to share filtered views
//
// Example enhanced version:
// ```javascript
// let selectedTags = [];
// 
// tag.addEventListener('click', () => {
//     const tagText = tag.textContent.toLowerCase();
//     
//     if (selectedTags.includes(tagText)) {
//         selectedTags = selectedTags.filter(t => t !== tagText);
//         tag.classList.remove('active');
//     } else {
//         selectedTags.push(tagText);
//         tag.classList.add('active');
//     }
//     
//     filterClubs(selectedTags);
// });
// ```
//
// =============================================================================