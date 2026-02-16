const API_URL = 'http://localhost:5000/api';

// Helper for Fetch API
async function fetchClient(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Auth State
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return { token, user };
}

function updateNav() {
    const { user } = checkAuth();
    const navContainer = document.getElementById('nav-links');

    if (user) {
        let dashboardLink = '/dashboard-user.html';
        if (user.role === 'host') dashboardLink = '/dashboard-host.html';
        if (user.role === 'admin') dashboardLink = '/dashboard-admin.html';

        navContainer.innerHTML = `
      <li><a href="adventure-listing.html">Adventures</a></li>
      <li><a href="${dashboardLink}">Dashboard</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `;

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    } else {
        navContainer.innerHTML = `
      <li><a href="adventure-listing.html">Adventures</a></li>
      <li><a href="login.html">Login</a></li>
      <li><a href="register.html" class="btn">Register</a></li>
    `;
    }
}

// Common Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
});
