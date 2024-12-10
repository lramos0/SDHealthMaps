var usercounter = 0

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:30000/api/visit-count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-counter').textContent = `Current Users: ${data.visits}`;
        })
        .catch(error => console.error('Error fetching visit count:', error));
})
