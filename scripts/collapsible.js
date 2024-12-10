// Wait for the DOM to fully load before adding event listeners
document.querySelectorAll('.collapsible-button').forEach(button => {
    button.addEventListener('click', function() {
        const collapsible = this.closest('.collapsible');
        collapsible.classList.toggle('active'); // Toggle the active class

        const content = collapsible.querySelector('.collapsible-content');
        if (content.style.display === 'block') {
            content.style.display = 'none'; // Hide content
        } else {
            content.style.display = 'block'; // Show content
        }
    });
});

