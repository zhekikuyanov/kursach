// Notification system

class NotificationManager {
    constructor() {
        this.notificationCount = 0;
        this.init();
    }

    init() {
        // Simulate some initial notifications
        setTimeout(() => {
            this.showInitialNotifications();
        }, 2000);

        // Simulate random notifications
        setInterval(() => {
            this.showRandomNotification();
        }, 30000); // Every 30 seconds
    }

    showInitialNotifications() {
        showNotification(
            'info',
            'Система запущена',
            'Производственная система Milar EMS успешно инициализирована'
        );

        // Show critical parameter warning with 50% chance
        if (Math.random() > 0.5) {
            setTimeout(() => {
                showNotification(
                    'warning',
                    'Параметр близок к границе',
                    'Температура пайки приближается к верхнему пределу'
                );
            }, 3000);
        }
    }

    showRandomNotification() {
        const notifications = [
            {
                type: 'info',
                title: 'Заказ завершен',
                message: 'Заказ PO-2024-00127 успешно завершен'
            },
            {
                type: 'warning',
                title: 'Низкая производительность',
                message: 'Линия L-02 показывает снижение производительности'
            },
            {
                type: 'error',
                title: 'Обнаружен дефект',
                message: 'В партии BATCH-2024-003 обнаружены критические дефекты'
            },
            {
                type: 'info',
                title: 'Плановое обслуживание',
                message: 'Запланировано техническое обслуживание линии L-01'
            }
        ];

        const notification = notifications[Math.floor(Math.random() * notifications.length)];

        // 30% chance to show random notification
        if (Math.random() < 0.3) {
            showNotification(notification.type, notification.title, notification.message);
        }
    }
}

// Global function to show notifications
function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <span class="material-icons">${getNotificationIcon(type)}</span>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <span class="material-icons">close</span>
        </button>
    `;

    container.appendChild(notification);

    // Play sound for critical notifications
    if (type === 'error') {
        playNotificationSound();
    }

    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info',
        'warning': 'warning',
        'error': 'error'
    };
    return icons[type] || 'info';
}

function playNotificationSound() {
    // In a real application, you would play an actual sound file
    // For demo purposes, we'll use the Web Audio API to generate a simple beep
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio context not supported');
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager();