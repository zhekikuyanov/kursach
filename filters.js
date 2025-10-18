// Search and filtering functionality

class FilterManager {
    constructor() {
        this.currentFilters = {
            status: 'all',
            priority: 'all',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedFilters();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
                this.saveFilters();
            });
        }

        // Filter chips
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;

                if (filterType && filterValue) {
                    // Update active state
                    chips.forEach(c => {
                        if (c.dataset.filter === filterType) {
                            c.classList.remove('active');
                        }
                    });
                    e.target.classList.add('active');

                    // Update filter
                    this.currentFilters[filterType] = filterValue;
                    this.applyFilters();
                    this.saveFilters();
                }
            });
        });

        // Defect type filter
        const defectTypeFilter = document.getElementById('defectTypeFilter');
        if (defectTypeFilter) {
            defectTypeFilter.addEventListener('change', (e) => {
                this.filterDefectsByType(e.target.value);
            });
        }
    }

    applyFilters() {
        const orders = dataManager.orders;
        const filteredOrders = orders.filter(order => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const matchesSearch =
                    order.id.toLowerCase().includes(searchTerm) ||
                    order.product.toLowerCase().includes(searchTerm) ||
                    order.article.toLowerCase().includes(searchTerm);

                if (!matchesSearch) return false;
            }

            // Status filter
            if (this.currentFilters.status !== 'all' && order.status !== this.currentFilters.status) {
                return false;
            }

            // Priority filter
            if (this.currentFilters.priority !== 'all' && order.priority !== this.currentFilters.priority) {
                return false;
            }

            return true;
        });

        this.renderFilteredOrders(filteredOrders);
    }

    renderFilteredOrders(orders) {
        const tableBody = document.querySelector('#ordersTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');

            const statusBadge = dataManager.getStatusBadge(order.status);
            const priorityClass = dataManager.getPriorityClass(order.priority);

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.product}</td>
                <td>${order.article}</td>
                <td>${statusBadge}</td>
                <td>${order.currentOperation}</td>
                <td class="${priorityClass}">${dataManager.getPriorityText(order.priority)}</td>
                <td>${order.quantity}</td>
                <td>${order.createdAt}</td>
                <td>
                    <button class="btn-action" onclick="dataManager.editOrder('${order.id}')">
                        <span class="material-icons">edit</span>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Show empty state if no results
        if (orders.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px; display: block;">search_off</span>
                    <div>Заказы не найдены</div>
                    <div style="font-size: 0.875rem; margin-top: 8px;">Попробуйте изменить параметры поиска или фильтры</div>
                </td>
            `;
            tableBody.appendChild(emptyRow);
        }
    }

    filterDefectsByType(type) {
        const defects = dataManager.defects;
        let filteredDefects = defects;

        if (type !== 'all') {
            filteredDefects = defects.filter(defect => {
                if (type === 'critical') {
                    return defect.severity === 'critical';
                } else if (type === 'major') {
                    return defect.severity === 'major';
                } else if (type === 'minor') {
                    return defect.severity === 'minor';
                }
                return true;
            });
        }

        this.renderFilteredDefects(filteredDefects);
    }

    renderFilteredDefects(defects) {
        const defectsTable = document.getElementById('defectsTable');
        if (!defectsTable) return;

        const tbody = defectsTable.querySelector('tbody');
        tbody.innerHTML = '';

        defects.forEach(defect => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${defect.id}</td>
                <td>${defect.batch}</td>
                <td>${dataManager.getDefectTypeText(defect.type)}</td>
                <td>${defect.cause}</td>
                <td>${dataManager.getOperationText(defect.operation)}</td>
                <td class="severity-${defect.severity}">${dataManager.getSeverityText(defect.severity)}</td>
                <td>${defect.date}</td>
                <td>${dataManager.getDefectStatusText(defect.status)}</td>
            `;

            tbody.appendChild(row);
        });

        // Show empty state if no results
        if (defects.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px; display: block;">check_circle</span>
                    <div>Дефекты не найдены</div>
                    <div style="font-size: 0.875rem; margin-top: 8px;">Попробуйте изменить параметры фильтра</div>
                </td>
            `;
            tbody.appendChild(emptyRow);
        }
    }

    saveFilters() {
        localStorage.setItem('orderFilters', JSON.stringify(this.currentFilters));
    }

    loadSavedFilters() {
        const savedFilters = localStorage.getItem('orderFilters');
        if (savedFilters) {
            this.currentFilters = { ...this.currentFilters, ...JSON.parse(savedFilters) };
            this.applySavedFilters();
        }
    }

    applySavedFilters() {
        // Apply search
        const searchInput = document.getElementById('searchInput');
        if (searchInput && this.currentFilters.search) {
            searchInput.value = this.currentFilters.search;
        }

        // Apply chip filters
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            const filterType = chip.dataset.filter;
            const filterValue = chip.dataset.value;

            if (filterType && this.currentFilters[filterType] === filterValue) {
                chip.classList.add('active');
            } else if (filterType && filterValue === 'all' && this.currentFilters[filterType] === 'all') {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        this.applyFilters();
    }

    clearFilters() {
        this.currentFilters = {
            status: 'all',
            priority: 'all',
            search: ''
        };

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            if (chip.dataset.value === 'all') {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        this.applyFilters();
        this.saveFilters();
    }
}

// Initialize filter manager
const filterManager = new FilterManager();