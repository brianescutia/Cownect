document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.tag');
    const clubCards = document.querySelectorAll('.club-card');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const clickedTag = tag.textContent.toLowerCase();

            clubCards.forEach(card => {
                const cardTags = card.querySelector('.club-tags').textContent.toLowerCase();

                if (cardTags.includes(clickedTag)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
