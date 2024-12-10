// Wait for the DOM to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const collapsibleButtons = document.querySelectorAll(".collapsible-button");

    collapsibleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling; // Get the corresponding collapsible content

            // Toggle visibility of the content
            if (content.style.display === "block") {
                content.style.display = "none"; // Collapse the content
            } else {
                content.style.display = "block"; // Expand the content
            }
        });
    });
});
