// Authentication and role management
class UserDatabase {
    constructor() {
        this.users = [
            {
                id: 1,
                username: 'technologist',
                password: 'tech123',
                name: 'Иванов А.И.',
                role: 'technologist',
                displayRole: 'Технолог/Инженер'
            },
            {
                id: 2,
                username: 'manager',
                password: 'manager123',
                name: 'Петрова С.В.',
                role: 'manager',
                displayRole: 'Менеджер производства'
            },
            {
                id: 3,
                username: 'quality',
                password: 'quality123',
                name: 'Сидоров Д.К.',
                role: 'quality',
                displayRole: 'Специалист ОТК'
            },
            {
                id: 4,
                username: 'admin',
                password: 'admin123',
                name: 'Администратор',
                role: 'technologist',
                displayRole: 'Технолог/Инженер'
            }
        ];
    }

    validateUser(username, password) {
        return this.users.find(user =>
            user.username === username && user.password === password
        );
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }
}

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.userDB = new UserDatabase();
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');

        if (savedUser && savedRole) {
            this.currentUser = savedUser;
            this.currentRole = savedRole;
            this.updateUI();

            // Redirect from login page if already authenticated
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        } else if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    validateForm(username, password, role) {
        const errors = [];

        if (!username.trim()) {
            errors.push('Логин не может быть пустым');
        }

        if (!password.trim()) {
            errors.push('Пароль не может быть пустым');
        }

        if (password.length < 4) {
            errors.push('Пароль должен содержать минимум 4 символа');
        }

        if (!role) {
            errors.push('Необходимо выбрать роль');
        }

        return errors;
    }

    login(username, password, role) {
        // Client-side validation
        const validationErrors = this.validateForm(username, password, role);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => {
                this.showError(error);
            });
            return false;
        }

        // Server-side validation (against mock database)
        const user = this.userDB.validateUser(username, password);
        if (!user) {
            this.showError('Неверный логин или пароль');
            return false;
        }

        // Check if selected role matches user's actual role
        if (user.role !== role) {
            this.showError('Выбранная роль не соответствует вашему профилю');
            return false;
        }

        // Successful login
        this.currentUser = user.name;
        this.currentRole = user.displayRole;

        localStorage.setItem('currentUser', this.currentUser);
        localStorage.setItem('currentRole', this.currentRole);
        localStorage.setItem('userRole', user.role);

        this.updateUI();
        this.redirectBasedOnRole();

        this.showSuccess(`Добро пожаловать, ${user.name}!`);
        return true;
    }

    logout() {
        const userName = this.currentUser;

        this.currentUser = null;
        this.currentRole = null;

        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');
        localStorage.removeItem('userRole');

        this.showInfo(`До свидания, ${userName}!`);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    switchRole(role) {
        // Check if user is authenticated
        if (!this.currentUser) {
            this.showError('Необходимо авторизоваться для смены роли');
            return;
        }

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
            this.showInfo(`Роль изменена на: ${this.currentRole}`);
        }
    }

    updateUI() {
        const userElements = document.querySelectorAll('#currentUser');
        const roleElements = document.querySelectorAll('#currentRole');

        userElements.forEach(el => {
            if (el) el.textContent = this.currentUser || 'Гость';
        });

        roleElements.forEach(el => {
            if (el) el.textContent = this.currentRole || 'Не авторизован';
        });

        // Update navigation based on role
        this.updateNavigation();
    }

    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentRole = localStorage.getItem('userRole');

        // Reset all navigation items first
        navLinks.forEach(link => {
            link.style.display = 'flex';
        });

        // Hide navigation items based on role
        if (currentRole === 'manager') {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === 'operations.html' ||
                    link.getAttribute('href') === 'quality.html') {
                    link.style.display = 'none';
                }
            });
        } else if (currentRole === 'quality') {
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

    // Notification methods
    showError(message) {
        this.showNotification('error', 'Ошибка', message);
    }

    showSuccess(message) {
        this.showNotification('success', 'Успех', message);
    }

    showInfo(message) {
        this.showNotification('info', 'Информация', message);
    }

    showNotification(type, title, message) {
        // Use the global showNotification function if available
        if (typeof showNotification === 'function') {
            showNotification(type, title, message);
        } else {
            // Fallback to console and alert
            console.log(`${type}: ${title} - ${message}`);
            if (type === 'error') {
                alert(`Ошибка: ${message}`);
            }
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Real-time validation
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const roleSelect = document.getElementById('role');

        [usernameInput, passwordInput, roleSelect].forEach(input => {
            if (input) {
                input.addEventListener('blur', function () {
                    validateField(this);
                });
            }
        });

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            // Validate all fields before submission
            let isValid = true;
            [usernameInput, passwordInput, roleSelect].forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                authManager.login(username, password, role);
            }
        });
    }

    function validateField(field) {
        const errorElement = document.getElementById(field.id + 'Error');

        if (!errorElement) return true;

        // Clear previous error
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        field.classList.remove('error');

        // Validate based on field type
        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        } else if (field.type === 'password' && field.value.length < 4) {
            isValid = false;
            errorMessage = 'Пароль должен содержать минимум 4 символа';
        } else if (field.type === 'text' && field.value.length < 3) {
            isValid = false;
            errorMessage = 'Логин должен содержать минимум 3 символа';
        } else if (field.tagName === 'SELECT' && !field.value) {
            isValid = false;
            errorMessage = 'Необходимо выбрать роль';
        }

        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.classList.add('error');
        }

        return isValid;
    }
});

// Role switching functions (for global access)
function switchRole(role) {
    authManager.switchRole(role);
}

function logout() {
    authManager.logout();
}