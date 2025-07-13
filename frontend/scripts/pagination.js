// =============================================================================
// CLUB CARDS PAGINATION SYSTEM
// =============================================================================
// This file handles splitting club cards into pages for better user experience
// Instead of showing 50+ clubs at once, we show 6 per page with navigation

// 🎯 WAIT FOR PAGE TO LOAD - Ensure all elements exist before manipulation
document.addEventListener('DOMContentLoaded', () => {

    // 🎴 GET ALL CLUB CARDS and convert to array for easier manipulation
    // Array.from() converts NodeList to Array so we can use array methods
    const cards = Array.from(document.querySelectorAll('.club-card'));

    // 🔢 FIND PAGINATION BUTTONS - These handle page navigation
    // Typically: [«] [1] [2] [3] [»] buttons at bottom of page
    const paginationButtons = document.querySelectorAll('.pagination button');

    // ⚙️ PAGINATION CONFIGURATION
    const cardsPerPage = 6;  // Show 6 clubs per page (2 rows of 3 in grid)

    // =============================================================================
    // SHOW PAGE FUNCTION - Display specific page of clubs
    // =============================================================================
    function showPage(pageIndex) {
        // 📊 CALCULATE WHICH CARDS TO SHOW
        // Page 0: cards 0-5 (start = 0)
        // Page 1: cards 6-11 (start = 6)  
        // Page 2: cards 12-17 (start = 12)
        const start = pageIndex * cardsPerPage;

        // 🔄 LOOP THROUGH ALL CARDS and show/hide based on page
        cards.forEach((card, i) => {
            // Check if this card's index falls within current page range
            // Example for Page 1 (pageIndex = 1):
            // - start = 6
            // - Card index 6: 6 >= 6 AND 6 < 12 -> Show ✅
            // - Card index 5: 5 >= 6 -> Hide ❌
            // - Card index 12: 12 >= 6 AND 12 < 12 -> Hide ❌
            if (i >= start && i < start + cardsPerPage) {
                card.style.display = 'block';  // Show this card
            } else {
                card.style.display = 'none';   // Hide this card
            }
        });

        // 🎨 UPDATE ACTIVE BUTTON STYLING
        // Remove 'active' class from all buttons
        paginationButtons.forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to current page button
        // pageIndex + 1 because button array includes « and » buttons
        // pageIndex 0 -> button index 1 (skip « button)
        paginationButtons[pageIndex + 1]?.classList.add('active');
    }

    // =============================================================================
    // PAGINATION BUTTON EVENT LISTENERS
    // =============================================================================
    paginationButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {

            // 🏠 HANDLE SPECIAL NAVIGATION BUTTONS

            // First button is « (go to first page)
            if (idx === 0) {
                return showPage(0);
            }

            // Last button is » (go to last page)
            if (idx === paginationButtons.length - 1) {
                // Calculate last page index based on total cards
                const lastPageIndex = Math.ceil(cards.length / cardsPerPage) - 1;
                return showPage(lastPageIndex);
            }

            // 🔢 HANDLE NUMBERED PAGE BUTTONS
            // Button index 1 = Page 0, Button index 2 = Page 1, etc.
            // Subtract 1 to convert button index to page index
            showPage(idx - 1);
        });
    });

    // 🚀 INITIALIZE - Show first page when page loads
    showPage(0);
});

// =============================================================================
// HOW THIS WORKS - Example with 20 Total Cards:
// =============================================================================
//
// Total Cards: 20
// Cards Per Page: 6
// Total Pages: Math.ceil(20/6) = 4 pages
//
// Page Distribution:
// - Page 0: Cards 0-5   (6 cards)
// - Page 1: Cards 6-11  (6 cards) 
// - Page 2: Cards 12-17 (6 cards)
// - Page 3: Cards 18-19 (2 cards)
//
// Button Layout: [«] [1] [2] [3] [4] [»]
// Button Indices: 0   1   2   3   4   5
//
// When user clicks button index 2 (page "2"):
// - showPage(1) is called (2-1=1)
// - start = 1 * 6 = 6
// - Shows cards 6,7,8,9,10,11
// - Hides all other cards
// - Button index 2 gets 'active' class
//
// =============================================================================
// INTEGRATION WITH SEARCH & FILTERS:
// =============================================================================
// 
// ⚠️ NOTE: This pagination works on ALL cards, even hidden ones
// If user searches "AI" and 3 cards match, pagination still shows original pages
// 
// Future enhancement would be:
// 1. Get visible cards only: const visibleCards = cards.filter(card => card.style.display !== 'none')
// 2. Paginate visible cards instead of all cards
// 3. Update pagination buttons to match filtered results
//
// Enhanced integration example:
// ```javascript
// function updatePagination() {
//     const visibleCards = cards.filter(card => card.style.display !== 'none');
//     const totalPages = Math.ceil(visibleCards.length / cardsPerPage);
//     // Update pagination buttons based on visible cards
//     // Re-initialize pagination with filtered results
// }
// ```
//
// =============================================================================