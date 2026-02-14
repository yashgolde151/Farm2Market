// Candlestick Chart - Working Implementation
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('candlestickChart')) {
        initializeCandlestickChart();
        setupChartControls();
    }
});

// Sample candlestick data
const candleData = [
    { x: 'Jan 1', open: 2300, high: 2450, low: 2280, close: 2400 },
    { x: 'Jan 2', open: 2400, high: 2520, low: 2380, close: 2450 },
    { x: 'Jan 3', open: 2450, high: 2480, low: 2320, close: 2380 },
    { x: 'Jan 4', open: 2380, high: 2420, low: 2250, close: 2350 },
    { x: 'Jan 5', open: 2350, high: 2550, low: 2340, close: 2500 },
    { x: 'Jan 6', open: 2500, high: 2560, low: 2420, close: 2450 },
    { x: 'Today', open: 2450, high: 2520, low: 2380, close: 2450 }
];

// Initialize Candlestick Chart
function initializeCandlestickChart() {
    const canvas = document.getElementById('candlestickChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 30;
    canvas.height = 300;
    
    // Draw the chart
    drawCandlestickChart(ctx, canvas.width, canvas.height);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newRect = canvas.parentElement.getBoundingClientRect();
        canvas.width = newRect.width - 30;
        canvas.height = 300;
        drawCandlestickChart(ctx, canvas.width, canvas.height);
    });
}

// Draw candlestick chart
function drawCandlestickChart(ctx, width, height) {
    // Find min and max values for scaling
    let minPrice = Math.min(...candleData.map(d => d.low));
    let maxPrice = Math.max(...candleData.map(d => d.high));
    
    // Add padding to the range
    const range = maxPrice - minPrice;
    minPrice -= range * 0.1;
    maxPrice += range * 0.1;
    
    // Dimensions
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Price labels
        const price = maxPrice - (range / 5) * i;
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('₹' + Math.round(price), padding.left - 10, y + 4);
    }
    
    // Draw Y-axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
    
    // Draw candlesticks
    const candleWidth = (chartWidth - 20) / candleData.length;
    const spacing = 10;
    
    candleData.forEach((candle, index) => {
        const x = padding.left + (index * (candleWidth + spacing)) + candleWidth / 2;
        
        // Calculate pixel positions
        const openY = padding.top + chartHeight - ((candle.open - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const closeY = padding.top + chartHeight - ((candle.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const highY = padding.top + chartHeight - ((candle.high - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const lowY = padding.top + chartHeight - ((candle.low - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        // Determine color (green for up, red for down)
        const isUp = candle.close >= candle.open;
        const bodyColor = isUp ? '#4CAF50' : '#f44336';
        const wickColor = isUp ? '#4CAF50' : '#f44336';
        
        // Draw wick (high-low line)
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
        
        // Draw body (open-close rectangle)
        const bodyHeight = Math.abs(closeY - openY);
        const bodyTop = Math.min(openY, closeY);
        const bodyLeft = x - candleWidth / 3;
        const bodyRight = x + candleWidth / 3;
        
        // Fill body
        ctx.fillStyle = bodyColor;
        ctx.fillRect(bodyLeft, bodyTop, (bodyRight - bodyLeft), bodyHeight || 2);
        
        // Stroke body
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bodyLeft, bodyTop, (bodyRight - bodyLeft), bodyHeight || 2);
        
        // Draw date labels
        ctx.fillStyle = '#666';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(candle.x, x, height - padding.bottom + 20);
    });
    
    // Draw title
    ctx.fillStyle = '#1B5E20';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Agricultural Commodity Index - Live Data', padding.left, 25);
}

// Setup time frame controls
function setupChartControls() {
    const timeFrames = document.querySelectorAll('.time-frame');
    timeFrames.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            timeFrames.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Selected timeframe:', this.textContent);
        });
    });
}

// Navigate to live market
function goToLiveMarket() {
    window.location.href = 'market.html';
}

// Export functions
window.goToLiveMarket = goToLiveMarket;
