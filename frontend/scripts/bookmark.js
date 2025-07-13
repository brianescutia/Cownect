document.addEventListener('DOMContentLoaded', () => {
    const bookmarks = document.querySelectorAll('.bookmark');

    bookmarks.forEach((icon) => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('bookmarked');

            // Optional: store bookmarked state in localStorage
            // You can give each club a unique ID if needed
        });
    });
});
