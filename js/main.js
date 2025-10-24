// Main application logic and data management

class DataManager {
    constructor() {
        this.orders = [];
        this.parameters = [];
        this.defects = [];
        this.init();
    }

    init() {
        this.generateSampleData();
        this.loadData();
        this.setupEventListeners();
    }

    generateSampleData() {
        // Sample orders data
        this.orders = [
            {
                id: 'PO-2024-00123',
                product: 'Контроллер PLC-100',
                article: 'PLC-100-01',
                status: 'in_progress',
                currentOperation: 'Пайка компонентов',
                priority: 'high',
                quantity: 1000,
                createdAt: '2024-01-15',
                progress: 65
            },
            {
                id: 'PO-2024-00124',
                product: 'Датчик температуры',
                article: 'TEMP-SENSOR-02',
                status: 'planned',
                currentOperation: 'Планирование',
                priority: 'medium',
                quantity: 5000,
                createdAt: '2024-01-16',
                progress: 0
            },
            {
                id: 'PO-2024-00125',
                product: 'Модуль связи',
                article: 'COMM-MODULE-05',
                status: 'in_progress',
                currentOperation: 'Тестирование',
                priority: 'high',
                quantity: 2000,
                createdAt: '2024-01-14',
                progress: 30
            },
            {
                id: 'PO-2024-00126',
                product: 'Блок питания',
                article: 'PWR-SUPPLY-12',
                status: 'paused',
                currentOperation: 'Монтаж',
                priority: 'low',
                quantity: 800,
                createdAt: '2024-01-13',
                progress: 45
            },
            {
                id: 'PO-2024-00127',
                product: 'Интерфейсная плата',
                article: 'IF-BOARD-08',
                status: 'completed',
                currentOperation: 'Завершено',
                priority: 'medium',
                quantity: 3000,
                createdAt: '2024-01-10',
                progress: 100
            }
        ];

        // Sample parameters data
        this.parameters = [
            {
                id: 'temp_soldering',
                name: 'Температура пайки',
                value: 245,
                unit: '°C',
                min: 230,
                max: 260,
                warningMin: 235,
                warningMax: 255,
                currentStatus: 'normal'
            },
            {
                id: 'pressure_reflow',
                name: 'Давление рефлоу',
                value: 1.2,
                unit: 'атм',
                min: 1.0,
                max: 1.5,
                warningMin: 1.1,
                warningMax: 1.4,
                currentStatus: 'warning'
            },
            {
                id: 'concentration_flux',
                name: 'Концентрация флюса',
                value: 8.5,
                unit: '%',
                min: 7.0,
                max: 9.0,
                warningMin: 7.5,
                warningMax: 8.8,
                currentStatus: 'critical'
            },
            {
                id: 'speed_conveyor',
                name: 'Скорость конвейера',
                value: 1.8,
                unit: 'м/мин',
                min: 1.5,
                max: 2.2,
                warningMin: 1.6,
                warningMax: 2.1,
                currentStatus: 'normal'
            }
        ];

        // Sample defects data
        this.defects = [
            {
                id: 'DEF-001',
                batch: 'BATCH-2024-001',
                type: 'solder_bridge',
                cause: 'Перегрев при пайке',
                operation: 'soldering',
                severity: 'major',
                date: '2024-01-15 14:30',
                status: 'open'
            },
            {
                id: 'DEF-002',
                batch: 'BATCH-2024-002',
                type: 'component_missing',
                cause: 'Ошибка установки',
                operation: 'mounting',
                severity: 'critical',
                date: '2024-01-15 16:45',
                status: 'in_progress'
            },
            {
                id: 'DEF-003',
                batch: 'BATCH-2024-003',
                type: 'test_failure',
                cause: 'Несоответствие параметров',
                operation: 'testing',
                severity: 'minor',
                date: '2024-01-16 09:15',
                status: 'resolved'
            }
        ];
    }

    loadData() {
        this.renderOrders();
        this.renderParameters();
        this.renderDefects();
        this.updateLastUpdateTime();
    }

