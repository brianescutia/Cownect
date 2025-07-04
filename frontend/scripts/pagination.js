document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.club-card'));
    const paginationButtons = document.querySelectorAll('.pagination button');
    const cardsPerPage = 6;

    function showPage(pageIndex) {
        const start = pageIndex * cardsPerPage;
        cards.forEach((card, i) => {
            card.style.display = (i >= start && i < start + cardsPerPage) ? 'block' : 'none';
        });
        paginationButtons.forEach(btn => btn.classList.remove('active'));
        paginationButtons[pageIndex + 1]?.classList.add('active');
    }

    paginationButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            if (idx === 0) return showPage(0); // « go to first
            if (idx === paginationButtons.length - 1) return showPage(paginationButtons.length - 2); // »
            showPage(idx - 1);
        });
    });

    showPage(0); // initialize on page 1
});
