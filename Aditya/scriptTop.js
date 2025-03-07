// Toggle sidebar sections
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = content.previousElementSibling.querySelector('i');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Search functionality (placeholder)
function search() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        alert(`Searching for: ${query}`); // Replace with actual search logic
    }
}

// Find user functionality (placeholder)
function findUser() {
    const handle = document.getElementById('userHandle').value;
    if (handle.trim() !== '') {
        alert(`Finding user: ${handle}`); // Replace with actual user search logic
    }
}

// Initialize sidebar sections as collapsed
document.querySelectorAll('.sidebar-item .content').forEach(content => {
    content.style.display = 'none';
});