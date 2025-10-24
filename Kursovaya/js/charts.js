// Charts initialization and management

class ChartsManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initializeCharts();
        this.setupChartUpdates();
    }

    initializeCharts() {
        // OEE Chart (Sparkline)
        this.initOEEChart();

        // Defects Chart (Sparkline)
        this.initDefectsChart();

        // Downtime Chart (Sparkline)
        this.initDowntimeChart();

        // Line Performance Chart
        this.initLineChart();

        // Orders Status Pie Chart
        this.initPieChart();

        // Defects by Operation Chart
        this.initDefectsByOperationChart();

        // Defects by Type Chart
        this.initDefectsByTypeChart();
    }

    initOEEChart() {
        const ctx = document.getElementById('oeeChart');
        if (!ctx) return;

        const data = {
            labels: Array.from({ length: 20 }, (_, i) => ''),
            datasets: [{
                data: [82, 84, 83, 85, 86, 87, 86, 88, 87, 86, 87, 88, 87, 86, 87, 88, 87, 86, 87, 87.2],
                borderColor: '#1D4ED8',
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        min: 80,
                        max: 90
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        });
    }

    initDefectsChart() {
        const ctx = document.getElementById('defectsChart');
        if (!ctx) return;

        const data = {
            labels: Array.from({ length: 20 }, (_, i) => ''),
            datasets: [{
                data: [2.5, 2.3, 2.2, 2.1, 2.0, 2.1, 2.0, 1.9, 1.8, 1.9, 1.8, 1.9, 1.8, 1.9, 1.8, 1.9, 1.8, 1.9, 1.8, 1.8],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        min: 1.5,
                        max: 2.5
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        });
    }

    initDowntimeChart() {
        const ctx = document.getElementById('downtimeChart');
        if (!ctx) return;

        const data = {
            labels: Array.from({ length: 20 }, (_, i) => ''),
            datasets: [{
                data: [6.2, 5.8, 5.5, 5.2, 5.0, 4.8, 4.6, 4.5, 4.4, 4.3, 4.4, 4.3, 4.4, 4.3, 4.4, 4.3, 4.4, 4.3, 4.3, 4.2],
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        min: 4,
                        max: 6.5
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        });
    }

    initLineChart() {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;

        const data = {
            labels: ['L-01', 'L-02', 'L-03', 'L-04', 'L-05', 'L-06'],
            datasets: [
                {
                    label: 'План',
                    data: [95, 92, 88, 90, 85, 87],
                    borderColor: '#64748B',
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: 'Факт',
                    data: [93, 90, 85, 88, 82, 84],
                    borderColor: '#1D4ED8',
                    backgroundColor: 'rgba(29, 78, 216, 0.1)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        };

        this.charts.set('lineChart', new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Производительность (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Производственные линии'
                        }
                    }
                }
            }
        }));
    }

    initPieChart() {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        const data = {
            labels: ['В работе', 'Планируется', 'На паузе', 'Завершены'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: [
                    '#1D4ED8',
                    '#64748B',
                    '#F59E0B',
                    '#10B981'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        };

        this.charts.set('pieChart', new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        }));
    }

    initDefectsByOperationChart() {
        const ctx = document.getElementById('defectsByOperationChart');
        if (!ctx) return;

        const data = {
            labels: ['Пайка', 'Монтаж', 'Тестирование', 'Упаковка'],
            datasets: [{
                label: 'Количество дефектов',
                data: [12, 8, 15, 3],
                backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#3B82F6',
                    '#10B981'
                ],
                borderWidth: 0
            }]
        };

        this.charts.set('defectsByOperationChart', new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество дефектов'
                        }
                    }
                }
            }
        }));
    }

    initDefectsByTypeChart() {
        const ctx = document.getElementById('defectsByTypeChart');
        if (!ctx) return;

        const data = {
            labels: ['Перемычки припоя', 'Отсутствие компонентов', 'Смещения', 'Повреждения', 'Ошибки тестирования'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#3B82F6',
                    '#8B5CF6',
                    '#10B981'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        };

        this.charts.set('defectsByTypeChart', new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        }));
    }

    setupChartUpdates() {
        // Simulate real-time chart updates
        setInterval(() => {
            this.updateCharts();
        }, 10000);
    }

    updateCharts() {
        // Update line chart with random variations
        const lineChart = this.charts.get('lineChart');
        if (lineChart) {
            lineChart.data.datasets[1].data = lineChart.data.datasets[1].data.map(value => {
                const variation = (Math.random() - 0.5) * 2;
                return Math.max(80, Math.min(95, value + variation));
            });
            lineChart.update('none');
        }

        // Update pie chart with random variations
        const pieChart = this.charts.get('pieChart');
        if (pieChart) {
            pieChart.data.datasets[0].data = pieChart.data.datasets[0].data.map(value => {
                const variation = (Math.random() - 0.5) * 5;
                return Math.max(10, value + variation);
            });

            // Normalize to 100%
            const total = pieChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            pieChart.data.datasets[0].data = pieChart.data.datasets[0].data.map(value =>
                Math.round((value / total) * 100)
            );

            pieChart.update('none');
        }
    }
}

// Initialize charts manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new ChartsManager();
});