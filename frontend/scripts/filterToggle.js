document.addEventListener('DOMContentLoaded', () => {
    const filterIcon = document.getElementById('filterToggle');
    const filterTags = document.getElementById('filterTags');

    filterIcon.addEventListener('click', () => {
        filterTags.classList.toggle('hidden');
    });
});
