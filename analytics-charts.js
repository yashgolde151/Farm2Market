// Enhanced Analytics Chart System
class AnalyticsCharts {
    constructor() {
        this.chartInstances = {};
        this.marketData = {
            wheat: { prices: [], volumes: [], dates: [] },
            rice: { prices: [], volumes: [], dates: [] },
            cotton: { prices: [], volumes: [], dates: [] }
        };
        this.init();
    }

    init() {
        this.generateMarketData();
        this.setupCharts();
        this.populateDemandGrid();
        this.setupInteractivity();
    }

    generateMarketData() {
        const crops = ['wheat', 'rice', 'cotton'];
        const days = 30;
        
        crops.forEach(crop => {
            const basePrice = this.getBasePrice(crop);
            const data = this.marketData[crop];
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                
                // Generate realistic price trends
                const trend = this.getPriceTrend(crop, i, days);
                const volatility = Math.random() * 100 - 50;
                const price = basePrice + trend + volatility;
                
                data.dates.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
                data.prices.push(Math.max(price, basePrice * 0.7));
                data.volumes.push(Math.floor(Math.random() * 1000) + 500);
            }
        });
    }

    getBasePrice(crop) {
        const basePrices = {
            wheat: 2150,
            rice: 1890,
            cotton: 5670
        };
        return basePrices[crop] || 2000;
    }

    getPriceTrend(crop, dayIndex, totalDays) {
        const progress = dayIndex / totalDays;
        
        // Different trend patterns for different crops
        switch (crop) {
            case 'wheat':
                return Math.sin(progress * Math.PI * 2) * 200 + progress * 300;
            case 'rice':
                return -progress * 150 + Math.cos(progress * Math.PI * 3) * 100;
            case 'cotton':
                return Math.sin(progress * Math.PI * 4) * 400 + progress * 200;
            default:
                return 0;
        }
    }

    setupCharts() {
        this.createTrendChart();
        this.createMarketDemandChart();
        this.createHistoricalChart();
    }

    createTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) {
            this.showFallbackMessage('trendChart', 'Price trend chart data unavailable');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        try {
            this.chartInstances.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.marketData.wheat.dates,
                    datasets: [
                        {
                            label: 'Wheat',
                            data: this.marketData.wheat.prices,
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Rice',
                            data: this.marketData.rice.prices,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Cotton',
                            data: this.marketData.cotton.prices,
                            borderColor: '#FF9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#4CAF50',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Date'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Price (₹/quintal)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        } catch (error) {
            console.error('Error creating trend chart:', error);
            this.showFallbackMessage('trendChart', 'Unable to load price trend chart');
        }
    }

    createMarketDemandChart() {
        const canvas = document.getElementById('marketDemandChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        try {
            const demandData = this.generateMarketDemandData();
            
            this.chartInstances.marketDemandChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: demandData.labels,
                    datasets: [{
                        label: 'Orders',
                        data: demandData.orders,
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Orders: ${context.parsed.y}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { size: 11 } }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating market demand chart:', error);
        }
    }

    createHistoricalChart() {
        const canvas = document.getElementById('historicalChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        try {
            const historicalData = this.generateHistoricalData('wheat', '1M');
            
            this.chartInstances.historicalChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historicalData.dates,
                    datasets: [{
                        label: 'Price',
                        data: historicalData.prices,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `Price: ₹${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { size: 11 } }
                        },
                        y: {
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { 
                                font: { size: 11 },
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            
            this.updateHistoricalStats(historicalData.prices);
        } catch (error) {
            console.error('Error creating historical chart:', error);
        }
    }

    generateMarketDemandData() {
        const crops = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize'];
        const orders = crops.map(() => Math.floor(Math.random() * 300) + 50);
        
        return {
            labels: crops,
            orders: orders
        };
    }

    generateHistoricalData(crop, period) {
        const days = this.getPeriodDays(period);
        const basePrice = this.getBasePrice(crop);
        const dates = [];
        const prices = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const progress = (days - 1 - i) / (days - 1);
            const trend = this.getHistoricalTrend(crop, progress);
            const volatility = (Math.random() - 0.5) * 200;
            const price = basePrice + trend + volatility;
            
            dates.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
            prices.push(Math.max(price, basePrice * 0.7));
        }
        
        return { dates, prices };
    }

    getPeriodDays(period) {
        switch(period) {
            case '1W': return 7;
            case '1M': return 30;
            case '3M': return 90;
            case '1Y': return 365;
            default: return 30;
        }
    }

    getHistoricalTrend(crop, progress) {
        switch (crop) {
            case 'wheat':
                return Math.sin(progress * Math.PI * 3) * 300 + progress * 400;
            case 'rice':
                return -progress * 200 + Math.cos(progress * Math.PI * 2) * 150;
            case 'cotton':
                return Math.sin(progress * Math.PI * 5) * 500 + progress * 300;
            case 'soybean':
                return Math.cos(progress * Math.PI * 2) * 250 + progress * 150;
            default:
                return 0;
        }
    }

    updateHistoricalStats(prices) {
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const volatility = ((high - low) / low * 100);
        const trend = prices[prices.length - 1] > prices[0] ? 'Bullish' : 'Bearish';
        const trendIcon = trend === 'Bullish' ? '↗' : '↘';
        
        const periodHigh = document.getElementById('periodHigh');
        const periodLow = document.getElementById('periodLow');
        const volatilityEl = document.getElementById('volatility');
        const trendDirection = document.getElementById('trendDirection');
        
        if (periodHigh) periodHigh.textContent = `₹${high.toFixed(0)}`;
        if (periodLow) periodLow.textContent = `₹${low.toFixed(0)}`;
        if (volatilityEl) volatilityEl.textContent = `${volatility.toFixed(1)}%`;
        if (trendDirection) {
            trendDirection.textContent = `${trendIcon} ${trend}`;
            trendDirection.className = `stat-value ${trend === 'Bullish' ? 'trend-up' : 'trend-down'}`;
        }
    }

    populateDemandGrid() {
        const demandGrid = document.getElementById('demandGrid');
        if (!demandGrid) return;

        const demandData = this.generateDemandData();
        demandGrid.innerHTML = '';

        demandData.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.className = 'demand-cell';
            cell.textContent = `${value}%`;
            cell.style.backgroundColor = this.getDemandColor(value);
            cell.title = `Demand Level: ${value}% - ${this.getDemandLabel(value)}`;
            
            // Add click interaction
            cell.addEventListener('click', () => {
                this.showDemandDetails(value, index);
            });
            
            demandGrid.appendChild(cell);
        });

        // Update demand stats
        this.updateDemandStats(demandData);
    }

    generateDemandData() {
        // Generate realistic demand data based on regions and crops
        const regions = ['Punjab', 'Haryana', 'UP', 'MP', 'Gujarat', 'Maharashtra', 'Karnataka', 'AP', 'TN', 'WB', 'Bihar', 'Odisha', 'Rajasthan', 'Assam', 'Kerala', 'HP'];
        const data = [];
        
        regions.forEach((region, index) => {
            // Simulate different demand levels based on region characteristics
            let baseDemand = 50;
            
            // Higher demand in major agricultural states
            if (['Punjab', 'Haryana', 'UP', 'MP'].includes(region)) {
                baseDemand = 75;
            }
            
            // Add seasonal variation
            const seasonal = Math.sin((index / regions.length) * Math.PI * 2) * 15;
            
            // Add random market fluctuation
            const fluctuation = (Math.random() - 0.5) * 20;
            
            const finalDemand = Math.max(10, Math.min(95, baseDemand + seasonal + fluctuation));
            data.push(Math.round(finalDemand));
        });
        
        return data;
    }

    getDemandColor(value) {
        if (value >= 90) return '#d32f2f';  // Very High - Red
        if (value >= 70) return '#f9a825';  // High - Orange  
        if (value >= 50) return '#4CAF50';  // Medium - Green
        return '#fbc02d';                   // Low - Yellow
    }

    getDemandLabel(value) {
        if (value >= 90) return 'Very High Demand';
        if (value >= 70) return 'High Demand';
        if (value >= 50) return 'Medium Demand';
        return 'Low Demand';
    }

    updateDemandStats(demandData) {
        const highDemandCount = demandData.filter(d => d >= 70).length;
        const highDemandPercentage = Math.round((highDemandCount / demandData.length) * 100);
        const avgPrice = 2400 + (highDemandPercentage * 10); // Price correlates with demand
        
        // Update stats display
        const statNumbers = document.querySelectorAll('.demand-stat .stat-number');
        if (statNumbers[0]) statNumbers[0].textContent = `${highDemandPercentage}%`;
        if (statNumbers[1]) statNumbers[1].textContent = `₹${avgPrice.toLocaleString()}`;
    }

    showDemandDetails(value, index) {
        const regions = ['Punjab', 'Haryana', 'UP', 'MP', 'Gujarat', 'Maharashtra', 'Karnataka', 'AP', 'TN', 'WB', 'Bihar', 'Odisha', 'Rajasthan', 'Assam', 'Kerala', 'HP'];
        const region = regions[index] || `Region ${index + 1}`;
        
        if (typeof showNotification === 'function') {
            showNotification(`${region}: ${value}% demand - ${this.getDemandLabel(value)}`, 'info');
        } else {
            alert(`${region}: ${value}% demand\n${this.getDemandLabel(value)}`);
        }
    }

    setupInteractivity() {
        // Crop selector for trend chart
        const cropSelect = document.querySelector('.modern-select');
        if (cropSelect) {
            cropSelect.addEventListener('change', (e) => {
                this.updateTrendChart(e.target.value.toLowerCase());
            });
        }

        // Region selector for demand grid
        const regionSelect = document.getElementById('demandRegionSelect');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                this.filterDemandByRegion(e.target.value);
            });
        }

        // Demand crop filter
        const demandCropFilter = document.getElementById('demandCropFilter');
        if (demandCropFilter) {
            demandCropFilter.addEventListener('change', (e) => {
                this.filterMarketDemand(e.target.value);
            });
        }

        // Historical chart controls
        const historicalCropSelect = document.getElementById('historicalCropSelect');
        if (historicalCropSelect) {
            historicalCropSelect.addEventListener('change', (e) => {
                this.updateHistoricalChart(e.target.value, this.currentPeriod);
            });
        }

        // Period buttons
        const replayBtns = document.querySelectorAll('.replay-btn');
        replayBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                replayBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const period = e.target.dataset.period;
                this.currentPeriod = period;
                this.updateHistoricalChart(this.getCurrentCrop(), period);
                this.updateReplayInfo(period);
            });
        });

        // Real-time updates
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
        
        // Initialize current period
        this.currentPeriod = '1M';
    }

    filterMarketDemand(cropFilter) {
        if (!this.chartInstances.marketDemandChart) return;

        let demandData;
        if (cropFilter === 'all') {
            demandData = this.generateMarketDemandData();
        } else {
            demandData = this.generateFilteredDemandData(cropFilter);
        }

        const chart = this.chartInstances.marketDemandChart;
        chart.data.labels = demandData.labels;
        chart.data.datasets[0].data = demandData.orders;
        chart.update();

        this.updateDemandMetrics(demandData.orders, cropFilter);
    }

    generateFilteredDemandData(crop) {
        const regions = ['North', 'South', 'East', 'West', 'Central'];
        const orders = regions.map(() => {
            let baseOrders = 50;
            if (crop === 'wheat') baseOrders = 80;
            else if (crop === 'rice') baseOrders = 70;
            else if (crop === 'cotton') baseOrders = 60;
            
            return Math.floor(Math.random() * 100) + baseOrders;
        });
        
        return {
            labels: regions,
            orders: orders
        };
    }

    updateDemandMetrics(orders, cropFilter) {
        const totalOrders = orders.reduce((sum, order) => sum + order, 0);
        const activeBuyers = Math.floor(totalOrders * 0.3);
        const avgOrderSize = (totalOrders / orders.length * 0.15).toFixed(1);

        const totalOrdersEl = document.getElementById('totalOrders');
        const activeBuyersEl = document.getElementById('activeBuyers');
        const avgOrderSizeEl = document.getElementById('avgOrderSize');

        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders.toLocaleString();
        if (activeBuyersEl) activeBuyersEl.textContent = activeBuyers.toLocaleString();
        if (avgOrderSizeEl) avgOrderSizeEl.textContent = `${avgOrderSize} Qt`;
    }

    updateHistoricalChart(crop, period) {
        if (!this.chartInstances.historicalChart) return;

        const historicalData = this.generateHistoricalData(crop, period);
        const chart = this.chartInstances.historicalChart;
        
        chart.data.labels = historicalData.dates;
        chart.data.datasets[0].data = historicalData.prices;
        chart.update();
        
        this.updateHistoricalStats(historicalData.prices);
    }

    getCurrentCrop() {
        const select = document.getElementById('historicalCropSelect');
        return select ? select.value : 'wheat';
    }

    updateReplayInfo(period) {
        const replayPeriod = document.getElementById('replayPeriod');
        const replayDate = document.getElementById('replayDate');
        
        const periodNames = {
            '1W': 'Last 1 Week',
            '1M': 'Last 1 Month', 
            '3M': 'Last 3 Months',
            '1Y': 'Last 1 Year'
        };
        
        if (replayPeriod) replayPeriod.textContent = periodNames[period] || 'Last 1 Month';
        if (replayDate) {
            const date = new Date();
            replayDate.textContent = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        }
    }

    filterDemandByRegion(region) {
        const demandGrid = document.getElementById('demandGrid');
        if (!demandGrid) return;

        let filteredData;
        
        switch(region) {
            case 'north':
                filteredData = this.generateRegionalData(['Punjab', 'Haryana', 'UP', 'HP']);
                break;
            case 'south':
                filteredData = this.generateRegionalData(['Karnataka', 'AP', 'TN', 'Kerala']);
                break;
            case 'west':
                filteredData = this.generateRegionalData(['Gujarat', 'Maharashtra', 'Rajasthan', 'MP']);
                break;
            case 'east':
                filteredData = this.generateRegionalData(['WB', 'Bihar', 'Odisha', 'Assam']);
                break;
            default:
                filteredData = this.generateDemandData();
        }

        this.updateDemandGrid(filteredData);
    }

    generateRegionalData(regions) {
        return regions.map(region => {
            let baseDemand = 50;
            
            // Regional characteristics
            if (['Punjab', 'Haryana'].includes(region)) baseDemand = 85;
            else if (['UP', 'MP'].includes(region)) baseDemand = 75;
            else if (['Gujarat', 'Maharashtra'].includes(region)) baseDemand = 70;
            
            const variation = (Math.random() - 0.5) * 20;
            return Math.max(10, Math.min(95, Math.round(baseDemand + variation)));
        });
    }

    updateDemandGrid(demandData) {
        const demandGrid = document.getElementById('demandGrid');
        if (!demandGrid) return;

        demandGrid.innerHTML = '';

        demandData.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.className = 'demand-cell';
            cell.textContent = `${value}%`;
            cell.style.backgroundColor = this.getDemandColor(value);
            cell.title = `Demand Level: ${value}% - ${this.getDemandLabel(value)}`;
            
            cell.addEventListener('click', () => {
                this.showDemandDetails(value, index);
            });
            
            demandGrid.appendChild(cell);
        });

        this.updateDemandStats(demandData);
    }

    updateTrendChart(selectedCrop) {
        if (!this.chartInstances.trendChart) return;

        const chart = this.chartInstances.trendChart;
        const cropData = this.marketData[selectedCrop];

        if (cropData) {
            chart.data.datasets[0].data = cropData.prices;
            chart.data.labels = cropData.dates;
            chart.update();
        }
    }

    updateRealTimeData() {
        // Simulate real-time price updates
        Object.keys(this.marketData).forEach(crop => {
            const data = this.marketData[crop];
            const lastPrice = data.prices[data.prices.length - 1];
            const change = (Math.random() - 0.5) * 50;
            const newPrice = Math.max(lastPrice + change, lastPrice * 0.9);
            
            data.prices.push(newPrice);
            data.volumes.push(Math.floor(Math.random() * 1000) + 500);
            
            // Keep only last 30 days
            if (data.prices.length > 30) {
                data.prices.shift();
                data.volumes.shift();
                data.dates.shift();
            }
        });

        // Update charts
        Object.values(this.chartInstances).forEach(chart => {
            if (chart && chart.update) {
                chart.update('none');
            }
        });
    }

    showFallbackMessage(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            const parent = container.parentElement;
            if (parent) {
                parent.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #666;">
                        <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p style="text-align: center; font-size: 1.1rem;">${message}</p>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Retry Loading
                        </button>
                    </div>
                `;
            }
        }
    }

    destroy() {
        Object.values(this.chartInstances).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.chartInstances = {};
    }
}

// Initialize analytics charts
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is available
    if (typeof Chart !== 'undefined') {
        new AnalyticsCharts();
    } else {
        console.error('Chart.js library not loaded');
        // Show fallback for all chart containers
        const chartContainers = ['trendChart', 'volumeChart', 'comparisonChart'];
        chartContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    parent.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #666;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #ff9800;"></i>
                            <p style="text-align: center;">Chart library not available</p>
                            <p style="text-align: center; font-size: 0.9rem; margin-top: 0.5rem;">Please check your internet connection</p>
                        </div>
                    `;
                }
            }
        });
    }
    
    // Initialize calculator functionality
    initializeCalculators();
});

// Global functions for replay controls
let replayInterval = null;
let isPlaying = false;

function toggleReplay() {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    if (isPlaying) {
        clearInterval(replayInterval);
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('active');
        isPlaying = false;
    } else {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('active');
        isPlaying = true;
        
        let step = 0;
        replayInterval = setInterval(() => {
            step++;
            if (step >= 30) {
                toggleReplay();
                return;
            }
            
            if (typeof showNotification === 'function' && step === 1) {
                showNotification('Historical replay started', 'info');
            }
        }, 200);
    }
}

function resetReplay() {
    if (isPlaying) {
        toggleReplay();
    }
    
    if (typeof showNotification === 'function') {
        showNotification('Historical data reset to current period', 'info');
    }
}

function exportData() {
    const crop = document.getElementById('historicalCropSelect')?.value || 'wheat';
    const period = document.querySelector('.replay-btn.active')?.dataset.period || '1M';
    
    const csvData = `Date,Price,Volume\n2023-12-01,2450,150\n2023-12-02,2465,180\n2023-12-03,2440,165`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crop}_${period}_historical_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification(`${crop} data exported successfully`, 'success');
    }
}

// Calculator Functions
function initializeCalculators() {
    // Setup slider interactions
    setupSliders();
    
    // Setup crop price updates
    setupCropPriceUpdates();
}

function setupSliders() {
    // Soil quality slider
    const soilSlider = document.getElementById('soilSlider');
    const soilValue = document.getElementById('soilValue');
    const soilQuality = document.getElementById('soilQuality');
    
    if (soilSlider && soilValue && soilQuality) {
        soilSlider.addEventListener('input', function() {
            const value = this.value;
            soilValue.textContent = value + '%';
            
            let quality = 'Poor';
            let color = '#f44336';
            if (value >= 80) { quality = 'Excellent'; color = '#4CAF50'; }
            else if (value >= 60) { quality = 'Good'; color = '#8BC34A'; }
            else if (value >= 40) { quality = 'Average'; color = '#FF9800'; }
            
            soilQuality.innerHTML = `${quality} (${value}%)`;
            soilQuality.style.color = color;
        });
    }
    
    // Rainfall slider
    const rainfallSlider = document.getElementById('rainfallSlider');
    const rainfallValue = document.getElementById('rainfallValue');
    const rainfallLabel = document.getElementById('rainfallLabel');
    
    if (rainfallSlider && rainfallValue && rainfallLabel) {
        rainfallSlider.addEventListener('input', function() {
            const value = this.value;
            rainfallValue.textContent = value + ' mm';
            rainfallLabel.textContent = value + ' mm';
        });
    }
}

function setupCropPriceUpdates() {
    const cropPrices = {
        wheat: 2450,
        rice: 1890,
        cotton: 5670,
        soybean: 4350
    };
    
    // Update current price in "What If I Wait" when crop changes
    const waitCropSelect = document.getElementById('waitCropSelect');
    const currentPriceInput = document.getElementById('currentPrice');
    
    if (waitCropSelect && currentPriceInput) {
        waitCropSelect.addEventListener('change', function() {
            const selectedCrop = this.value;
            currentPriceInput.value = cropPrices[selectedCrop] || 2450;
        });
    }
}

// ROI Calculator Function
function calculateROI() {
    const investment = parseFloat(document.getElementById('totalInvestment').value) || 0;
    const yield_qty = parseFloat(document.getElementById('expectedYield').value) || 0;
    const price = parseFloat(document.getElementById('marketPrice').value) || 0;
    
    if (investment <= 0 || yield_qty <= 0 || price <= 0) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter valid values for all fields', 'error');
        }
        return;
    }
    
    const revenue = yield_qty * price;
    const profit = revenue - investment;
    const roi = ((profit / investment) * 100);
    const breakeven = investment / yield_qty;
    
    // Update results
    const roiResult = document.getElementById('roiResult');
    const roiProfit = document.getElementById('roiProfit');
    const roiPercentage = document.getElementById('roiPercentage');
    const roiBreakeven = document.getElementById('roiBreakeven');
    
    if (roiResult && roiProfit && roiPercentage && roiBreakeven) {
        roiResult.style.display = 'block';
        
        const profitColor = profit >= 0 ? '#4CAF50' : '#f44336';
        const profitText = profit >= 0 ? 'Profit' : 'Loss';
        
        roiProfit.innerHTML = `₹${Math.abs(profit).toLocaleString()} <span>${profitText}</span>`;
        roiProfit.style.color = profitColor;
        
        roiPercentage.textContent = `• ROI: ${roi.toFixed(1)}%`;
        roiBreakeven.textContent = `• Breakeven: ₹${breakeven.toFixed(0)}/Qt`;
        
        if (typeof showNotification === 'function') {
            showNotification(`ROI calculated: ${roi.toFixed(1)}%`, 'success');
        }
    }
}

// Yield Predictor Function
function predictYield() {
    const cropType = document.getElementById('yieldCropSelect').value;
    const farmSize = parseFloat(document.getElementById('farmSize').value) || 0;
    const soilQuality = parseFloat(document.getElementById('soilSlider').value) || 0;
    const rainfall = parseFloat(document.getElementById('rainfallSlider').value) || 0;
    
    if (farmSize <= 0) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a valid farm size', 'error');
        }
        return;
    }
    
    // Base yield per acre for different crops
    const baseYields = {
        wheat: 3.2,
        rice: 2.8,
        cotton: 1.5,
        soybean: 2.1
    };
    
    const baseYield = baseYields[cropType] || 3.0;
    
    // Calculate yield based on factors
    const soilFactor = soilQuality / 100;
    const rainfallFactor = Math.min(rainfall / 120, 1.2); // Optimal around 120mm
    const randomFactor = 0.9 + (Math.random() * 0.2); // ±10% variation
    
    const predictedYieldPerAcre = baseYield * soilFactor * rainfallFactor * randomFactor;
    const totalYield = predictedYieldPerAcre * farmSize;
    
    // Calculate confidence based on input quality
    const confidence = Math.min(95, 60 + (soilQuality * 0.3) + (Math.min(rainfall, 150) * 0.2));
    
    // Update results
    const yieldResult = document.getElementById('yieldResult');
    const yieldAmount = document.getElementById('yieldAmount');
    const yieldConfidence = document.getElementById('yieldConfidence');
    
    if (yieldResult && yieldAmount && yieldConfidence) {
        yieldResult.style.display = 'block';
        yieldAmount.innerHTML = `${totalYield.toFixed(1)} <span>Quintals</span>`;
        yieldConfidence.textContent = `Confidence: ${confidence.toFixed(0)}%`;
        
        if (typeof showNotification === 'function') {
            showNotification(`Yield predicted: ${totalYield.toFixed(1)} quintals`, 'success');
        }
    }
}

// What If I Wait Simulator Function
function simulateWait() {
    const cropType = document.getElementById('waitCropSelect').value;
    const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
    const waitWeeks = parseFloat(document.getElementById('waitDuration').value) || 1;
    const quantity = parseFloat(document.getElementById('waitQuantity').value) || 0;
    
    if (currentPrice <= 0 || quantity <= 0) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter valid price and quantity', 'error');
        }
        return;
    }
    
    // Simulate price prediction based on historical patterns and market trends
    const volatility = {
        wheat: 0.15,
        rice: 0.12,
        cotton: 0.25,
        soybean: 0.18
    };
    
    const cropVolatility = volatility[cropType] || 0.15;
    
    // Time factor - longer wait = more uncertainty
    const timeFactor = 1 + (waitWeeks * 0.02);
    
    // Market trend simulation (seasonal patterns)
    const seasonalTrend = Math.sin((Date.now() / (1000 * 60 * 60 * 24 * 7)) * Math.PI / 26) * 0.1;
    
    // Random market movement
    const randomMovement = (Math.random() - 0.5) * cropVolatility * timeFactor;
    
    // Calculate predicted price
    const priceChange = seasonalTrend + randomMovement;
    const predictedPrice = currentPrice * (1 + priceChange);
    
    const priceChangePercent = (priceChange * 100);
    const potentialGain = (predictedPrice - currentPrice) * quantity;
    
    // Update results
    const waitResult = document.getElementById('waitResult');
    const predictedPriceEl = document.getElementById('predictedPrice');
    const priceChangeEl = document.getElementById('priceChange');
    const potentialGainEl = document.getElementById('potentialGain');
    
    if (waitResult && predictedPriceEl && priceChangeEl && potentialGainEl) {
        waitResult.style.display = 'block';
        
        predictedPriceEl.innerHTML = `₹${predictedPrice.toFixed(0)} <span>Predicted Price</span>`;
        
        const changeColor = priceChangePercent >= 0 ? '#4CAF50' : '#f44336';
        const changeSymbol = priceChangePercent >= 0 ? '+' : '';
        priceChangeEl.innerHTML = `Change: <span style="color: ${changeColor}">${changeSymbol}${priceChangePercent.toFixed(1)}%</span>`;
        
        const gainColor = potentialGain >= 0 ? '#4CAF50' : '#f44336';
        const gainText = potentialGain >= 0 ? 'Potential Gain' : 'Potential Loss';
        potentialGainEl.innerHTML = `${gainText}: <span style="color: ${gainColor}">₹${Math.abs(potentialGain).toLocaleString()}</span>`;
        
        if (typeof showNotification === 'function') {
            const message = potentialGain >= 0 ? 
                `Waiting may gain ₹${potentialGain.toLocaleString()}` : 
                `Waiting may lose ₹${Math.abs(potentialGain).toLocaleString()}`;
            showNotification(message, potentialGain >= 0 ? 'success' : 'error');
        }
    }
}