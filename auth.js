// Authentication and role management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');

        if (savedUser && savedRole) {
            this.currentUser = savedUser;
            this.currentRole = savedRole;
            this.updateUI();
        } else if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    login(username, password, role) {
        // In a real application, this would validate against a server
        // For demo purposes, we accept any credentials
        this.currentUser = username || 'Пользователь';
        this.currentRole = role;

        localStorage.setItem('currentUser', this.currentUser);
        localStorage.setItem('currentRole', this.currentRole);

        this.updateUI();
        this.redirectBasedOnRole();

        return true;
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;

        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');

        window.location.href = 'login.html';
    }

    switchRole(role) {
        const roleMap = {
            'technologist': { name: 'Технолог', role: 'Технолог/Инженер' },
            'manager': { name: 'Менеджер', role: 'Менеджер производства' },
            'quality': { name: 'Специалист ОТК', role: 'Специалист ОТК' }
        };

        if (roleMap[role]) {
            this.currentUser = roleMap[role].name;
            this.currentRole = roleMap[role].role;

            localStorage.setItem('currentUser', this.currentUser);
            localStorage.setItem('currentRole', this.currentRole);

            this.updateUI();
            // Don't redirect, just update the UI
        }
    }

    updateUI() {
        const userElements = document.querySelectorAll('#currentUser');
        const roleElements = document.querySelectorAll('#currentRole');

        userElements.forEach(el => {
            if (el) el.textContent = this.currentUser;
        });

        roleElements.forEach(el => {
            if (el) el.textContent = this.currentRole;
        });

        // Update navigation based on role
        this.updateNavigation();
    }

    updateNavigation() {
        // Hide/show navigation items based on role
        const navLinks = document.querySelectorAll('.nav-link');

        if (this.currentRole === 'Менеджер производства') {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === 'operations.html' ||
                    link.getAttribute('href') === 'quality.html') {
                    link.style.display = 'none';
                }
            });
        } else if (this.currentRole === 'Специалист ОТК') {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === 'operations.html') {
                    link.style.display = 'none';
                }
            });
        }
    }

    redirectBasedOnRole() {
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }

    getCurrentRole() {
        return this.currentRole;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            authManager.login(username, password, role);
        });
    }
});

// Role switching functions (for global access)
function switchRole(role) {
    authManager.switchRole(role);
}

function logout() {
    authManager.logout();
}