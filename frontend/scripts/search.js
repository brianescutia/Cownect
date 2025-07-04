document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('clubSearch');
    const clubCards = document.querySelectorAll('.club-card');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        clubCards.forEach(card => {
            const name = card.querySelector('.club-name').textContent.toLowerCase();
            const description = card.querySelector('.club-description').textContent.toLowerCase();
            const tags = card.querySelector('.club-tags').textContent.toLowerCase();

            const matches = name.includes(query) || description.includes(query) || tags.includes(query);

            card.style.display = matches ? 'flex' : 'none';
        });
    });
});
