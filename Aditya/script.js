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

// Countdown timer for registration
function updateTimer() {
    const targetDate = new Date("March 6, 2025 00:39:11").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('timer').innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s ${distance > 0 ? '<a href="#">Register now</a>' : 'Registration Closed'}`;

    if (distance < 0) {
        clearInterval(timer);
    }
}

const timer = setInterval(updateTimer, 1000);
updateTimer();

// Initialize sidebar sections as collapsed
document.querySelectorAll('.sidebar-item .content').forEach(content => {
    content.style.display = 'none';
});

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message !== '') {
        const chatMessages = document.getElementById('chatMessages');
        const newMessage = document.createElement('p');
        newMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message
        input.value = '';
    }
}

// Theme toggling
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Dynamic theme based on time
function setDynamicTheme() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load saved theme or set dynamic theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
} else {
    setDynamicTheme();
}

// Add event listener for Enter key in chat input
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});