    renderOrders() {
        const tableBody = document.querySelector('#ordersTable tbody') ||
            document.querySelector('#activeOrdersTable tbody');

        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.orders.forEach(order => {
            const row = document.createElement('tr');

            const statusBadge = this.getStatusBadge(order.status);
            const priorityClass = this.getPriorityClass(order.priority);

            if (tableBody.closest('#activeOrdersTable')) {
                // Active orders table (dashboard)
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.product}</td>
                    <td>${statusBadge}</td>
                    <td>${order.currentOperation}</td>
                    <td class="${priorityClass}">${this.getPriorityText(order.priority)}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${order.progress}%"></div>
                        </div>
                        <span class="progress-text">${order.progress}%</span>
                    </td>
                `;
            } else {
                // Full orders table
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.product}</td>
                    <td>${order.article}</td>
                    <td>${statusBadge}</td>
                    <td>${order.currentOperation}</td>
                    <td class="${priorityClass}">${this.getPriorityText(order.priority)}</td>
                    <td>${order.quantity}</td>
                    <td>${order.createdAt}</td>
                    <td>
                        <button class="btn-action" onclick="dataManager.editOrder('${order.id}')">
                            <span class="material-icons">edit</span>
                        </button>
                    </td>
                `;
            }

            tableBody.appendChild(row);
        });
    }

    renderParameters() {
        const parametersGrid = document.getElementById('parametersGrid');
        if (!parametersGrid) return;

        parametersGrid.innerHTML = '';

        this.parameters.forEach(param => {
            const card = document.createElement('div');
            card.className = `parameter-card ${param.currentStatus}`;
            card.onclick = () => this.showParameterModal(param);

            const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;
            const warningMinPercent = ((param.warningMin - param.min) / (param.max - param.min)) * 100;
            const warningMaxPercent = ((param.warningMax - param.min) / (param.max - param.min)) * 100;

            card.innerHTML = `
                <div class="parameter-header">
                    <div class="parameter-name">${param.name}</div>
                    <div class="parameter-status ${param.currentStatus}">
                        ${this.getStatusText(param.currentStatus)}
                    </div>
                </div>
                <div class="parameter-value">${param.value}</div>
                <div class="parameter-unit">${param.unit}</div>
                <div class="parameter-range">
                    <div class="range-labels">
                        <span>${param.min}${param.unit}</span>
                        <span>${param.max}${param.unit}</span>
                    </div>
                    <div class="range-bar">
                        <div class="range-fill ${param.currentStatus}" style="width: ${percentage}%"></div>
                        <div class="range-marker" style="left: ${warningMinPercent}%"></div>
                        <div class="range-marker" style="left: ${warningMaxPercent}%"></div>
                    </div>
                </div>
            `;

            parametersGrid.appendChild(card);
        });
    }

    renderDefects() {
        const defectsTable = document.getElementById('defectsTable');
        if (!defectsTable) return;

        const tbody = defectsTable.querySelector('tbody');
        tbody.innerHTML = '';

        this.defects.forEach(defect => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${defect.id}</td>
                <td>${defect.batch}</td>
                <td>${this.getDefectTypeText(defect.type)}</td>
                <td>${defect.cause}</td>
                <td>${this.getOperationText(defect.operation)}</td>
                <td class="severity-${defect.severity}">${this.getSeverityText(defect.severity)}</td>
                <td>${defect.date}</td>
                <td>${this.getDefectStatusText(defect.status)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    getStatusBadge(status) {
        const statusMap = {
            'planned': { text: 'Планируется', class: 'status-planned' },
            'in_progress': { text: 'В работе', class: 'status-in-progress' },
            'paused': { text: 'На паузе', class: 'status-paused' },
            'completed': { text: 'Завершен', class: 'status-completed' }
        };

        const statusInfo = statusMap[status] || statusMap.planned;
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    getPriorityClass(priority) {
        const priorityMap = {
            'high': 'priority-high',
            'medium': 'priority-medium',
            'low': 'priority-low'
        };
        return priorityMap[priority] || 'priority-medium';
    }

    getPriorityText(priority) {
        const priorityMap = {
            'high': 'Высокий',
            'medium': 'Средний',
            'low': 'Низкий'
        };
        return priorityMap[priority] || 'Средний';
    }

    getStatusText(status) {
        const statusMap = {
            'normal': 'Норма',
            'warning': 'Предупреждение',
            'critical': 'Критично'
        };
        return statusMap[status] || 'Норма';
    }

    getDefectTypeText(type) {
        const typeMap = {
            'solder_bridge': 'Перемычка припоя',
            'component_missing': 'Отсутствующий компонент',
            'misalignment': 'Смещение',
            'damage': 'Повреждение',
            'test_failure': 'Неудачное тестирование'
        };
        return typeMap[type] || type;
    }

    getOperationText(operation) {
        const operationMap = {
            'soldering': 'Пайка',
            'mounting': 'Монтаж',
            'testing': 'Тестирование',
            'packaging': 'Упаковка'
        };
        return operationMap[operation] || operation;
    }

    getSeverityText(severity) {
        const severityMap = {
            'minor': 'Мелкий',
            'major': 'Значительный',
            'critical': 'Критический'
        };
        return severityMap[severity] || severity;
    }

    getDefectStatusText(status) {
        const statusMap = {
            'open': 'Открыт',
            'in_progress': 'В работе',
            'resolved': 'Решен'
        };
        return statusMap[status] || status;
    }

    updateLastUpdateTime() {
        const timeElement = document.getElementById('lastUpdateTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }
    }

    setupEventListeners() {
        // Update time every minute
        setInterval(() => this.updateLastUpdateTime(), 60000);

        // Simulate real-time data updates
        setInterval(() => this.simulateDataUpdate(), 10000);
    }

    simulateDataUpdate() {
        // Randomly update some parameter values
        this.parameters.forEach(param => {
            const variation = (Math.random() - 0.5) * (param.max - param.min) * 0.1;
            param.value = Math.max(param.min, Math.min(param.max, param.value + variation));

            // Update status based on value
            if (param.value < param.warningMin || param.value > param.warningMax) {
                param.currentStatus = 'warning';
            } else if (param.value < param.min || param.value > param.max) {
                param.currentStatus = 'critical';

                // Show notification for critical parameters
                if (Math.random() < 0.3) { // 30% chance to show notification
                    showNotification(
                        'error',
                        `Критическое значение параметра`,
                        `Параметр "${param.name}" вышел за пределы нормы: ${param.value}${param.unit}`
                    );
                }
            } else {
                param.currentStatus = 'normal';
            }
        });

        this.renderParameters();
    }

    // Modal functions
    showParameterModal(param) {
        const modal = document.getElementById('parameterModal');
        const title = document.getElementById('parameterModalTitle');
        const valueInput = document.getElementById('parameterValue');
        const unitSpan = document.getElementById('parameterUnit');
        const minSpan = document.getElementById('minValue');
        const maxSpan = document.getElementById('maxValue');
        const rangeVisualization = document.getElementById('rangeVisualization');

        if (modal && title && valueInput) {
            title.textContent = `Ввод параметра: ${param.name}`;
            valueInput.value = param.value;
            valueInput.min = param.min;
            valueInput.max = param.max;
            valueInput.step = 0.1;
            unitSpan.textContent = param.unit;
            minSpan.textContent = param.min;
            maxSpan.textContent = param.max;

            // Create range visualization
            rangeVisualization.innerHTML = `
                <div class="range-bar">
                    <div class="range-fill normal" style="width: 100%"></div>
                    <div class="range-marker" style="left: ${((param.warningMin - param.min) / (param.max - param.min)) * 100}%"></div>
                    <div class="range-marker" style="left: ${((param.warningMax - param.min) / (param.max - param.min)) * 100}%"></div>
                </div>
            `;

            // Update form handler
            const form = document.getElementById('parameterForm');
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateParameter(param.id, parseFloat(valueInput.value));
                this.closeParameterModal();
            };

            modal.classList.add('show');
        }
    }

    closeParameterModal() {
        const modal = document.getElementById('parameterModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    updateParameter(paramId, newValue) {
        const param = this.parameters.find(p => p.id === paramId);
        if (param) {
            param.value = newValue;
            this.renderParameters();

            showNotification(
                'info',
                'Параметр обновлен',
                `Значение параметра "${param.name}" изменено на ${newValue}${param.unit}`
            );
        }
    }

    showCreateOrderModal() {
        const modal = document.getElementById('createOrderModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeCreateOrderModal() {
        const modal = document.getElementById('createOrderModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    createNewOrder(formData) {
        const newOrder = {
            id: `PO-2024-00${this.orders.length + 130}`,
            product: formData.product,
            article: formData.article,
            status: 'planned',
            currentOperation: 'Планирование',
            priority: formData.priority,
            quantity: formData.quantity,
            createdAt: new Date().toISOString().split('T')[0],
            progress: 0
        };

        this.orders.unshift(newOrder);
        this.renderOrders();

        showNotification(
            'info',
            'Заказ создан',
            `Новый заказ ${newOrder.id} успешно создан`
        );
    }

    showDefectModal() {
        const modal = document.getElementById('defectModal');
        if (modal) {
            // Populate batch options
            const batchSelect = document.getElementById('defectBatch');
            if (batchSelect) {
                const batches = [...new Set(this.orders.map(order => `BATCH-${order.id.split('-').pop()}`))];
                batchSelect.innerHTML = '<option value="">Выберите партию</option>' +
                    batches.map(batch => `<option value="${batch}">${batch}</option>`).join('');
            }

            modal.classList.add('show');
        }
    }

    closeDefectModal() {
        const modal = document.getElementById('defectModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    registerDefect(formData) {
        const newDefect = {
            id: `DEF-00${this.defects.length + 1}`.padStart(6, '0'),
            batch: formData.batch,
            type: formData.type,
            cause: formData.cause,
            operation: formData.operation,
            severity: formData.severity,
            date: new Date().toLocaleString('ru-RU'),
            status: 'open'
        };

        this.defects.unshift(newDefect);
        this.renderDefects();

        showNotification(
            'warning',
            'Дефект зарегистрирован',
            `Дефект ${newDefect.id} зарегистрирован в системе`
        );
    }
}

// Global functions for HTML onclick handlers
function showCreateOrderModal() {
    dataManager.showCreateOrderModal();
}

function closeCreateOrderModal() {
    dataManager.closeCreateOrderModal();
}

function showDefectModal() {
    dataManager.showDefectModal();
}

function closeDefectModal() {
    dataManager.closeDefectModal();
}

function closeParameterModal() {
    dataManager.closeParameterModal();
}

function exportHistory() {
    // Simple CSV export simulation
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Время,Операция,Параметры,Пользователь,Статус\n"
        + "2024-01-15 14:30:00,Пайка компонентов,Температура: 245°C,Иванов А.И.,Успешно\n"
        + "2024-01-15 15:45:00,Тестирование,Напряжение: 3.3V,Петров С.В.,Успешно\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "operations_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('info', 'Экспорт завершен', 'История операций экспортирована в CSV');
}

// Initialize data manager
const dataManager = new DataManager();

// Form handlers
document.addEventListener('DOMContentLoaded', function () {
    // Create order form
    const createOrderForm = document.getElementById('createOrderForm');
    if (createOrderForm) {
        createOrderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = {
                product: document.getElementById('orderProduct').value,
                article: document.getElementById('orderArticle').value,
                quantity: parseInt(document.getElementById('orderQuantity').value),
                priority: document.getElementById('orderPriority').value
            };
            dataManager.createNewOrder(formData);
            dataManager.closeCreateOrderModal();
            this.reset();
        });
    }

    // Defect registration form
    const defectForm = document.getElementById('defectForm');
    if (defectForm) {
        defectForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = {
                batch: document.getElementById('defectBatch').value,
                operation: document.getElementById('defectOperation').value,
                type: document.getElementById('defectType').value,
                severity: document.getElementById('defectSeverity').value,
                cause: document.getElementById('defectCause').value
            };
            dataManager.registerDefect(formData);
            dataManager.closeDefectModal();
            this.reset();
        });
    }
});